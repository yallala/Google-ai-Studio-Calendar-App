import React, { useState } from 'react';
import { User } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon } from './Icons';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  currentUser: User;
  users: User[];
  onUserChange: (userId: string) => void;
  onOpenUserManagement: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
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

  const handleSelectUser = (userId: string) => {
    onUserChange(userId);
    setIsUserMenuOpen(false);
  }

  return (
    <header className="text-center mb-6">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
          >
            <div className={`w-8 h-8 rounded-full ${currentUser.avatarColor} flex items-center justify-center text-white font-bold`}>
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
            </div>
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <p className="px-4 py-2 text-xs text-gray-500">Switch User</p>
              {users.map(user => (
                 <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                 >
                    <div className={`w-6 h-6 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                        {user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                 </button>
              ))}
            </div>
          )}
        </div>
        {currentUser.role === 'admin' && (
           <button 
              onClick={onOpenUserManagement}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-600"
              title="Manage Users"
            >
             <UsersIcon className="w-6 h-6" />
           </button>
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">Family Calendar Hub</h1>
      <p className="text-lg text-gray-500">Your one place for family plans and goals.</p>
      <div className="flex items-center justify-center mt-6 space-x-2 md:space-x-4">
        <button 
          onClick={onPrevMonth}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
            <h2 className="text-2xl md:text-3xl font-semibold w-48 text-center">{monthName} {year}</h2>
            <button
                onClick={onToday}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 transition-all"
            >
            Today
            </button>
        </div>
        <button 
          onClick={onNextMonth}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;