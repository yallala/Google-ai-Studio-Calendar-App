import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { EventType } from './types.js';
import Calendar from './components/Calendar.js';
import Header from './components/Header.js';
import AddEventModal from './components/AddEventModal.js';
import { EVENT_TYPE_COLORS, USERS as SEED_USERS, INITIAL_EVENTS as SEED_EVENTS } from './constants.js';
import UserManagementModal from './components/UserManagementModal.js';

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('familyCalendarUsers');
    return savedUsers ? JSON.parse(savedUsers) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedCurrentUser = localStorage.getItem('familyCalendarCurrentUser');
    if (savedCurrentUser) {
        return JSON.parse(savedCurrentUser);
    }
    const userList = localStorage.getItem('familyCalendarUsers');
    return userList ? JSON.parse(userList)[0] : SEED_USERS[0];
  });
  
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('familyCalendarEvents');
    if (savedEvents) {
      return JSON.parse(savedEvents).map((event) => ({
        ...event,
        date: new Date(event.date),
      }));
    }
    return SEED_EVENTS.map(e => ({...e, id: crypto.randomUUID()}));
  });

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

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

  const handleOpenModal = useCallback((date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
  }, []);

  const handleAddEvent = useCallback((event) => {
    if (selectedDate) {
      const newEvent = {
        id: crypto.randomUUID(),
        ...event,
        date: selectedDate,
        createdBy: currentUser.id,
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
      handleCloseModal();
    }
  }, [selectedDate, currentUser, handleCloseModal]);
  
  const handleDeleteEvent = useCallback((eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);
  
  const handleUserChange = useCallback((userId) => {
    const newCurrentUser = users.find(u => u.id === userId);
    if (newCurrentUser) {
      setCurrentUser(newCurrentUser);
    }
  }, [users]);

  const handleRoleChange = useCallback((userId) => {
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

  const filterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Events', value: EventType.EVENT },
    { label: 'Goals', value: EventType.GOAL },
    { label: 'Updates', value: EventType.UPDATE },
  ];

  return React.createElement('div', { className: "bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen text-gray-800" },
    React.createElement('div', { className: "container mx-auto p-4 md:p-8" },
      React.createElement(Header, { 
        currentDate: currentDate, 
        onPrevMonth: handlePrevMonth, 
        onNextMonth: handleNextMonth,
        onToday: handleToday,
        currentUser: currentUser,
        users: users,
        onUserChange: handleUserChange,
        onOpenUserManagement: () => setIsUserModalOpen(true)
      }),
      React.createElement('div', { className: "flex justify-center my-4 space-x-4" },
        legendItems.map(item => 
          React.createElement('div', { key: item.type, className: "flex items-center space-x-2 text-sm" },
            React.createElement('span', { className: `w-4 h-4 rounded-full ${item.color}` }),
            React.createElement('span', { className: "capitalize" }, item.type.toLowerCase())
          )
        )
      ),
      React.createElement('div', { className: "flex justify-center mb-4" },
        React.createElement('div', { className: "flex items-center space-x-1 bg-gray-200/60 p-1 rounded-full shadow-inner" },
          filterOptions.map(option => 
            React.createElement('button', {
              key: option.value,
              onClick: () => handleFilterChange(option.value),
              className: `px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out ${
                activeFilter === option.value
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-gray-600 hover:bg-white/70'
              }`,
              'aria-pressed': activeFilter === option.value
            }, option.label)
          )
        )
      ),
      React.createElement(Calendar, { 
        currentDate: currentDate, 
        events: filteredEvents, 
        onAddEventClick: handleOpenModal,
        onDeleteEvent: handleDeleteEvent,
        currentUser: currentUser,
        users: users
      }),
      isModalOpen && selectedDate && React.createElement(AddEventModal, { 
        isOpen: isModalOpen, 
        onClose: handleCloseModal, 
        onAddEvent: handleAddEvent,
        selectedDate: selectedDate
      }),
      isUserModalOpen && React.createElement(UserManagementModal, {
        isOpen: isUserModalOpen,
        onClose: () => setIsUserModalOpen(false),
        users: users,
        onRoleChange: handleRoleChange,
        currentUserId: currentUser.id
      })
    ),
    React.createElement('footer', { className: "text-center text-sm text-gray-500 pb-4" },
      "Family Calendar Hub - Stay Connected & Organized"
    )
  );
};

export default App;
