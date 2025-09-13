import React, { useState } from "react";
import { ChatSession, MoodEntry, JournalEntry } from "../types";
import { PlusIcon, ChatBubbleIcon, TrashIcon, FaceSmileIcon, BookOpenIcon } from "./Icons";
import { MOOD_OPTIONS } from "../constants";

const MoodHistoryView: React.FC<{ moodHistory: MoodEntry[] }> = ({ moodHistory }) => {
  if (moodHistory.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-[var(--text-secondary)]">
        You haven't logged any moods yet.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <ul className="space-y-2">
        {moodHistory.map(entry => {
          const moodOption = MOOD_OPTIONS.find(m => m.id === entry.mood);
          return (
            <li key={entry.id} className="p-3 bg-[var(--bg-primary)] rounded-lg shadow-sm">
              <div className="flex items-start space-x-3">
                <span className={`text-2xl ${moodOption?.color}`}>{moodOption?.emoji || '😐'}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-md capitalize text-[var(--text-primary)]">{entry.mood}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{new Date(entry.timestamp).toLocaleDateString()}</p>
                  </div>
                  {entry.note && <p className="text-sm text-[var(--text-secondary)] mt-1 italic">"{entry.note}"</p>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const JournalHistoryView: React.FC<{ 
    journalEntries: JournalEntry[];
    onNew: () => void;
    onSelect: (entry: JournalEntry) => void;
    onDelete: (id: string) => void;
}> = ({ journalEntries, onNew, onSelect, onDelete }) => {
    if (journalEntries.length === 0) {
        return (
            <div className="p-4 text-center text-sm text-[var(--text-secondary)] flex flex-col items-center">
                 <p className="mb-4">You haven't written any journal entries yet.</p>
                 <button
                    onClick={onNew}
                    className="flex items-center w-full justify-center px-3 py-2 text-sm font-medium rounded-md bg-[var(--accent-primary)] text-white hover:opacity-90"
                >
                    <PlusIcon className="w-5 h-5 mr-3" />
                    New Journal Entry
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="p-2">
                 <button
                    onClick={onNew}
                    className="flex items-center w-full justify-center px-3 py-2 text-sm font-medium rounded-md bg-[var(--accent-primary)] text-white hover:opacity-90"
                >
                    <PlusIcon className="w-5 h-5 mr-3" />
                    New Journal Entry
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-2">
                    {journalEntries.map(entry => (
                        <li key={entry.id} className="group p-3 bg-[var(--bg-primary)] rounded-lg shadow-sm cursor-pointer hover:bg-[var(--model-bubble)]" onClick={() => onSelect(entry)}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-bold text-md text-[var(--text-primary)] truncate">{entry.title}</p>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">{new Date(entry.timestamp).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Delete this journal entry?')) {
                                            onDelete(entry.id);
                                        }
                                    }}
                                    className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-500 transition-opacity flex-shrink-0 ml-2"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  createNewChat: () => void;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  clearAllChats: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  botName: string;
  moodHistory: MoodEntry[];
  journalEntries: JournalEntry[];
  openJournalModal: (entry: JournalEntry | null) => void;
  deleteJournalEntry: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  createNewChat,
  switchSession,
  deleteSession,
  clearAllChats,
  isOpen,
  setIsOpen,
  botName,
  moodHistory,
  journalEntries,
  openJournalModal,
  deleteJournalEntry
}) => {
  const [view, setView] = useState<'chats' | 'moods' | 'journal'>('chats');

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-[var(--bg-secondary)] text-[var(--text-secondary)] transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 border-b border-[var(--bg-primary)]">
          <h1 className="text-xl font-bold text-center text-[var(--text-primary)]">{botName}</h1>
        </div>

        <div className="p-2 border-b border-[var(--bg-primary)]">
          <div className="flex bg-[var(--bg-primary)] rounded-lg p-1">
            <button
              onClick={() => setView('chats')}
              className={`flex-1 text-sm py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors ${view === 'chats' ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--model-bubble)]'}`}
            >
              <ChatBubbleIcon className="w-4 h-4" /> Chats
            </button>
            <button
              onClick={() => setView('moods')}
              className={`flex-1 text-sm py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors ${view === 'moods' ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--model-bubble)]'}`}
            >
              <FaceSmileIcon className="w-4 h-4" /> Moods
            </button>
             <button
              onClick={() => setView('journal')}
              className={`flex-1 text-sm py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors ${view === 'journal' ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--model-bubble)]'}`}
            >
              <BookOpenIcon className="w-4 h-4" /> Journal
            </button>
          </div>
        </div>
        
        {view === 'chats' && (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                <button
                  onClick={createNewChat}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md bg-[var(--accent-primary)] text-white hover:opacity-90"
                >
                  <PlusIcon className="w-5 h-5 mr-3" />
                  New Chat
                </button>
              </div>
              <nav className="flex-1 px-2 space-y-1">
                {sessions.map((session) => (
                  <div key={session.id} className="group relative">
                    <button
                      onClick={() => switchSession(session.id)}
                      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-left ${
                        activeSessionId === session.id
                          ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                          : "hover:bg-[var(--bg-primary)]"
                      }`}
                    >
                      <ChatBubbleIcon className="w-5 h-5 mr-3" />
                      <span className="flex-1 truncate">{session.name === "New Chat" ? `Chat - ${new Date(session.createdAt).toLocaleDateString()}` : session.name}</span>
                    </button>
                    <button 
                      onClick={() => deleteSession(session.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-500 transition-opacity"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-[var(--bg-primary)]">
              <button
                onClick={clearAllChats}
                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-500/10"
              >
                <TrashIcon className="w-5 h-5 mr-3" />
                Clear All Chats
              </button>
            </div>
          </>
        )}
        
        {view === 'moods' && <MoodHistoryView moodHistory={moodHistory} />}
        
        {view === 'journal' && <JournalHistoryView 
            journalEntries={journalEntries}
            onNew={() => openJournalModal(null)}
            onSelect={(entry) => openJournalModal(entry)}
            onDelete={deleteJournalEntry}
        />}


      </div>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-20 bg-black/50 md:hidden"></div>}
    </>
  );
};