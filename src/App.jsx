// タスクボード本体: タスクの追加・完了切替・削除と一覧表示を担う
import { useState } from 'react'

// 日時を「2026/10/06 14:05」形式の文字列にする
const formatDate = (time) =>
  new Date(time).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

// タスク番号を「T-001」形式にする
const formatNo = (no) => `T-${String(no).padStart(3, '0')}`

export default function App() {
  // タスク一覧。completedAt が null なら未完了、数値（完了日時）なら完了
  const [tasks, setTasks] = useState([])
  // 入力欄のテキスト
  const [text, setText] = useState('')
  // 次に振るタスク番号（削除しても番号は再利用しない）
  const [nextNo, setNextNo] = useState(1)

  // フォーム送信でタスクを追加（空白のみの入力は無視）
  const addTask = (e) => {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), no: nextNo, title, createdAt: Date.now(), completedAt: null },
    ])
    setNextNo((n) => n + 1)
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

  // 完了率（タスクが無いときは 0%）
  const progress = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0

  // タスク1行分の表示
  const renderTask = (task) => (
    <li key={task.id} className={task.completedAt ? 'task done' : 'task'}>
      <label className="task-main">
        <input
          type="checkbox"
          checked={Boolean(task.completedAt)}
          onChange={() => toggleTask(task.id)}
        />
        <span className="content">
          <span className="title">{task.title}</span>
          {/* タスク番号・追加日時と、完了していれば完了日時 */}
          <span className="meta">
            <span className="no">{formatNo(task.no)}</span>
            <span>追加 {formatDate(task.createdAt)}</span>
            {task.completedAt && <span>完了 {formatDate(task.completedAt)}</span>}
          </span>
        </span>
      </label>
      <button
        className="delete"
        onClick={() => deleteTask(task.id)}
        aria-label={`「${task.title}」を削除`}
      >
        削除
      </button>
    </li>
  )

  return (
    <main className="board">
      {/* ヘッダー: タイトルと件数・完了率 */}
      <header className="header">
        <div>
          <p className="eyebrow">TASK BOARD</p>
          <h1>タスクボード</h1>
        </div>
        <dl className="stats">
          <div>
            <dt>未完了</dt>
            <dd>{activeTasks.length}</dd>
          </div>
          <div>
            <dt>完了</dt>
            <dd>{doneTasks.length}</dd>
          </div>
          <div>
            <dt>完了率</dt>
            <dd>{progress}%</dd>
          </div>
        </dl>
      </header>

      {/* 完了率の進捗バー */}
      <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${progress}%` }} />
      </div>

      {/* タスク追加フォーム */}
      <form className="add-form" onSubmit={addTask}>
        <input
          id="new-task"
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
        <p className="empty">タスクはまだありません。上の入力欄から追加してください。</p>
      ) : (
        <>
          <ul className="task-list">{activeTasks.map(renderTask)}</ul>
          {doneTasks.length > 0 && (
            <>
              <h2 className="section-label">完了済み</h2>
              <ul className="task-list">{doneTasks.map(renderTask)}</ul>
            </>
          )}
        </>
      )}
    </main>
  )
}
