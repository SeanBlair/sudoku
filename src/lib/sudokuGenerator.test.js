import { assert, describe, it } from 'vitest';
import { generateSudoku, solveSudoku } from './sudokuGenerator';


describe('solveSudoku', () => {
const solved = 
`1,2,3,4,5,6,7,8,9,
 4,5,6,7,8,9,1,2,3,
 7,8,9,1,2,3,4,5,6,
 2,1,4,3,6,5,8,9,7,
 3,6,5,8,9,7,2,1,4,
 8,9,7,2,1,4,3,6,5,
 5,3,1,6,4,2,9,7,8,
 6,4,2,9,7,8,5,3,1,
 9,7,8,5,3,1,6,4,2`;



  it('does some stuff', () => {
    const sudoku = solveSudoku(); 

    assert()
  })
})

describe('sudokuHasSolution')

