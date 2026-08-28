#!/usr/bin/env python3
"""
SwachhApp — Waste Image AI Classifier Training Pipeline
========================================================
Train two models using MobileNetV2 transfer learning:
  1. Binary "Waste Gate": waste vs not-waste
  2. Multi-class: organic / recyclable / hazardous

Exports both models to ONNX for browser deployment via ONNX Runtime Web.
"""

import os
import sys
import random
import shutil
from pathlib import Path

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset, random_split, ConcatDataset
from torchvision import transforms, models
from PIL import Image
import numpy as np

# ─── Config ────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "models"
OUTPUT_DIR.mkdir(exist_ok=True)

WASTE_TRAIN_DIR = DATA_DIR / "DATASET" / "TRAIN"
WASTE_TEST_DIR  = DATA_DIR / "DATASET" / "TEST"
HAZARDOUS_DIR   = DATA_DIR / "hazardous" / "Dataset"

IMG_SIZE = 224
BATCH_SIZE = 32
NUM_EPOCHS_GATE = 8
NUM_EPOCHS_MULTI = 10
LEARNING_RATE = 1e-4
DEVICE = "mps" if torch.backends.mps.is_available() else "cpu"

print(f"[INFO] Using device: {DEVICE}")

# ─── Transforms ────────────────────────────────────────────────────────────────
train_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.1),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

val_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


class FolderImageDataset(Dataset):
    def __init__(self, root_dir, label, transform=None, max_samples=None):
        self.transform = transform
        self.label = label
        self.images = []
        root = Path(root_dir)
        if root.exists():
            exts = {'.jpg', '.jpeg', '.png', '.bmp', '.webp'}
            all_imgs = [p for p in root.rglob('*') if p.suffix.lower() in exts]
            if max_samples and len(all_imgs) > max_samples:
                random.shuffle(all_imgs)
                all_imgs = all_imgs[:max_samples]
            self.images = all_imgs
        print(f"  [Dataset] {root_dir} -> {len(self.images)} images, label={label}")

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img_path = self.images[idx]
        try:
            img = Image.open(img_path).convert('RGB')
        except Exception:
            img = Image.new('RGB', (IMG_SIZE, IMG_SIZE), (128, 128, 128))
        if self.transform:
            img = self.transform(img)
        return img, self.label


class MultiClassWasteDataset(Dataset):
    def __init__(self, dirs_and_labels, transform=None, max_per_class=None):
        self.transform = transform
        self.samples = []
        exts = {'.jpg', '.jpeg', '.png', '.bmp', '.webp'}
        for dir_path, label in dirs_and_labels:
            d = Path(dir_path)
            if d.exists():
                imgs = [p for p in d.rglob('*') if p.suffix.lower() in exts]
                if max_per_class and len(imgs) > max_per_class:
                    random.shuffle(imgs)
                    imgs = imgs[:max_per_class]
                for p in imgs:
                    self.samples.append((p, label))
                print(f"  [MultiClass] {d} -> {len(imgs)} images, label={label}")
        random.shuffle(self.samples)

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        try:
            img = Image.open(img_path).convert('RGB')
        except Exception:
            img = Image.new('RGB', (IMG_SIZE, IMG_SIZE), (128, 128, 128))
        if self.transform:
            img = self.transform(img)
        return img, label


def generate_negative_samples(output_dir, count=5000):
    neg_dir = Path(output_dir)
    neg_dir.mkdir(parents=True, exist_ok=True)
    existing = list(neg_dir.glob("*.jpg"))
    if len(existing) >= count:
        print(f"  [Negatives] Already have {len(existing)} negative samples.")
        return
    print(f"  [Negatives] Generating {count} synthetic non-waste images...")
    for i in range(count):
        choice = random.choice(['solid', 'gradient', 'noise', 'pattern', 'stripe', 'face_like'])
        if choice == 'solid':
            color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
            img = Image.new('RGB', (IMG_SIZE, IMG_SIZE), color)
        elif choice == 'gradient':
            arr = np.zeros((IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8)
            r1, g1, b1 = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
            r2, g2, b2 = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
            for y in range(IMG_SIZE):
                t = y / IMG_SIZE
                arr[y, :] = [int(r1*(1-t)+r2*t), int(g1*(1-t)+g2*t), int(b1*(1-t)+b2*t)]
            img = Image.fromarray(arr)
        elif choice == 'noise':
            arr = np.random.randint(0, 256, (IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8)
            img = Image.fromarray(arr)
        elif choice == 'pattern':
            arr = np.zeros((IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8)
            c1 = [random.randint(150, 255) for _ in range(3)]
            c2 = [random.randint(0, 100) for _ in range(3)]
            for y in range(IMG_SIZE):
                for x in range(IMG_SIZE):
                    arr[y, x] = c1 if (x // 16 + y // 16) % 2 == 0 else c2
            img = Image.fromarray(arr)
        elif choice == 'stripe':
            arr = np.zeros((IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8)
            colors = [np.array([random.randint(0, 255) for _ in range(3)]) for _ in range(5)]
            sw = IMG_SIZE // len(colors)
            for y in range(IMG_SIZE):
                for x in range(IMG_SIZE):
                    arr[y, x] = colors[min(x // sw, len(colors) - 1)]
            img = Image.fromarray(arr)
        else:  # face_like
            skin = (random.randint(180, 240), random.randint(130, 190), random.randint(100, 160))
            img = Image.new('RGB', (IMG_SIZE, IMG_SIZE), skin)
        img.save(neg_dir / f"neg_{i:05d}.jpg", "JPEG", quality=85)
        if (i + 1) % 1000 == 0:
            print(f"    Generated {i+1}/{count}")
    print(f"  [Negatives] Done. {count} images saved.")


def build_mobilenet_classifier(num_classes, pretrained=True):
    model = models.mobilenet_v2(weights='IMAGENET1K_V1' if pretrained else None)
    for param in model.features.parameters():
        param.requires_grad = False
    for param in model.features[-3:].parameters():
        param.requires_grad = True
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(model.last_channel, 256),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(256, num_classes),
    )
    return model


def train_model(model, train_loader, val_loader, num_epochs, model_name, num_classes):
    model = model.to(DEVICE)
    criterion = nn.BCEWithLogitsLoss() if num_classes == 1 else nn.CrossEntropyLoss()
    optimizer = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=LEARNING_RATE)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=3, gamma=0.5)
    best_val_acc = 0.0

    for epoch in range(num_epochs):
        model.train()
        train_loss, train_correct, train_total = 0.0, 0, 0
        for batch_idx, (images, labels) in enumerate(train_loader):
            images = images.to(DEVICE)
            if num_classes == 1:
                labels = labels.float().to(DEVICE)
                outputs = model(images).squeeze(1)
                loss = criterion(outputs, labels)
                preds = (torch.sigmoid(outputs) > 0.5).long()
                train_correct += (preds == labels.long()).sum().item()
            else:
                labels = labels.to(DEVICE)
                outputs = model(images)
                loss = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)
                train_correct += (preds == labels).sum().item()
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * images.size(0)
            train_total += images.size(0)
            if (batch_idx + 1) % 50 == 0:
                print(f"    Epoch [{epoch+1}/{num_epochs}] Batch [{batch_idx+1}/{len(train_loader)}] Loss: {loss.item():.4f}")
        scheduler.step()
        train_acc = train_correct / train_total

        model.eval()
        val_correct, val_total = 0, 0
        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(DEVICE)
                if num_classes == 1:
                    labels = labels.float().to(DEVICE)
                    outputs = model(images).squeeze(1)
                    preds = (torch.sigmoid(outputs) > 0.5).long()
                    val_correct += (preds == labels.long()).sum().item()
                else:
                    labels = labels.to(DEVICE)
                    outputs = model(images)
                    _, preds = torch.max(outputs, 1)
                    val_correct += (preds == labels).sum().item()
                val_total += images.size(0)
        val_acc = val_correct / val_total
        print(f"  [Epoch {epoch+1}/{num_epochs}] Train Acc: {train_acc:.4f} | Val Acc: {val_acc:.4f}")
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), OUTPUT_DIR / f"{model_name}_best.pth")
            print(f"    ✅ Saved best model (val_acc={val_acc:.4f})")

    print(f"\n  📊 Best {model_name} val accuracy: {best_val_acc:.4f}\n")
    return model, best_val_acc


def export_to_onnx(model, model_name, num_classes):
    model.eval()
    model = model.to("cpu")
    dummy = torch.randn(1, 3, IMG_SIZE, IMG_SIZE)
    onnx_path = OUTPUT_DIR / f"{model_name}.onnx"
    torch.onnx.export(model, dummy, str(onnx_path), export_params=True, opset_version=13,
                       do_constant_folding=True, input_names=['input'], output_names=['output'],
                       dynamic_axes={'input': {0: 'batch'}, 'output': {0: 'batch'}})
    size_mb = onnx_path.stat().st_size / (1024 * 1024)
    print(f"  📦 Exported {model_name} to ONNX ({size_mb:.1f} MB)")
    return onnx_path


def main():
    print("\n" + "=" * 70)
    print("  🧠 SwachhApp AI — Waste Image Classifier Training Pipeline")
    print("=" * 70 + "\n")

    print("[Step 1/5] Generating non-waste negative samples...")
    neg_dir = DATA_DIR / "negatives"
    generate_negative_samples(neg_dir, count=5000)

    print("\n[Step 2/5] Building binary waste gate dataset...")
    waste_train_o = FolderImageDataset(WASTE_TRAIN_DIR / "O", label=1, transform=train_transform, max_samples=4000)
    waste_train_r = FolderImageDataset(WASTE_TRAIN_DIR / "R", label=1, transform=train_transform, max_samples=4000)
    waste_haz_g = FolderImageDataset(HAZARDOUS_DIR / "gloves", label=1, transform=train_transform)
    waste_haz_m = FolderImageDataset(HAZARDOUS_DIR / "Mask", label=1, transform=train_transform)
    neg_dataset = FolderImageDataset(neg_dir, label=0, transform=train_transform, max_samples=5000)

    all_gate = ConcatDataset([waste_train_o, waste_train_r, waste_haz_g, waste_haz_m, neg_dataset])
    val_size = int(0.15 * len(all_gate))
    train_size = len(all_gate) - val_size
    gate_train, gate_val = random_split(all_gate, [train_size, val_size])
    gate_train_loader = DataLoader(gate_train, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    gate_val_loader = DataLoader(gate_val, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
    print(f"  Gate dataset: {train_size} train, {val_size} val")

    print("\n[Step 3/5] Training binary waste gate...")
    gate_model = build_mobilenet_classifier(num_classes=1)
    gate_model, gate_acc = train_model(gate_model, gate_train_loader, gate_val_loader,
                                         NUM_EPOCHS_GATE, "waste_gate", 1)

    print("\n[Step 4/5] Training multi-class waste classifier...")
    multi_data = MultiClassWasteDataset([
        (WASTE_TRAIN_DIR / "O", 0), (WASTE_TEST_DIR / "O", 0),
        (WASTE_TRAIN_DIR / "R", 1), (WASTE_TEST_DIR / "R", 1),
        (HAZARDOUS_DIR / "gloves", 2), (HAZARDOUS_DIR / "Mask", 2),
    ], transform=train_transform, max_per_class=5000)
    val_m = int(0.15 * len(multi_data))
    train_m = len(multi_data) - val_m
    mt, mv = random_split(multi_data, [train_m, val_m])
    mt_loader = DataLoader(mt, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    mv_loader = DataLoader(mv, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
    print(f"  Multi-class dataset: {train_m} train, {val_m} val")

    multi_model = build_mobilenet_classifier(num_classes=3)
    multi_model, multi_acc = train_model(multi_model, mt_loader, mv_loader,
                                           NUM_EPOCHS_MULTI, "waste_classifier", 3)

    print("\n[Step 5/5] Exporting models to ONNX...")
    g = build_mobilenet_classifier(num_classes=1)
    g.load_state_dict(torch.load(OUTPUT_DIR / "waste_gate_best.pth", map_location="cpu", weights_only=True))
    export_to_onnx(g, "waste_gate", 1)

    m = build_mobilenet_classifier(num_classes=3)
    m.load_state_dict(torch.load(OUTPUT_DIR / "waste_classifier_best.pth", map_location="cpu", weights_only=True))
    export_to_onnx(m, "waste_classifier", 3)

    print("\n" + "=" * 70)
    print(f"  ✅ Training Complete!")
    print(f"  Waste Gate Accuracy:  {gate_acc:.1%}")
    print(f"  Multi-Class Accuracy: {multi_acc:.1%}")
    print(f"  Models saved to:      {OUTPUT_DIR}")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
