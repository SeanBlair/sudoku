export function generateSolvedSudoku() {
  let attempt = attemptToGenerateASolvedSudoku();
  let attemptsCount = 1;

  while (!isSolved(attempt)) {
    attempt = attemptToGenerateASolvedSudoku();
    attemptsCount++;
  }

  console.log(attempt);
  console.log(`Attempts: ${attemptsCount}`);

  return attempt;
}

function isSolved(sudoku) {
  return sudoku.flat().every(number => number !== undefined);
}

// Generates a solved sudoku roughly every other attempt (~50%).
function attemptToGenerateASolvedSudoku() {
  const sudoku = generateEmptySudokuBoard();

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      setAllCellsWithOnlyOneOption(sudoku);
      if (!sudoku[row][column]) {
        const options = getCellOptions(sudoku, row, column);
        const randomOption = options[getRandomInt(0, options.length)];
        sudoku[row][column] = randomOption;
        // Todo: Need to handle the case when setting this value results in a cell with no options.
        // Ideally we would set to another option. Would likely require to implement history and backtracking...
      }
    }
  }
  return sudoku;
}

function generateEmptySudokuBoard() {
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
  
  // When not searching for single option cells to set, in some cases we prioritize a subset
  // of options by returning them only. Since we solve this row by row, from left to right,
  // when solving a group's middle row, we need to make sure we use all the third group's first row 
  // values by the end of the second group, as these are no longer valid for the third group.
  if (!searchingForSingleOptionCell && isSecondGroupIn(column) && isMiddleRowOfGroup(row)) {
    const lastColumn = 8;
    const thirdGroupInValues = getGroupValues(sudoku, row, lastColumn);
    const unusedThirdGroupInValues = thirdGroupInValues.filter(v => !rowValues.includes(v));
    if (unusedThirdGroupInValues.length > 0) {
      return unusedThirdGroupInValues;
    }
  }

  const columnValues = getColumnValues(sudoku, column);
  const groupValues = getGroupValues(sudoku, row, column);
  const allValues = [...rowValues, ...columnValues, ...groupValues];
  const allUnusedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => !allValues.includes(v));

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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
