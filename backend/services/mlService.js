const ort = require("onnxruntime-node");
const path = require("path");

let session = null;

// Charger modèle ONNX
async function loadModel() {
  if (!session) {
    const modelPath = path.join(
      __dirname,
      "..",
      "models",
      "watering_model.onnx"
    );
    session = await ort.InferenceSession.create(modelPath);
    console.log("🤖 ONNX Model loaded successfully!");

    // Debug: afficher les noms d'entrée/sortie
    console.log("Model inputs:", session.inputNames);
    console.log("Model outputs:", session.outputNames);
  }
}

async function predictWatering(plantId, temp, humidity, light) {
  if (!session) await loadModel();

  const inputTensor = new ort.Tensor(
    "float32",
    Float32Array.from([plantId, temp, humidity, light]),
    [1, 4]
  );

  const feeds = { input: inputTensor };

  // IMPORTANT: Ne demander QUE la sortie 'output_label', pas 'output_probability'
  const fetches = ["output_label"];

  const results = await session.run(feeds, fetches);

  // Récupérer la prédiction (0 ou 1)
  const pred = results.output_label.data[0];

  return pred; // 1 = arroser, 0 = ok
}

module.exports = {
  loadModel,
  predictWatering,
};
