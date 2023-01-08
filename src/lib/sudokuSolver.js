// Instead of brute forcing like solveSudoku() (in sudokuGenerator.js), attempts to decrease the time to
// solve by minimizing backtracking.
// This is done by:
// - Identifying 'only option' cells and setting them instead of only 'single option' cells.
// - Set each cell's options once and maintain them as they change instead of recomputing them
// each time we set a cell's value.
// - Only check sibling cells when a cell's value or options change instead of checking the full board.
// - Cache values in arrays instead of continually searching for them.
function solveSudoku(sudokuTwoDimensionalArray) {
  let board = buildSudokuBoard(sudokuTwoDimensionalArray);

  setAllCellOptionsAndAddKnownCellsToQueues(board);
  setValuesOfAllKnownCells(board);

  if (!isSolved(board)) {
    board = solveBoardByBacktracking(board);
  }

  return sudokuBoardToTwoDimensionalArray(board);
}

function solveBoardByBacktracking(boardToSolve) {
  let board = deepClone(boardToSolve);
  const snapshots = [];

  loops:
  for (let rowIndex = 0; rowIndex < sudokuNumbers.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < sudokuNumbers.length; columnIndex++) {

      // Process any known cells in queues resulting from setting the previous
      // cell's value.
      setValuesOfAllKnownCells(board);

      while (!canBeSolved(board)) {
        // Attempt to backtrack
        if (snapshots.length > 0) {
          const snapshot = snapshots.pop(); 

          board = snapshot.board;
          rowIndex = snapshot.rowIndex;
          columnIndex = snapshot.columnIndex;

          // Handle snapshot that includes a queued known cell value.
          setValuesOfAllKnownCells(board);
        } else {
          // Can't solve this board as we have tried all possible combinations of
          // cell options.
          break loops;
        }
      }

      const cell = board.cellRows[rowIndex][columnIndex];

      if (!cellValueIsSet(cell)) {
        // Handle the board's next unset cell, which should have at least 2 options at this point.

        const cellOptions = cell.options.filter(o => o !== emptySudokuCellValue);

        if (cellOptions.length < 2) {
          // All single option cells should already have been set.
          // Any cells with no options should have been identified and handled by backtracking.
          throw new Error('Found a cell with less than 2 options, not sure what to do here...');
        }

        // Random option we are setting this cell to and removing from the snapshot
        const randomOption = cellOptions[Math.floor(Math.random() * cellOptions.length)]

        // Create snapshot.
        createSnapshotWithoutCellsOption(randomOption, rowIndex, columnIndex, board, snapshots);

        cell.onlyOptionValue = randomOption;

        // Set this cell's value and remove its other options from the cell's groups.
        setOnlyOptionCellValue(cell, board);
      }
    }
  }

  return board;
}

function createSnapshotWithoutCellsOption(option, rowIndex, columnIndex, board, snapshots) {
  const clonedBoard = deepClone(board);
  const cell = clonedBoard.cellRows[rowIndex][columnIndex];

  // Remove option from cell
  cell.options[option] = emptySudokuCellValue; 
  cell.optionsCount--;

  // Handle cell that becomes single option in the snapshot.
  if (cell.optionsCount === 1) {
    clonedBoard.singleOptionCellCoordinates.push({
      rowIndex: cell.rowIndex,
      columnIndex: cell.columnIndex
    });
  }

  // Remove this option from the cell's groups and add any new only option cells to queue
  decrementGroupsOptionCountForOption(option, cell, clonedBoard);

  snapshots.push({
    board: clonedBoard,
    rowIndex: rowIndex,
    columnIndex: columnIndex
  });
}

function setAllCellOptionsAndAddKnownCellsToQueues(board) {
  setAllCellOptionsAndHandleCellsWithLessThanTwoOptions(board);
  addAllOnlyOptionCellsToQueue(board);
}

function canBeSolved(board) {
  return !board.hasCellWithNoOptions && !board.hasCellThatIsOnlyOptionForMultipleValues;
}

function isSolved(board) {
  const totalBoardCells = 81;
  return board.valuesCount === totalBoardCells;
}

// Sets the values of all known cells in the queues, as well as of any sibling cells whose
// values become known.
function setValuesOfAllKnownCells(board) {
  while (canBeSolved(board) && hasKnownCell(board)) {
    setAllOnlyOptionCells(board);
    setAllSingleOptionCells(board);
  }
}

function hasKnownCell(board) {
  return board.singleOptionCellCoordinates.length > 0 || board.onlyOptionCellCoordinates.length > 0;
}

function setAllOnlyOptionCells(board) {
  while (board.onlyOptionCellCoordinates.length > 0 && canBeSolved(board)) {
    const coordinates = board.onlyOptionCellCoordinates.shift();
    const onlyOptionCell = board.cellRows[coordinates.rowIndex][coordinates.columnIndex];
    
    if (onlyOptionCell.value) {
      // Hmm, not sure exactly why this is here.
      // Todo: figure out why this is already processed.
      // Skip it for now as its value is set.
      continue;
    }

    setOnlyOptionCellValue(onlyOptionCell, board);
  }
}

function setOnlyOptionCellValue(onlyOptionCell, board) {
  const value = onlyOptionCell.onlyOptionValue;
  setCellValue(onlyOptionCell, value, board);

  const otherOptions = onlyOptionCell.options.filter(o => o !== value && o !== emptySudokuCellValue);
  removeCellOptions(onlyOptionCell);
  decrementGroupsOptionsCountsForOtherOptionsOfCellGettingSet(onlyOptionCell, otherOptions, board);
}

function decrementGroupsOptionsCountsForOtherOptionsOfCellGettingSet(cellGettingSet, otherOptions, board) {
  otherOptions.forEach(otherOption => {
    decrementGroupsOptionCountForOption(otherOption, cellGettingSet, board);
  });
}

function decrementGroupsOptionCountForOption(option, cellThatHadOption, board) {
  decrementRowOptionCountForOption(option, cellThatHadOption, board);
  decrementColumnOptionCountForOption(option, cellThatHadOption, board);
  decrementSquareOptionCountForOption(option, cellThatHadOption, board);
}

function decrementRowOptionCountForOption(option, cellThatHadOption, board) {
  const rowOptionsCounts = board.rowsOptionsCounts[cellThatHadOption.rowIndex];
  rowOptionsCounts[option]--;
  if (rowOptionsCounts[option] === 1) {
    addOnlyOptionCellInRowToQueue(option, cellThatHadOption.rowIndex, board);
  }
}

function decrementColumnOptionCountForOption(option, cellThatHadOption, board) {
  const columnOptionsCounts = board.columnsOptionsCounts[cellThatHadOption.columnIndex];
  columnOptionsCounts[option]--;
  if (columnOptionsCounts[option] === 1) {
    addOnlyOptionCellInColumnToQueue(option, cellThatHadOption.columnIndex, board);
  }
}

function decrementSquareOptionCountForOption(option, cellThatHadOption, board) {
  const squareOptionsCounts = board.squaresOptionsCounts[cellThatHadOption.squareIndex];
  squareOptionsCounts[option]--;
  if (squareOptionsCounts[option] === 1) {
    addOnlyOptionCellInSquareToQueue(option, cellThatHadOption.squareIndex, board);
  }
}

function buildSudokuBoard(sudokuTwoDimensionalArray) {

  // Returns a 1-indexed array of counts of current options for the group. 
  // Ex: If the group has 2 cells with the option 1, position 1 will have the value 2.
  const buildGroupOptionsCounts = () => {
    const initialCount = 0;
    return Array(sudokuNumbers.length + 1).fill(initialCount);
  }

  // Returns a collection of options counts for each row, column or square.
  const buildGroupsOptionsCounts = () => {
    return Array(sudokuNumbers.length).fill().map(buildGroupOptionsCounts);
  }

  const sudokuBoard = {
    // 2D array for cell objects grouped by row
    cellRows: Array(sudokuNumbers.length).fill().map(() => Array()),

    // Number of cells with a value set. Used for identifying when the board is solved.
    valuesCount: 0,

    // To track each row's, column's or 3 X 3 square's total options for each number.
    // Used to identify when there is a single cell which is the only option for a 
    // number in a group.
    rowsOptionsCounts: buildGroupsOptionsCounts(),
    columnsOptionsCounts: buildGroupsOptionsCounts(),
    squaresOptionsCounts: buildGroupsOptionsCounts(),


    // Queues of cell coordinates for cells whose value has been identified.
    singleOptionCellCoordinates: [],
    onlyOptionCellCoordinates: [],

    // Flags that indicate the board is not solveable.
    hasCellWithNoOptions: false,
    hasCellThatIsOnlyOptionForMultipleValues: false
  }

  // Populate the board's values.
  sudokuTwoDimensionalArray.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const squareIndex = getSquareIndex(rowIndex, columnIndex);
      const cell = buildCell(value, rowIndex, columnIndex, squareIndex);
      
      if (value !== emptySudokuCellValue) {
        sudokuBoard.valuesCount++;
        removeCellOptions(cell);
      }

      sudokuBoard.cellRows[rowIndex].push(cell);
    });
  });

  return sudokuBoard;
}

// Returns an object that represents a sudoku cell
function buildCell(value, rowIndex, columnIndex, squareIndex) {
  return {
    value: value,
    rowIndex: rowIndex,
    columnIndex: columnIndex,
    squareIndex: squareIndex,

    // Number of options for this cell. Used for identifying single option cells.
    optionsCount: 0,

    // 1-indexed array for tracking this cell's value options.
    // If a cell has a number X as an option, options[X] is set to X, otherwise it is set to 0.
    options: Array(sudokuNumbers.length + 1).fill(0)
  }
}

function setAllCellOptionsAndHandleCellsWithLessThanTwoOptions(board) {
  board.cellRows.forEach(cellRow => {
    cellRow.forEach(cell => {
      if (!cellValueIsSet(cell)) {
        setCellOptions(cell, board);

        if (cell.optionsCount === 0) {
          board.hasCellWithNoOptions = true;
        }
        if (cell.optionsCount === 1) {
          board.singleOptionCellCoordinates.push({
            rowIndex: cell.rowIndex,
            columnIndex: cell.columnIndex
          });
        }
      }
    });
  });
}

function cellValueIsSet(cell) {
  return cell.value !== emptySudokuCellValue;
}

function setCellOptions(cell, board) {
  sudokuNumbers.forEach(number => {
    if (isOptionForCell(number, cell, board)) {
      addOptionToCell(number, cell, board);
    }
  });
}

function isOptionForCell(number, cell, board) {
  const cellHasNumber = (c) => c.value === number;

  const rowHasNumber = () => board.cellRows[cell.rowIndex].some(cellHasNumber);
  const columnHasNumber = () => board.cellRows.some(cellRow => cellHasNumber(cellRow[cell.columnIndex]));
  const squareHasNumber = () => {
    const indexes = getSquareBoundaryIndexes(cell.squareIndex);

    for (let rowIndex = indexes.minRow; rowIndex <= indexes.maxRow; rowIndex++) {
      for (let columnIndex = indexes.minColumn; columnIndex <= indexes.maxColumn; columnIndex++) {
        if (cellHasNumber(board.cellRows[rowIndex][columnIndex])) {
          return true;
        }
      }
    }
    return false;
  }

  // Todo: also make sure that options exclude
  // - When a group has all options for a number in a single row/column, these will not be options
  // for the rest of the row/column. This will need to be updated as we start solving the board
  // and removing options...
  // - Other options? Might be worth the extra work...
  
  return !rowHasNumber() && !columnHasNumber() && !squareHasNumber();
}

function addOptionToCell(option, cell, board) {
  cell.options[option] = option;
  cell.optionsCount++;

  // Update the cell's groups' option count
  board.rowsOptionsCounts[cell.rowIndex][option]++;
  board.columnsOptionsCounts[cell.columnIndex][option]++;
  board.squaresOptionsCounts[cell.squareIndex][option]++;
}

function addAllOnlyOptionCellsToQueue(board) {
  board.rowsOptionsCounts.forEach((rowOptionsCounts, rowIndex) => {
    addAllOnlyOptionCellsInGroupToQueue(rowOptionsCounts, rowIndex, board, addOnlyOptionCellInRowToQueue);
  });
  board.columnsOptionsCounts.forEach((columnOptionsCounts, columnIndex) => {
    addAllOnlyOptionCellsInGroupToQueue(columnOptionsCounts, columnIndex, board, addOnlyOptionCellInColumnToQueue);
  });
  board.squaresOptionsCounts.forEach((squareOptionsCounts, squareIndex) => {
    addAllOnlyOptionCellsInGroupToQueue(squareOptionsCounts, squareIndex, board, addOnlyOptionCellInSquareToQueue);
  });
}

// Only option cells are cells with more than one option, but are the 
// only option in a row, column or square for some value.
// They are identified by having a collection for each row, column and square
// that tracks how many options there currently are for each value. When there is 
// only one option, and the one cell that has this option also has other options, 
// this is a only option cell.
function addAllOnlyOptionCellsInGroupToQueue(groupOptionsCounts, groupIndex, board, addFunction) {
  groupOptionsCounts.forEach((groupOptionCount, option) => {
    if (groupOptionCount === 1) {
      addFunction(option, groupIndex, board);
    }
  });
}

function addOnlyOptionCellInSquareToQueue(onlyOption, squareIndex, board) {
  let onlyOptionCell;

  const indexes = getSquareBoundaryIndexes(squareIndex);

  // Find the one cell in this square that has this option.
  outer:
  for (let rowIndex = indexes.minRow; rowIndex <= indexes.maxRow; rowIndex++) {
    for (let columnIndex = indexes.minColumn; columnIndex <= indexes.maxColumn; columnIndex++) {
      const cell = board.cellRows[rowIndex][columnIndex];
      if (cell.options && cell.options.includes(onlyOption)) {
        onlyOptionCell = cell;
        break outer;
      }
    }
  }

  addOnlyOptionCellToQueue(onlyOption, onlyOptionCell, board);
}

function addOnlyOptionCellInColumnToQueue(onlyOption, columnIndex, board) {
  let onlyOptionCell;

  // Find the one cell in this column that has this option.
  for (let rowIndex = 0; rowIndex < sudokuNumbers.length; rowIndex++) {
    const cell = board.cellRows[rowIndex][columnIndex]; 
    if (cell.options && cell.options.includes(onlyOption)) {
      onlyOptionCell = cell;
      break;
    }
  }

  addOnlyOptionCellToQueue(onlyOption, onlyOptionCell, board);
}

function addOnlyOptionCellInRowToQueue(onlyOption, rowIndex, board) {
  // Find the one cell in this row that has this option.
  const onlyOptionCell = board.cellRows[rowIndex]
    .find(cell => cell.options && cell.options.includes(onlyOption));

  addOnlyOptionCellToQueue(onlyOption, onlyOptionCell, board);
}

function addOnlyOptionCellToQueue(onlyOption, onlyOptionCell, board) {
  const isAlsoASingleOptionCell = onlyOptionCell.optionsCount === 1;

  // Single option cells are handled elsewhere.
  if (!isAlsoASingleOptionCell) {
    if (onlyOptionCell.onlyOptionValue) {
      // If the cell already has an onlyOptionValue set and it is equal to onlyOption, the cell is an
      // only option for 2 or more of its row, column or square. It has already been added to the queue.
      const isOnlyOptionForMultipleValues = onlyOptionCell.onlyOptionValue !== onlyOption;
      if (isOnlyOptionForMultipleValues) {
        // Board can not be solved.
        board.hasCellThatIsOnlyOptionForMultipleValues = true;
      }
    } else {
      // Track the value this cell should be set to.
      onlyOptionCell.onlyOptionValue = onlyOption;

      // Add to the queue so its value will get set.
      board.onlyOptionCellCoordinates.push({
        rowIndex: onlyOptionCell.rowIndex,
        columnIndex: onlyOptionCell.columnIndex
      });
    }
  }
}

function setAllSingleOptionCells(board) {
  while (board.singleOptionCellCoordinates.length > 0 && canBeSolved(board)) {
    const coordinates = board.singleOptionCellCoordinates.shift(); 
    const singleOptionCell = board.cellRows[coordinates.rowIndex][coordinates.columnIndex];

    if (singleOptionCell.value) {
      // This cell was also a 'only option' cell and was already processed.
      continue;
    }

    setSingleOptionCellValue(singleOptionCell, board);
  }
}

function setSingleOptionCellValue(singleOptionCell, board) {
    // Find this cell's one option
    const value = singleOptionCell.options.find(option => option !== emptySudokuCellValue);
    setCellValue(singleOptionCell, value, board);
    removeCellOptions(singleOptionCell);
}

function removeCellOptions(cell) {
  cell.options = null;
  cell.optionsCount = 0;
}
 
function setCellValue(cell, value, board) {
  cell.value = value;
  board.valuesCount++;
  removeOptionFromGroupsOfCellGettingSet(cell, value, board);
  removeOptionFromSiblingsOfCellGettingSet(cell, value, board);
}

function sudokuBoardToTwoDimensionalArray(sudokuBoard) {
  const array = [];
  sudokuBoard.cellRows.forEach(cellRow => {
    const inner = [];
    cellRow.forEach(cell => {
      inner.push(cell.value);
    })
    array.push(inner);
  });
  return array;
}

function removeOptionFromSiblingsOfCellGettingSet(cellGettingSet, option, board) {
  const siblingCells = getUniqueSiblingCellsWithOptions(cellGettingSet, board);

  siblingCells.forEach(siblingCell => {
    const siblingCellHasOption = siblingCell.options[option] !== emptySudokuCellValue;

    if (siblingCellHasOption) {
      siblingCell.options[option] = emptySudokuCellValue; 
      siblingCell.optionsCount--;

      if (siblingCell.optionsCount === 1) {
        board.singleOptionCellCoordinates.push({
          rowIndex: siblingCell.rowIndex,
          columnIndex: siblingCell.columnIndex
        });
      }
      if (siblingCell.optionsCount === 0) {
        board.hasCellWithNoOptions = true;
      }

      // If siblingCell belongs to a different row, column or square as cellGettingSet, 
      // we need to also decrement its option counts.

      if (siblingCell.rowIndex !== cellGettingSet.rowIndex) {
        decrementRowOptionCountForOption(option, siblingCell, board);
      }
      if (siblingCell.columnIndex !== cellGettingSet.columnIndex) {
        decrementColumnOptionCountForOption(option, siblingCell, board);
      }
      if (siblingCell.squareIndex !== cellGettingSet.squareIndex) {
        decrementSquareOptionCountForOption(option, siblingCell, board);
      }
    }
  });
}

function removeOptionFromGroupsOfCellGettingSet(cell, option, board) {
  board.rowsOptionsCounts[cell.rowIndex][option] = 0;
  board.columnsOptionsCounts[cell.columnIndex][option] = 0;
  board.squaresOptionsCounts[cell.squareIndex][option] = 0;
}

function getUniqueSiblingCellsWithOptions(cell, board) {
  const rowSiblings = getRowSiblingsWithOptions(cell, board);
  const columnSiblings = getColumnSiblingsWithOptions(cell, board);
  const squareSiblingsNotInRowOrColumn = getSquareSiblingsWithOptions(cell, board)
    .filter(c => c.rowIndex !== cell.rowIndex && c.columnIndex !== cell.columnIndex);

  return [...rowSiblings, ...columnSiblings, ...squareSiblingsNotInRowOrColumn];
}

function getRowSiblingsWithOptions(cell, board) {
  return board.cellRows[cell.rowIndex].filter(rowCell => isSiblingWithOptions(rowCell, cell));
}

function getColumnSiblingsWithOptions(cell, board) {
  const columnSiblingsWithOptions = [];
  board.cellRows.forEach(cellRow => {
    const columnCell = cellRow[cell.columnIndex];
    if (isSiblingWithOptions(columnCell, cell)) {
      columnSiblingsWithOptions.push(columnCell);
    }
  });
  return columnSiblingsWithOptions;
}

function getSquareSiblingsWithOptions(cell, board) {
  const squareSiblingsWithOptions = [];

  const indexes = getSquareBoundaryIndexes(cell.squareIndex);

  for (let rowIndex = indexes.minRow; rowIndex <= indexes.maxRow; rowIndex++) {
    for (let columnIndex = indexes.minColumn; columnIndex <= indexes.maxColumn; columnIndex++) {
      const squareCell = board.cellRows[rowIndex][columnIndex];
      if (isSiblingWithOptions(squareCell, cell)) {
        squareSiblingsWithOptions.push(squareCell);
      }
    }
  }

  return squareSiblingsWithOptions;
}

function isSiblingWithOptions(cellToCheck, cell) {
  return cellToCheck !== cell && cellToCheck.options;
}

// 3 x 3 cell squares are 0 indexed, left to right, top to bottom
// 0, 1, 2
// 3, 4, 5
// 6, 7, 8
function getSquareIndex(rowIndex, columnIndex) {
  const rowSquareIndexes = [0, 0, 0, 3, 3, 3, 6, 6, 6];
  const columnSquareOffsets = [0, 0, 0, 1, 1, 1, 2, 2, 2]
  const rowSquareIndex = rowSquareIndexes[rowIndex];
  const columnSquareOffset = columnSquareOffsets[columnIndex];

  return rowSquareIndex + columnSquareOffset;
}

// Returns an object that contains the boundary row and column
// indexes of the square with the given index.
function getSquareBoundaryIndexes(squareIndex) {
  const squareIndexToMinRowIndex = [0, 0, 0, 3, 3, 3, 6, 6, 6];
  const squareIndexToMaxRowIndex = [2, 2, 2, 5, 5, 5, 8, 8, 8];
  const squareIndexToMinColumnIndex = [0, 3, 6, 0, 3, 6, 0, 3, 6];
  const squareIndexToMaxColumnIndex = [2, 5, 8, 2, 5, 8, 2, 5, 8];

  return {
    minRow: squareIndexToMinRowIndex[squareIndex],
    maxRow: squareIndexToMaxRowIndex[squareIndex],
    minColumn: squareIndexToMinColumnIndex[squareIndex],
    maxColumn: squareIndexToMaxColumnIndex[squareIndex]
  }
}


export { solveSudoku }

import { sudokuNumbers, emptySudokuCellValue, deepClone, shuffle } from "./sudokuUtils";