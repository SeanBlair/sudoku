import { assert, describe, it } from 'vitest';
import { generateSudoku, solveSudoku, isSolved, sudokuHasSolution } from './sudokuGenerator';
import { deepClone, getRandomInt, sudokuNumbers } from './sudokuUtils';

const solvedSudoku = [
  [1,2,3,4,5,6,7,8,9],
  [4,5,6,7,8,9,1,2,3],
  [7,8,9,1,2,3,4,5,6],
  [2,1,4,3,6,5,8,9,7],
  [3,6,5,8,9,7,2,1,4],
  [8,9,7,2,1,4,3,6,5],
  [5,3,1,6,4,2,9,7,8],
  [6,4,2,9,7,8,5,3,1],
  [9,7,8,5,3,1,6,4,2]
];

describe('solveSudoku', () => {

  it('returns a solved sudoku', () => {
    // const sudokuToSolve = deepClone(solvedSudoku);
    // const result = sudokuHasSolution(sudokuToSolve); 

    // const x = 1;

    // assert.isTrue(result);
  })
})

// describe('sudokuHasSolution')

describe('isSolved', () => {
  it('returns true when the given sudoku is solved', () => {
    assert.isTrue(isSolved(solvedSudoku));
  })

  it('returns false when the given sudoku has a non-sudoku value', () => {
    const notSolvedSudokus = [];

    const nonSudokuValues = [null, undefined, '', ' ', 0, -1, 10];
    nonSudokuValues.forEach(v => {
      const clonedSudoku = deepClone(solvedSudoku);

      clonedSudoku[getRandomInt(0, clonedSudoku.length)] = v;
      notSolvedSudokus.push(clonedSudoku);
    });

    assert.isTrue(notSolvedSudokus.every(sudoku => !isSolved(sudoku)));
  })

  it('returns false when the given sudoku has a repeated value in row, colum or group', () => {
    const randomIndex = getRandomInt(0, sudokuNumbers.length);
    const newValue = sudokuNumbers.find(number => number !== solvedSudoku[randomIndex][randomIndex]);
    const sudokuWithRepeatedValue = deepClone(solvedSudoku);
    sudokuWithRepeatedValue[randomIndex][randomIndex] = newValue;

    assert.isFalse(isSolved(sudokuWithRepeatedValue));
  })
})

