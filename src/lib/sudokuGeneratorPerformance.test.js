import { describe, it } from "vitest"
import { generateSudoku } from "./sudokuGenerator";
import { emptySudokuCellValue } from "./sudokuUtils";

describe('Check performance of sudoku generator', () => {

  const logSudokuDetails = (sudoku) => {
    const countClues = (sudoku) => {
      return sudoku.flat().filter(v => v !== emptySudokuCellValue).length;
    }
    
    console.log(`\nSudoku with ${countClues(sudoku)} clues`)

    sudoku.forEach(row => {
      console.log(row.toString());
    })
  };

  it('Generates a sudoku with minimal clues in a reasonable time span', () => {
    console.time('Duration');
    const result = generateSudoku();
    console.timeEnd('Duration');

    logSudokuDetails(result);
  })
})