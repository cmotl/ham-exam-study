import { useState } from 'react'

export default function QuestionCard({ question, mode = 'study', selectedAnswer, onSelect }) {
  const [revealed, setRevealed] = useState(false)
  const isStudy = mode === 'study'
  const letters = Object.keys(question.answers)

  return (
    <div className="card bg-base-100 shadow-sm mb-4">
      <div className="card-body">
        <h3 className="card-title text-base">
          <span className="badge badge-neutral badge-sm mr-2">{question.id}</span>
          {question.question}
        </h3>

        {question.figure_image_base64 && (
          <figure className="my-3">
            <img
              src={`data:image/png;base64,${question.figure_image_base64}`}
              alt={question.figure || 'Question figure'}
              className="max-w-full rounded-lg border border-base-300"
            />
            {question.figure && (
              <figcaption className="text-sm text-base-content/60 mt-1">
                {question.figure}
              </figcaption>
            )}
          </figure>
        )}

        <div className="space-y-2 mt-2">
          {letters.map((letter) => {
            let btnClass = 'btn btn-block justify-start text-left font-normal h-auto py-2 min-h-0'

            if (isStudy && revealed) {
              if (letter === question.correct_answer) {
                btnClass += ' btn-success'
              } else {
                btnClass += ' btn-ghost'
              }
            } else if (!isStudy) {
              if (selectedAnswer === letter) {
                btnClass += ' btn-active btn-primary'
              } else {
                btnClass += ' btn-ghost'
              }
            } else {
              btnClass += ' btn-ghost'
            }

            return (
              <button
                key={letter}
                className={btnClass}
                onClick={() => {
                  if (isStudy) {
                    setRevealed(true)
                  } else if (onSelect) {
                    onSelect(letter)
                  }
                }}
              >
                <span className="font-bold mr-2 shrink-0">{letter}.</span>
                {question.answers[letter]}
              </button>
            )
          })}
        </div>

        {isStudy && !revealed && (
          <div className="mt-2">
            <button className="btn btn-outline btn-sm" onClick={() => setRevealed(true)}>
              Reveal Answer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
