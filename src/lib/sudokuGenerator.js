function generateSudoku() {
  return generateInitialSudokuWithSingleSolution();
}

function canSolveSudoku(sudoku) {
  return isSolved(solveSudoku(sudoku));
}

function generateInitialSudokuWithSingleSolution() {
  const solvedSudoku = generateSolvedSudoku();

  return minimizeCluesForSingleSolution(solvedSudoku);
}

function minimizeCluesForSingleSolution(solvedSudoku) {
  // const allPositions = shuffle(getAllSudokuCoordinates());
  const allPositions = getAllSudokuCoordinatesShuffled();

  allPositions.forEach(position => {
    removeClueIfNotNeededForASingleSolution(position, solvedSudoku);
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

function getAllSudokuCoordinatesShuffled() {
  return shuffle(getAllSudokuCoordinates());
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
    && allGroupsHaveDistinctValues(sudoku);
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

function allGroupsHaveDistinctValues(sudoku) {
  const groupStartIndexes = [0, 4, 7];
  const groupRowStartIndexes = groupStartIndexes;
  const groupColumnStartIndexes = groupStartIndexes;

  return groupRowStartIndexes.every(rowIndex => {
    return groupColumnStartIndexes.every(columnIndex => {
      const groupValues = getGroupValues(sudoku, rowIndex, columnIndex);
      return allValuesAreUnique(groupValues);
    });
  });
}

function getCellOptions(sudoku, row, column, searchingForSingleOptionCell = false) {
  const rowValues = getRowValues(sudoku, row);
  const columnValues = getColumnValues(sudoku, column);
  const groupValues = getGroupValues(sudoku, row, column);
  
  // When not searching for single option cells to set, in some cases we prioritize a subset
  // of options by returning them only. Since we solve this row by row, from left to right,
  // when solving a group's middle row, we need to make sure we use all the third group's first row 
  // values by the end of the second group, as these are no longer valid for the third group.

  // Todo: would this approach help to prune out some from the column perspective?
  if (!searchingForSingleOptionCell && isSecondGroupIn(column) && isMiddleRowOfGroup(row)) {
    const lastColumnIndex = 8;
    const thirdGroupInValues = getGroupValues(sudoku, row, lastColumnIndex);
    // Todo: can't we simplify this to filter by not included in allValues below?? It will provide different results.
    // Also is this correct? Looks like will only filter out the ones in ALL of the groups, which does not make sense! (i think)
    const unusedThirdGroupInValues = thirdGroupInValues
      .filter(v => !rowValues.includes(v) && !columnValues.includes(v) && !groupValues.includes(v)); 
    if (unusedThirdGroupInValues.length > 0) {
      return unusedThirdGroupInValues;
    }
  }

  const allValues = [...rowValues, ...columnValues, ...groupValues];
  const allUnusedValues = sudokuNumbers.filter(v => !allValues.includes(v));

  return allUnusedValues;
}

function isSecondGroupIn(columnIndex) {
  const secondGroupInColumnIndexes = [3, 4, 5];
  return secondGroupInColumnIndexes.includes(columnIndex);
}

function isMiddleRowOfGroup(rowIndex) {
  const middleRowIndexes = [1, 4, 7];
  return middleRowIndexes.includes(rowIndex);
}

function getGroupValues(sudoku, rowIndex, columnIndex) {
  const groupIndexes = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const rowGroupIndexes = groupIndexes.find(group => group.includes(rowIndex));
  const columnGroupIndexes = groupIndexes.find(group => group.includes(columnIndex));
  const groupValues = [];

  rowGroupIndexes.forEach(row => {
    columnGroupIndexes.forEach(column => {
      groupValues.push(sudoku[row][column]);
    });
  });

  return filterOutEmptyCells(groupValues);
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
  generateSolvedSudoku, getAllSudokuCoordinatesShuffled, 
  removeClueIfNotNeededForASingleSolution };

// Todo: figure out why putting this statement at the start of this file screws up debugging the 
// unit tests.
import { sudokuNumbers, shuffle, allValuesAreUnique, deepClone, emptySudokuCellValue, 
  getEmptySudokuBoard } from "./sudokuUtils";
import { solveSudoku } from "./sudokuSolver";
