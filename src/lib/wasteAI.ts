/**
 * SwachhApp — AI Waste Image Validator & Classifier
 * ==================================================
 * Uses ONNX Runtime Web to run trained MobileNetV2 models in the browser:
 *   1. Waste Gate: binary waste vs not-waste classifier
 *   2. Waste Classifier: multi-class organic / recyclable / hazardous
 */

// We'll use dynamic import for onnxruntime-web to avoid SSR issues
let ortModule: typeof import('onnxruntime-web') | null = null;
let gateSession: any = null;
let classifierSession: any = null;
let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

const WASTE_GATE_MODEL_URL = '/models/waste_gate.onnx';
const WASTE_CLASSIFIER_MODEL_URL = '/models/waste_classifier.onnx';

// ImageNet normalization constants (same as training)
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];
const IMG_SIZE = 224;

export const WASTE_CLASS_LABELS = ['organic', 'recyclable', 'hazardous'] as const;
export type WasteAIClass = (typeof WASTE_CLASS_LABELS)[number];

export interface WasteGateResult {
  isWaste: boolean;
  confidence: number;
}

export interface WasteClassResult {
  category: WasteAIClass;
  confidence: number;
  scores: Record<WasteAIClass, number>;
}

export interface WasteAIResult {
  gate: WasteGateResult;
  classification: WasteClassResult | null;
}

/**
 * Load ONNX Runtime and both models. Caches sessions for re-use.
 */
export async function loadModels(): Promise<void> {
  if (modelsLoaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      // Dynamic import to avoid SSR
      ortModule = await import('onnxruntime-web');

      // Configure ONNX Runtime to use CDN for WASM binaries and single thread
      ortModule.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/';
      ortModule.env.wasm.numThreads = 1;

      console.log('[WasteAI] Loading waste gate model...');
      gateSession = await ortModule.InferenceSession.create(WASTE_GATE_MODEL_URL, {
        executionProviders: ['wasm'],
      });

      console.log('[WasteAI] Loading waste classifier model...');
      classifierSession = await ortModule.InferenceSession.create(WASTE_CLASSIFIER_MODEL_URL, {
        executionProviders: ['wasm'],
      });

      modelsLoaded = true;
      console.log('[WasteAI] ✅ Both models loaded successfully');
    } catch (err) {
      console.error('[WasteAI] Failed to load models:', err);
      throw err;
    }
  })();

  return loadingPromise;
}

/**
 * Preprocess an image (from data URL) into a Float32Array tensor [1, 3, 224, 224].
 */
function preprocessImage(imageDataUrl: string): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = IMG_SIZE;
      canvas.height = IMG_SIZE;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, IMG_SIZE, IMG_SIZE);
      const imageData = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);
      const { data } = imageData;

      // Convert to CHW format with normalization
      const float32 = new Float32Array(3 * IMG_SIZE * IMG_SIZE);
      for (let y = 0; y < IMG_SIZE; y++) {
        for (let x = 0; x < IMG_SIZE; x++) {
          const srcIdx = (y * IMG_SIZE + x) * 4;
          const dstIdx = y * IMG_SIZE + x;
          // R channel
          float32[0 * IMG_SIZE * IMG_SIZE + dstIdx] = (data[srcIdx] / 255 - MEAN[0]) / STD[0];
          // G channel
          float32[1 * IMG_SIZE * IMG_SIZE + dstIdx] = (data[srcIdx + 1] / 255 - MEAN[1]) / STD[1];
          // B channel
          float32[2 * IMG_SIZE * IMG_SIZE + dstIdx] = (data[srcIdx + 2] / 255 - MEAN[2]) / STD[2];
        }
      }
      resolve(float32);
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });
}

/**
 * Sigmoid function
 */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Softmax function
 */
function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

/**
 * Run the waste gate binary classifier.
 * Returns whether the image is waste and the confidence score.
 */
async function runWasteGate(inputTensor: Float32Array): Promise<WasteGateResult> {
  if (!gateSession || !ortModule) throw new Error('Models not loaded');

  const tensor = new ortModule.Tensor('float32', inputTensor, [1, 3, IMG_SIZE, IMG_SIZE]);
  const results = await gateSession.run({ input: tensor });
  const output = results.output;
  const logit = output.data[0] as number;
  const prob = sigmoid(logit);

  return {
    isWaste: prob > 0.6, // 60% threshold — tuned for recall
    confidence: Math.round(prob * 100),
  };
}

/**
 * Run the multi-class waste classifier.
 * Returns the predicted category and confidence scores.
 */
async function runWasteClassifier(inputTensor: Float32Array): Promise<WasteClassResult> {
  if (!classifierSession || !ortModule) throw new Error('Models not loaded');

  const tensor = new ortModule.Tensor('float32', inputTensor, [1, 3, IMG_SIZE, IMG_SIZE]);
  const results = await classifierSession.run({ input: tensor });
  const output = results.output;
  const logits = Array.from(output.data as Float32Array);
  const probs = softmax(logits);

  const maxIdx = probs.indexOf(Math.max(...probs));
  const scores: Record<WasteAIClass, number> = {
    organic: Math.round(probs[0] * 100),
    recyclable: Math.round(probs[1] * 100),
    hazardous: Math.round(probs[2] * 100),
  };

  return {
    category: WASTE_CLASS_LABELS[maxIdx],
    confidence: Math.round(probs[maxIdx] * 100),
    scores,
  };
}

/**
 * Main API: Validate and classify a waste image.
 * 
 * @param imageDataUrl - The base64 data URL of the uploaded image
 * @returns WasteAIResult with gate decision and classification
 */
export async function analyzeWasteImage(imageDataUrl: string): Promise<WasteAIResult> {
  await loadModels();

  const inputTensor = await preprocessImage(imageDataUrl);
  const gate = await runWasteGate(inputTensor);

  let classification: WasteClassResult | null = null;
  if (gate.isWaste) {
    classification = await runWasteClassifier(inputTensor);
  }

  return { gate, classification };
}

/**
 * Check if models are ready
 */
export function isModelReady(): boolean {
  return modelsLoaded;
}

/**
 * Map AI class to app waste category
 */
export function mapAIClassToCategory(aiClass: WasteAIClass): string {
  switch (aiClass) {
    case 'organic': return 'wet_organic';
    case 'recyclable': return 'dry_recyclable';
    case 'hazardous': return 'hazardous';
    default: return 'mixed';
  }
}
