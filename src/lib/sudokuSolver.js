// Instead of brute forcing like solveSudoku() (in sudokuGenerator.js), attempts to decrease the time to
// solve by minimizing backtracking.
// This is done by:
// - Identifying 'only option' cells and setting them instead of only 'single option' cells.
// - Set each cell's options once and maintain them as they change instead of recomputing
// each time we set a cell's value.
// - Only check sibling cells when a cell's value or options change instead of the full board.
// - Cache values in arrays instead of continually searching for them.
function solveSudoku(sudokuTwoDimensionalArray) {

  let board = buildSudokuBoard(sudokuTwoDimensionalArray);

  resetCanBeSolvedFlags(board);

  setAllCellOptionsAndAddSingleOptionCellsToQueue(board);

  addAllOnlyOptionCellsInBoardToQueue(board);

  setValuesOfAllKnownCells(board);

  // All right! We should be ready to start storing snapshots for backtracking!!!
  // We have to:
  // - Find the best cell with multiple options to try
  //  - I think this should be the one with less options because:
  //   - Less likely to pick the wrong one.
  //  - However, if we pick the one with most options, there is a greater likelihood of resulting
  //    in finding a new 'only option' cell, as we are removing the most options from a row, column or group...
  // - Pick the best option, snapshot the current state with the rest of the options.
  // - Set the cell's value.
  //  - Handle it the same as setting a 'only option' cell's value.
  //    - Has multiple options (is different than a single option cell)
  //    - Can trigger the creation of both single and only option cells.
  //  - Ensure all the only and single option cells are added to the queues.
  // - Call setValuesOfAllKnownCells
  // - Repeat till solved or can't solve.
  // - If can't solve pop last snapshot and reset state.
  // - If no snapshots return.

  const boardSnapshots = [];

  // Todo: add some unit tests for the most basic scenarios of the
  // following algorithm.

  while (!isSolved(board)) {
    if (!canBeSolved(board)) {
      if (boardSnapshots.length > 0) {
        backtrack(board, boardSnapshots);
      } else {
        // Can't solve this sudoku
        break;
      }
    } 
    const nextCellToTry = getNextCellToTry();
    const nextOptionToTry = getAndRemoveNextOptionToTry(nextCellToTry)
    if (nextCellToTry.options.length > 0) {
      takeSnapshot(board, boardSnapshots);
    }
    addNextGuessToQueue(nextCellToTry, nextOptionToTry, board);
    setValuesOfAllKnownCells(board);
  }

  return sudokuBoardToTwoDimensionalArray(board);
}

function addNextGuessToQueue(cell, value, board) {
  
}

function takeSnapshot(board, snapshots) {

}

function getNextCellToTry() {
  return buildCell(0, 0, 0, 0);
}

function backtrack(board, snapshots) {
  board = snapshots.pop();
}

function canBeSolved(board) {
  return !board.hasCellWithNoOptions && !board.hasCellThatIsOnlyOptionForMultipleValues;
}

function resetCanBeSolvedFlags(board) {
  board.hasCellWithNoOptions = false;
  board.hasCellThatIsOnlyOptionForMultipleValues = false;
}

function getAndRemoveNextOptionToTry(cell) {
  // find best next option to try among the cell's options.
  // remove from cell and return.
}

function isSolved(board) {
  const totalBoardCells = 81;
  // return board.valuesCount === totalBoardCells;

  return true;
}

// Sets the values of all known cells in the queues, as well as of any sibling cells whose
// values become known.
function setValuesOfAllKnownCells(board) {
  // First set all only option cells as these can create both only and single
  // option cells amongst their siblings.
  setAllOnlyOptionCells(board);
  // Then set all single option cells as these can only create single option cells
  // amongst their siblings.
  setAllSingleOptionCells(board);
}

function setAllOnlyOptionCells(board) {
  while (board.onlyOptionCells.length > 0 && canBeSolved(board)) {
    const onlyOptionCell = board.onlyOptionCells.shift();
    
    const value = onlyOptionCell.onlyOptionValue;
    setCellValue(onlyOptionCell, value, board);

    const otherOptions = onlyOptionCell.options.filter(o => o !== value && o !== emptySudokuCellValue);
    // Remove this cell's options so it is not considered an only option cell for other options.
    removeCellOptions(onlyOptionCell);
    decrementParentOptionCountsForOtherOptions(onlyOptionCell, otherOptions, board);

    // We are done processing this only option cell.
    onlyOptionCell.isInQueue = false;
  }
}

function decrementParentOptionCountsForOtherOptions(cell, otherOptions, board) {
  const row = board.rows[cell.rowIndex];
  const column = board.columns[cell.columnIndex];
  const group = board.groups[cell.groupIndex];
  
  // One less option for all other options this cell had.
  otherOptions.forEach(otherOption => {
    row.optionCounts[otherOption]--;
    column.optionCounts[otherOption]--;
    group.optionCounts[otherOption]--;

    // Add any new 'only option' cells created by removing this cell's options to the queue.
    if (row.optionCounts[otherOption] === 1) {
      addOnlyOptionCellToQueue(otherOption, row.cells, board);
    }
    if (column.optionCounts[otherOption] === 1) {
      addOnlyOptionCellToQueue(otherOption, column.cells, board);
    }
    if (group.optionCounts[otherOption] === 1) {
      addOnlyOptionCellToQueue(otherOption, group.cells, board);
    }
  });
}

function buildSudokuBoard(sudokuTwoDimensionalArray) {
  const emptySudokuGroups = () => Array(sudokuNumbers.length).fill().map(() => {
    return {
      cells: Array(),
      // 1-indexed array of counts of current options. Ex: If there are 2 cells with the option 1,
      // position 1 will have the value 2.
      optionCounts: Array(sudokuNumbers.length + 1).fill(0)
    }
  } ); 
  const board = {
    rows: emptySudokuGroups(),
    columns: emptySudokuGroups(),
    groups: emptySudokuGroups(),
    singleOptionCells: [],
    onlyOptionCells: [],
    hasCellWithNoOptions: false,
    hasCellThatIsOnlyOptionForMultipleValues: false,
    valuesCount: 0
  }

  sudokuTwoDimensionalArray.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const groupIndex = getGroupIndex(rowIndex, columnIndex);
      const cell = buildCell(value, rowIndex, columnIndex, groupIndex);
      if (value !== emptySudokuCellValue) {
        board.valuesCount++;
      }
      // A cell's row, column and group all reference the same cell object.
      board.rows[rowIndex].cells.push(cell);
      board.columns[columnIndex].cells.push(cell);
      board.groups[groupIndex].cells.push(cell);
    });
  });

  return board;
}

function buildCell(value, rowIndex, columnIndex, groupIndex) {
  return {
    value: value,
    rowIndex: rowIndex,
    columnIndex: columnIndex,
    groupIndex: groupIndex,
    optionsCount: 0,
    // options is 1-indexed: 1 in pos 1, 2 in pos 2, etc.
    options: Array(sudokuNumbers.length + 1).fill(emptySudokuCellValue)
  }
}

function setAllCellOptionsAndAddSingleOptionCellsToQueue(board) {
  board.rows.forEach(row => {
    row.cells.forEach(cell => {
      if (!cellValueIsSet(cell)) {
        setCellOptions(cell, board);
        if (cell.optionsCount === 0) {
          board.hasCellWithNoOptions = true;
        }
        if (cell.optionsCount === 1) {
          board.singleOptionCells.push(cell);
        }
      }
    });
  });
}

function cellValueIsSet(cell) {
  return cell.value !== emptySudokuCellValue;
}

function setCellOptions(cell, sudokuBoard) {
  sudokuNumbers.forEach(number => {
    const cellHasNumber = (cell) => cell.value === number;
    const rowHasNumber = () => sudokuBoard.rows[cell.rowIndex].cells.some(cellHasNumber);
    const columnHasNumber = () => sudokuBoard.columns[cell.columnIndex].cells.some(cellHasNumber);
    const groupHasNumber = () => sudokuBoard.groups[cell.groupIndex].cells.some(cellHasNumber);
    
    // Todo: also make sure that options exclude
    // - When a group has all options for a number in a single row/column, these will not be options
    // for the rest of the row/column. This will need to be updated as we start solving the board
    // and removing options...
    // - Other options? Might be worth the extra work...
    
    const isOption = !rowHasNumber() && !columnHasNumber() && !groupHasNumber();
    if (isOption) {
      addOptionToCell(cell, number, sudokuBoard)
    }
  });
}

function addOptionToCell(cell, option, sudokuBoard) {
  cell.options[option] = option;
  cell.optionsCount++;

  // Update parents
  sudokuBoard.rows[cell.rowIndex].optionCounts[option]++;
  sudokuBoard.columns[cell.columnIndex].optionCounts[option]++;
  sudokuBoard.groups[cell.groupIndex].optionCounts[option]++;
}

function addAllOnlyOptionCellsInBoardToQueue(board) {
  board.rows.forEach(row => addAllOnlyOptionCellsInGroupToQueue(row, board));
  board.columns.forEach(column => addAllOnlyOptionCellsInGroupToQueue(column, board));
  board.groups.forEach(group => addAllOnlyOptionCellsInGroupToQueue(group, board));
}

// Only option cells are cells with more than one option, but are the 
// only option in a row, column or group for some value.
// They are identified by having a collection on each row, column and group
// called optionCounts that tracks how many options there currently are
// for each value. When there is only one option, and the one cell that
// has this option also has other options, this is a only option cell.
function addAllOnlyOptionCellsInGroupToQueue(cellGroup, board) {
  cellGroup.optionCounts.forEach((optionCount, option) => {
    if (optionCount === 1) {
      addOnlyOptionCellToQueue(option, cellGroup.cells, board);
    }
  });
}

function addOnlyOptionCellToQueue(onlyOption, cellGroup, board) {
  // Find the one cell among this cell group that has this option.
  const onlyOptionCell = cellGroup.find(cell => cell.options && cell.options.includes(onlyOption));

  const isAlsoASingleOptionCell = onlyOptionCell.optionsCount === 1;

  // Single option cells are handled elsewhere.
  if (!isAlsoASingleOptionCell) {
    if (onlyOptionCell.isInQueue) {
      // If is already in the queue and its onlyOptionValue is equal to onlyOption, the cell is an
      // only option for 2 or more of its row, column or group. No need to add it again.
      const isOnlyOptionForMultipleValues = onlyOptionCell.onlyOptionValue !== onlyOption;
      if (isOnlyOptionForMultipleValues) {
        // Board can not be solved.
        board.hasCellThatIsOnlyOptionForMultipleValues = true;
      }
    } else {
      // Track the value this cell should be set to.
      onlyOptionCell.onlyOptionValue = onlyOption;
      onlyOptionCell.isInQueue = true;
      board.onlyOptionCells.push(onlyOptionCell);
    }
  }
}

function setAllSingleOptionCells(board) {
  while (board.singleOptionCells.length > 0 && canBeSolved(board)) {
    const singleOptionCell = board.singleOptionCells.shift(); 
    // Find this cell's one option
    const value = singleOptionCell.options.find(option => option !== emptySudokuCellValue);
    setCellValue(singleOptionCell, value, board);
    removeCellOptions(singleOptionCell);
  }
}

function removeCellOptions(cell) {
  cell.options = null;
  cell.optionsCount = 0;
}
 
function setCellValue(cell, value, board) {
  cell.value = value;
  board.valuesCount++;
  removeOptionFromSiblingCells(cell, value, board);
  removeOptionFromParents(cell, value, board);
}

function sudokuBoardToTwoDimensionalArray(sudokuBoard) {
  const array = [];
  sudokuBoard.rows.forEach(row => {
    const inner = [];
    row.cells.forEach(cell => {
      inner.push(cell.value);
    })
    array.push(inner);
  });
  return array;
}

function removeOptionFromSiblingCells(cell, option, board) {
  const siblingCells = getUniqueSiblingCellsWithOptions(cell, board);
  siblingCells.forEach(siblingCell => {
    const siblingCellHasOption = siblingCell.options[option] !== emptySudokuCellValue;
    if (siblingCellHasOption) {
      siblingCell.options[option] = emptySudokuCellValue;
      siblingCell.optionsCount--;
      if (siblingCell.optionsCount === 1) {
        board.singleOptionCells.push(siblingCell);
      }
      if (siblingCell.optionsCount === 0) {
        board.hasCellWithNoOptions = true;
      }
    }
  });
}

function removeOptionFromParents(cell, option, board) {
  board.rows[cell.rowIndex].optionCounts[option] = 0;
  board.columns[cell.columnIndex].optionCounts[option] = 0;
  board.groups[cell.groupIndex].optionCounts[option] = 0;
}

function getUniqueSiblingCellsWithOptions(cell, board) {
  const rowSiblings = getRowSiblingsWithOptions(cell, board);
  const columnSiblings = getColumnSiblingsWithOptions(cell, board);
  const groupSiblingsNotInRowOrColumn = getGroupSiblingsWithOptions(cell, board)
    .filter(c => c.rowIndex !== cell.rowIndex && c.columnIndex !== cell.columnIndex);

  return [...rowSiblings, ...columnSiblings, ...groupSiblingsNotInRowOrColumn];
}

function getRowSiblingsWithOptions(cell, board) {
  return board.rows[cell.rowIndex].cells.filter(siblingWithOptions(cell));
}

function getColumnSiblingsWithOptions(cell, board) {
  return board.columns[cell.columnIndex].cells.filter(siblingWithOptions(cell));
}

function getGroupSiblingsWithOptions(cell, board) {
  return board.groups[cell.groupIndex].cells.filter(siblingWithOptions(cell));
}

function siblingWithOptions(cell) {
  return (c) => c !== cell && c.options;
}

// 3 x 3 cell groups are 0 indexed, left to right, top to bottom
// 0, 1, 2
// 3, 4, 5
// 6, 7, 8
function getGroupIndex(rowIndex, columnIndex) {
  const rowGroupIndexes = [0, 0, 0, 3, 3, 3, 6, 6, 6];
  const columnGroupOffsets = [0, 0, 0, 1, 1, 1, 2, 2, 2]
  const rowGroupIndex = rowGroupIndexes[rowIndex];
  const columnGroupOffset = columnGroupOffsets[columnIndex];

  return rowGroupIndex + columnGroupOffset;
}

export { solveSudoku }

import { sudokuNumbers, emptySudokuCellValue, deepClone } from "./sudokuUtils";