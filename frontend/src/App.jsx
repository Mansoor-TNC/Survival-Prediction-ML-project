import { useState, useEffect } from "react";
import "./App.css";

function App() {
const [pclass, setPclass] = useState("");
const [gender, setGender] = useState("");
const [age, setAge] = useState("");
const [fare, setFare] = useState("");
const [analysisText, setAnalysisText] = useState("Analyzing");
const [prediction, setPrediction] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const [bubbles, setBubbles] = useState([]);

useEffect(() => {
  const createBubble = () => {
    return {
      id: Date.now() + Math.random(),
      size: Math.random() * 20 + 3,
      left: Math.random() * 100,
      duration: Math.random() * 8 + 8,
      drift: Math.random() * 120 - 60,
      opacity: Math.random() * 0.45 + 0.25,
      stretch: Math.random() * 0.35 + 0.85,
    };
  };

  setBubbles(
    Array.from({ length: 12 }, createBubble)
  );

  const interval = setInterval(() => {
    setBubbles((current) => [
      ...current.slice(-20),
      createBubble(),
    ]);
  }, 1200);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (!loading) return;

  let dots = 0;

  const interval = setInterval(() => {
    dots = (dots + 1) % 4;
    setAnalysisText("Analyzing" + ".".repeat(dots));
  }, 400);

  return () => clearInterval(interval);
}, [loading]);

async function handleSubmit(event) {
event.preventDefault();

setLoading(true);
setPrediction("");
setError("");
const startTime = Date.now();

 try {
    const response = await fetch("https://survival-prediction-ml-project.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pclass: Number(pclass),
        gender: gender,
        age: Number(age),
        fare: Number(fare),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Prediction failed");
    }

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(3000 - elapsed, 0);
    await new Promise((resolve) => setTimeout(resolve, remaining));
    setPrediction(data.prediction);
    setLoading(false);

  } catch (error) {
    console.error(error);
    setError("Unable to connect to the prediction server. Please make sure the API is running.");
    setLoading(false);
  }
}

function tryAgain() {
setPclass("");
setGender("");
setAge("");
setFare("");
setPrediction("");
}

return ( <main className="container">

  <div className="bubble-layer" aria-hidden="true">
    {bubbles.map((bubble) => (
      <span
        key={bubble.id}
        className="bubble"
        style={{
          width: `${bubble.size}px`,
          height: `${bubble.size * bubble.stretch}px`,
          left: `${bubble.left}%`,
          opacity: bubble.opacity,
          animationDuration: `${bubble.duration}s`,
          animationDelay: `${bubble.delay}s`,
          "--drift": `${bubble.drift}px`,
        }}
      />
    ))}
  </div>

  <h1>🚢 Titanic Survival Experiment</h1>

  <p className="subtitle">
    Imagine you are a passenger in Titanic. Enter the your passenger details and see whether you will survive or not.
  </p>

  <section className="card">

    <h2>Passenger Details</h2>

    <form onSubmit={handleSubmit}>

      <label>Passenger Class</label>

      <select
        value={pclass}
        onChange={(event) => setPclass(event.target.value)}
        required
      >
        <option value="" disabled hidden>
          Select class
        </option>

        <option value="1">1st Class</option>
        <option value="2">2nd Class</option>
        <option value="3">3rd Class</option>
      </select>


      <label>Gender</label>

      <select
        value={gender}
        onChange={(event) => setGender(event.target.value)}
        required
      >
        <option value="" disabled hidden>
          Select Gender
        </option>

        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>


      <label>Age</label>

      <input
        type="number"
        min="0"
        max="100"
        step="0.1"
        value={age}
        onChange={(event) => setAge(event.target.value)}
        placeholder="Enter age"
        required
      />


      <label>Fare</label>

      <input
        type="number"
        min="1"
        step="0.01"
        value={fare}
        onChange={(event) => setFare(event.target.value)}
        placeholder="Enter fare"
        required
      />


      <button type="submit" disabled={loading}>
        {loading ? `🌊 ${analysisText}` : "🔮 Predict Survival"}
      </button>

    </form>

  </section>


  {(prediction || error) && (
    <section className="result">

      <h2 className={error ? "error" : prediction === "Survived" ? "survived" : "not-survived"}>
        {error ? "⚠️Connection Error" : prediction === "Survived" ? "🚢 Fortunately, you would Survive" : "🌊 Unfortunately, you would not Survive"}
      </h2>

      <p>
        {error ? error : prediction === "Survived"
          ? "Based on the passenger details you entered, our ML model predicts that you would have survived the Titanic disaster."
          : "Based on the passenger details you entered, our ML model predicts that you would not have survived the Titanic disaster."}
      </p>

      <button onClick={tryAgain}>
        Try Another Passenger
      </button>

    </section>
  )}

</main>

);
}

export default App;
