import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CalendarEvent, EventType, User } from './types';
import Calendar from './components/Calendar';
import Header from './components/Header';
import AddEventModal from './components/AddEventModal';
import { EVENT_TYPE_COLORS, USERS as SEED_USERS, INITIAL_EVENTS as SEED_EVENTS } from './constants';
import UserManagementModal from './components/UserManagementModal';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('familyCalendarUsers');
    return savedUsers ? JSON.parse(savedUsers) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedCurrentUser = localStorage.getItem('familyCalendarCurrentUser');
    return savedCurrentUser ? JSON.parse(savedCurrentUser) : users[0];
  });
  
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const savedEvents = localStorage.getItem('familyCalendarEvents');
    if (savedEvents) {
      // Dates need to be converted back from string to Date objects
      return JSON.parse(savedEvents).map((event: CalendarEvent) => ({
        ...event,
        date: new Date(event.date),
      }));
    }
    return SEED_EVENTS.map(e => ({...e, id: crypto.randomUUID()}));
  });

  // Save to localStorage whenever users, currentUser, or events change
  useEffect(() => {
    localStorage.setItem('familyCalendarUsers', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('familyCalendarCurrentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('familyCalendarEvents', JSON.stringify(events));
  }, [events]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventType | 'ALL'>('ALL');

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);
  
  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleOpenModal = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
  }, []);

  const handleAddEvent = useCallback((event: Omit<CalendarEvent, 'id' | 'date' | 'createdBy'>) => {
    if (selectedDate) {
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        ...event,
        date: selectedDate,
        createdBy: currentUser.id,
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
      handleCloseModal();
    }
  }, [selectedDate, currentUser, handleCloseModal]);
  
  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  }, []);

  const handleFilterChange = useCallback((filter: EventType | 'ALL') => {
    setActiveFilter(filter);
  }, []);
  
  const handleUserChange = useCallback((userId: string) => {
    const newCurrentUser = users.find(u => u.id === userId);
    if (newCurrentUser) {
      setCurrentUser(newCurrentUser);
    }
  }, [users]);

  const handleRoleChange = useCallback((userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
          : user
      )
    );
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'ALL') {
      return events;
    }
    return events.filter(event => event.type === activeFilter);
  }, [events, activeFilter]);

  const legendItems = useMemo(() => Object.values(EventType).map(type => ({
      type,
      color: EVENT_TYPE_COLORS[type],
    })), []);

  const filterOptions: { label: string; value: EventType | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Events', value: EventType.EVENT },
    { label: 'Goals', value: EventType.GOAL },
    { label: 'Updates', value: EventType.UPDATE },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen text-gray-800">
      <div className="container mx-auto p-4 md:p-8">
        <Header 
          currentDate={currentDate} 
          onPrevMonth={handlePrevMonth} 
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          currentUser={currentUser}
          users={users}
          onUserChange={handleUserChange}
          onOpenUserManagement={() => setIsUserModalOpen(true)}
        />
        
        <div className="flex justify-center my-4 space-x-4">
          {legendItems.map(item => (
            <div key={item.type} className="flex items-center space-x-2 text-sm">
              <span className={`w-4 h-4 rounded-full ${item.color}`}></span>
              <span className="capitalize">{item.type.toLowerCase()}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-1 bg-gray-200/60 p-1 rounded-full shadow-inner">
                {filterOptions.map(option => (
                <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out ${
                    activeFilter === option.value
                        ? 'bg-white text-indigo-600 shadow-md'
                        : 'text-gray-600 hover:bg-white/70'
                    }`}
                    aria-pressed={activeFilter === option.value}
                >
                    {option.label}
                </button>
                ))}
            </div>
        </div>

        <Calendar 
          currentDate={currentDate} 
          events={filteredEvents} 
          onAddEventClick={handleOpenModal}
          onDeleteEvent={handleDeleteEvent}
          currentUser={currentUser}
          users={users}
        />
        
        {isModalOpen && selectedDate && (
          <AddEventModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            onAddEvent={handleAddEvent}
            selectedDate={selectedDate}
          />
        )}
        
        {isUserModalOpen && (
          <UserManagementModal
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            users={users}
            onRoleChange={handleRoleChange}
            currentUserId={currentUser.id}
          />
        )}
      </div>
      <footer className="text-center text-sm text-gray-500 pb-4">
        Family Calendar Hub - Stay Connected & Organized
      </footer>
    </div>
  );
};

export default App;