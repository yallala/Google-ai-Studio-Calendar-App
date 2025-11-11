import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon } from './Icons.js';

const Header = ({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth, 
  onToday,
  currentUser,
  users,
  onUserChange,
  onOpenUserManagement
}) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSelectUser = (userId) => {
    onUserChange(userId);
    setIsUserMenuOpen(false);
  }

  return React.createElement('header', { className: "text-center mb-6" },
    React.createElement('div', { className: "absolute top-4 right-4 flex items-center gap-2" },
      React.createElement('div', { className: "relative" },
        React.createElement('button', { 
          onClick: () => setIsUserMenuOpen(!isUserMenuOpen),
          className: "flex items-center gap-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
        },
          React.createElement('div', { className: `w-8 h-8 rounded-full ${currentUser.avatarColor} flex items-center justify-center text-white font-bold` },
            currentUser.name.charAt(0)
          ),
          React.createElement('div', { className: "text-left hidden sm:block" },
            React.createElement('p', { className: "text-sm font-semibold" }, currentUser.name),
            React.createElement('p', { className: "text-xs text-gray-500 capitalize" }, currentUser.role)
          )
        ),
        isUserMenuOpen && React.createElement('div', { className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20" },
          React.createElement('p', { className: "px-4 py-2 text-xs text-gray-500" }, "Switch User"),
          users.map(user => 
             React.createElement('button', {
                key: user.id,
                onClick: () => handleSelectUser(user.id),
                className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
             },
                React.createElement('div', { className: `w-6 h-6 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold text-xs` },
                    user.name.charAt(0)
                ),
                React.createElement('span', null, user.name)
             )
          ))
        )
      ),
      currentUser.role === 'admin' && React.createElement('button', { 
          onClick: onOpenUserManagement,
          className: "p-2 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-600",
          title: "Manage Users"
        },
         React.createElement(UsersIcon, { className: "w-6 h-6" })
       )
    ),
    React.createElement('h1', { className: "text-4xl md:text-5xl font-bold text-indigo-600 mb-2" }, "Family Calendar Hub"),
    React.createElement('p', { className: "text-lg text-gray-500" }, "Your one place for family plans and goals."),
    React.createElement('div', { className: "flex items-center justify-center mt-6 space-x-2 md:space-x-4" },
      React.createElement('button', { 
        onClick: onPrevMonth,
        className: "p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors",
        'aria-label': "Previous month"
      },
        React.createElement(ChevronLeftIcon, { className: "w-6 h-6" })
      ),
      React.createElement('div', { className: "flex items-center space-x-2" },
        React.createElement('h2', { className: "text-2xl md:text-3xl font-semibold w-48 text-center" }, `${monthName} ${year}`),
        React.createElement('button', {
            onClick: onToday,
            className: "px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 transition-all"
        }, "Today")
      ),
      React.createElement('button', { 
        onClick: onNextMonth,
        className: "p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors",
        'aria-label': "Next month"
      },
        React.createElement(ChevronRightIcon, { className: "w-6 h-6" })
      )
    )
  );
};

export default Header;
