import { useState } from 'react';
import { Button } from './/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import { Sparkles, Lightbulb, RotateCcw, Play, CheckCircle2, Trophy } from 'lucide-react';
import {SudokuBoard} from './SudokuBoard';
import {DifficultySelector} from './DifficultySelector';
import { useGeneratePuzzle, useSolvePuzzle, useValidateBoard } from '../use-queries';
import { toast } from 'sonner';

export const SudokuGame=()=> {
    const [board, setBoard] = useState(
        Array(9)
            .fill(null)
            .map(() => Array(9).fill(BigInt(0)))
    );
    const [initialBoard, setInitialBoard] = useState(
        Array(9)
            .fill(null)
            .map(() => Array(9).fill(BigInt(0)))
    );
    const [difficulty, setDifficulty] = useState('medium');
    const [activeTab, setActiveTab] = useState('play');
    const [showVictory, setShowVictory] = useState(false);

    const generatePuzzle = useGeneratePuzzle();
    const solvePuzzle = useSolvePuzzle();
    const validateBoard = useValidateBoard();

    const handleGeneratePuzzle = async () => {
        try {
            const puzzle = await generatePuzzle.mutateAsync(difficulty);
            setBoard(puzzle);
            setInitialBoard(puzzle);
            setShowVictory(false);
            toast.success('New puzzle generated!', {
                description: `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
            });
        } catch (error) {
            toast.error('Failed to generate puzzle', {
                description: 'Please try again',
            });
        }
    };

    const handleSolvePuzzle = async () => {
        try {
            const solution = await solvePuzzle.mutateAsync(board);
            if (solution) {
                setBoard(solution);
                toast.success('Puzzle solved!', {
                    description: 'Here is the solution',
                });
            } else {
                toast.error('No solution found', {
                    description: 'This puzzle cannot be solved',
                });
            }
        } catch (error) {
            toast.error('Failed to solve puzzle', {
                description: 'Please try again',
            });
        }
    };

    const handleResetBoard = () => {
        setBoard(initialBoard);
        setShowVictory(false);
        toast.info('Board reset', {
            description: 'Returned to initial state',
        });
    };

    const handleCheckSolution = async () => {
        // Check if board is fully filled
        const isFilled = board.every((row) => row.every((cell) => cell !== BigInt(0)));

        if (!isFilled) {
            toast.error('Puzzle incomplete', {
                description: 'Please fill all cells before checking',
            });
            return;
        }

        try {
            const isValid = await validateBoard.mutateAsync(board);
            if (isValid) {
                setShowVictory(true);
            } else {
                toast.error('Not quite right', {
                    description: 'Some numbers are incorrect. Keep trying!',
                });
            }
        } catch (error) {
            toast.error('Validation failed', {
                description: 'Please try again',
            });
        }
    };

    const handleValidateCustomBoard = async () => {
        try {
            const isValid = await validateBoard.mutateAsync(board);
            if (isValid) {
                setInitialBoard(board);
                toast.success('Valid Sudoku board!', {
                    description: 'You can now solve this puzzle',
                });
            } else {
                toast.error('Invalid Sudoku board', {
                    description: 'Please check the numbers and try again',
                });
            }
        } catch (error) {
            toast.error('Validation failed', {
                description: 'Please try again',
            });
        }
    };

    const handleClearBoard = () => {
        const emptyBoard = Array(9)
            .fill(null)
            .map(() => Array(9).fill(BigInt(0)));
        setBoard(emptyBoard);
        setInitialBoard(emptyBoard);
        setShowVictory(false);
        toast.info('Board cleared', {
            description: 'Ready for custom input',
        });
    };

    const handlePlayAgain = () => {
        setShowVictory(false);
        handleGeneratePuzzle();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-2 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Sudoku Puzzle
                    </CardTitle>
                    <CardDescription className="text-base">
                        Fill the 9×9 grid so that each row, column, and 3×3 box contains the digits 1-9
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="play" className="gap-2">
                                <Play className="w-4 h-4" />
                                Play Generated
                            </TabsTrigger>
                            <TabsTrigger value="custom" className="gap-2">
                                <Sparkles className="w-4 h-4" />
                                Custom Puzzle
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="play" className="space-y-6 mt-6">
                            <div className="space-y-4">
                                <DifficultySelector value={difficulty} onChange={setDifficulty} />
                                <Button
                                    onClick={handleGeneratePuzzle}
                                    disabled={generatePuzzle.isPending}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {generatePuzzle.isPending ? 'Generating...' : 'Generate New Puzzle'}
                                </Button>
                            </div>

                            <SudokuBoard board={board} initialBoard={initialBoard} onBoardChange={setBoard} />

                            <div className="grid grid-cols-3 gap-3">
                                <Button
                                    onClick={handleResetBoard}
                                    variant="outline"
                                    disabled={solvePuzzle.isPending || validateBoard.isPending}
                                    className="gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reset
                                </Button>
                                <Button
                                    onClick={handleCheckSolution}
                                    disabled={validateBoard.isPending || solvePuzzle.isPending}
                                    variant="default"
                                    className="gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {validateBoard.isPending ? 'Checking...' : 'Check'}
                                </Button>
                                <Button
                                    onClick={handleSolvePuzzle}
                                    disabled={solvePuzzle.isPending || validateBoard.isPending}
                                    variant="secondary"
                                    className="gap-2"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    {solvePuzzle.isPending ? 'Solving...' : 'Solution'}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="custom" className="space-y-6 mt-6">
                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <p className="text-sm text-muted-foreground">
                                    Click on any cell to enter numbers 1-9. Create your own puzzle or input one you'd
                                    like to solve.
                                </p>
                            </div>

                            <SudokuBoard
                                board={board}
                                initialBoard={Array(9)
                                    .fill(null)
                                    .map(() => Array(9).fill(BigInt(0)))}
                                onBoardChange={setBoard}
                                customMode
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Button onClick={handleClearBoard} variant="outline" className="gap-2">
                                    <RotateCcw className="w-4 h-4" />
                                    Clear Board
                                </Button>
                                <Button
                                    onClick={handleValidateCustomBoard}
                                    disabled={validateBoard.isPending}
                                    variant="secondary"
                                    className="gap-2"
                                >
                                    {validateBoard.isPending ? 'Validating...' : 'Validate & Solve'}
                                </Button>
                            </div>

                            {initialBoard.some((row) => row.some((cell) => cell !== BigInt(0))) && (
                                <Button
                                    onClick={handleSolvePuzzle}
                                    disabled={solvePuzzle.isPending}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    {solvePuzzle.isPending ? 'Solving...' : 'Show Solution'}
                                </Button>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card className="border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">How to Play</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">1</span>
                        </div>
                        <p>
                            <strong className="text-foreground">Generate a puzzle:</strong> Choose your difficulty
                            level and click "Generate New Puzzle" to start playing.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">2</span>
                        </div>
                        <p>
                            <strong className="text-foreground">Fill the grid:</strong> Click on any empty cell and
                            type a number from 1-9. Each row, column, and 3×3 box must contain all digits 1-9.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">3</span>
                        </div>
                        <p>
                            <strong className="text-foreground">Check your solution:</strong> When you've filled all
                            cells, click "Check" to see if you've solved it correctly!
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">4</span>
                        </div>
                        <p>
                            <strong className="text-foreground">Need help?</strong> Use "Solution" to see the answer,
                            or "Reset" to return to the initial puzzle state.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={showVictory} onOpenChange={setShowVictory}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader className="space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-bounce">
                            <Trophy className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <AlertDialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            You Win! 🎉
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base">
                            Congratulations! You've successfully completed the Sudoku puzzle. Your logic and
                            problem-solving skills are impressive!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setShowVictory(false)} className="w-full sm:w-auto">
                            Close
                        </Button>
                        <Button onClick={handlePlayAgain} className="w-full sm:w-auto gap-2">
                            <Sparkles className="w-4 h-4" />
                            Play Again
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
