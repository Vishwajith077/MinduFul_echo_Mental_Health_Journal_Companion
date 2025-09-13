
import React, { useRef } from 'react';
import { Theme } from '../types';
import { THEMES } from '../constants';
import { XMarkIcon } from './Icons';

interface ThemePickerProps {
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
    setCustomBg: (bg: string | null) => void;
    onClose: () => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ currentTheme, setTheme, setCustomBg, onClose }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCustomBg(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
            <div className="bg-[var(--bg-secondary)] rounded-lg shadow-2xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Customize Theme</h3>
                
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-[var(--text-primary)] mb-3">Color Themes</h4>
                    <div className="grid grid-cols-3 gap-4">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => setTheme(theme.name)}
                                className={`p-2 rounded-lg border-2 transition-all ${
                                    currentTheme === theme.name ? 'border-[var(--accent-primary)]' : 'border-transparent hover:border-gray-400'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors['--bg-primary'], border: `2px solid ${theme.colors['--accent-primary']}` }}></div>
                                    <span className="capitalize text-[var(--text-secondary)] text-sm">{theme.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-md font-semibold text-[var(--text-primary)] mb-3">Chat Background</h4>
                     <div className="flex space-x-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 py-2 px-4 bg-[var(--accent-primary)] text-white rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Upload Image
                        </button>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleBgUpload} className="hidden" />
                        <button
                            onClick={() => setCustomBg(null)}
                            className="flex-1 py-2 px-4 bg-[var(--model-bubble)] text-[var(--text-primary)] rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Remove Background
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
