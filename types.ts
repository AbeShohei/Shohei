import React from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEVELOPMENT';
}

export interface Skill {
  category: string;
  items: string[];
}

export interface HistoryItem {
  year: string;
  title: string;
  company: string;
  description: string;
}

export enum Section {
  HERO = 'HERO',
  ABOUT = 'ABOUT',
  WORKS = 'WORKS',
  CONTACT = 'CONTACT',
}

export interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
}