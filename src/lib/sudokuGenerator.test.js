import { assert, describe, it } from 'vitest';
import { generateSudoku, solveSudokuRecursively, 
  isSolved, hasSolution, generateEmptySudoku, 
  solveSudokuAndCountSolutions } from './sudokuGenerator';
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

const impossibleSudoku = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 1, 2, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const singleSolutionSudoku = [
  [1, 6, 0, 0, 0, 0, 0, 7, 0],
  [0, 4, 0, 0, 0, 0, 3, 0, 6],
  [0, 0, 0, 0, 9, 0, 0, 5, 0],
  [0, 1, 6, 3, 0, 0, 0, 0, 0],
  [8, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 4, 8, 1, 0, 0, 0, 0],
  [0, 0, 0, 6, 0, 0, 0, 0, 2],
  [0, 5, 2, 0, 4, 7, 6, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 9]
];

describe('solveSudoku', () => {

  it('returns a solved sudoku', () => {
    // const sudokuToSolve = deepClone(solvedSudoku);
    // const result = sudokuHasSolution(sudokuToSolve); 

    // const x = 1;

    // assert.isTrue(result);
  })
})

describe('hasSolution', () => {
  it('returns true when the given sudoku is already solved', () => {
    assert.isTrue(hasSolution(solvedSudoku));
  })

  it('returns false when the given sudoku is full and not valid', () => {
    const sudoku = deepClone(solvedSudoku);
    sudoku[0][0] = 1;
    sudoku[0][1] = 1;

    assert.isFalse(hasSolution(sudoku));
  })

  it('returns true when the given sudoku has a possible solution', () => {
    const sudoku = deepClone(solvedSudoku);
    sudoku[0][0] = 0;

    assert.isTrue(hasSolution(sudoku));
  })

  it('returns false when the given sudoku does not have a solution', () => {
    // const impossibleSudoku = [
    //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
    //   [4, 5, 6, 1, 2, 3, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0]
    // ];

    assert.isFalse(hasSolution(impossibleSudoku));
  })
})

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

describe('solveSudokuAndCountSolutions', () => {
  it('returns 0 when sudoku has no solutions', () => {
    const result = solveSudokuAndCountSolutions(impossibleSudoku);

    assert.equal(result, 0)
  })
  it('returns 1 when sudoku has only one solution', () => {
    const result = solveSudokuAndCountSolutions(singleSolutionSudoku);

    assert.equal(result, 1); 
  })
  it('returns 2 when sudoku has at least 2 solutions', () => {
    const sudoku = generateEmptySudoku();

    const result = solveSudokuAndCountSolutions(sudoku);

    assert.equal(result, 2); 
  })
})



