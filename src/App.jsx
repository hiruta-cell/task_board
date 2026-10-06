import { useState } from 'react'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')

  const addTask = (e) => {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, createdAt: Date.now(), completedAt: null },
    ])
    setText('')
  }

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completedAt: t.completedAt ? null : Date.now() } : t,
      ),
    )
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  // 未完了: 追加順 / 完了: 新しく完了したものほど上
  const activeTasks = tasks
    .filter((t) => !t.completedAt)
    .sort((a, b) => a.createdAt - b.createdAt)
  const doneTasks = tasks
    .filter((t) => t.completedAt)
    .sort((a, b) => b.completedAt - a.completedAt)

  return (
    <main className="board">
      <h1>Task Board</h1>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力"
          aria-label="新しいタスク"
        />
        <button type="submit" disabled={!text.trim()}>
          追加
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">タスクはまだありません</p>
      ) : (
        <ul className="task-list">
          {[...activeTasks, ...doneTasks].map((task) => (
            <li key={task.id} className={task.completedAt ? 'task done' : 'task'}>
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(task.completedAt)}
                  onChange={() => toggleTask(task.id)}
                />
                <span className="title">{task.title}</span>
              </label>
              <button
                className="delete"
                onClick={() => deleteTask(task.id)}
                aria-label={`「${task.title}」を削除`}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
