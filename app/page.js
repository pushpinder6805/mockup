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
  {
    id: 3,
    question: "10 × 5 = ?",
    options: ["40", "45", "50", "55"],
    answer: "50",
  },
  {
    id: 4,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    answer: "Pacific",
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
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const selectAnswer = (option) => {
    setAnswers({ ...answers, [current]: option });
  };

  if (!started) {
    return (
      <div style={styles.center}>
        <h1 style={styles.title}>Mock Test</h1>
        <p style={styles.subtitle}>Duration: 1 Hour | Questions: {QUESTIONS.length}</p>
        <button onClick={() => setStarted(true)} style={styles.startButton}>
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
        <div style={styles.header}>
          <h2 style={styles.timer}>Time Left: {formatTime()}</h2>
          <div style={styles.progress}>
            Question {current + 1} of {QUESTIONS.length}
          </div>
        </div>

        <h3 style={styles.question}>{q.question}</h3>

        <div style={styles.optionsContainer}>
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => selectAnswer(opt)}
              style={{
                ...styles.option,
                background: answers[current] === opt ? "#4caf50" : "#f5f5f5",
                color: answers[current] === opt ? "#fff" : "#333",
                border: answers[current] === opt ? "2px solid #45a049" : "2px solid #ddd",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <div style={styles.navigation}>
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            style={{
              ...styles.navButton,
              opacity: current === 0 ? 0.5 : 1,
            }}
          >
            Previous
          </button>

          <button
            disabled={current === QUESTIONS.length - 1}
            onClick={() => setCurrent(current + 1)}
            style={{
              ...styles.navButton,
              ...styles.nextButton,
              opacity: current === QUESTIONS.length - 1 ? 0.5 : 1,
            }}
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
          muted
          style={styles.video}
        />
        <p style={styles.cameraLabel}>Camera Monitoring</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  left: {
    flex: 3,
    padding: 40,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  right: {
    flex: 1,
    borderLeft: "2px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fafafa",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "2px solid #e0e0e0",
  },
  timer: {
    fontSize: 24,
    fontWeight: "600",
    color: "#d32f2f",
    margin: 0,
  },
  progress: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
  question: {
    fontSize: 28,
    fontWeight: "500",
    color: "#222",
    marginBottom: 30,
    lineHeight: 1.4,
  },
  optionsContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  option: {
    display: "block",
    width: "100%",
    padding: 20,
    fontSize: 20,
    fontWeight: "500",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left",
  },
  navigation: {
    display: "flex",
    gap: 15,
    marginTop: 30,
  },
  navButton: {
    flex: 1,
    padding: 18,
    fontSize: 18,
    fontWeight: "600",
    borderRadius: 10,
    border: "2px solid #2196f3",
    backgroundColor: "#fff",
    color: "#2196f3",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  nextButton: {
    backgroundColor: "#2196f3",
    color: "#fff",
  },
  video: {
    width: "100%",
    maxHeight: "400px",
    borderRadius: 12,
    border: "2px solid #ddd",
    backgroundColor: "#000",
  },
  cameraLabel: {
    marginTop: 15,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#666",
    marginBottom: 40,
  },
  startButton: {
    padding: "20px 60px",
    fontSize: 24,
    fontWeight: "600",
    backgroundColor: "#2196f3",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};
