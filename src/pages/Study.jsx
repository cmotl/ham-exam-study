import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { POOLS } from '../pools'
import QuestionCard from '../components/QuestionCard'

export default function Study() {
  const { pool: poolId } = useParams()
  const pool = POOLS.find((p) => p.id === poolId)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSubelement, setActiveSubelement] = useState(null)
  const [activeGroup, setActiveGroup] = useState(null)

  useEffect(() => {
    if (!pool) return
    setLoading(true)
    fetch(pool.file)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load pool data`)
        return r.json()
      })
      .then((d) => {
        setData(d)
        setActiveSubelement(d.subelements[0]?.id || null)
        setActiveGroup(d.subelements[0]?.groups[0]?.id || null)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [pool])

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

  const currentSubelement = data.subelements.find((s) => s.id === activeSubelement)
  const currentGroup = currentSubelement?.groups.find((g) => g.id === activeGroup)

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="btn btn-ghost btn-sm">&larr; Home</Link>
        <h1 className="text-2xl font-bold">
          Study: {pool.label} ({pool.years})
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-72 shrink-0">
          <ul className="menu bg-base-100 rounded-box shadow-sm w-full">
            {data.subelements.map((sub) => (
              <li key={sub.id}>
                <details open={sub.id === activeSubelement}>
                  <summary
                    className="font-semibold"
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveSubelement(sub.id)
                      setActiveGroup(sub.groups[0]?.id || null)
                    }}
                  >
                    {sub.id}
                  </summary>
                  <ul>
                    {sub.groups.map((group) => (
                      <li key={group.id}>
                        <a
                          className={activeGroup === group.id ? 'active' : ''}
                          onClick={() => {
                            setActiveSubelement(sub.id)
                            setActiveGroup(group.id)
                          }}
                        >
                          {group.id}
                          <span className="text-xs text-base-content/50 ml-1">
                            ({group.questions.length})
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        </div>

        {/* Questions */}
        <div className="flex-1 min-w-0">
          {currentGroup && (
            <>
              <h2 className="text-lg font-semibold mb-1">{currentGroup.id}</h2>
              <p className="text-sm text-base-content/60 mb-4">{currentGroup.title}</p>
              {currentGroup.questions.map((q) => (
                <QuestionCard key={q.id} question={q} mode="study" />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
