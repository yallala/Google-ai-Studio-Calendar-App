import React from 'react';
import { CloseIcon } from './Icons.js';

// Fix: Added explicit types for props to aid TypeScript's type inference.
const UserManagementModal = ({ isOpen, onClose, users, onRoleChange, currentUserId }: {
  isOpen: boolean;
  onClose: () => void;
  users: { id: string; name: string; role: string; avatarColor: string; }[];
  onRoleChange: (userId: string) => void;
  currentUserId: string;
}) => {
  if (!isOpen) return null;

  return React.createElement('div', {
      className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
      onClick: onClose
    },
    React.createElement('div', {
        className: "bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-lg relative animate-fade-in",
        onClick: e => e.stopPropagation()
      },
      React.createElement('button', {
          onClick: onClose,
          className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600",
          'aria-label': "Close modal"
        },
        React.createElement(CloseIcon, null)
      ),
      React.createElement('h2', { className: "text-2xl font-bold mb-4 text-gray-800" }, "User Management"),
      React.createElement('div', { className: "space-y-3" },
        users.map(user => 
          React.createElement('div', { key: user.id, className: "flex items-center justify-between bg-gray-50 p-3 rounded-lg" },
            React.createElement('div', { className: "flex items-center gap-3" },
              React.createElement('div', { className: `w-8 h-8 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold` },
                user.name.charAt(0)
              ),
              React.createElement('div', null,
                React.createElement('p', { className: "font-semibold text-gray-800" }, user.name),
                React.createElement('p', { className: `text-sm capitalize font-medium ${user.role === 'admin' ? 'text-indigo-600' : 'text-gray-500'}` }, user.role)
              )
            ),
            React.createElement('button', {
                onClick: () => onRoleChange(user.id),
                disabled: user.id === currentUserId,
                className: `px-3 py-1.5 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  bg-white border border-gray-300 text-gray-700 hover:bg-gray-100
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`
              },
              user.role === 'admin' ? 'Make User' : 'Make Admin'
            )
          )
        )
      ),
      React.createElement('p', { className: "text-xs text-gray-400 mt-4 text-center" }, "You cannot change your own role."),
      React.createElement('style', null, `
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `)
    )
  );
};

export default UserManagementModal;