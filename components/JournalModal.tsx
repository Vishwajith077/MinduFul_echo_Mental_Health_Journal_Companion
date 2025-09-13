import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { XMarkIcon, TrashIcon } from './Icons';

interface JournalModalProps {
    entry: JournalEntry | null;
    onSave: (entry: { id?: string; title: string; content: string }) => void;
    onClose: () => void;
    onDelete: (id: string) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ entry, onSave, onClose, onDelete }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (entry) {
            setTitle(entry.title);
            setContent(entry.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [entry]);

    const handleSave = () => {
        if (title.trim()) {
            onSave({ id: entry?.id, title, content });
        }
    };
    
    const handleDelete = () => {
        if (entry && window.confirm('Are you sure you want to delete this journal entry?')) {
            onDelete(entry.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[var(--bg-secondary)] rounded-lg shadow-2xl p-6 w-full max-w-2xl h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{entry ? 'Edit Journal' : 'New Journal Entry'}</h3>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 flex flex-col gap-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Journal Title"
                        className="w-full p-2 text-lg font-semibold bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your thoughts here..."
                        className="w-full flex-1 p-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                    <div>
                        {entry && (
                            <button
                                onClick={handleDelete}
                                className="py-2 px-4 text-red-500 rounded-md font-semibold hover:bg-red-500/10 transition-colors flex items-center gap-2"
                            >
                                <TrashIcon className="w-5 h-5"/> Delete
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={!title.trim()}
                        className="py-2.5 px-6 bg-[var(--accent-primary)] text-white rounded-md font-semibold hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-opacity"
                    >
                        Save Entry
                    </button>
                </div>
            </div>
        </div>
    );
};
