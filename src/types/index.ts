export type Role = "STUDENT" | "ADMIN" | "INSTRUCTOR";

export interface User {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  role?: Role;
  createdAt?: string;
}

export interface Program {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  pricePaise?: number;
  isPublished?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date?: string;
  time?: string;
  speaker?: string;
  description?: string;
  link?: string;
  badge?: string;
}
