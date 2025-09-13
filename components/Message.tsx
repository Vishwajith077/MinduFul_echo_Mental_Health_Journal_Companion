import React from 'react';
import { Message as MessageType } from '../types';
import { UserCircleIcon, SparklesIcon, LinkIcon } from './Icons';

interface MessageProps {
    message: MessageType;
    botName: string;
}

// Function to render text with clickable links
const renderTextWithLinks = (text: string) => {
    // Regex to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-primary)] hover:underline font-medium"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};


export const Message: React.FC<MessageProps> = ({ message, botName }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-start gap-4 py-4 ${isUser ? 'justify-end' : ''}`}>
             {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white">
                    <SparklesIcon className="w-5 h-5" />
                </div>
            )}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="font-bold text-sm text-[var(--text-primary)] mb-1">
                    {isUser ? 'You' : botName}
                </div>
                <div
                    className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
                        isUser
                            ? 'bg-[var(--user-bubble)] text-[var(--text-primary)] rounded-br-none'
                            : 'bg-[var(--model-bubble)] text-[var(--text-primary)] rounded-bl-none'
                    }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{renderTextWithLinks(message.text)}</p>
                </div>
                {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="mt-3 w-full max-w-md lg:max-w-2xl">
                        <div className="border-t border-[var(--model-bubble)] pt-2">
                             <h4 className="text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
                                <LinkIcon className="w-3 h-3" />
                                Sources
                            </h4>
                            <ul className="space-y-1">
                                {message.sources.map((source, index) => (
                                    <li key={index}>
                                        <a 
                                            href={source.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="flex items-start gap-2 text-xs text-[var(--accent-primary)] hover:underline"
                                            title={source.title}
                                        >
                                           <span className="font-mono bg-[var(--bg-secondary)] px-1 py-0.5 rounded-sm">{index + 1}</span>
                                           <span className="truncate flex-1">{source.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
             {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-[var(--text-secondary)]">
                    <UserCircleIcon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
};