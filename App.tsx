import React from 'react';
import { useChatManager } from './hooks/useChatManager';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { JournalModal } from './components/JournalModal';

const App: React.FC = () => {
    const chatManager = useChatManager();
    const { 
        botName, sessions, activeSessionId, createNewChat, switchSession, deleteSession, clearAllChats, 
        sidebarOpen, setSidebarOpen, moodHistory,
        journalEntries, saveJournalEntry, deleteJournalEntry,
        isJournalModalOpen, editingJournal, openJournalModal, closeJournalModal
    } = chatManager;

    if (!process.env.API_KEY) {
        return (
            <div className="flex items-center justify-center h-screen bg-red-50 text-red-800">
                <div className="text-center p-8 border-2 border-red-200 rounded-lg">
                    <h1 className="text-2xl font-bold mb-2">Configuration Error</h1>
                    <p>The Gemini API key is missing.</p>
                    <p>Please set the <code>API_KEY</code> environment variable to use the application.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <Sidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                createNewChat={createNewChat}
                switchSession={switchSession}
                deleteSession={deleteSession}
                clearAllChats={clearAllChats}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                botName={botName}
                moodHistory={moodHistory}
                journalEntries={journalEntries}
                openJournalModal={openJournalModal}
                deleteJournalEntry={deleteJournalEntry}
            />
            <main className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
                <ChatWindow chatManager={chatManager} />
            </main>

            {isJournalModalOpen && (
                <JournalModal
                    entry={editingJournal}
                    onSave={saveJournalEntry}
                    onClose={closeJournalModal}
                    onDelete={deleteJournalEntry}
                />
            )}
        </div>
    );
};

export default App;