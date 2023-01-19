export const sudokuNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const emptySudokuCellValue = 0;

export const empty = '';

export function getEmptySudokuOptions() {
  return Array(9).fill(empty);
} 

export function getEmptySudokuBoard() {
  const sudoku = [];
  for (let i = 0; i < sudokuNumbers.length; i++) {
    const row = Array(sudokuNumbers.length).fill(emptySudokuCellValue);
    sudoku.push(row);
  }
  return sudoku;
}

export function deepClone(object) {
  return JSON.parse(JSON.stringify(object));
}

// Returns a random integer greater or equal than min and lesser than max 
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function allValuesAreUnique(array) {
  return new Set(array).size === array.length;
}

export function shuffle(array) {
  return array.sort((a, b) => 0.5 - Math.random());
}
