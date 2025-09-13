import React, { useState, useRef, useEffect } from 'react';
import { useChatManager } from '../hooks/useChatManager';
import { Message } from './Message';
import { SendIcon, SettingsIcon, MenuIcon, SparklesIcon, FaceSmileIcon } from './Icons';
import { ThemePicker } from './ThemePicker';
import { MoodLoggerModal } from './MoodLoggerModal';
import { AGE_GROUPS } from '../constants';

interface ChatWindowProps {
    chatManager: ReturnType<typeof useChatManager>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatManager }) => {
    const {
        activeSession, sendMessage, isLoading, botName,
        theme, setTheme, customBg, setCustomBg,
        ageGroup, setAgeGroup, sidebarOpen, setSidebarOpen,
        logMood
    } = chatManager;
    
    const [input, setInput] = useState('');
    const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
    const [isMoodLoggerOpen, setIsMoodLoggerOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [activeSession?.messages]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            sendMessage(input.trim());
            setInput('');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const handleSuggestActivity = () => {
        const prompt = "I'm looking for something to do right now. Based on our recent conversation and how I might be feeling, could you suggest a personalized activity for me?";
        sendMessage(prompt);
    };

    const mainContentStyle: React.CSSProperties = customBg ? {
        backgroundImage: `url(${customBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    } : {};
    
    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)]">
            <header className="flex items-center justify-between p-4 border-b border-[var(--bg-secondary)] bg-[var(--bg-primary)]/80 backdrop-blur-sm z-10">
                <div className="flex items-center space-x-2">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">{botName}</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <select
                            value={ageGroup}
                            onChange={(e) => setAgeGroup(e.target.value as any)}
                            className="bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md pl-3 pr-8 py-1.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        >
                            {AGE_GROUPS.map(ag => <option key={ag.id} value={ag.id}>{ag.label}</option>)}
                        </select>
                    </div>
                     <button onClick={() => setIsMoodLoggerOpen(true)} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]" title="Log Mood">
                        <FaceSmileIcon className="w-6 h-6" />
                    </button>
                     <button onClick={handleSuggestActivity} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]" title="Suggest Activity">
                        <SparklesIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => setIsThemePickerOpen(true)} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]" title="Settings">
                        <SettingsIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto" style={mainContentStyle}>
                 <div className={`h-full ${customBg ? 'bg-black/40' : ''}`}>
                    <div className="px-6">
                        {activeSession && activeSession.messages.length > 0 ? (
                            activeSession.messages.map(msg => (
                                <Message key={msg.id} message={msg} botName={botName} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-secondary)]">
                                <SparklesIcon className="w-16 h-16 mb-4 text-[var(--accent-primary)]"/>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">Hello! I'm {botName}.</h3>
                                <p className="mt-2 max-w-sm">How are you feeling today? You can talk to me about anything, log your mood with the 😊 icon, or ask for a personalized activity suggestion with the ✨ icon.</p>
                                <p className="mt-4 text-xs max-w-sm text-[var(--text-secondary)]/80">This is a safe and private space for you. Feel free to share your thoughts, explore your feelings, or just chat about your day. I'm here to listen without judgment.</p>
                            </div>
                        )}
                        {isLoading && (
                            <div className="flex items-start gap-4 py-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white">
                                    <SparklesIcon className="w-5 h-5 animate-pulse" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="font-bold text-sm text-[var(--text-primary)] mb-1">{botName}</div>
                                    <div className="max-w-md px-4 py-3 rounded-2xl shadow-sm bg-[var(--model-bubble)] text-[var(--text-primary)] rounded-bl-none">
                                        <div className="flex items-center space-x-1">
                                            <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce delay-75"></span>
                                            <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce delay-200"></span>
                                            <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce delay-300"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                 </div>
            </main>

            <footer className="p-4 bg-[var(--bg-primary)]/80 backdrop-blur-sm border-t border-[var(--bg-secondary)]">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full pl-4 pr-12 py-3 text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--accent-primary)] text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </footer>

            {isThemePickerOpen && (
                <ThemePicker
                    currentTheme={theme}
                    setTheme={setTheme}
                    setCustomBg={setCustomBg}
                    onClose={() => setIsThemePickerOpen(false)}
                />
            )}
            {isMoodLoggerOpen && (
                <MoodLoggerModal
                    onClose={() => setIsMoodLoggerOpen(false)}
                    logMood={logMood}
                />
            )}
        </div>
    );
};