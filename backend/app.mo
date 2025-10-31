import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Debug "mo:base/Debug";

persistent actor Sudoku {

  type Board = [[Nat]];

  func isValid(board : Board, row : Nat, col : Nat, num : Nat) : Bool {
    for (i in board.keys()) {
      if (board[row][i] == num or board[i][col] == num) {
        return false;
      };
    };

    let startRow = (row / 3) * 3;
    let startCol = (col / 3) * 3;

    var i = startRow;
    while (i < startRow + 3) {
      var j = startCol;
      while (j < startCol + 3) {
        if (board[i][j] == num) {
          return false;
        };
        j += 1;
      };
      i += 1;
    };

    true;
  };

  func solveSudokuHelper(board : Board) : ?Board {
    for (row in board.keys()) {
      for (col in board[row].keys()) {
        if (board[row][col] == 0) {
          var num = 1;
          while (num <= 9) {
            if (isValid(board, row, col, num)) {
              let newRow = Array.tabulate<Nat>(
                9,
                func(i) {
                  if (i == col) { num } else { board[row][i] };
                },
              );
              let newBoard = Array.tabulate<[Nat]>(
                9,
                func(i) {
                  if (i == row) { newRow } else { board[i] };
                },
              );
              switch (solveSudokuHelper(newBoard)) {
                case (?solution) { return ?solution };
                case null {};
              };
            };
            num += 1;
          };
          return null;
        };
      };
    };
    ?board;
  };

  public func solveSudoku(board : Board) : async ?Board {
    solveSudokuHelper(board);
  };

  func removeNumbers(board : Board, difficulty : Text) : Board {
    let removals = switch (difficulty) {
      case ("easy") { 30 };
      case ("medium") { 40 };
      case ("hard") { 50 };
      case (_) { Debug.trap("Invalid difficulty level: " # debug_show (difficulty)) };
    };

    var newBoard = board;
    var count = 0;

    let positions = Array.tabulate<(Nat, Nat)>(
      81,
      func(i) {
        (i / 9, i % 9);
      },
    );

    let shuffledPositions = Array.tabulate<(Nat, Nat)>(
      81,
      func(i) {
        let index = Int.abs(Time.now() + i) % 81;
        positions[index];
      },
    );

    var i = 0;
    while (i < removals and i < 81) {
      let (row, col) = shuffledPositions[i];
      if (newBoard[row][col] != 0) {
        let newRow = Array.tabulate<Nat>(
          9,
          func(j) {
            if (j == col) { 0 } else { newBoard[row][j] };
          },
        );
        newBoard := Array.tabulate<[Nat]>(
          9,
          func(j) {
            if (j == row) { newRow } else { newBoard[j] };
          },
        );
        count += 1;
      };
      i += 1;
    };

    newBoard;
  };

  public func generatePuzzle(difficulty : Text) : async Board {
    let emptyBoard = Array.tabulate<[Nat]>(
      9,
      func(_) {
        Array.tabulate<Nat>(9, func(_) { 0 });
      },
    );

    let filledBoard = switch (solveSudokuHelper(emptyBoard)) {
      case (?board) { board };
      case null { return emptyBoard };
    };

    removeNumbers(filledBoard, difficulty);
  };

  public func validateBoard(board : Board) : async Bool {
    if (board.size() != 9) {
      return false;
    };

    for (row in board.vals()) {
      if (row.size() != 9) {
        return false;
      };
      for (cell in row.vals()) {
        if (cell < 0 or cell > 9) {
          return false;
        };
      };
    };

    for (row in board.keys()) {
      for (col in board[row].keys()) {
        if (board[row][col] != 0) {
          let temp = board[row][col];
          let newRow = Array.tabulate<Nat>(
            9,
            func(i) {
              if (i == col) { 0 } else { board[row][i] };
            },
          );
          let newBoard = Array.tabulate<[Nat]>(
            9,
            func(i) {
              if (i == row) { newRow } else { board[i] };
            },
          );
          if (not isValid(newBoard, row, col, temp)) {
            return false;
          };
        };
      };
    };

    true;
  };
};
