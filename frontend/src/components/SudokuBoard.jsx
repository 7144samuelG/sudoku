import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';


export const SudokuBoard=({ board, initialBoard, onBoardChange, customMode = false }) =>{
    const [selectedCell, setSelectedCell] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedCell) return;

            const { row, col } = selectedCell;

            // Handle number input
            if (e.key >= '1' && e.key <= '9') {
                if (customMode || initialBoard[row][col] === BigInt(0)) {
                    const newBoard = board.map((r, i) =>
                        i === row ? r.map((c, j) => (j === col ? BigInt(e.key) : c)) : r
                    );
                    onBoardChange(newBoard);
                }
            }

            // Handle delete/backspace
            if (e.key === 'Backspace' || e.key === 'Delete') {
                if (customMode || initialBoard[row][col] === BigInt(0)) {
                    const newBoard = board.map((r, i) =>
                        i === row ? r.map((c, j) => (j === col ? BigInt(0) : c)) : r
                    );
                    onBoardChange(newBoard);
                }
            }

            // Handle arrow keys
            if (e.key === 'ArrowUp' && row > 0) {
                setSelectedCell({ row: row - 1, col });
                e.preventDefault();
            }
            if (e.key === 'ArrowDown' && row < 8) {
                setSelectedCell({ row: row + 1, col });
                e.preventDefault();
            }
            if (e.key === 'ArrowLeft' && col > 0) {
                setSelectedCell({ row, col: col - 1 });
                e.preventDefault();
            }
            if (e.key === 'ArrowRight' && col < 8) {
                setSelectedCell({ row, col: col + 1 });
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, board, initialBoard, onBoardChange, customMode]);

    const handleCellClick = (row, col) => {
        setSelectedCell({ row, col });
    };

    const isHighlighted = (row, col) => {
        if (!selectedCell) return false;
        return (
            selectedCell.row === row ||
            selectedCell.col === col ||
            (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
                Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
        );
    };

    return (
        <div className="flex justify-center">
            <div className="inline-block p-2 bg-card rounded-xl border-2 border-border shadow-xl">
                <div className="grid grid-cols-9 gap-0">
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            const isInitial = initialBoard[rowIndex][colIndex] !== BigInt(0);
                            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                            const isHighlightedCell = isHighlighted(rowIndex, colIndex);
                            const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                            const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

                            return (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    className={cn(
                                        'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-base sm:text-lg font-semibold transition-all duration-150',
                                        'focus:outline-none focus:z-10',
                                        isSelected && 'bg-primary/20 ring-2 ring-primary ring-inset',
                                        !isSelected && isHighlightedCell && 'bg-accent/30',
                                        !isSelected && !isHighlightedCell && 'bg-background hover:bg-accent/20',
                                        isInitial && !customMode
                                            ? 'text-foreground font-bold cursor-default'
                                            : 'text-primary cursor-pointer',
                                        isRightBorder && 'border-r-2 border-border',
                                        isBottomBorder && 'border-b-2 border-border',
                                        cell === BigInt(0) && 'text-muted-foreground/30'
                                    )}
                                    disabled={isInitial && !customMode}
                                    type="button"
                                >
                                    {cell !== BigInt(0) ? Number(cell) : ''}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
