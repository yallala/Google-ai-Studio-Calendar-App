import React, { useState, useCallback, FormEvent } from 'react';
import { CalendarEvent, EventType } from '../types';
import { EVENT_TYPE_COLORS, EVENT_TYPE_TEXT_COLORS, EVENT_TYPE_BORDER_COLORS } from '../constants';
import { CloseIcon, SparklesIcon } from './Icons';
import { generateEventIdea } from '../services/geminiService';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Update the event type to omit 'createdBy' as it's handled by the parent component.
  onAddEvent: (event: Omit<CalendarEvent, 'id' | 'date' | 'createdBy'>) => void;
  selectedDate: Date;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAddEvent, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>(EventType.EVENT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddEvent({ title, description, type });
      setTitle('');
      setDescription('');
      setType(EventType.EVENT);
    }
  };

  const handleSuggestIdea = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idea = await generateEventIdea();
      const parsedIdea = JSON.parse(idea);
      setTitle(parsedIdea.title || '');
      setDescription(parsedIdea.description || '');
    } catch (err) {
      setError('Could not generate an idea. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-md relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">Add New Item</h2>
        <p className="text-gray-500 mb-6">For {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              id="title" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex space-x-2">
              {Object.values(EventType).map(eventType => (
                <button
                  key={eventType}
                  type="button"
                  onClick={() => setType(eventType)}
                  className={`flex-1 py-2 px-3 text-sm rounded-md border-2 transition-all ${
                    type === eventType
                      ? `${EVENT_TYPE_BORDER_COLORS[eventType]} ${EVENT_TYPE_COLORS[eventType]} ${EVENT_TYPE_TEXT_COLORS[eventType]} font-semibold`
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {eventType.charAt(0) + eventType.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              onClick={handleSuggestIdea}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isLoading ? 'Generating...' : 'Suggest Idea with AI'}
            </button>
            <button 
              type="submit" 
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Item
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AddEventModal;