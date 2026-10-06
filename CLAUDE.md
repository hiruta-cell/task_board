# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code へのガイドです。

## プロジェクト概要

task_board — React（Vite）製のタスク管理ボード。

- `src/App.jsx` — タスクの追加・完了切替・削除、表示順のロジック
- `src/components/ToggleEffect.jsx` — 完了／未完了切替時のアニメ風演出（爆発・集中線・カットイン文字）
- `src/App.css` — スタイル
- 保存: タスクと次のタスク番号を localStorage（キー `task-board`）に保存し、リロード後も復元する
- 表示順: 未完了（追加順）→ 完了（完了日時の新しい順）
- デプロイ先: https://hiruta-cell.github.io/task_board/ （GitHub Pages）

## 技術スタック

| 分類 | 使用技術 |
| --- | --- |
| UI ライブラリ | React 19（関数コンポーネント＋Hooks: `useState` / `useEffect`） |
| ビルドツール | Vite 8（`@vitejs/plugin-react`） |
| 言語 | JavaScript（JSX、ES Modules）※TypeScript は未使用 |
| スタイル | 素の CSS（`src/App.css`）。CSS 変数で配色・フォントを管理し、`prefers-color-scheme` でダーク／ライトを切替 |
| フォント | Google Fonts（Chakra Petch / Noto Sans JP / JetBrains Mono） |
| データ保存 | ブラウザの localStorage（サーバー・DB なし） |
| 実行環境 | Node.js（ローカル開発）、GitHub Actions は Node 22 でビルド |
| ホスティング | GitHub Pages（GitHub Actions で自動デプロイ） |

外部ライブラリは必要最小限にする。追加する場合はユーザーに確認してから導入する。

## コミュニケーション

- 説明・コメント・コミットメッセージは日本語で書く（コード識別子や技術用語は原文のまま）。

## コーディング規約

- **ファイルを作成・変更したら、簡潔でわかりやすい日本語の説明コメントを付ける。**
  - ファイル冒頭にそのファイルの役割を1行で書く。
  - 関数・状態・主要なブロックには「何をするか／なぜそうするか」を短く書く。
  - コードを読めば分かる自明な処理にはコメントを付けない（書きすぎない）。
  - JSON など、コメントを書けない形式のファイルは対象外。

### 命名規則

| 対象 | 規則 | 例 |
| --- | --- | --- |
| コンポーネント | PascalCase。ファイル名もコンポーネント名と同じ `.jsx` | `App` → `App.jsx`、`TaskItem` → `TaskItem.jsx` |
| コンポーネントの置き場所 | ルートは `src/App.jsx`。新しく分割するコンポーネントは `src/components/` に置く | `src/components/TaskItem.jsx` |
| コンポーネントの定義 | 関数コンポーネントを `export default function 名前()` で書く | `export default function App()` |
| 状態（state） | `[名詞, set名詞]` | `[tasks, setTasks]`、`[text, setText]` |
| イベント処理関数 | 動詞＋対象の camelCase | `addTask`、`toggleTask`、`deleteTask` |
| 表示用の補助関数 | `render〇〇`（JSX を返す）、`format〇〇`（文字列を整形） | `renderTask`、`formatDate`、`formatNo` |
| 定数 | UPPER_SNAKE_CASE | `STORAGE_KEY` |
| CSS クラス | kebab-case。状態は別クラスを付け足して表す | `.task-list`、`.add-form`、`.task.done` |
| CSS 変数 | `--役割` の kebab-case | `--bg`、`--accent`、`--font-mono` |

## Git / GitHub 運用ルール

**コードを変更したら、そのたびに GitHub へプッシュすること。**

1. 変更が一区切りついたら（1つの修正・機能追加ごと）、すぐにコミットする。
2. コミット後、必ず `git push` でリモート（`origin`）へプッシュする。
3. コミットメッセージは変更内容が分かる簡潔な日本語で書く。
   - 例: `タスク追加フォームを実装`、`ドラッグ＆ドロップのバグを修正`
4. 関係のないファイル（`.env`、認証情報、`node_modules/`、ビルド成果物など）はコミットしない。必要に応じて `.gitignore` に追加する。
5. プッシュに失敗した場合（リモート未設定、認証エラー、競合など）は、強制プッシュ（`--force`）せずユーザーに報告して指示を仰ぐ。

### 初回セットアップ（未実施の場合）

```bash
git init
git branch -M main
git remote add origin <GitHubリポジトリのURL>
git push -u origin main
```

## 開発コマンド

```bash
npm install     # 依存パッケージのインストール
npm run dev     # 開発サーバー起動
npm run build   # 本番ビルド（dist/）
```

## 公開（GitHub Pages）

- デプロイ先: https://hiruta-cell.github.io/task_board/
- `main` へプッシュすると `.github/workflows/deploy.yml` が自動でビルド・公開する。
- 公開パスに合わせ、`vite.config.js` の `base` を本番ビルド時のみ `/task_board/` にしている。
- `deploy.yml` は、実行対象のコミットが `main` の最新でなければ公開せずに失敗する（古い版での上書き防止）。

### 公開後の確認（「公開済み」と報告する前に必ず行う）

過去に、古いデプロイ（`6727964`）が Actions 画面で再実行され、新しい版が古いビルドで上書きされたことがある。プッシュしただけで「公開済み」と判断しないこと。

1. GitHub API で、HEAD のコミットに対応するワークフロー実行が `completed` / `success` になったことを確認する（`gh` は未インストールのため `curl` で取得する）。
   ```bash
   curl -s "https://api.github.com/repos/hiruta-cell/task_board/actions/runs?per_page=3"
   ```
2. 公開中の `index.html` が読み込んでいる JS / CSS を取得し、**今回の変更に固有の文字列が含まれているか**を確認する。キャッシュを避けるためクエリ（`?v=乱数`）を付ける。
   - アセットのファイル名（ハッシュ）が手元のビルドと一致するかどうかだけで判断しない。
3. ユーザーには、ブラウザのキャッシュが最大10分ほど残ること（`cache-control: max-age=600`）、スーパーリロード（Windows: Ctrl + F5 / Mac: ⌘ + Shift + R）で再読み込みすることを伝える。

### 再デプロイの方法

- Actions 画面の **Run workflow**（`workflow_dispatch`）で実行するか、**最新の実行**を Re-run する。
- 古い実行は Re-run しない（上記のチェックで失敗するが、そもそも行わない）。
- ローカルからやり直す場合は空のコミットをプッシュする: `git commit --allow-empty -m "GitHub Pages を最新版で再デプロイ"`

### 演出が表示されないときの確認

- OS の「動きを減らす」設定（Windows: 設定 → アクセシビリティ → 視覚効果 → アニメーション効果 がオフ）では、`prefers-reduced-motion` によって演出を出さない仕様。不具合と判断する前にこの設定を確認する。
