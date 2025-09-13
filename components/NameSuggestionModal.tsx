
import React from 'react';
import { BOT_NAME_SUGGESTIONS } from '../constants';

interface NameSuggestionModalProps {
    onSelectName: (name: string) => void;
}

export const NameSuggestionModal: React.FC<NameSuggestionModalProps> = ({ onSelectName }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center transform transition-all animate-fade-in-up">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome!</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    I'm your personal AI mental health companion. To get started, please give me a name.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {BOT_NAME_SUGGESTIONS.map((name) => (
                        <button
                            key={name}
                            onClick={() => onSelectName(name)}
                            className="px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:-translate-y-1 transition-all duration-200"
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
