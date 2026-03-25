// src/types/index.ts

export type Role = 'FACULTY' | 'EXAM_CELL';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  department: string;
}

export interface Question {
  id?: number;
  subject_id: number;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  unit: number;
}

export interface PaperConfig {
  id?: number;
  subject_id: number;
  title: string;
  total_questions: number;
  duration: string;
  max_marks: number;
  exam_date: string;
  instructions: string;
}