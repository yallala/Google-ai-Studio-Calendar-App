import React, { useState } from 'react';
import { EVENT_TYPE_COLORS, EVENT_TYPE_TEXT_COLORS } from '../constants.js';
import { TrashIcon } from './Icons.js';

// Fix: Added explicit types for props to aid TypeScript's type inference.
const EventItem = ({ event, onDelete, currentUser, eventCreator }: {
  event: { id: string, title: string, description?: string, type: string, createdBy: string },
  onDelete: (eventId: string) => void,
  currentUser: { id: string, role: string },
  eventCreator: { name: string, avatarColor: string } | undefined
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = EVENT_TYPE_COLORS[event.type];
  const textColor = EVENT_TYPE_TEXT_COLORS[event.type];

  const canDelete = currentUser.role === 'admin' || currentUser.id === event.createdBy;

  const creatorName = eventCreator ? eventCreator.name : 'Unknown';
  const descriptionText = event.description ? `\nDescription: ${event.description}` : '';

  return React.createElement('div', { 
        className: `p-1.5 rounded-md text-xs cursor-pointer ${color} ${textColor} font-medium relative flex items-center gap-1.5`,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        title: `Created by: ${creatorName}${descriptionText}`
    },
      eventCreator && React.createElement('div', { 
          className: `w-4 h-4 rounded-full ${eventCreator.avatarColor} flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold`
        },
            creatorName.charAt(0)
      ),
      React.createElement('p', { className: "truncate flex-grow" }, event.title),
      isHovered && canDelete && React.createElement('button', { 
            onClick: (e) => {
                e.stopPropagation();
                onDelete(event.id);
            },
            className: "absolute top-1/2 right-1 -translate-y-1/2 p-0.5 bg-white/50 rounded-full text-red-700 hover:bg-white/80",
            'aria-label': `Delete event ${event.title}`
          },
            React.createElement(TrashIcon, { className: "w-3 h-3"})
      )
    );
};

export default EventItem;