#!/usr/bin/env python3
"""
Export trained PyTorch checkpoints to self-contained ONNX format (no external .data files).
"""

import os
import shutil
from pathlib import Path
import torch
import torch.nn as nn
from torchvision import models
import onnx
import onnxruntime as ort
import numpy as np

BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "models"
PUBLIC_MODELS_DIR = BASE_DIR.parent / "public" / "models"
PUBLIC_MODELS_DIR.mkdir(parents=True, exist_ok=True)

IMG_SIZE = 224

def build_mobilenet_classifier(num_classes):
    model = models.mobilenet_v2(weights=None)
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(model.last_channel, 256),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(256, num_classes),
    )
    return model

def export_standalone_onnx(model, model_name):
    model.eval()
    model = model.to("cpu")
    dummy_input = torch.randn(1, 3, IMG_SIZE, IMG_SIZE)
    onnx_path = OUTPUT_DIR / f"{model_name}.onnx"

    print(f"Exporting {model_name} to {onnx_path}...")
    
    # Use legacy TorchScript exporter (dynamo=False) so all weights are embedded in a single .onnx file
    torch.onnx.export(
        model,
        dummy_input,
        str(onnx_path),
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch'}, 'output': {0: 'batch'}},
        dynamo=False,
    )

    # Clean up any separate .data file if created and ensure fully self-contained
    data_file = OUTPUT_DIR / f"{model_name}.onnx.data"
    if data_file.exists():
        data_file.unlink()

    # Load and re-save with onnx to guarantee single standalone protobuf
    onnx_model = onnx.load(str(onnx_path))
    onnx.save_model(onnx_model, str(onnx_path), save_as_external_data=False)

    size_mb = onnx_path.stat().st_size / (1024 * 1024)
    print(f"✅ Standalone {model_name}.onnx created ({size_mb:.2f} MB)")

    # Copy to public/models for Next.js web serving
    public_target = PUBLIC_MODELS_DIR / f"{model_name}.onnx"
    shutil.copy2(onnx_path, public_target)
    print(f"📂 Copied to {public_target}")

    # Verify with onnxruntime
    session = ort.InferenceSession(str(public_target))
    test_input = np.random.randn(1, 3, IMG_SIZE, IMG_SIZE).astype(np.float32)
    outputs = session.run(None, {'input': test_input})
    print(f"🔍 Verified with ONNX Runtime, output shape: {outputs[0].shape}, sample output: {outputs[0]}\n")
    return onnx_path

def main():
    print("--- 🚀 Exporting Self-Contained Waste AI Models ---")
    
    # 1. Waste Gate (Binary: Waste vs Not-Waste)
    gate_path = OUTPUT_DIR / "waste_gate_best.pth"
    gate_model = build_mobilenet_classifier(num_classes=1)
    gate_model.load_state_dict(torch.load(gate_path, map_location="cpu", weights_only=True))
    export_standalone_onnx(gate_model, "waste_gate")

    # 2. Waste Classifier (Multi-class: Organic, Recyclable, Hazardous)
    cls_path = OUTPUT_DIR / "waste_classifier_best.pth"
    cls_model = build_mobilenet_classifier(num_classes=3)
    cls_model.load_state_dict(torch.load(cls_path, map_location="cpu", weights_only=True))
    export_standalone_onnx(cls_model, "waste_classifier")

    print("🎉 Both standalone models exported and verified in public/models/!")

if __name__ == "__main__":
    main()
