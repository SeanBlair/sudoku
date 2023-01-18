import { sudokuNumbers, shuffle, allValuesAreUnique, deepClone, emptySudokuCellValue, 
  getEmptySudokuBoard } from "./sudokuUtils";
import { solveSudoku } from "./sudokuSolver";


function generateSudoku(cellProcessedCallback = null) {
  if (!cellProcessedCallback) {
    cellProcessedCallback = () => {};
  }
  return generateInitialSudokuWithSingleSolution(cellProcessedCallback);
}

function canSolveSudoku(sudoku) {
  return isSolved(solveSudoku(sudoku));
}

function generateInitialSudokuWithSingleSolution(cellProcessedCallback) {
  return minimizeCluesForSingleSolution(generateSolvedSudoku(), cellProcessedCallback);
}

function minimizeCluesForSingleSolution(solvedSudoku, cellProcessedCallback) {
  const allPositions = shuffle(getAllSudokuCoordinates());

  allPositions.forEach((position, index) => {
    removeClueIfNotNeededForASingleSolution(position, solvedSudoku);
    cellProcessedCallback(index);
  });
  return solvedSudoku;
}

function removeClueIfNotNeededForASingleSolution(position, solvedSudoku) {
  // Save this clue in case we can't remove it
  const positionValue = solvedSudoku[position.row][position.column];
  // Remove this clue.
  solvedSudoku[position.row][position.column] = emptySudokuCellValue;

  if (!hasExactlyOneSolution(solvedSudoku)) {
    // We can't remove this clue.
    solvedSudoku[position.row][position.column] = positionValue;
  }
}

function hasExactlyOneSolution(sudoku) {
  return countUpToTwoSolutions(sudoku) === 1;
}

// Returns 0 if the sudoku has no solutions, 1 if only has one solution,
// 2 if has at least two solutions.
function countUpToTwoSolutions(sudoku) {
  if (!hasEmptyCell(sudoku)) {
    return isSolved(sudoku) ? 1 : 0;
  }
  
  const maxSolutionsToCheck = 2;

  // Total solutions found so far
  let solutionsCount = 0;

  for (let row = 0; row < sudokuNumbers.length; row++) {
    for (let column = 0; column < sudokuNumbers.length; column++) {
      if (cellIsEmpty(sudoku, row, column)) {
        // Solutions found for this cell. If a sudoku has 2 solutions, a single cell will 
        // have 2 different values that result in a solution.
        let cellSolutionsCount = 0;
        const cellOptions = shuffle(getCellOptions(sudoku, row, column));

        for (let optionIndex = 0; optionIndex < cellOptions.length; optionIndex++) {
          const clonedSudoku = deepClone(sudoku);
          clonedSudoku[row][column] = cellOptions[optionIndex];
          if (canSolveSudoku(clonedSudoku)) {
            cellSolutionsCount++;
            if (cellSolutionsCount === maxSolutionsToCheck) {
              // Found the 2 solutions we were looking for.
              return cellSolutionsCount;
            } else {
              // Ensure 1 solution is noted in case we never find 2 solutions.
              solutionsCount = cellSolutionsCount;
            }
          }
        }
      }
    }
  }
  return solutionsCount;
}

function getAllSudokuCoordinates() {
  const coordinates = [];
  sudokuNumbers.forEach((_, rowIndex) => {
    sudokuNumbers.forEach((_, columnIndex) => {
      coordinates.push({row: rowIndex, column: columnIndex});
    })
  })
  return coordinates;
}

function hasEmptyCell(sudoku) {
  return sudoku.flat().some(value => value === emptySudokuCellValue);
}

function cellIsEmpty(sudoku, row, column) {
  return sudoku[row][column] === emptySudokuCellValue; 
}

function generateSolvedSudoku() {
  return solveSudoku(getEmptySudokuBoard());
}

function isSolved(sudoku) {
  return allSudokuRulesAreMet(sudoku); 
}

function areAllSudokuValues(sudoku) {
  return sudoku.flat().every(value => sudokuNumbers.includes(value));
}

function allSudokuRulesAreMet(sudoku) {
  return areAllSudokuValues(sudoku) 
    && allRowsHaveDistinctValues(sudoku) 
    && allColumnsHaveDistinctValues(sudoku) 
    && allSquaresHaveDistinctValues(sudoku);
}

function allRowsHaveDistinctValues(sudoku) {
  return sudoku.every(row => allValuesAreUnique(row));
}

function allColumnsHaveDistinctValues(sudoku) {
  return sudokuNumbers.every((_, columnIndex) => {
    const columnValues = getColumnValues(sudoku, columnIndex);
    return allValuesAreUnique(columnValues);
  })
}

function allSquaresHaveDistinctValues(sudoku) {
  const groupStartIndexes = [0, 4, 7];
  const groupRowStartIndexes = groupStartIndexes;
  const groupColumnStartIndexes = groupStartIndexes;

  return groupRowStartIndexes.every(rowIndex => {
    return groupColumnStartIndexes.every(columnIndex => {
      const squareValues = getSquareValues(sudoku, rowIndex, columnIndex);
      return allValuesAreUnique(squareValues);
    });
  });
}

function getCellOptions(sudoku, row, column) {
  const rowValues = getRowValues(sudoku, row);
  const columnValues = getColumnValues(sudoku, column);
  const groupValues = getSquareValues(sudoku, row, column);
  
  const allValues = [...rowValues, ...columnValues, ...groupValues];
  const allUnusedValues = sudokuNumbers.filter(v => !allValues.includes(v));

  return allUnusedValues;
}

function getSquareValues(sudoku, rowIndex, columnIndex) {
  const squareIndexes = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const squareRowIndexes = squareIndexes.find(indexes => indexes.includes(rowIndex));
  const squareColumnIndexes = squareIndexes.find(indexes => indexes.includes(columnIndex));
  const squareValues = [];

  squareRowIndexes.forEach(rowIndex => {
    squareColumnIndexes.forEach(columnIndex => {
      squareValues.push(sudoku[rowIndex][columnIndex]);
    });
  });

  return filterOutEmptyCells(squareValues);
}

function getColumnValues(sudokuBoard, columnIndex) {
  const columnValues = [];
  for (let rowIndex = 0; rowIndex < sudokuNumbers.length; rowIndex++) {
    columnValues.push(sudokuBoard[rowIndex][columnIndex]);
  }
  return filterOutEmptyCells(columnValues);
}

function getRowValues(sudoku, rowIndex) {
  return filterOutEmptyCells(sudoku[rowIndex]);
}

function filterOutEmptyCells(sudokuGroup) {
  return sudokuGroup.filter(v => v !== emptySudokuCellValue);
}


export { generateSudoku, countUpToTwoSolutions, isSolved, canSolveSudoku, 
  generateSolvedSudoku, removeClueIfNotNeededForASingleSolution };
