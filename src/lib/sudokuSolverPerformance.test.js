import { describe, it } from 'vitest';
import { solveSudoku as smartSolve} from './sudokuSolver';
import { solveSudoku as dumbSolve } from './sudokuGenerator';
import { deepClone } from './sudokuUtils';

describe('Performance', () => {
  const sampleCount = 1;

  const executeMultipleTimesAndLogDurations = (func) => {
    [...Array(sampleCount)].forEach((_, index) => {
      console.time(index);
      func();
      console.timeEnd(index);
    });
  }

  describe('Empty sudoku', () => {
    const emptySudoku = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    it('smart solver', () => {
      executeMultipleTimesAndLogDurations(() => smartSolve(emptySudoku));
    })
  
    it('dumb solver', () => {
      executeMultipleTimesAndLogDurations(() => dumbSolve(deepClone(emptySudoku)));
    })
  })
  
  describe('Single solution sudoku with minimal clues', () => {
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

    it('smart solver', () => {
      executeMultipleTimesAndLogDurations(() => smartSolve(singleSolutionSudoku));
    })
  
    it('dumb solver', () => {
      executeMultipleTimesAndLogDurations(() => dumbSolve(deepClone(singleSolutionSudoku)));
    })
  })

  describe('Sudoku with multiple solutions and around half the clues', () => {
    
    // Solved sudoku with all 1, 3, 5, 7, and 9 values removed.
    const multipleSolutionSudoku = [
      [0, 0, 0, 8, 0, 6, 0, 2, 4],
      [6, 2, 8, 0, 4, 0, 0, 0, 7],
      [0, 0, 4, 0, 0, 2, 8, 6, 9],
      [0, 0, 2, 0, 0, 0, 6, 4, 8],
      [4, 8, 0, 6, 0, 0, 0, 0, 2],
      [0, 6, 0, 2, 8, 4, 0, 0, 5],
      [8, 0, 6, 0, 2, 0, 4, 0, 0],
      [0, 0, 0, 4, 6, 8, 2, 0, 0],
      [2, 4, 0, 0, 0, 0, 0, 8, 6]
    ];

    it('smart solver', () => {
      executeMultipleTimesAndLogDurations(() => smartSolve(multipleSolutionSudoku));
    })
  
    it('dumb solver', () => {
      executeMultipleTimesAndLogDurations(() => dumbSolve(deepClone(multipleSolutionSudoku)));
    })
  })
})
