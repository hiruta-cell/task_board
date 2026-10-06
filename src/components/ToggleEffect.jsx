// 完了切替時のアニメ風演出: クリック位置からの爆発・集中線・カットイン文字を画面に重ねて表示する

import { useEffect, useState } from 'react'

// 演出の表示時間（ms）。App.css のアニメーションの長さに合わせる
const DURATION = 1600
const PARTICLE_COUNT = 20
const PARTICLE_COLORS = ['#ffd166', '#ff5fa2', '#4cc9f0', '#ffffff', '#b28dff']

// 種類ごとのカットイン文言
const LABELS = {
  done: { main: 'COMPLETE!!', sub: 'タスク完了' },
  undo: { main: 'REOPEN!', sub: '未完了に戻しました' },
}

// 飛び散る粒をランダムに生成（3つに1つは星形）
const createParticles = () =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const star = i % 3 === 0
    return {
      angle: (360 / PARTICLE_COUNT) * i + Math.random() * 14 - 7,
      dist: 80 + Math.random() * 120,
      size: star ? 14 + Math.random() * 10 : 5 + Math.random() * 6,
      delay: Math.random() * 0.08,
      spin: Math.random() * 540 - 270,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      star,
    }
  })

export default function ToggleEffect({ type, x, y, onEnd }) {
  // 粒の配置はマウント時に一度だけ決める（再描画で動きが変わらないように）
  const [particles] = useState(createParticles)
  const label = LABELS[type]

  // 演出が終わったら親に知らせて取り除いてもらう。
  // App の再描画のたびにタイマーがリセットされないよう、マウント時に一度だけ開始する
  useEffect(() => {
    const timer = setTimeout(onEnd, DURATION)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`fx ${type}`} style={{ '--x': `${x}px`, '--y': `${y}px` }} aria-hidden="true">
      <div className="fx-flash" />
      <div className="fx-lines" />
      <span className="fx-ring" />
      <span className="fx-ring second" />
      {particles.map((p, i) => (
        <span
          key={i}
          className={p.star ? 'fx-particle star' : 'fx-particle'}
          style={{
            '--angle': `${p.angle}deg`,
            '--dist': `${p.dist}px`,
            '--size': `${p.size}px`,
            '--delay': `${p.delay}s`,
            '--spin': `${p.spin}deg`,
            '--color': p.color,
          }}
        />
      ))}
      {/* 画面中央のカットイン: 斜めの帯＋大きな文字 */}
      <div className="fx-cutin">
        <div className="fx-band" />
        <p className="fx-title">{label.main}</p>
        <p className="fx-sub">{label.sub}</p>
      </div>
    </div>
  )
}
