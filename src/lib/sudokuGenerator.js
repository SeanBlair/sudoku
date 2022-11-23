import { getRandomInt, sudokuNumbers, shuffle } from "./sudokuUtils";

export function generateSudoku() {
  const sudoku = generateEmptySudoku();

  solveSudoku(sudoku, 0, 0);

  return sudoku;
}

// Invariants:
// - any value > 0 is valid.
// - row and column are never === 9
// - if return true sudoku is solved.
// - if return false sudoky is not solveable.
function solveSudoku(sudoku, row, column) {
  const maxRowAndColumnValue = 8;

  if (row === maxRowAndColumnValue && column === maxRowAndColumnValue) {
    // End of sudoku
    return true;
  }

  const nextRow = column === maxRowAndColumnValue ? row + 1 : row;
  const nextColumn = column === maxRowAndColumnValue ? 0 : column + 1;

  if (cellIsEmpty(sudoku, row, column)) {
    const cellOptions = getAllCellOptions(sudoku, row, column);

    let cellOptionsIndex = 0;
    let solved = false;

    while (!solved && cellOptionsIndex < cellOptions.length) {
      sudoku[row][column] = cellOptions[cellOptionsIndex];
      solved = solveSudoku(sudoku, nextRow, nextColumn);
      cellOptionsIndex++;

      // Todo: can we tweak this to return number of solutions??? To be used in other algorithm that determines is there is onl
      // one solution.
      // Or at least has 2 solutions? Would be simply to find one cell where 2 different options result in solved sudokus.
      // 

      // Bug here somewhere/somehow: row 1 column 5 correctly gets set to 3, but then it gets reset to 7 
      // as cell options has the values 3, 7, 8, 9 and cellOptionsIndex has the value 1.. Also row is still 1
      // and column 5, although they should have gotten incremented.
      // Todo: look exactly what happens when setting 1,5 to 3 and calling solveSudoku()
    }
    return solved;
  } else {
    solveSudoku(nextRow, nextColumn); 
  }
}

export function generateInitialSudokuWithSingleSolution() {
  // According to https://stackoverflow.com/questions/6924216/how-to-generate-sudoku-boards-with-unique-solutions
  // looks like i will need to do the following.
  // - Implement a 'fast back-tracking' sudoku solver that counts number of solutions. Will generally stop after finding 2.
  // - Remove all cells (in random order) that still result in a single solution.
}

function sudokuHasNSolutions(sudoku, nSolutions) {
  let solutionsFound = 0;

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++){
      if (cellIsEmpty(sudoku, row, column)) {
        const options = getAllCellOptions(sudoku, row, column);
        const shuffledOptions = shuffle(options);
        for (let shuffledOptionsIndex = 0; shuffledOptionsIndex < shuffledOptions; shuffledOptionsIndex++) {
          sudoku[row][column] = shuffledOptions[shuffledOptionsIndex];
          if (sudokuHasSolution(sudoku)) {
            solutionsFound++;
            if (solutionsFound === nSolutions) {
              return true;
            } 
          }
        }
        // haven't returned because we still haven't found enought solutions.
        // Todo: do we have to call this recursively?
        //  
      }
    }
  }
}

function sudokuHasSolution(sudoku) {
  return solveSudoku(sudoku, 0, 0);
}

function getAllCellOptions(sudoku, row, column) {
  const rowValues = sudoku[row].filter(v => v > 0);
  const columnValues = getColumnValues(sudoku, column);
  const groupValues = getGroupValues(sudoku, row, column);
  
  const allValues = [...rowValues, ...columnValues, ...groupValues];
  const allUnusedValues = sudokuNumbers.filter(v => !allValues.includes(v));

  return allUnusedValues;
}

function cellIsEmpty(sudoku, row, column) {
  return sudoku[row][column] === 0; 
}

export function generateSolvedSudoku() {
  let sudoku = attemptToGenerateASolvedSudoku();
  let attempts = 1;

  while (!isSolved(sudoku)) {
    sudoku = attemptToGenerateASolvedSudoku();
    attempts++;
  }
  console.log(`Attempts to generate this solved sudoku: ${attempts}`)
  return sudoku;
}

function isSolved(sudoku) {
  // When a sudoku is not solved, at least one of the values will be undefined.
  return sudoku.flat().every(value => value !== undefined);
}

// Generates a solved sudoku roughly every 9 out of 10 attempts.
function attemptToGenerateASolvedSudoku() {
  const sudoku = generateEmptySudoku();

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      setAllCellsWithOnlyOneOption(sudoku);
      if (!sudoku[row][column]) {
        const options = getCellOptions(sudoku, row, column);
        sudoku[row][column] = options[getRandomInt(0, options.length)];
        // Todo: Need to handle the case when setting this value results in a cell with no options.
        // Ideally we would set to another option. Would likely require to implement history and backtracking...
      }
    }
  }
  return sudoku;
}

function generateEmptySudoku() {
  const sudoku = [];
  for (let i = 0; i < 9; i++) {
    const row = Array(9).fill(0);
    sudoku.push(row);
  }
  return sudoku;
}

function setAllCellsWithOnlyOneOption(sudoku) {
  let cell = findCellWithOnlyOneOption(sudoku);

  while (cell != null) {
    sudoku[cell.row][cell.column] = cell.value;
    
    cell = findCellWithOnlyOneOption(sudoku);
  }
}

function findCellWithOnlyOneOption(sudoku) {
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      if (!sudoku[row][column]) {
        const cellOptions = getCellOptions(sudoku, row, column, true);
        if (cellOptions.length === 1) {
          return {
            row: row,
            column: column,
            value: cellOptions[0]
          }
        }
      }
    }
  }
  return null;
}

function getCellOptions(sudoku, row, column, searchingForSingleOptionCell = false) {
  const rowValues = sudoku[row].filter(v => v > 0);
  const columnValues = getColumnValues(sudoku, column);
  const groupValues = getGroupValues(sudoku, row, column);
  
  // When not searching for single option cells to set, in some cases we prioritize a subset
  // of options by returning them only. Since we solve this row by row, from left to right,
  // when solving a group's middle row, we need to make sure we use all the third group's first row 
  // values by the end of the second group, as these are no longer valid for the third group.
  if (!searchingForSingleOptionCell && isSecondGroupIn(column) && isMiddleRowOfGroup(row)) {
    const lastColumnIndex = 8;
    const thirdGroupInValues = getGroupValues(sudoku, row, lastColumnIndex);
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

function isSecondGroupIn(column) {
  const secondGroupInColumns = [3, 4, 5];
  return secondGroupInColumns.includes(column);
}

function isMiddleRowOfGroup(row) {
  const middleRows = [1, 4, 7];
  return middleRows.includes(row);
}

function getGroupValues(sudoku, row, column) {
  const groups = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const rowGroup = groups.find(group => group.includes(row));
  const columnGroup = groups.find(group => group.includes(column));
  const groupValues = [];

  rowGroup.forEach(row => {
    columnGroup.forEach(column => {
      const value = sudoku[row][column];
      if (value > 0) {
        groupValues.push(value);
      }
    });
  });
  return groupValues;
}

function getColumnValues(sudokuBoard, column) {
  const columnValues = [];
  for (let row = 0; row < 9; row++) {
    const value = sudokuBoard[row][column];
    if (value > 0) {
      columnValues.push(value);
    }
  }
  return columnValues;
}
