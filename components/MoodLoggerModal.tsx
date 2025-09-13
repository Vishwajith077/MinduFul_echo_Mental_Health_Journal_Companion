import React, { useState } from 'react';
import { Mood } from '../types';
import { MOOD_OPTIONS } from '../constants';
import { XMarkIcon } from './Icons';

interface MoodLoggerModalProps {
    logMood: (mood: Mood, note: string) => void;
    onClose: () => void;
}

export const MoodLoggerModal: React.FC<MoodLoggerModalProps> = ({ logMood, onClose }) => {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        if (selectedMood) {
            logMood(selectedMood, note);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
            <div className="bg-[var(--bg-secondary)] rounded-lg shadow-2xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">How are you feeling?</h3>
                
                <div className="mb-4">
                    <div className="flex justify-around items-center p-2 bg-[var(--bg-primary)] rounded-lg">
                        {MOOD_OPTIONS.map((mood) => (
                            <button
                                key={mood.id}
                                onClick={() => setSelectedMood(mood.id)}
                                className={`flex flex-col items-center p-2 rounded-lg w-16 transition-all ${
                                    selectedMood === mood.id ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--model-bubble)]'
                                }`}
                            >
                                <span className="text-3xl">{mood.emoji}</span>
                                <span className="text-xs mt-1 capitalize">{mood.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="mood-note" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Add a note (optional)</label>
                    <textarea
                        id="mood-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={3}
                        className="w-full p-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />
                </div>
                
                <button
                    onClick={handleSubmit}
                    disabled={!selectedMood}
                    className="w-full py-2.5 px-4 bg-[var(--accent-primary)] text-white rounded-md font-semibold hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-opacity"
                >
                    Log Mood
                </button>
            </div>
        </div>
    );
};
