import os
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split
import rasterio
from skimage.metrics import peak_signal_noise_ratio as psnr, structural_similarity as ssim

class StackedLandsatDataset(Dataset):
    def __init__(self, base_path, patch_size=128):
        print(f"Scanning dataset folder: {base_path}")
        self.file_list = [
            os.path.join(root, file)
            for root, _, files in os.walk(base_path)
            for file in files if "all_bands" in file
        ]
        print(f"Found {len(self.file_list)} files matching 'all_bands'.")
        if len(self.file_list) == 0:
            print("ERROR: No 'all_bands' files found! Check your dataset path.")
        self.patch_size = patch_size
    def __len__(self):
        return len(self.file_list)
    def __getitem__(self, idx):
        try:
            with rasterio.open(self.file_list[idx]) as src:
                all_bands = src.read().astype(np.float32)
        except Exception as e:
            print(f"Error reading file {self.file_list[idx]}: {e}")
            raise
        try:
            # Bands 2-4 (RGB)
            optical = all_bands[1:4] / 10000.0
            # Bands 10-11 (thermal)
            thermal = all_bands[9:11] / 300.0
            _, h, w = optical.shape
            ps = self.patch_size
            if h < ps or w < ps:
                print(f"Warning: Image in {self.file_list[idx]} is too small for patch size {ps}")
                raise ValueError("Patch size is larger than image dimensions.")
            top = np.random.randint(0, h - ps)
            left = np.random.randint(0, w - ps)
            optical_patch = optical[:, top:top+ps, left:left+ps]
            thermal_patch = thermal[:, top:top+ps, left:left+ps]
        except Exception as e:
            print(f"Error processing bands from file {self.file_list[idx]}: {e}")
            raise
        return torch.tensor(optical_patch), torch.tensor(thermal_patch)

class PhysicsAwareUNet(nn.Module):
    def __init__(self, in_channels_opt=3, in_channels_th=2, out_channels=2):
        super().__init__()
        self.opt_conv = nn.Sequential(
            nn.Conv2d(in_channels_opt, 64, 3, padding=1), nn.ReLU(),
            nn.Conv2d(64, 64, 3, padding=1), nn.ReLU()
        )
        self.th_conv = nn.Sequential(
            nn.Conv2d(in_channels_th, 64, 3, padding=1), nn.ReLU(),
            nn.Conv2d(64, 64, 3, padding=1), nn.ReLU()
        )
        self.fuse = nn.Sequential(
            nn.Conv2d(128, 128, 3, padding=1), nn.ReLU(),
            nn.Conv2d(128, out_channels, 3, padding=1)
        )
    def forward(self, opt, th_lr):
        f_opt = self.opt_conv(opt)
        f_th = self.th_conv(th_lr)
        fused = torch.cat([f_opt, f_th], dim=1)
        return self.fuse(fused)

def physics_loss(pred, target):
    l1 = nn.L1Loss()(pred, target)
    tv_loss = (
        (pred[:, :, :-1, :] - pred[:, :, 1:, :]).abs().mean() +
        (pred[:, :, :, :-1] - pred[:, :, :, 1:]).abs().mean()
    )
    return l1 + 0.01 * tv_loss

def train_and_evaluate(data_path, num_epochs=40):
    print("Initializing dataset...")
    dataset = StackedLandsatDataset(data_path)
    if len(dataset) == 0:
        print("No files loaded. Exiting.")
        return
    train_len = int(len(dataset) * 0.8)
    test_len = len(dataset) - train_len
    print(f"Splitting dataset: {train_len} train / {test_len} test samples")
    train_dataset, test_dataset = random_split(dataset, [train_len, test_len])
    train_loader = DataLoader(train_dataset, batch_size=2, shuffle=True, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=1, shuffle=False, num_workers=0)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    model = PhysicsAwareUNet().to(device)
    optimizer = optim.Adam(model.parameters(), lr=1e-4)
    print("Starting training loop...")
    for epoch in range(num_epochs):
        model.train()
        epoch_loss = 0
        for batch_idx, (opt_patch, th_patch) in enumerate(train_loader):
            try:
                opt_patch, th_patch = opt_patch.to(device), th_patch.to(device)
                th_lr = nn.functional.interpolate(th_patch, scale_factor=0.5, mode='bilinear', align_corners=False)
                th_lr = nn.functional.interpolate(th_lr, size=(opt_patch.shape[2], opt_patch.shape[3]), mode='bilinear', align_corners=False)
                optimizer.zero_grad()
                pred = model(opt_patch, th_lr)
                loss = physics_loss(pred, th_patch)
                loss.backward()
                optimizer.step()
                epoch_loss += loss.item()
                if batch_idx % 5 == 0:
                    print(f"Epoch {epoch+1} Batch {batch_idx+1}: Loss {loss.item():.4f}")
            except Exception as e:
                print(f"Error in batch {batch_idx}: {e}")
                continue
        avg_loss = epoch_loss / len(train_loader)
        print(f"Epoch {epoch+1}/{num_epochs} Completed. Average Loss: {avg_loss:.4f}")
        torch.save(model.state_dict(), "physics_aware_unet.pth")
        print("✅ Model saved as physics_aware_unet.pth")

    print("Training complete. Starting evaluation...")
    model.eval()
    
    psnr_scores, ssim_scores, rmse_scores = [], [], []
    with torch.no_grad():
        for idx, (opt_patch, th_patch) in enumerate(test_loader):
            try:
                opt_patch, th_patch = opt_patch.to(device), th_patch.to(device)
                th_lr = nn.functional.interpolate(th_patch, scale_factor=0.5, mode='bilinear', align_corners=False)
                th_lr = nn.functional.interpolate(th_lr, size=(opt_patch.shape[2], opt_patch.shape[3]), mode='bilinear', align_corners=False)
                pred = model(opt_patch, th_lr)
                pred_np = pred.cpu().numpy()[0]
                gt_np = th_patch.cpu().numpy()[0]
                for i in range(pred_np.shape[0]):
                    psnr_scores.append(psnr(gt_np[i], pred_np[i], data_range=1.0))
                    ssim_scores.append(ssim(gt_np[i], pred_np[i], data_range=1.0))
                    rmse_scores.append(np.sqrt(np.mean((gt_np[i]-pred_np[i])**2)))
                if idx % 10 == 0:
                    print(f"Evaluated {idx+1} test samples...")
            except Exception as e:
                print(f"Error during evaluation of test sample {idx}: {e}")
                continue
    print("\nTest Metrics (mean over bands & samples):")
    print(f"PSNR: {np.mean(psnr_scores):.3f}, SSIM: {np.mean(ssim_scores):.3f}, RMSE: {np.mean(rmse_scores):.3f}")

if __name__ == "__main__":
    dataset_path = r"C:\Users\SAHIL GIRI\datasetforsih\ssl4eo_l_oli_tirs_toa_benchmark"
    try:
        train_and_evaluate(dataset_path)
    except Exception as main_e:
        print("Fatal error in pipeline:", main_e)
