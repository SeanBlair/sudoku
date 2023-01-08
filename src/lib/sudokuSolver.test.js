import { assert, describe, expect, it } from 'vitest';
import { solveSudoku } from './sudokuSolver';
import { isSolved } from './sudokuGenerator';

describe('Single Option Cells', () => {
  it('Sets a single option cell', () => {

    // The first cell has a single option: 1.
    const sudokuWithSingleOptionCell = [
      [0, 2, 0, 5, 8, 0, 0, 0, 0],
      [0, 4, 7, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3, 0, 0, 0, 0, 0, 0, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 0],
      [9, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const result = solveSudoku(sudokuWithSingleOptionCell);

    assert.equal(result[0][0], 1);
  })

  it('Sets cell that becomes single option after setting another single option cell', () => {

    // Last cell of first row (A) has a single option (9)
    // Last cell of second row (B) has 2 options (6, 9).
    // When we set A, B becomes a single option cell (6)
    const sudoku = [
      [1, 2, 3, 4, 5, 6, 7, 8, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 2], 
      [0, 0, 0, 0, 0, 0, 0, 0, 3], 
      [0, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 0, 0, 0, 0, 0, 0, 5],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const result = solveSudoku(sudoku);

    assert.equal(result[0][8], 9);
    assert.equal(result[1][8], 6);
  })

  it('Does not set a value when 2 cells in the same group have the same single option', () => {

    // Both last cells in the 1st row can only be 9.
    const sudoku = [
      [1, 2, 3, 4, 5, 6, 7, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0, 8],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const result = solveSudoku(sudoku);

    const expected = result[0][7] === 0 
      || result[0][8] === 0;  

    assert.isTrue(expected);
  })
})

describe('Only Option Cells', () => {
  it('Sets a only option cell', () => {

    // An 'only option' cell has multiple options, but is the only cell in a 
    // cell group with one of these options.
    // The first cell can be multiple options, but is the only cell 
    // in the first row which can be 1. Also the only cell in the
    // first column that can be 1. Also the only cell in the first
    // group that can be 1.
    const sudokuWithOnlyOptionCell = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1]
    ];

    const result = solveSudoku(sudokuWithOnlyOptionCell);

    assert.equal(result[0][0], 1);
  })

  it('Sets cells that becomes only option after setting another only option cell', () => {

    // The last column has only option cells:
    const sudoku = [
      [1, 2, 3, 4, 5, 6, 7, 8, 0], 
      [0, 5, 0, 0, 0, 0, 0, 0, 0], // only option for 6 after setting 5
      [0, 0, 0, 0, 0, 0, 0, 0, 0], // only option for 5 after setting 7
      [8, 0, 0, 0, 0, 0, 0, 0, 0], // only option for 7 after setting 8 
      [0, 0, 0, 0, 0, 0, 0, 0, 0], // only option for 8
      [0, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 0, 0, 0, 0, 0, 0, 3],
      [0, 0, 0, 0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 1]
    ];

    const result = solveSudoku(sudoku);

    assert.equal(result[1][8], 6); 
    assert.equal(result[2][8], 5);
    assert.equal(result[3][8], 7);
    assert.equal(result[4][8], 8);
  })

  it('Does not set a value when a cell is the only option for 2 different numbers', () => {

    // first cell is the only option for both 1 and 2.
    const sudoku = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 1, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 2, 0],
      [0, 1, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const result = solveSudoku(sudoku);

    assert.equal(result[0][0], 0);
  })

  it(`Does not set a value when a cell becomes the only option for 2 different numbers after 
  setting a different only option cell `, () => {

    // The last cell in the first row is the only option for 5 and it includes 1 and 2 in 
    // its options. When we set the last cell to 5, the first cell becomes the only option 
    // for both 1 and 2.
    const sudoku = [
      [0, 0, 0, 0, 0, 0, 3, 4, 0], 
      [5, 0, 0, 1, 2, 0, 0, 0, 0], 
      [0, 5, 0, 0, 0, 0, 0, 0, 0], 
      [0, 1, 2, 0, 0, 0, 0, 5, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 1, 0, 0, 0, 0, 5, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const result = solveSudoku(sudoku);

    assert.equal(result[0][8], 5);
    assert.equal(result[0][0], 0);
  })
})


describe('Solveable Sudoku', () => {
  it('Sets all single option and only option cells', () => {
    const sudoku = [
      [1, 6, 0, 0, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 0, 0, 3, 0, 6],
      [0, 0, 0, 0, 9, 0, 0, 5, 8],
      [0, 1, 6, 3, 0, 0, 0, 0, 0],
      [8, 0, 0, 0, 0, 0, 0, 0, 5],
      [0, 2, 4, 8, 1, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0, 0, 2],
      [0, 5, 2, 0, 4, 7, 6, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 9]
    ];

    const result = solveSudoku(sudoku);

    // Only option cells
    assert.equal(result[2][5], 6);
    assert.equal(result[7][7], 8);
    assert.equal(result[8][0], 6);
    assert.equal(result[4][4], 6);
    assert.equal(result[7][8], 1);
    assert.equal(result[2][3], 4);
    assert.equal(result[6][0], 4);
    assert.equal(result[7][0], 3);
    assert.equal(result[5][8], 3);
    assert.equal(result[2][6], 1);
    assert.equal(result[2][0], 2);

    // Single option cells
    assert.equal(result[3][8], 7);
    assert.equal(result[7][3], 9);
    assert.equal(result[6][7], 3);
    assert.equal(result[5][6], 9);
    assert.equal(result[8][7], 4);
    assert.equal(result[5][5], 5);
    assert.equal(result[5][7], 6);
    assert.equal(result[0][6], 2);
    assert.equal(result[3][7], 2);
  })

  it('Given a solved sudoku, returns the solved sudoku', () => {
    const solvedSudoku = [
      [3, 1, 9, 8, 7, 6, 5, 2, 4],
      [6, 2, 8, 5, 4, 9, 1, 3, 7],
      [7, 5, 4, 3, 1, 2, 8, 6, 9],
      [1, 3, 2, 7, 9, 5, 6, 4, 8],
      [4, 8, 5, 6, 3, 1, 9, 7, 2],
      [9, 6, 7, 2, 8, 4, 3, 1, 5],
      [8, 9, 6, 1, 2, 7, 4, 5, 3],
      [5, 7, 3, 4, 6, 8, 2, 9, 1],
      [2, 4, 1, 9, 5, 3, 7, 8, 6]
    ];

    const result = solveSudoku(solvedSudoku);

    expect(result).to.eql(solvedSudoku);
  })
})


describe('Unsolveable Sudoku', () => {
  it('Does not set a value when a cell has no options', () => {

    // The last cell of the first row has no options.
    const sudokuWithZeroOptionCell = [
      [1, 2, 3, 4, 5, 6, 7, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 9],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const result = solveSudoku(sudokuWithZeroOptionCell);

    assert.equal(result[0][8], 0)
  })
})

describe('Backtracking (unsolved after setting all single and only option cells)', () => {

  it('Solves a 1-solution sudoku having a cell with 2 options', () => {

    // The last column of the first row has 2 options (4, 8) after setting
    // all the single and only option cells.
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

    const result = solveSudoku(singleSolutionSudoku);

    assert.equal(result[0][8], 4);

    assert.isTrue(isSolved(result));
  })

  it('Solves a 2-solution sudoku having a cell with 2 options', () => {
    // Solved sudoku with all 1 and 3 values replaced with 0.
    const twoSolutionSudoku = [
      [0, 0, 9, 8, 7, 6, 5, 2, 4],
      [6, 2, 8, 5, 4, 9, 0, 0, 7],
      [7, 5, 4, 0, 0, 2, 8, 6, 9],
      [0, 0, 2, 7, 9, 5, 6, 4, 8],
      [4, 8, 5, 6, 0, 0, 9, 7, 2],
      [9, 6, 7, 2, 8, 4, 0, 0, 5],
      [8, 9, 6, 0, 2, 7, 4, 5, 0],
      [5, 7, 0, 4, 6, 8, 2, 9, 0],
      [2, 4, 0, 9, 5, 0, 7, 8, 6]
    ];

    const result = solveSudoku(twoSolutionSudoku);

    const isSolutionA = result[0][0] === 1 && result[0][1] === 3;
    const isSolutionB = result[0][0] === 3 && result[0][1] === 1;

    assert.isTrue(isSolutionA || isSolutionB);
    assert.isTrue(isSolved(result));
  })

  it('Does not solve a sudoku that requires backtracking to identify is not solveable', () => {

    // First 3 columns of the first row all have 1 and 2 as options.
    // Setting any of these 3 cells to either 1 or 2 will result in 
    // one of the other having no options.
    const impossibleSudoku = [
      [0, 0, 0, 4, 5, 6, 7, 8, 9],
      [3, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const result = solveSudoku(impossibleSudoku);

    const oneIsEmpty = result[0][0] === 0 || result[0][1] === 0 || result[0][2] === 0;

    assert.isTrue(oneIsEmpty);
    assert.isFalse(isSolved(result))
  })
})
