import React, { useMemo } from 'react';
import { CalendarEvent, User } from '../types';
import { PlusIcon } from './Icons';
import EventItem from './EventItem';

interface CalendarProps {
  currentDate: Date;
  events: CalendarEvent[];
  onAddEventClick: (date: Date) => void;
  onDeleteEvent: (eventId: string) => void;
  currentUser: User;
  users: User[];
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, events, onAddEventClick, onDeleteEvent, currentUser, users }) => {
  const today = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  
  const usersById = useMemo(() => {
    return users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {} as Record<string, User>);
  }, [users]);

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = date.toDateString() === today.toDateString();
    
    const dayEvents = events.filter(event => event.date.toDateString() === date.toDateString());

    calendarDays.push(
      <div key={day} className="relative p-2 border-r border-b border-gray-200 min-h-[120px] md:min-h-[140px] flex flex-col group bg-white hover:bg-gray-50 transition-colors">
        <div className={`flex justify-between items-center ${isToday ? 'font-bold text-indigo-600' : ''}`}>
          <span className={`text-sm ${isToday ? 'w-7 h-7 flex items-center justify-center bg-indigo-600 text-white rounded-full' : ''}`}>
            {day}
          </span>
          <button 
            onClick={() => onAddEventClick(date)} 
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-indigo-500"
            aria-label={`Add event for ${date.toLocaleDateString()}`}
            >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-1 space-y-1 overflow-y-auto flex-grow">
          {dayEvents.map(event => (
            <EventItem 
                key={event.id} 
                event={event} 
                onDelete={onDeleteEvent} 
                currentUser={currentUser}
                eventCreator={usersById[event.createdBy]}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b border-gray-200">
        {daysOfWeek.map(day => (
          <div key={day} className="py-3 border-r border-gray-200 last:border-r-0">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays}
      </div>
    </div>
  );
};

export default Calendar;
