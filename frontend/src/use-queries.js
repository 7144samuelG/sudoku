import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import { backend } from "declarations/backend";
export function useGeneratePuzzle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (difficulty) => {
  
            return backend.generatePuzzle(difficulty);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sudoku'] });
        },
    });
}

export function useSolvePuzzle() {
  
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (board) => {
           
            return await backend.solveSudoku(board);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sudoku'] });
        },
    });
}

export function useValidateBoard() {
    

    return useMutation({
        mutationFn: async (board) => {
            
            return await backend.validateBoard(board);
        },
    });
}
