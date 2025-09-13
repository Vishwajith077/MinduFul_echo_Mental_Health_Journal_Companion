
import { useState, useEffect, useCallback } from "react";
import { ChatSession, Message, Theme, AgeGroup, Mood, MoodEntry, Source, JournalEntry } from "../types";
import { createChat, getSystemInstruction, generateChatName } from "../services/geminiService";
import { Chat } from "@google/genai";
import { THEMES } from "../constants";

const initialSession: ChatSession = {
    id: `session-${Date.now()}`,
    name: "New Chat",
    messages: [],
    createdAt: Date.now(),
};

export const useChatManager = () => {
    const [botName, setBotName] = useState<string>(() => localStorage.getItem("botName") || "Mindful Echo");
    const [sessions, setSessions] = useState<ChatSession[]>(() => {
        const savedSessions = localStorage.getItem("chatSessions");
        return savedSessions ? JSON.parse(savedSessions) : [initialSession];
    });
    const [activeSessionId, setActiveSessionId] = useState<string>(() => {
        const savedId = localStorage.getItem("activeSessionId");
        return savedId || sessions[0].id;
    });
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "light");
    const [customBg, setCustomBg] = useState<string | null>(() => localStorage.getItem("customBg"));
    const [ageGroup, setAgeGroup] = useState<AgeGroup>(() => (localStorage.getItem("ageGroup") as AgeGroup) || "adult");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
        const savedMoods = localStorage.getItem("moodHistory");
        return savedMoods ? JSON.parse(savedMoods) : [];
    });
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
        const saved = localStorage.getItem("journalEntries");
        return saved ? JSON.parse(saved) : [];
    });
    const [isJournalModalOpen, setJournalModalOpen] = useState(false);
    const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);

    useEffect(() => {
        localStorage.setItem("chatSessions", JSON.stringify(sessions));
        localStorage.setItem("activeSessionId", activeSessionId);
    }, [sessions, activeSessionId]);

    useEffect(() => {
        localStorage.setItem("botName", botName);
    }, [botName]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        const root = document.documentElement;
        
        THEMES.forEach(t => root.classList.remove(t.name));
        
        const selectedTheme = THEMES.find(t => t.name === theme);
        if (selectedTheme) {
            root.classList.add(selectedTheme.name);
            Object.entries(selectedTheme.colors).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        }
    }, [theme]);
    
    useEffect(() => {
        if (customBg) {
            localStorage.setItem("customBg", customBg);
        } else {
            localStorage.removeItem("customBg");
        }
    }, [customBg]);

    useEffect(() => {
        localStorage.setItem("ageGroup", ageGroup);
    }, [ageGroup]);

    useEffect(() => {
        localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
    }, [moodHistory]);

    useEffect(() => {
        localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
    }, [journalEntries]);

    const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
    
    let chat: Chat | null = null;
    try {
        if(botName) {
            const systemInstruction = getSystemInstruction(ageGroup, botName);
            chat = createChat(systemInstruction, activeSession.messages);
        }
    } catch(e) {
        console.error(e);
    }

    const sendMessage = useCallback(async (text: string) => {
        if (!chat) return;

        const isFirstMessage = activeSession.messages.length === 0;

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: "user",
            text,
            timestamp: Date.now(),
        };

        setSessions(currentSessions => currentSessions.map(session =>
            session.id === activeSessionId
                ? { ...session, messages: [...session.messages, userMessage] }
                : session
        ));
        setIsLoading(true);

        if (isFirstMessage) {
            generateChatName(text).then(newName => {
                setSessions(currentSessions => currentSessions.map(session =>
                    session.id === activeSessionId
                        ? { ...session, name: newName }
                        : session
                ));
            });
        }

        try {
            const stream = await chat.sendMessageStream({ 
                message: text,
                config: {
                    tools: [{ googleSearch: {} }],
                }
            });
            
            let fullResponse = "";
            let messageId: string | null = null;

            for await (const chunk of stream) {
                const textPart = chunk.text;
                if (textPart) {
                    fullResponse += textPart;
                    if (!messageId) {
                         messageId = `msg-${Date.now()}-bot`;
                         const botMessage: Message = {
                            id: messageId,
                            role: "model",
                            text: fullResponse,
                            timestamp: Date.now(),
                            sources: [],
                        };
                        setSessions(currentSessions => currentSessions.map(session =>
                            session.id === activeSessionId
                                ? { ...session, messages: [...session.messages, botMessage] }
                                : session
                        ));
                    } else {
                        setSessions(currentSessions => currentSessions.map(session =>
                            session.id === activeSessionId
                                ? {
                                    ...session,
                                    messages: session.messages.map(msg =>
                                        msg.id === messageId ? { ...msg, text: fullResponse } : msg
                                    ),
                                }
                                : session
                        ));
                    }
                }
                
                const sources: Source[] | undefined = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks
                    ?.map((c: any) => ({ uri: c.web?.uri, title: c.web?.title }))
                    .filter((c: any): c is Source => c.uri && c.title);

                if (sources?.length && messageId) {
                    setSessions(currentSessions => currentSessions.map(session =>
                        session.id === activeSessionId
                            ? {
                                ...session,
                                messages: session.messages.map(msg =>
                                    msg.id === messageId ? { 
                                        ...msg, 
                                        sources: [
                                            ...(msg.sources || []), 
                                            ...sources.filter(s => !(msg.sources || []).some(es => es.uri === s.uri))
                                        ]
                                    } : msg
                                ),
                            }
                            : session
                    ));
                }
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: Message = {
                 id: `msg-${Date.now()}-error`,
                 role: "model",
                 text: "Sorry, I'm having trouble connecting right now. Please check your API Key and try again later.",
                 timestamp: Date.now(),
            };
            setSessions(currentSessions => currentSessions.map(session =>
                session.id === activeSessionId
                    ? { ...session, messages: [...session.messages, errorMessage] }
                    : session
            ));
        } finally {
            setIsLoading(false);
        }
    }, [chat, activeSessionId, activeSession]);

    const createNewChat = () => {
        const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            name: "New Chat",
            messages: [],
            createdAt: Date.now(),
        };
        setSessions([...sessions, newSession]);
        setActiveSessionId(newSession.id);
    };

    const switchSession = (id: string) => {
        setActiveSessionId(id);
    };
    
    const deleteSession = (id: string) => {
        const remainingSessions = sessions.filter(s => s.id !== id);
        if (remainingSessions.length === 0) {
            const newInitialSession = { ...initialSession, id: `session-${Date.now()}` };
            setSessions([newInitialSession]);
            setActiveSessionId(newInitialSession.id);
        } else {
            setSessions(remainingSessions);
            if (activeSessionId === id) {
                setActiveSessionId(remainingSessions[0].id);
            }
        }
    };

    const clearAllChats = () => {
        const newInitialSession = { ...initialSession, id: `session-${Date.now()}` };
        setSessions([newInitialSession]);
        setActiveSessionId(newInitialSession.id);
    };

    const logMood = (mood: Mood, note: string) => {
        const newMoodEntry: MoodEntry = {
            id: `mood-${Date.now()}`,
            mood,
            note,
            timestamp: Date.now(),
        };
        setMoodHistory([newMoodEntry, ...moodHistory]);
        
        // Start a conversation about the mood
        const moodMessage = `I just logged my mood as ${mood}.${note ? ` My thoughts: "${note}"` : ''}`;
        sendMessage(moodMessage);
    };

    const saveJournalEntry = (entry: { id?: string; title: string; content: string }) => {
        if (entry.id) { // Update existing
            setJournalEntries(journalEntries.map(j => 
                j.id === entry.id ? { ...j, title: entry.title, content: entry.content, timestamp: Date.now() } : j
            ));
        } else { // Create new
            const newEntry: JournalEntry = {
                id: `journal-${Date.now()}`,
                title: entry.title,
                content: entry.content,
                timestamp: Date.now(),
            };
            setJournalEntries([newEntry, ...journalEntries]);
        }
        setJournalModalOpen(false);
        setEditingJournal(null);
    };

    const deleteJournalEntry = (id: string) => {
        setJournalEntries(journalEntries.filter(j => j.id !== id));
        setJournalModalOpen(false);
        setEditingJournal(null);
    };

    const openJournalModal = (entry: JournalEntry | null) => {
        setEditingJournal(entry);
        setJournalModalOpen(true);
    };

    const closeJournalModal = () => {
        setJournalModalOpen(false);
        setEditingJournal(null);
    };

    return {
        botName, setBotName,
        sessions, activeSessionId, activeSession,
        theme, setTheme, customBg, setCustomBg,
        ageGroup, setAgeGroup,
        sidebarOpen, setSidebarOpen,
        isLoading,
        moodHistory, logMood,
        journalEntries, saveJournalEntry, deleteJournalEntry,
        isJournalModalOpen, editingJournal, openJournalModal, closeJournalModal,
        sendMessage, createNewChat, switchSession, deleteSession, clearAllChats
    };
};