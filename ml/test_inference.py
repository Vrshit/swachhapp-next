#!/usr/bin/env python3
"""
Test the exported ONNX models with real test images and non-waste images.
"""

import sys
from pathlib import Path
import numpy as np
from PIL import Image
import onnxruntime as ort

BASE_DIR = Path(__file__).parent
MODELS_DIR = BASE_DIR.parent / "public" / "models"

IMG_SIZE = 224
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(1, 3, 1, 1)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(1, 3, 1, 1)

def preprocess(img_path_or_image):
    if isinstance(img_path_or_image, (str, Path)):
        img = Image.open(img_path_or_image).convert('RGB')
    else:
        img = img_path_or_image.convert('RGB')
    img = img.resize((IMG_SIZE, IMG_SIZE))
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.transpose(arr, (2, 0, 1))  # HWC -> CHW
    arr = np.expand_dims(arr, 0)       # 1CHW
    arr = (arr - MEAN) / STD
    return arr

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=-1, keepdims=True)

def test_models():
    gate_session = ort.InferenceSession(str(MODELS_DIR / "waste_gate.onnx"))
    cls_session = ort.InferenceSession(str(MODELS_DIR / "waste_classifier.onnx"))
    
    classes = ['organic', 'recyclable', 'hazardous']

    print("=== Testing Waste Images (Should be ACCEPTED) ===")
    test_o = list((BASE_DIR / "data/DATASET/TEST/O").glob("*.jpg"))[:3]
    test_r = list((BASE_DIR / "data/DATASET/TEST/R").glob("*.jpg"))[:3]
    test_haz = list((BASE_DIR / "data/hazardous/Dataset/gloves").glob("*.jpg"))[:2]

    for p in test_o + test_r + test_haz:
        tensor = preprocess(p)
        gate_out = gate_session.run(None, {'input': tensor})[0]
        gate_prob = sigmoid(gate_out[0, 0])
        is_waste = gate_prob > 0.5
        
        cls_out = cls_session.run(None, {'input': tensor})[0]
        cls_probs = softmax(cls_out)[0]
        pred_class = classes[np.argmax(cls_probs)]
        
        print(f"[{'✅ ACCEPT' if is_waste else '❌ REJECT'}] {p.parent.name}/{p.name[:15]}: Waste Prob={gate_prob:.1%}, Predicted Category={pred_class} ({cls_probs.max():.1%})")

    print("\n=== Testing Non-Waste Images (Should be REJECTED) ===")
    test_negs = list((BASE_DIR / "data/negatives").glob("*.jpg"))[:5]
    for p in test_negs:
        tensor = preprocess(p)
        gate_out = gate_session.run(None, {'input': tensor})[0]
        gate_prob = sigmoid(gate_out[0, 0])
        is_waste = gate_prob > 0.5
        print(f"[{'❌ FALSE ACCEPT' if is_waste else '✅ REJECT'}] {p.name}: Waste Prob={gate_prob:.1%}")

    print("\n=== Testing Simulated Movie Poster / Colorful Landscape ===")
    poster = Image.new('RGB', (IMG_SIZE, IMG_SIZE), color=(20, 40, 90)) # Deep cinematic blue
    # Add warm title block
    for x in range(30, 190):
        for y in range(80, 120):
            poster.putpixel((x, y), (255, 215, 0)) # Gold title
    tensor = preprocess(poster)
    gate_out = gate_session.run(None, {'input': tensor})[0]
    gate_prob = sigmoid(gate_out[0, 0])
    is_waste = gate_prob > 0.5
    print(f"[{'❌ FALSE ACCEPT' if is_waste else '✅ REJECT'}] Movie Poster Mockup: Waste Prob={gate_prob:.1%}")

if __name__ == "__main__":
    test_models()
