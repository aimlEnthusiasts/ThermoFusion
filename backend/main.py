from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import torch
import numpy as np
import rasterio
import matplotlib.pyplot as plt
import io, base64
from torch.nn import functional as F
from skimage.metrics import (
    peak_signal_noise_ratio as psnr,
    structural_similarity as ssim,
)
from skimage.filters import sobel, unsharp_mask
from skimage import color, exposure
from matplotlib import cm
from ai.training import PhysicsAwareUNet

app = FastAPI(title="Thermal SR Model API")

origins = [
    "https://thermofusionsih25.vercel.app",
    "http://localhost:8080",  # for local dev
]

# ✅ Allow React frontend to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or restrict to your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "./ai/model.pth"
# DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
DEVICE = torch.device("cpu")

print("🚀 Loading model...")
model = PhysicsAwareUNet().to(DEVICE)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()
print("✅ Model ready!")


def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


def image_to_base64(img: np.ndarray, cmap: str | None = None):
    """
    Encode a 2D or 3D numpy image array as base64 PNG. If 2D, an optional matplotlib
    colormap name can be provided.
    """
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.axis("off")
    if img.ndim == 2:
        ax.imshow(img, cmap=cmap if cmap else "gray")
    else:
        ax.imshow(np.clip(img, 0, 1))
    plt.tight_layout(pad=0)
    b64 = fig_to_base64(fig)
    plt.close(fig)
    return b64


@app.get("/health")
async def health_check():
    """Health check endpoint for keeping the backend warm"""
    return {"status": "healthy", "model_loaded": True, "device": str(DEVICE)}


@app.post("/infer")
async def infer(file: UploadFile = File(...)):
    try:
        with rasterio.open(file.file) as src:
            all_bands = src.read().astype(np.float32)
            # Reflectance scaling for optical (OLI); simplistic normalization for thermal
            # If data already in 0-1, skip division
            if np.nanmax(all_bands[1:4]) <= 1.5:
                optical = all_bands[1:4]
            else:
                optical = all_bands[1:4] / 10000.0  # Bands 2-4
            thermal = all_bands[9:11] / 300.0  # Bands 10-11

        optical_tensor = torch.tensor(optical).unsqueeze(0).to(DEVICE)
        thermal_tensor = torch.tensor(thermal).unsqueeze(0).to(DEVICE)

        th_lr = F.interpolate(
            thermal_tensor, scale_factor=0.5, mode="bilinear", align_corners=False
        )
        th_lr = F.interpolate(
            th_lr,
            size=(optical_tensor.shape[2], optical_tensor.shape[3]),
            mode="bilinear",
            align_corners=False,
        )

        with torch.no_grad():
            pred = model(optical_tensor, th_lr)

        pred_np = pred.squeeze(0).cpu().numpy()
        gt_np = thermal_tensor.squeeze(0).cpu().numpy()

        psnr_val = np.mean(
            [
                psnr(gt_np[i], pred_np[i], data_range=1.0)
                for i in range(pred_np.shape[0])
            ]
        )
        ssim_val = np.mean(
            [
                ssim(gt_np[i], pred_np[i], data_range=1.0)
                for i in range(pred_np.shape[0])
            ]
        )
        rmse_val = np.sqrt(np.mean((gt_np - pred_np) ** 2))

        down_pred = F.interpolate(
            pred, scale_factor=0.5, mode="bilinear", align_corners=False
        )
        down_gt = F.interpolate(
            thermal_tensor, scale_factor=0.5, mode="bilinear", align_corners=False
        )
        diff = np.abs(down_pred.cpu().numpy() - down_gt.cpu().numpy())
        conf = float(np.clip(1 - np.mean(diff) * 10, 0, 1))

        # Create comprehensive diagnostic visualization
        fig, axes = plt.subplots(4, 2, figsize=(12, 16))
        fig.suptitle("Thermal Super-Resolution Diagnostics", fontsize=14)

        # (1) Predicted & Ground Truth
        axes[0, 0].imshow(pred_np[0], cmap="inferno")
        axes[0, 0].set_title("Predicted Thermal Band 1")
        axes[0, 1].imshow(gt_np[0], cmap="inferno")
        axes[0, 1].set_title("Ground Truth Thermal Band 1")

        # (2) Residual Maps
        error_map = pred_np - gt_np
        axes[1, 0].imshow(error_map[0], cmap="coolwarm")
        axes[1, 0].set_title("Residual Map (Pred - GT)")
        axes[1, 1].imshow(np.abs(error_map[0]), cmap="magma")
        axes[1, 1].set_title("Absolute Error Map")

        # (3) Edge Overlays
        opt_gray = np.mean(optical, axis=0)
        opt_edges = sobel(opt_gray)
        pred_edges = sobel(np.mean(pred_np, axis=0))
        overlay = np.dstack([opt_edges, pred_edges, np.zeros_like(opt_edges)])
        axes[2, 0].imshow(overlay)
        axes[2, 0].set_title("Edge Overlay (Optical=Red, Thermal=Green)")
        axes[2, 1].imshow(pred_edges, cmap="gray")
        axes[2, 1].set_title("Predicted Thermal Edges")

        # (4) Histogram + Scatter
        axes[3, 0].hist(
            gt_np.flatten(), bins=50, alpha=0.6, label="Ground Truth", color="red"
        )
        axes[3, 0].hist(
            pred_np.flatten(), bins=50, alpha=0.6, label="Predicted", color="green"
        )
        axes[3, 0].legend()
        axes[3, 0].set_title("Histogram: Predicted vs GT")
        axes[3, 0].set_xlabel("Normalized Temperature")
        axes[3, 0].set_ylabel("Frequency")

        axes[3, 1].scatter(
            gt_np.flatten(), pred_np.flatten(), s=2, alpha=0.3, color="blue"
        )
        axes[3, 1].plot([0, 1], [0, 1], "r--")
        axes[3, 1].set_title("Predicted vs GT Scatter Plot")
        axes[3, 1].set_xlabel("Ground Truth")
        axes[3, 1].set_ylabel("Predicted")

        plt.tight_layout(rect=[0, 0.03, 1, 0.97])
        main_vis_base64 = fig_to_base64(fig)
        plt.close(fig)

        # Create individual visualizations for separate display
        visualizations = {}

        # 1. Predicted vs Ground Truth
        fig1, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))
        ax1.imshow(pred_np[0], cmap="inferno")
        ax1.set_title("Predicted Thermal Band 1")
        ax2.imshow(gt_np[0], cmap="inferno")
        ax2.set_title("Ground Truth Thermal Band 1")
        plt.tight_layout()
        visualizations["predicted_vs_gt"] = fig_to_base64(fig1)
        plt.close(fig1)

        # 2. Residual Maps
        fig2, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))
        ax1.imshow(error_map[0], cmap="coolwarm")
        ax1.set_title("Residual Map (Pred - GT)")
        ax2.imshow(np.abs(error_map[0]), cmap="magma")
        ax2.set_title("Absolute Error Map")
        plt.tight_layout()
        visualizations["residual_maps"] = fig_to_base64(fig2)
        plt.close(fig2)

        # 3. Edge Analysis
        fig3, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))
        ax1.imshow(overlay)
        ax1.set_title("Edge Overlay (Optical=Red, Thermal=Green)")
        ax2.imshow(pred_edges, cmap="gray")
        ax2.set_title("Predicted Thermal Edges")
        plt.tight_layout()
        visualizations["edge_analysis"] = fig_to_base64(fig3)
        plt.close(fig3)

        # 4. Statistical Analysis
        fig4, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))
        ax1.hist(gt_np.flatten(), bins=50, alpha=0.6, label="Ground Truth", color="red")
        ax1.hist(
            pred_np.flatten(), bins=50, alpha=0.6, label="Predicted", color="green"
        )
        ax1.legend()
        ax1.set_title("Histogram: Predicted vs GT")
        ax1.set_xlabel("Normalized Temperature")
        ax1.set_ylabel("Frequency")

        ax2.scatter(gt_np.flatten(), pred_np.flatten(), s=2, alpha=0.3, color="blue")
        ax2.plot([0, 1], [0, 1], "r--")
        ax2.set_title("Predicted vs GT Scatter Plot")
        ax2.set_xlabel("Ground Truth")
        ax2.set_ylabel("Predicted")
        plt.tight_layout()
        visualizations["statistical_analysis"] = fig_to_base64(fig4)
        plt.close(fig4)

        # Build final fused output image (optical-thermal mixture)
        # Robust per-band normalization to avoid black previews
        def robust_rescale(band: np.ndarray) -> np.ndarray:
            p2, p98 = np.nanpercentile(band, [2, 98])
            if p98 - p2 < 1e-6:
                return np.zeros_like(band)
            return np.clip((band - p2) / (p98 - p2), 0, 1)

        # True color optical RGB using bands 4-3-2 (indices 3,2,1)
        r = robust_rescale(all_bands[3])
        g = robust_rescale(all_bands[2])
        b = robust_rescale(all_bands[1])
        optical_true_rgb = np.transpose(np.stack([r, g, b], axis=0), (1, 2, 0))

        # False color composite (NIR-Red-Green => Bands 5-4-3 => idx 4,3,2)
        nir = robust_rescale(all_bands[4])
        r_fc = robust_rescale(all_bands[3])
        g_fc = robust_rescale(all_bands[2])
        optical_false_rgb = np.transpose(np.stack([nir, r_fc, g_fc], axis=0), (1, 2, 0))

        # Thermal RGB (pseudo color) from predicted thermal bands
        # Compose as [Band11, mean(B10,B11), Band10]
        thermal_mean = np.mean(pred_np, axis=0)
        thermal_rgb = np.stack(
            [
                pred_np[1],
                thermal_mean,
                pred_np[0],
            ],
            axis=0,
        )
        # Normalize thermal to 0..1 based on current scene range
        tmin, tmax = np.percentile(thermal_rgb, [1, 99])
        thermal_rgb = np.clip((thermal_rgb - tmin) / max(tmax - tmin, 1e-6), 0, 1)
        thermal_rgb = np.transpose(thermal_rgb, (1, 2, 0))

        # Enhance thermal intensity using CLAHE to preserve local contrast
        t_lo, t_hi = np.percentile(thermal_mean, [1, 99])
        thermal_intensity = np.clip(
            (thermal_mean - t_lo) / max(t_hi - t_lo, 1e-6), 0, 1
        )
        thermal_intensity_eq = exposure.equalize_adapthist(
            thermal_intensity, clip_limit=0.01
        )

        # Blend in Lab colorspace: mix thermal intensity into luminance channel
        optical_lab = color.rgb2lab(np.clip(optical_true_rgb, 0, 1))  # L in [0,100]
        L = optical_lab[..., 0]
        thermal_L = thermal_intensity_eq * 100.0
        alpha = 0.35
        fused_L = np.clip((1 - alpha) * L + alpha * thermal_L, 0, 100)
        optical_lab[..., 0] = fused_L
        fused_rgb = np.clip(color.lab2rgb(optical_lab), 0, 1)

        # Light sharpening to counter any residual blur
        fused_rgb = np.clip(
            unsharp_mask(fused_rgb, radius=1.2, amount=0.8, preserve_range=True), 0, 1
        )

        # Encode previews
        final_output_b64 = image_to_base64(fused_rgb)
        thermal_rgb_b64 = image_to_base64(thermal_rgb)
        optical_true_b64 = image_to_base64(optical_true_rgb)
        optical_false_b64 = image_to_base64(optical_false_rgb)

        return JSONResponse(
            {
                "psnr": round(float(psnr_val), 3),
                "ssim": round(float(ssim_val), 3),
                "rmse": round(float(rmse_val), 3),
                "confidence": round(conf, 3),
                "visualization": main_vis_base64,
                "final_output": final_output_b64,
                "individual_visualizations": visualizations,
                "thermal_rgb": thermal_rgb_b64,
                "optical_true_color": optical_true_b64,
                "optical_false_color": optical_false_b64,
            }
        )

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
        # uvicorn inference_api:app --host 0.0.0.0 --port 8000
