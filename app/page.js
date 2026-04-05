"use client";
import { useEffect, useRef, useState } from "react";

const QUESTIONS = [
  {
    id: 1,
    question: "2 + 2 = ?",
    options: ["2", "3", "4", "5"],
    answer: "4",
  },
  {
    id: 2,
    question: "Capital of India?",
    options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    answer: "Delhi",
  },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const videoRef = useRef(null);

  // TIMER
  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started]);

  // CAMERA
  useEffect(() => {
    if (!started) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
      });
  }, [started]);

  const formatTime = () => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    return `${h}:${m}:${s}`;
  };

  const selectAnswer = (option) => {
    setAnswers({ ...answers, [current]: option });
  };

  if (!started) {
    return (
      <div style={styles.center}>
        <h1>Mock Test</h1>
        <button onClick={() => setStarted(true)} style={styles.button}>
          Start Test
        </button>
      </div>
    );
  }

  const q = QUESTIONS[current];

  return (
    <div style={styles.container}>
      {/* LEFT PANEL */}
      <div style={styles.left}>
        <h2>Time Left: {formatTime()}</h2>

        <h3>{q.question}</h3>

        <div>
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => selectAnswer(opt)}
              style={{
                ...styles.option,
                background:
                  answers[current] === opt ? "#4caf50" : "#eee",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            Prev
          </button>

          <button
            disabled={current === QUESTIONS.length - 1}
            onClick={() => setCurrent(current + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT PANEL (CAMERA) */}
      <div style={styles.right}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={styles.video}
        />
        <p>Camera Monitoring</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  left: {
    flex: 3,
    padding: 20,
  },
  right: {
    flex: 1,
    borderLeft: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    maxHeight: "300px",
    borderRadius: 10,
  },
  option: {
    display: "block",
    width: "100%",
    margin: "10px 0",
    padding: 15,
    fontSize: 18,
  },
  button: {
    padding: "10px 20px",
    fontSize: 18,
  },
  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};
