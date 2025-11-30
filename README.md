# CyberFolio // System Online

サイバーパンク、グリッチアート、レトロフューチャーな美学を取り入れた、没入型の個人ポートフォリオサイトです。
React, Three.js, Tailwind CSS を使用して構築されており、パフォーマンスと視覚効果を両立させています。

🔗 **Live Demo:** [https://shohei-github-bdjjuv6g8-abeshoheis-projects.vercel.app/](https://shohei-github-bdjjuv6g8-abeshoheis-projects.vercel.app/)

![CyberFolio Preview](https://picsum.photos/800/400?grayscale)
*(※実際のスクリーンショットに差し替えることを推奨します)*

## ⚡ Features

- **Immersive Visuals**: Three.jsによる3D空間背景とパーティクルエフェクト。
- **Matrix Rain**: HTML5 Canvasを使用したデジタルレインエフェクト。
- **Glitch UI**: CSSアニメーションによるグリッチテキストやホバーエフェクト。
- **Responsive Design**: Tailwind CSSによる完全レスポンシブ対応。
- **CRT Effects**: スキャンラインや画面のちらつき（Flicker）によるブラウン管風の演出。

## 🛠 Tech Stack

- **Frontend Framework**: [React](https://react.dev/) (v18+)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D & Animation**: [Three.js](https://threejs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

ローカル環境でプロジェクトを実行する手順です。

### 1. Clone the repository

```bash
git clone https://github.com/AbeShohei/Shohei.git
cd Shohei
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いて確認できます。

## 📂 Project Structure

```
/
├── public/          # 静的アセット
├── src/
│   ├── components/  # Reactコンポーネント (MatrixBackground, GlitchText etc.)
│   ├── types/       # TypeScript型定義
│   ├── constants.tsx # 定数データ (プロフィール情報、プロジェクト一覧)
│   ├── App.tsx      # メインアプリケーション
│   └── main.tsx     # エントリーポイント
└── ...
```

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
