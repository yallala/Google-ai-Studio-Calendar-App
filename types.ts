export enum EventType {
  EVENT = 'EVENT',
  GOAL = 'GOAL',
  UPDATE = 'UPDATE',
}

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: EventType;
  description?: string;
  createdBy: string; // User ID
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  avatarColor: string;
}
