
import { useEffect, useState, useCallback } from "react";

const API_URL =
  "https://the-trivia-api.com/v2/questions?limit=10";

function Home() {
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);
  const [retry, setRetry] = useState(0);

  // Fetch questions from API
  useEffect(() => {
    const controller = new AbortController();

    async function getQuestions() {
      setLoading(true);
      setError("");
      setQuestions([]);
      setOptions([]);
      setIndex(0);
      setSelected("");
      setScore(0);
      setTimeLeft(30);
      setFinished(false);

      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (response.status === 429) {
          throw new Error(
            "API rate limit reached. Please wait and try again."
          );
        }

        if (!response.ok) {
          throw new Error("Unable to load questions.");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No questions available.");
        }

        setQuestions(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getQuestions();

    return () => controller.abort();
  }, [retry]);

  // Shuffle options once per question
  useEffect(() => {
    const q = questions[index];

    if (!q) {
      setOptions([]);
      return;
    }

    const allOptions = [
      ...q.incorrectAnswers,
      q.correctAnswer,
    ];

    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [
        allOptions[j],
        allOptions[i],
      ];
    }

    setOptions(allOptions);
    setSelected("");
    setTimeLeft(30);
  }, [questions, index]);

  // Next question and score calculation
  const nextQuestion = useCallback(() => {
    const q = questions[index];

    if (!q) return;

    if (selected === q.correctAnswer) {
      setScore((previous) => previous + 1);
    }

    if (index >= questions.length - 1) {
      setFinished(true);
    } else {
      setIndex((previous) => previous + 1);
    }
  }, [questions, index, selected]);

  // 30-second countdown; auto-advance when time ends
  useEffect(() => {
    if (
      loading ||
      error ||
      finished ||
      questions.length === 0
    ) {
      return;
    }

    if (timeLeft === 0) {
      nextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    timeLeft,
    loading,
    error,
    finished,
    questions.length,
    nextQuestion,
  ]);

  const restartQuiz = () => {
    setRetry((previous) => previous + 1);
  };

  // Loading screen
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1>Quiz App</h1>
          <h3>Loading questions...</h3>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1>Quiz App</h1>
          <p style={{ color: "crimson" }}>{error}</p>
          <button style={styles.primaryButton} onClick={restartQuiz}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Result screen
  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1>Quiz Completed!</h1>
          <h2>
            Your Score: {score} / {questions.length}
          </h2>
          <h3>{percentage}%</h3>

          <p>
            {percentage >= 80
              ? "Excellent work!"
              : percentage >= 50
              ? "Good job! Keep practicing."
              : "Keep learning and try again!"}
          </p>

          <button style={styles.primaryButton} onClick={restartQuiz}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Quiz App</h1>

        <div style={styles.info}>
          <span>
            Question {index + 1} / {questions.length}
          </span>

          <span
            style={{
              color: timeLeft <= 10 ? "#dc2626" : "#2563eb",
              fontWeight: "bold",
            }}
          >
            Time: {timeLeft}s
          </span>
        </div>

        <div style={styles.progressBackground}>
          <div
            style={{
              ...styles.progressBar,
              width: `${
                ((index + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>

        <p style={styles.category}>
          {q.category?.replaceAll("_", " ")} · {q.difficulty}
        </p>

        <h2 style={styles.question}>
          {q.question.text}
        </h2>

        <div>
          {options.map((option, i) => (
            <button
              key={`${index}-${i}`}
              disabled={timeLeft === 0}
              onClick={() => setSelected(option)}
              style={{
                ...styles.option,
                background:
                  selected === option ? "#dbeafe" : "#ffffff",
                borderColor:
                  selected === option ? "#2563eb" : "#d1d5db",
                opacity: timeLeft === 0 ? 0.7 : 1,
              }}
            >
              {String.fromCharCode(65 + i)}. {option}
            </button>
          ))}
        </div>

        {timeLeft === 0 && (
          <p style={{ color: "#dc2626" }}>
            Time is up! Moving to the next question...
          </p>
        )}

        <button
          style={styles.primaryButton}
          onClick={nextQuestion}
          disabled={!selected || timeLeft === 0}
        >
          {index === questions.length - 1
            ? "Finish Quiz"
            : "Next Question"}
        </button>

        <p style={styles.footer}>
          Correct answers: {score}
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #dbeafe, #f5f3ff)",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
  },
  card: {
    width: "100%",
    maxWidth: "650px",
    boxSizing: "border-box",
    padding: "30px",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
  heading: {
    textAlign: "center",
    color: "#2563eb",
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    margin: "22px 0 12px",
    flexWrap: "wrap",
  },
  progressBackground: {
    height: "7px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "#2563eb",
    transition: "width 0.3s",
  },
  category: {
    marginTop: "22px",
    color: "#6b7280",
    textTransform: "capitalize",
    fontSize: "14px",
  },
  question: {
    fontSize: "22px",
    lineHeight: 1.5,
    marginBottom: "22px",
  },
  option: {
    display: "block",
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    border: "2px solid #d1d5db",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "16px",
    color: "#1f2937",
    overflowWrap: "anywhere",
  },
  primaryButton: {
    display: "block",
    width: "100%",
    padding: "14px",
    marginTop: "20px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    color: "#6b7280",
  },
};

export default Home;
