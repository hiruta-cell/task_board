// タスクボード本体: タスクの追加・完了切替・削除と一覧表示を担う
import { useState } from 'react'

export default function App() {
  // タスク一覧。completedAt が null なら未完了、数値（完了日時）なら完了
  const [tasks, setTasks] = useState([])
  // 入力欄のテキスト
  const [text, setText] = useState('')

  // フォーム送信でタスクを追加（空白のみの入力は無視）
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

  // 完了 ⇔ 未完了を切り替え。完了時は現在時刻を記録し、並び順に使う
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completedAt: t.completedAt ? null : Date.now() } : t,
      ),
    )
  }

  // 指定したタスクを削除
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

      {/* タスク追加フォーム */}
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

      {/* タスク一覧（未完了 → 完了の順に表示） */}
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
