import { EventType } from './types.js';

export const EVENT_TYPE_COLORS = {
  [EventType.EVENT]: 'bg-blue-400',
  [EventType.GOAL]: 'bg-green-400',
  [EventType.UPDATE]: 'bg-yellow-400',
};

export const EVENT_TYPE_TEXT_COLORS = {
  [EventType.EVENT]: 'text-blue-800',
  [EventType.GOAL]: 'text-green-800',
  [EventType.UPDATE]: 'text-yellow-800',
};

export const EVENT_TYPE_BORDER_COLORS = {
    [EventType.EVENT]: 'border-blue-400',
    [EventType.GOAL]: 'border-green-400',
    [EventType.UPDATE]: 'border-yellow-400',
};

export const USERS = [
    { id: 'u1', name: 'Sudheer', role: 'admin', avatarColor: 'bg-rose-400' },
    { id: 'u2', name: 'Aruna', role: 'user', avatarColor: 'bg-sky-400' },
    { id: 'u3', name: 'Amsu', role: 'user', avatarColor: 'bg-teal-400' },
    { id: 'u4', name: 'Sai', role: 'user', avatarColor: 'bg-amber-400' },
];

export const INITIAL_EVENTS = [
  {
    date: new Date(),
    title: 'Family Movie Night',
    type: EventType.EVENT,
    description: 'Watch The Incredibles together.',
    createdBy: 'u1'
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    title: 'Plan Weekend Trip',
    type: EventType.GOAL,
    description: 'Decide on a destination for the weekend getaway.',
    createdBy: 'u2'
  },
  {
      date: new Date(new Date().setDate(new Date().getDate() - 5)),
      title: 'School Parent-Teacher Meeting',
      type: EventType.UPDATE,
      description: 'Meeting at 3 PM in the main hall.',
      createdBy: 'u1'
  }
];