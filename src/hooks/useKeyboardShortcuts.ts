
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement).isContentEditable
            ) {
                return;
            }

            // Simple "G then X" style shortcuts
            // For now, we'll support direct shortcuts or common ones

            // Alt + P -> Projects
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                navigate('/overview');
            }

            // Alt + S -> Settings
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                navigate('/settings');
            }

            // Alt + A -> Alerts
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                navigate('/alerts');
            }

            // Alt + B -> Billing
            if (e.altKey && e.key === 'b') {
                e.preventDefault();
                navigate('/billing');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);
}
