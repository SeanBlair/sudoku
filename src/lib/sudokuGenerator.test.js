import { assert, describe, it } from 'vitest';
import { generateSudoku, solveSudokuRecursively, solveSudokuSuperFast, minimizeCluesForSingleSolution,
  isSolved, hasSolution, generateEmptySudoku, solveSudokuFastPlease, solveSudokuFaster,
  solveSudokuAndCountSolutions, generateSolvedSudoku } from './sudokuGenerator';
import { deepClone, emptySudokuCellValue, getRandomInt, sudokuNumbers } from './sudokuUtils';

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

// describe('solveSudoku', () => {

//   it('returns a solved sudoku', () => {
//     // const sudokuToSolve = deepClone(solvedSudoku);
//     // const result = sudokuHasSolution(sudokuToSolve); 

//     // const x = 1;

//     // assert.isTrue(result);
//   })
// })

// describe('hasSolution', () => {
//   it('returns true when the given sudoku is already solved', () => {
//     assert.isTrue(hasSolution(solvedSudoku));
//   })

//   it('returns false when the given sudoku is full and not valid', () => {
//     const sudoku = deepClone(solvedSudoku);
//     sudoku[0][0] = 1;
//     sudoku[0][1] = 1;

//     assert.isFalse(hasSolution(sudoku));
//   })

//   it('returns true when the given sudoku has a possible solution', () => {
//     const sudoku = deepClone(solvedSudoku);
//     sudoku[0][0] = 0;

//     assert.isTrue(hasSolution(sudoku));
//   })

//   it('returns false when the given sudoku does not have a solution', () => {
//     // const impossibleSudoku = [
//     //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//     //   [4, 5, 6, 1, 2, 3, 0, 0, 0],
//     //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     //   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     //   [0, 0, 0, 0, 0, 0, 0, 0, 0]
//     // ];

//     assert.isFalse(hasSolution(impossibleSudoku));
//   })
// })

// describe('isSolved', () => {
//   it('returns true when the given sudoku is solved', () => {
//     assert.isTrue(isSolved(solvedSudoku));
//   })

//   it('returns false when the given sudoku has a non-sudoku value', () => {
//     const notSolvedSudokus = [];

//     const nonSudokuValues = [null, undefined, '', ' ', 0, -1, 10];
//     nonSudokuValues.forEach(v => {
//       const clonedSudoku = deepClone(solvedSudoku);

//       clonedSudoku[getRandomInt(0, clonedSudoku.length)] = v;
//       notSolvedSudokus.push(clonedSudoku);
//     });

//     assert.isTrue(notSolvedSudokus.every(sudoku => !isSolved(sudoku)));
//   })

//   it('returns false when the given sudoku has a repeated value in row, colum or group', () => {
//     const randomIndex = getRandomInt(0, sudokuNumbers.length);
//     const newValue = sudokuNumbers.find(number => number !== solvedSudoku[randomIndex][randomIndex]);
//     const sudokuWithRepeatedValue = deepClone(solvedSudoku);
//     sudokuWithRepeatedValue[randomIndex][randomIndex] = newValue;

//     assert.isFalse(isSolved(sudokuWithRepeatedValue));
//   })
// })

// describe('solveSudokuAndCountSolutions', () => {
//   // it('returns 0 when sudoku has no solutions', () => {
//   //   const result = solveSudokuAndCountSolutions(impossibleSudoku);

//   //   assert.equal(result, 0) 
//   // })
//   it('returns 1 when sudoku has only one solution', () => {
//     // const result = solveSudokuAndCountSolutions(singleSolutionSudoku);

//     // assert.equal(result, 1); 
//   }) 
// //   it('returns 2 when sudoku has at least 2 solutions', () => {
// //     const sudoku = generateEmptySudoku();

// //     const result = solveSudokuAndCountSolutions(sudoku);

// //     assert.equal(result, 2); 
// //   })
// })

// describe('generateSudoku', () => {
//   it('generates a single solution sudoku with minimal clues', () => {
//     // const result = generateSudoku();
    
//     // assert.isTrue(result.length === 9);
//   })
// })

// describe('generateSolvedSudoku', () => {
//   it('generates a random solved sudoku', () => {
//     // const result = generateSolvedSudoku();

//     // assert.isTrue(result.length === 9);
//   })
// })

// describe('solveSudokuSuperFast', () => {
//   it('solves a sudoku with a single solution', () => {
//     // const result = solveSudokuSuperFast(singleSolutionSudoku);

//     // assert.isTrue(result.length === 9);
//   })

//   // it('solves a sudoku with at least 2 solutions', () => {
//   //   const result = solveSudokuSuperFast(generateEmptySudoku());

//   //   assert.isTrue(result.length === 9);
//   // })
 
// })

// describe('solveSudokuFastPlease', () => {
//   it('solves a sudoku with a single solution', () => {
//     const result = solveSudokuFastPlease(singleSolutionSudoku); 

//     console.log(result); 

//     assert.isTrue(isSolved(result));
//   })
//   it('solves a sudoku with more than one solution', () => {
//     const result = solveSudokuFastPlease(generateEmptySudoku());

//     console.log(result); 

//     assert.isTrue(isSolved(result));
//   })
// }) 

// describe('generateSudoku', () => {

//   it('generates a sudoku with a single solution with minimal clues', () => {
//     const sudoku = generateSudoku();

//     assert.isTrue(sudoku.length === 9);
//   })
// })

const hardToMinimize = [
  [5,4,1,6,3,8,2,7,9],
  [2,3,6,9,7,1,8,4,5],
  [7,8,9,5,4,2,1,6,3],
  [9,7,3,1,2,4,6,5,8],
  [6,5,8,3,9,7,4,2,1],
  [4,1,2,8,6,5,9,3,7],
  [1,6,4,7,5,9,3,8,2],
  [8,2,7,4,1,3,5,9,6],
  [3,9,5,2,8,6,7,1,4]
];

const easyToMinimize = [
  [3,1,9,8,7,6,5,2,4],
  [6,2,8,5,4,9,1,3,7],
  [7,5,4,3,1,2,8,6,9],
  [1,3,2,7,9,5,6,4,8],
  [4,8,5,6,3,1,9,7,2],
  [9,6,7,2,8,4,3,1,5],
  [8,9,6,1,2,7,4,5,3],
  [5,7,3,4,6,8,2,9,1],
  [2,4,1,9,5,3,7,8,6]
];

describe('minimizeCluesForSingleSolution', () => {
  it('minimizes a sudoku that is hard to minimize', () => {
    // const result = minimizeCluesForSingleSolution(deepClone(hardToMinimize));

    // assert.isTrue(true);

    // 1. Time: 29 s, solveSudoku(): 3958, backtrack: 38548, average backtrack: 9
    // 2. Time: 81 s, solveSudoku(): 4111, backtrack: 140733, average backtrack: 34
    // 3. Time: 14 s, solveSudoku(): 4061, backtrack: 18872, average backtrack: 4
    // 4. Time: 28 s, solveSudoku(): 3926, backtrack: 24151, average backtrack: 6

    // 5. Time: 17 s, solveSudoku(): 2671, backtrack: 40560, average backtrack: 15
    // returned zero: 0, one: 50, two: 31
    // 6. Time: 136 s, solveSudoku(): 3860, backtrack: 136914, average backtrack: 35
    // returned zero: 0, one: 56, two: 25
    // 7. Time: 26 s, solveSudoku(): 3515, backtrack: 29848, average backtrack: 8
    // returned zero: 0, one: 54, two: 27
    // 8. Time: 467 s, solveSudoku(): 3954, backtrack: 591210, average backtrack: 149
    // returned zero: 0, one: 58, two: 23
    // 9. Time: 11 s, solveSudoku(): 3490, backtrack: 9319, average backtrack: 2
    // returned zero: 0, one: 54, two: 27
    // 10. Time: 47 s, solveSudoku(): 4009, backtrack: 94629, average backtrack: 23
  })

  // it('minimizes a sudoku that is easy to minimize', () => {
  //   // const result = minimizeCluesForSingleSolution(deepClone(easyToMinimize));

  //   // assert.isTrue(true);

  //   // 1. Time: 14 s, solveSudoku(): 3983, backtrack: 12926, average backtrack: 3
  //   // 2. Time: 13 s, solveSudoku(): 3672, backtrack: 15627, average backtrack: 4
  //   // 3. Time: 21 s, solveSudoku(): 4003, backtrack: 14825, average backtrack: 3
  //   // 4. Time: 142 s, solveSudoku(): 4309, backtrack: 217284, average backtrack: 50


  // })
})

describe('solveSudokuFaster()', () => {
  // it('solves the given sudoku', () => {
  //   const solved = solveSudokuFaster(deepClone(singleSolutionSudoku));

  //   assert.isTrue(isSolved(solved));
  // })

  it('has cell with single option', () => {
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

    const result = solveSudokuFaster(sudokuWithSingleOptionCell);

    assert.equal(result[0][0], 1);
  })

  it('has cell that is only option', () => {
    // One cell has multiple options, but is the only cell in row
    // with one of these options.
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

    const result = solveSudokuFaster(sudokuWithOnlyOptionCell);

    const expectedOnlyOptionCellValue = 1;
    assert.equal(result[0][0], expectedOnlyOptionCellValue);
  })

  // todo: create some test cases that verify will correctly set
  // single/only option cells created through setting other single/only option
  // cells.
  //
  it('has cascade of single option cells', () => {
    const sudoku = [
      [1, 2, 3, 4, 5, 6, 7, 8, 0],
      [0, 5, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [8, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 0, 0, 0, 0, 0, 0, 3],
      [0, 0, 0, 0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 1]
    ];

    const result = solveSudokuFaster(sudoku);

    assert.equal(result[0][8], 9); // single option
    assert.equal(result[1][8], 6); // only option
    assert.equal(result[2][8], 5); // only option
    assert.equal(result[3][8], 7); // only option
    assert.equal(result[4][8], 8); // only option
  })
  it('has cascade of only option cells', () => {

  })

  it('Does not set a value when a cell has no options', () => {
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

    const result = solveSudokuFaster(sudokuWithZeroOptionCell);

    assert.equal(result[0][8], emptySudokuCellValue)
  })
})

