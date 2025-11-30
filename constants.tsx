import { Project, Skill, HistoryItem } from './types';
import React from 'react';
import { Terminal, Cpu, Globe, Mail } from 'lucide-react';

export const MY_NAME = "Shohei"; 
export const TAGLINE = "Student // Engineer";

export const TICKER_TEXTS = [
  "SYSTEM STATUS: ONLINE",
  "LOCATION: KYOTO, JP",
  "AVAILABLE FOR INTERNSHIPS",
  "STUDYING: SECURITY & ECONOMICS",
  "LAST LOGIN: JUST NOW",
  "SECURITY LEVEL: MAX"
];

export const SKILLS: Skill[] = [
  {
    category: "フロントエンド",
    items: ["React.js", "TypeScript", "Tailwind CSS", "Next.js"]
  },
  {
    category: "バックエンド",
    items: ["Node.js", "Python", "Java", "PostgreSQL", "Supabase"]
  },
  {
    category: "DevOps",
    items: ["Docker", "AWS"]
  },
  {
    category: "クリエイティブ",
    items: ["Figma"]
  },
  {
    category: "その他",
    items: ["R"]
  }
];

export const CAREER_HISTORY: HistoryItem[] = [
  {
    year: "2027 (EXPECTED)",
    title: "経済学部 経済学科",
    company: "同志社大学",
    description: "卒業見込み。経済学と情報学を横断的に学び、セキュリティ分野にも関心を持つ。"
  }
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "NEURAL_NEXUS",
    description: "WebGLとリアルタイムデータ処理を使用したニューラルネットワーク経路の可視化システム。",
    tags: ["WebGL", "React", "Python"],
    imageUrl: "https://picsum.photos/600/400?random=1",
    link: "/project/neural-nexus",
    status: 'ONLINE'
  },
  {
    id: "p2",
    title: "CYBER_MARKET",
    description: "高頻度取引チャートを備えた分散型マーケットプレイスのダッシュボード。",
    tags: ["Solidity", "Next.js", "D3.js"],
    imageUrl: "https://picsum.photos/600/400?random=2",
    link: "/project/cyber-market",
    status: 'DEVELOPMENT'
  },
  {
    id: "p3",
    title: "GHOST_PROTOCOL",
    description: "一時的なストレージとターミナルベースのUIを備えた暗号化メッセージングサービス。",
    tags: ["Rust", "WebAssembly", "Socket.io"],
    imageUrl: "https://picsum.photos/600/400?random=3",
    link: "/project/ghost-protocol",
    status: 'ONLINE'
  },
  {
    id: "p4",
    title: "SYNTH_WAVE_GEN",
    description: "レトロウェーブの美学に基づいたAI駆動の音楽生成ツール。",
    tags: ["Python", "TensorFlow", "React"],
    imageUrl: "https://picsum.photos/600/400?random=4",
    link: "/project/synth-wave",
    status: 'OFFLINE'
  }
];