import { Link } from 'react-router-dom'
import { POOLS } from '../pools'

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Choose an Exam Pool</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {POOLS.map((pool) => (
          <div key={pool.id} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">
                {pool.label}
                <span className="badge badge-outline">{pool.years}</span>
              </h2>
              <p className="text-sm text-base-content/70">
                {pool.examQuestions} questions on the exam &middot; {pool.passingScore} to pass
              </p>
              <div className="card-actions justify-end mt-2">
                <Link to={`/study/${pool.id}`} className="btn btn-primary btn-sm">
                  Study
                </Link>
                <Link to={`/exam/${pool.id}`} className="btn btn-secondary btn-sm">
                  Practice Exam
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
