import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { POOLS } from '../pools'
import QuestionCard from '../components/QuestionCard'
import ExamResults from '../components/ExamResults'

function selectExamQuestions(data, count) {
  // ARRL exam structure: one question from each group, distributed across subelements.
  // We pick one random question per group, then shuffle and trim to the exam count.
  const allGroupQuestions = []
  for (const sub of data.subelements) {
    for (const group of sub.groups) {
      const idx = Math.floor(Math.random() * group.questions.length)
      allGroupQuestions.push(group.questions[idx])
    }
  }
  // Shuffle
  for (let i = allGroupQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allGroupQuestions[i], allGroupQuestions[j]] = [allGroupQuestions[j], allGroupQuestions[i]]
  }
  return allGroupQuestions.slice(0, count)
}

export default function Exam() {
  const { pool: poolId } = useParams()
  const pool = POOLS.find((p) => p.id === poolId)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!pool) return
    setLoading(true)
    fetch(pool.file)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load pool data')
        return r.json()
      })
      .then((d) => {
        setData(d)
        setQuestions(selectExamQuestions(d, pool.examQuestions))
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [pool])

  function handleRestart() {
    setQuestions(selectExamQuestions(data, pool.examQuestions))
    setAnswers({})
    setCurrentIndex(0)
    setSubmitted(false)
  }

  if (!pool) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Pool not found.</p>
        <Link to="/" className="btn btn-primary mt-4">Back to Home</Link>
      </div>
    )
  }

  if (loading) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
  if (error) return <div className="alert alert-error">{error}</div>

  if (submitted) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Link to="/" className="btn btn-ghost btn-sm">&larr; Home</Link>
          <h1 className="text-2xl font-bold">
            Exam Results: {pool.label} ({pool.years})
          </h1>
        </div>
        <ExamResults questions={questions} answers={answers} pool={pool} />
        <div className="mt-6 flex gap-3">
          <button className="btn btn-primary" onClick={handleRestart}>
            Try Again
          </button>
          <Link to="/" className="btn btn-ghost">Back to Home</Link>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="btn btn-ghost btn-sm">&larr; Home</Link>
        <h1 className="text-2xl font-bold">
          Practice Exam: {pool.label} ({pool.years})
        </h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-4">
        <progress
          className="progress progress-primary flex-1"
          value={answeredCount}
          max={questions.length}
        />
        <span className="text-sm font-mono whitespace-nowrap">
          {answeredCount} / {questions.length}
        </span>
      </div>

      {/* Question navigation dots */}
      <div className="flex flex-wrap gap-1 mb-4">
        {questions.map((q, i) => (
          <button
            key={q.id}
            className={`btn btn-xs ${
              i === currentIndex
                ? 'btn-primary'
                : answers[q.id]
                  ? 'btn-success btn-outline'
                  : 'btn-ghost'
            }`}
            onClick={() => setCurrentIndex(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current question */}
      <div className="mb-2 text-sm text-base-content/60">
        Question {currentIndex + 1} of {questions.length}
      </div>
      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        mode="exam"
        selectedAnswer={answers[currentQuestion.id]}
        onSelect={(letter) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: letter }))}
      />

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            Next
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => setSubmitted(true)}
          >
            Submit Exam ({answeredCount}/{questions.length} answered)
          </button>
        )}
      </div>
    </div>
  )
}
