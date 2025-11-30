import { Project, Skill, HistoryItem } from './types';
import React from 'react';
import { Terminal, Cpu, Globe, Mail } from 'lucide-react';

export const MY_NAME = "Shohei"; 
export const TAGLINE = "AI Engineer // Frontend Dev";

export const TICKER_TEXTS = [
  "SYSTEM STATUS: ONLINE",
  "LATEST PROJECT: UNIV_CIRCLE_CONNECT",
  "AVAILABLE FOR INTERNSHIPS",
  "INTEGRATING: GEMINI API",
  "LAST LOGIN: JUST NOW",
  "SECURITY LEVEL: MAX"
];

export const SKILLS: Skill[] = [
  {
    category: "Frontend & UI",
    items: ["React.js", "TypeScript", "Tailwind CSS", "Glassmorphism", "Three.js"]
  },
  {
    category: "AI & Data",
    items: ["Google Gemini API", "Prompt Engineering", "Python", "CSV Parsing"]
  },
  {
    category: "Backend & Cloud",
    items: ["Node.js", "Google Cloud Run", "Supabase", "Docker"]
  },
  {
    category: "Domain Knowledge",
    items: ["Economics", "Cyber Security", "Data Analysis"]
  }
];

export const CAREER_HISTORY: HistoryItem[] = [
  {
    year: "2027 (EXPECTED)",
    title: "経済学部 経済学科",
    company: "同志社大学",
    description: "経済学と情報学を横断的に学び、AI技術の実社会への適用に関心を持つ。"
  }
];

export const PROJECTS: Project[] = [
  {
    id: "univ-circle",
    title: "UNIV_CIRCLE_CONNECT",
    description: "AI(Gemini)を活用した次世代サークル新歓プラットフォーム。自然言語マッチングや紹介文のAI推敲機能を搭載し、グラスモーフィズムと3Dアニメーションによる没入感のあるUIを提供。",
    tags: ["React", "Gemini API", "Tailwind", "Cloud Run"],
    // thum.io を使用してサイトのスクリーンショットをリアルタイム取得
    imageUrl: "https://image.thum.io/get/width/800/crop/600/noanimate/https://univcircle-connect-1068348265766.us-west1.run.app/",
    link: "https://univcircle-connect-1068348265766.us-west1.run.app/",
    status: 'ONLINE'
  },
  {
    id: "p2",
    title: "CYBER_MARKET",
    description: "高頻度取引チャートを備えた分散型マーケットプレイスのダッシュボード。経済指標のリアルタイム可視化。",
    tags: ["Solidity", "Next.js", "D3.js"],
    imageUrl: "https://picsum.photos/seed/market/600/400",
    link: "/project/cyber-market",
    status: 'DEVELOPMENT'
  },
  {
    id: "p3",
    title: "GHOST_PROTOCOL",
    description: "一時的なストレージとターミナルベースのUIを備えた暗号化メッセージングサービス。",
    tags: ["Rust", "WebAssembly", "Socket.io"],
    imageUrl: "https://picsum.photos/seed/ghost/600/400",
    link: "/project/ghost-protocol",
    status: 'ONLINE'
  },
  {
    id: "p4",
    title: "SYNTH_WAVE_GEN",
    description: "レトロウェーブの美学に基づいたAI駆動の音楽生成ツール。",
    tags: ["Python", "TensorFlow", "React"],
    imageUrl: "https://picsum.photos/seed/synth/600/400",
    link: "/project/synth-wave",
    status: 'OFFLINE'
  }
];