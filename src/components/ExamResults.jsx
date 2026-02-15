import QuestionCard from './QuestionCard'

export default function ExamResults({ questions, answers, pool }) {
  const correct = questions.filter((q) => answers[q.id] === q.correct_answer).length
  const total = questions.length
  const passed = correct >= pool.passingScore
  const percentage = Math.round((correct / total) * 100)

  const missed = questions.filter((q) => answers[q.id] !== q.correct_answer)

  return (
    <div>
      <div className={`alert ${passed ? 'alert-success' : 'alert-error'} mb-6`}>
        <div>
          <h2 className="text-2xl font-bold">
            {passed ? 'Congratulations! You passed!' : 'Not quite — keep studying!'}
          </h2>
          <p className="text-lg mt-1">
            Score: {correct} / {total} ({percentage}%) &middot; Passing: {pool.passingScore}
          </p>
        </div>
      </div>

      {missed.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Missed Questions ({missed.length})
          </h3>
          {missed.map((q) => (
            <div key={q.id} className="mb-4">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title text-base">
                    <span className="badge badge-error badge-sm mr-2">{q.id}</span>
                    {q.question}
                  </h4>

                  {q.figure_image_base64 && (
                    <figure className="my-3">
                      <img
                        src={`data:image/png;base64,${q.figure_image_base64}`}
                        alt={q.figure || 'Question figure'}
                        className="max-w-full rounded-lg border border-base-300"
                      />
                    </figure>
                  )}

                  <div className="space-y-1 mt-2">
                    {Object.entries(q.answers).map(([letter, text]) => {
                      let cls = 'text-sm py-1 px-2 rounded'
                      if (letter === q.correct_answer) {
                        cls += ' bg-success/20 font-semibold'
                      } else if (letter === answers[q.id]) {
                        cls += ' bg-error/20 line-through'
                      }
                      return (
                        <div key={letter} className={cls}>
                          <span className="font-bold mr-2">{letter}.</span>{text}
                        </div>
                      )
                    })}
                  </div>

                  <p className="text-sm mt-2">
                    Your answer: <span className="font-bold text-error">{answers[q.id] || 'Unanswered'}</span>
                    {' · '}
                    Correct: <span className="font-bold text-success">{q.correct_answer}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
