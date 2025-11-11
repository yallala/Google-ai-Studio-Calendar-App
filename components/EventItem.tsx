import React, { useState } from 'react';
import { CalendarEvent, User } from '../types';
import { EVENT_TYPE_COLORS, EVENT_TYPE_TEXT_COLORS } from '../constants';
import { TrashIcon } from './Icons';

interface EventItemProps {
  event: CalendarEvent;
  onDelete: (eventId: string) => void;
  currentUser: User;
  eventCreator?: User;
}

const EventItem: React.FC<EventItemProps> = ({ event, onDelete, currentUser, eventCreator }) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = EVENT_TYPE_COLORS[event.type];
  const textColor = EVENT_TYPE_TEXT_COLORS[event.type];

  const canDelete = currentUser.role === 'admin' || currentUser.id === event.createdBy;

  const creatorName = eventCreator ? eventCreator.name : 'Unknown';
  const descriptionText = event.description ? `\nDescription: ${event.description}` : '';

  return (
    <div 
        className={`p-1.5 rounded-md text-xs cursor-pointer ${color} ${textColor} font-medium relative flex items-center gap-1.5`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={`Created by: ${creatorName}${descriptionText}`}
    >
      {eventCreator && (
        <div 
          className={`w-4 h-4 rounded-full ${eventCreator.avatarColor} flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold`}
        >
            {creatorName.charAt(0)}
        </div>
      )}
      <p className="truncate flex-grow">{event.title}</p>
      {isHovered && canDelete && (
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
            }}
            className="absolute top-1/2 right-1 -translate-y-1/2 p-0.5 bg-white/50 rounded-full text-red-700 hover:bg-white/80"
            aria-label={`Delete event ${event.title}`}
          >
            <TrashIcon className="w-3 h-3"/>
          </button>
      )}
    </div>
  );
};

export default EventItem;
