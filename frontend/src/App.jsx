import "./globals.css"

import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import {SudokuGame} from './components/SudokuGame';
import {Header} from './components/Header';


function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <SudokuGame />
                </main>
                <Toaster />
            </div>
        </ThemeProvider>
    );
}

export default App;