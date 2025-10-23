# 🌡️ ThermoFusion — Optical-Guided Super-Resolution for Thermal IR Imagery

AI-driven fusion pipeline that uses **high-resolution optical imagery** to **super-resolve low-resolution thermal infrared (TIR)** data — producing *thermally faithful* and *spatially sharp* heat maps for **urban planning**, **wildfire monitoring**, and **precision agriculture**.

> 🏆 Project submitted to **Smart India Hackathon 2025 (PS ID: SIH25171)** by **Team J.A.R.V.I.S**.

## Quick Links:
- **Prototype Link:** [https://thermofusionsih25.vercel.app/](https://thermofusionsih25.vercel.app/)
- **Demo Video:** [https://www.youtube.com/watch?v=2EFcKO_lVRg](https://www.youtube.com/watch?v=2EFcKO_lVRg)


---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Highlights & Key Features](#-highlights--key-features)
- [System Architecture](#-system-architecture)
- [Getting Started](#%EF%B8%8F-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Install (Development)](#quick-install-development)
- [Dataset & Preprocessing](#%EF%B8%8F-dataset--preprocessing)
- [Co-registration & Alignment](#-co-registration--alignment)
- [Model Design](#-model-design)
  - [Fusion Network](#fusion-network)
  - [Physics-Informed Priors](#physics-informed-priors)
- [Training](#-training)
  - [Loss Functions & Metrics](#loss-functions--metrics)
  - [How to Run Training](#how-to-run-training)
- [Inference & API (FastAPI)](#-inference--api-fastapi)
  - [Endpoints](#endpoints)
  - [Example Client Request](#example-client-request)
- [Frontend (React)](#-frontend-react)
- [Evaluation](#-evaluation)
- [Contributing](#-contributing)
- [License & Contact](#-license--contact)

---

## 🚀 Project Overview
**ThermoFusion** fuses coarse thermal infrared (TIR) measurements with high-resolution optical imagery to produce **spatially detailed, thermally accurate maps**.

It addresses three major challenges:
1. **Multi-sensor alignment** — Accurate geometric co-registration between optical and TIR sources.  
2. **Modal fusion** — Inject optical detail (edges, textures) without corrupting thermal fidelity.  
3. **Thermal super-resolution** — Upsample thermal maps guided by optical features while preserving *Kelvin-accurate* temperature values.

Built with **PyTorch**, **FastAPI**, and **React**, ThermoFusion is modular, scalable, and designed for **real-time inference** and **interactive visualization**.

---

## ✨ Highlights & Key Features
🔀 **Multi-branch fusion network** — Separate optical and thermal encoders with guided feature fusion.  
🧠 **Physics-informed regularizers** — Emissivity and radiative transfer constraints for thermal realism.  
📏 **Geometry alignment module** — Feature-based & learnable refinement for pixel-level precision.  
📊 **Quantitative evaluation** — PSNR, SSIM, RMSE (Kelvin), and residual/edge maps.  
⚙️ **FastAPI backend** — Upload, preprocess, inference & visualization endpoints.  
💻 **React dashboard** — Tile viewer, fusion parameter tuning, and metric visualization.  
☁️ **Designed for scalability** — Satellite-scale inference, tiling, and GPU acceleration.

---

## 🧩 System Architecture
![Architecture](https://res.cloudinary.com/dmgjftmqa/image/upload/v1761225801/Screenshot_2025-10-23_185251_ijjifi.png)


---

## ⚙️ Getting Started

### Prerequisites
- **Python:** 3.10+  
- **Node.js:** 18+  
- **GPU:** NVIDIA + CUDA Toolkit (recommended for training/inference)  
- **Optional:** Docker (for containerized deployment)

### Quick Install (Development)
```bash
# 1. Clone repo
git clone https://github.com/aimlEnthusiasts/ThermoFusion.git
cd ThermoFusion


# 2. Backend (FastAPI)

cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt


# 3. Frontend (React)

cd ../frontend
npm install
npm run start


# 4. Run backend locally

cd ../backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload


```
Frontend: http://localhost:3000

Backend API docs: http://localhost:8000/docs

## 🛰️ Dataset & Preprocessing

> Download the official problem dataset [Dataset](https://www.sac.gov.in/files/sih/ps-03-data.pdf)

### Pipeline:

- Radiometric calibration (DN → Radiance → Brightness Temp)

- Emissivity correction

- Optional atmospheric correction

- Resampling & normalization per modality

- Data augmentation with geometric consistency

### 🎯 Co-registration & Alignment

- **Coarse alignment** — Geotransform + CRS metadata (rasterio, pyproj).

- **Feature-based refinement** — SIFT/ORB features + RANSAC homography.

- **Learnable refinement (optional)** — CNN predicts small pixel shifts.

- **Confidence masking** — Remove unreliable regions (e.g., clouds).

## 🧠 Model Design
### Fusion Network

A multi-branch encoder–decoder with attention-guided fusion:

```bash
class FusionSR(nn.Module):
    def __init__(self, up_scale=4):
        super().__init__()
        self.opt_enc = OpticalEncoder()
        self.thr_enc = ThermalEncoder()
        self.fusion = CrossAttentionFusion()
        self.upsampler = Upsampler(scale=up_scale)
        self.refiner = nn.Sequential(
            nn.Conv2d(...), nn.ReLU(), nn.Conv2d(1,1,kernel_size=3,padding=1)
        )

    def forward(self, optical_hr, thermal_lr):
        opt_feat = self.opt_enc(optical_hr)
        thr_feat = self.thr_enc(thermal_lr)
        fused = self.fusion(opt_feat, thr_feat)
        up = self.upsampler(fused)
        return self.refiner(up)
```

### Physics-Informed Priors

- **Emissivity loss** — Enforces emissivity-consistent temperature prediction.

- **Radiative transfer consistency** — Downsampled HR ≈ original LR.

- **Energy-balance regularizer** — Penalizes unrealistic gradients.

## 🧩 Training
### Loss Functions & Metrics

- **L1/L2 loss** — Temperature reconstruction (Kelvin)

- **Perceptual/edge loss** — Preserve texture boundaries

- **Physics loss** — Radiance/emissivity consistency

- **Downsample consistency loss** — Maintain LR fidelity

- **Metrics:** PSNR, SSIM, RMSE (Kelvin)

### How to Run Training
```bash
source .venv/bin/activate
python train.py \
  --optical_dir ../datasets/site_01/optical \
  --thermal_dir ../datasets/site_01/thermal \
  --scale 4 \
  --batch_size 8 \
  --epochs 200 \
  --save_dir ../experiments/thermofusion_run1 \
  --lr 1e-4 \
  --device cuda:0
```

## 🧠 Inference & API (FastAPI)
### Endpoints

| Endpoint          | Method | Description                          |
|--------------------|---------|--------------------------------------|
| `/api/v1/infer`    | POST    | Upload optical + thermal, return HR thermal |
| `/api/v1/preprocess` | POST  | Run calibration + alignment          |
| `/api/v1/metrics`  | POST    | Evaluate PSNR, SSIM, RMSE            |
| `/api/v1/status`   | GET     | Health check                         |


### Example Client Request
```bash
curl -X POST "http://localhost:8000/api/v1/infer" \
  -F "optical=@/path/to/optical.tif" \
  -F "thermal=@/path/to/thermal.tif"
```

## 💻 Frontend (React)

### Features:

🗺️ Map/tile preview (Leaflet / Mapbox GL)

📁 File upload (Optical + Thermal)

🔄 Fusion parameter sliders

📊 Metric display (PSNR / SSIM / RMSE)

💾 GeoTIFF download

### Run locally:
```bash
cd frontend
npm install
npm run start
```

App: http://localhost:3000

## 📈 Evaluation

### Metrics:

**PSNR (dB)** — higher = better

**SSIM (0–1)** — structure preservation

**RMSE (Kelvin)** — absolute temperature accuracy

### Validation reports (in experiments/<run>/reports/):

- PSNR/SSIM curves

- Residual heatmaps

- Before/after comparisons


## 🤝 Contributing

Contributions welcome via GitHub Discussions or Pull Requests:

1. Fork repo

2. Create branch feature/xyz

3.Submit PR with clear description and tests

## 📄 License & Contact

License: MIT
Team: Team J.A.R.V.I.S (ThermoFusion) — Smart India Hackathon 2025 (SIH25171)
Contact: Project discussions on GitHub Discussions



