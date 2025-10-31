import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export const Header=() =>{
    const { theme, setTheme } = useTheme();

    return (
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-6 h-6 text-primary-foreground"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                            <rect x="9" y="3" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                            <rect x="15" y="3" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                            <rect x="3" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                            <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                            <rect x="15" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                            <rect x="3" y="15" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                            <rect x="9" y="15" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                            <rect x="15" y="15" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sudoku</h1>
                        <p className="text-sm text-muted-foreground">Challenge your mind</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="rounded-full"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    );
}
