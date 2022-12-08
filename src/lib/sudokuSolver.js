
// todo: these global variables are a bit of a code smell...
// how about storing this on the sudokuBoard??

// Global flag used to indicate when a cell with no options is found.
let boardHasCellWithNoOptions = false;

// Global flag used to indicate when a cell which is the only option for multiple values is found.
let boardHasCellThatIsOnlyOptionForMultipleValues = false;

function boardCanBeSolved() {
  return !boardHasCellWithNoOptions && !boardHasCellThatIsOnlyOptionForMultipleValues;
}

function resetCanBeSolvedFlags() {
  boardHasCellWithNoOptions = false;
  boardHasCellThatIsOnlyOptionForMultipleValues = false;
}

// Instead of brute forcing like solveSudoku() (in sudokuGenerator.js), attempts to decrease the time to
// solve by minimizing backtracking.
// This is done by:
// - Identifying 'only option' cells and setting them instead of only 'single option' cells.
// - Set each cell's options once and maintain them as they change instead of recomputing
// each time we set a cell's value.
// - Only check sibling cells when a cell's value or options change instead of the full board.
// - Cache values in arrays instead of continually searching for them.
function solveSudokuFaster(sudokuTwoDimensionalArray) {

  // Get cell options should be very thorough, only return options that are known to be valid.
  // At some point we might want to review each cell's options, for example: when a group
  // has all options for a number in a single row or column, this option is not valid for any other
  // cell in the same row/column in other groups.

  // Todo: should we store these on the sudokuBoard?
  const singleOptionCells = [];
  const onlyOptionCells = [];

  let sudokuBoard = buildSudokuBoard(sudokuTwoDimensionalArray);

  resetCanBeSolvedFlags();

  setAllCellOptionsAndAddSingleOptionCellsToQueue(sudokuBoard, singleOptionCells);

  addAllOnlyOptionCellsInBoardToQueue(sudokuBoard, onlyOptionCells);

  setValuesOfAllKnownCells(sudokuBoard, onlyOptionCells, singleOptionCells);

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

  while (!isSolved(sudokuBoard)) {
    if (!boardCanBeSolved()) {
      if (boardSnapshots.length > 0) {
        backtrack(sudokuBoard, boardSnapshots);
      } else {
        // Can't solve this sudoku
        break;
      }
    } 
    const nextCellToTry = getNextCellToTry();
    const nextOptionToTry = getAndRemoveNextOptionToTry(nextCellToTry)
    if (nextCellToTry.options.length > 0) {
      takeSnapshot(sudokuBoard, boardSnapshots);
    }
    addNextGuessToQueue(nextCellToTry, nextOptionToTry, sudokuBoard);
    setValuesOfAllKnownCells(sudokuBoard);
  }

  return sudokuBoardToTwoDimensionalArray(sudokuBoard);
}

function setNextOptionToTry(nextCell, nextOption, sudokuBoard) {
  // How about, if the cell has no more options, add it to the singleOptionCells queue,
  // otherwise add it to the onlyOptionCells queue.
  // then call setValuesOfAllKnownCells
}

function getAndRemoveNextOptionToTry(cell) {
  // find best next option to try among the cell's options.
  // remove from cell and return.
}

function getNextCellToGuess(sudokuBoard) {
  // We need to find the cell with least options.
  // return null if no more cells with options.
}

function isSolved(sudokuBoard) {
  // How about adding a field called setCellCount?
  // if is 81, solved, otherwise not.
}

// Sets the values of all known cells in the queues, as well as of any sibling cells whose
// values become known.
function setValuesOfAllKnownCells(sudokuBoard, onlyOptionCells, singleOptionCells) {
  // First set all only option cells as these can create both only and single
  // option cells amongst their siblings.
  setAllOnlyOptionCells(sudokuBoard, onlyOptionCells, singleOptionCells);
  // Then set all single option cells as these can only create single option cells
  // amongst their siblings.
  setAllSingleOptionCells(sudokuBoard, singleOptionCells);
}

function setAllOnlyOptionCells(sudokuBoard, onlyOptionCells, singleOptionCells) {
  while (onlyOptionCells.length > 0 && boardCanBeSolved()) {
    const onlyOptionCell = onlyOptionCells.shift();
    
    const value = onlyOptionCell.onlyOptionValue;
    setCellValue(onlyOptionCell, value, sudokuBoard, singleOptionCells);

    const otherOptions = onlyOptionCell.options.filter(o => o !== value && o !== emptySudokuCellValue);
    // Remove this cell's options so it is not considered an only option cell for other options.
    removeCellOptions(onlyOptionCell);
    decrementParentOptionCountsForOtherOptions(onlyOptionCell, otherOptions, sudokuBoard, onlyOptionCells);

    // We are done processing this only option cell.
    onlyOptionCell.isInQueue = false;
  }
}

function decrementParentOptionCountsForOtherOptions(cell, otherOptions, sudokuBoard, onlyOptionCells) {
  const row = sudokuBoard.rows[cell.rowIndex];
  const column = sudokuBoard.columns[cell.columnIndex];
  const group = sudokuBoard.groups[cell.groupIndex];
  
  // One less option for all other options this cell had.
  otherOptions.forEach(otherOption => {
    row.optionCounts[otherOption]--;
    column.optionCounts[otherOption]--;
    group.optionCounts[otherOption]--;

    // Add any new 'only option' cells created by removing this cell's options to the queue.
    if (row.optionCounts[otherOption] === 1) {
      addOnlyOptionCellToQueue(otherOption, row.cells, onlyOptionCells);
    }
    if (column.optionCounts[otherOption] === 1) {
      addOnlyOptionCellToQueue(otherOption, column.cells, onlyOptionCells);
    }
    if (group.optionCounts[otherOption] === 1) {
      addOnlyOptionCellToQueue(otherOption, group.cells, onlyOptionCells);
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
  }

  sudokuTwoDimensionalArray.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const groupIndex = getGroupIndex(rowIndex, columnIndex);
      const cell = {
        value: value,
        rowIndex: rowIndex,
        columnIndex: columnIndex,
        groupIndex: groupIndex
      }
      board.rows[rowIndex].cells.push(cell);
      board.columns[columnIndex].cells.push(cell);
      board.groups[groupIndex].cells.push(cell);
    });
  });

  return board;
}

function setAllCellOptionsAndAddSingleOptionCellsToQueue(sudokuBoard, singleOptionCells) {
  sudokuBoard.rows.forEach(row => {
    row.cells.forEach(cell => {
      if (!cellValueIsSet(cell)) {
        setCellOptions(cell, sudokuBoard);
        if (cell.optionsCount === 0) {
          boardHasCellWithNoOptions = true;
        }
        if (cell.optionsCount === 1) {
          singleOptionCells.push(cell);
        }
      }
    });
  });
}

function cellValueIsSet(cell) {
  return cell.value !== emptySudokuCellValue;
}

function setCellOptions(cell, sudokuBoard) {
  // Cell options is 1-indexed: 1 in pos 1, 2 in pos 2, etc.
  cell.options = Array(sudokuNumbers.length + 1).fill(emptySudokuCellValue);
  cell.optionsCount = 0;

  sudokuNumbers.forEach(number => {
    const cellHasNumber = (cell) => cell.value === number;
    const rowHasNumber = () => sudokuBoard.rows[cell.rowIndex].cells.some(cellHasNumber);
    const columnHasNumber = () => sudokuBoard.columns[cell.columnIndex].cells.some(cellHasNumber);
    const groupHasNumber = () => sudokuBoard.groups[cell.groupIndex].cells.some(cellHasNumber);
    // Todo: also make sure that options exclude
    // - When a group has all options for a number in a single row/column, these will not be options
    // for the rest of the row/column.
    // - Any other options, is worth the extra work.
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

function addAllOnlyOptionCellsInBoardToQueue(sudokuBoard, onlyOptionCells) {
  sudokuBoard.rows.forEach(row => addAllOnlyOptionCellsInGroupToQueue(row, onlyOptionCells));
  sudokuBoard.columns.forEach(column => addAllOnlyOptionCellsInGroupToQueue(column, onlyOptionCells));
  sudokuBoard.groups.forEach(group => addAllOnlyOptionCellsInGroupToQueue(group, onlyOptionCells));
}

// Only option cells are cells with more than one option, but are the 
// only option in a row, column or group for some value.
// They are identified by having a collection on each row, column and group
// called optionCounts that tracks how many options there currently are
// for each value. When there is only one option, and the one cell that
// has this option also has other options, this is a only option cell.
function addAllOnlyOptionCellsInGroupToQueue(cellGroup, onlyOptionCells) {
  cellGroup.optionCounts.forEach((optionCount, option) => {
    if (optionCount === 1) {
      addOnlyOptionCellToQueue(option, cellGroup.cells, onlyOptionCells);
    }
  });
}

function addOnlyOptionCellToQueue(onlyOption, cellGroup, onlyOptionCells) {
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
        boardHasCellThatIsOnlyOptionForMultipleValues = true;
      }
    } else {
      // Track the value this cell should be set to.
      onlyOptionCell.onlyOptionValue = onlyOption;
      onlyOptionCell.isInQueue = true;
      onlyOptionCells.push(onlyOptionCell);
    }
  }
}

function setAllSingleOptionCells(sudokuBoard, singleOptionCells) {
  while (singleOptionCells.length > 0 && boardCanBeSolved()) {
    const singleOptionCell = singleOptionCells.shift(); 
    // Find this cell's one option
    const value = singleOptionCell.options.find(option => option !== emptySudokuCellValue);
    setCellValue(singleOptionCell, value, sudokuBoard, singleOptionCells);
    removeCellOptions(singleOptionCell);
  }
}

function removeCellOptions(cell) {
  cell.options = null;
  cell.optionsCount = 0;
}
 
function setCellValue(cell, value, sudokuBoard, singleOptionCells) {
  cell.value = value;
  removeOptionFromSiblingCells(cell, value, sudokuBoard, singleOptionCells);
  removeOptionFromParents(cell, value, sudokuBoard);
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

function removeOptionFromSiblingCells(cell, option, sudokuBoard, singleOptionCells) {
  const siblingCells = getUniqueSiblingCellsWithOptions(cell, sudokuBoard);
  siblingCells.forEach(siblingCell => {
    const siblingCellHasOption = siblingCell.options[option] !== emptySudokuCellValue;
    if (siblingCellHasOption) {
      siblingCell.options[option] = emptySudokuCellValue;
      siblingCell.optionsCount--;
      if (siblingCell.optionsCount === 1) {
        singleOptionCells.push(siblingCell);
      }
      if (siblingCell.optionsCount === 0) {
        boardHasCellWithNoOptions = true;
      }
    }
  });
}

function removeOptionFromParents(cell, option, sudokuBoard) {
  sudokuBoard.rows[cell.rowIndex].optionCounts[option] = 0;
  sudokuBoard.columns[cell.columnIndex].optionCounts[option] = 0;
  sudokuBoard.groups[cell.groupIndex].optionCounts[option] = 0;
}

function getUniqueSiblingCellsWithOptions(cell, sudokuBoard) {
  const rowSiblings = getRowSiblingsWithOptions(cell, sudokuBoard);
  const columnSiblings = getColumnSiblingsWithOptions(cell, sudokuBoard);
  const groupSiblingsNotInRowOrColumn = getGroupSiblingsWithOptions(cell, sudokuBoard)
    .filter(c => c.rowIndex !== cell.rowIndex && c.columnIndex !== cell.columnIndex);

  return [...rowSiblings, ...columnSiblings, ...groupSiblingsNotInRowOrColumn];
}

function getRowSiblingsWithOptions(cell, sudokuBoard) {
  return sudokuBoard.rows[cell.rowIndex].cells.filter(siblingWithOptions(cell));
}

function getColumnSiblingsWithOptions(cell, sudokuBoard) {
  return sudokuBoard.columns[cell.columnIndex].cells.filter(siblingWithOptions(cell));
}

function getGroupSiblingsWithOptions(cell, sudokuBoard) {
  return sudokuBoard.groups[cell.groupIndex].cells.filter(siblingWithOptions(cell));
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

export { solveSudokuFaster }

import { isSolved } from "./sudokuGenerator";
import { sudokuNumbers, emptySudokuCellValue, deepClone } from "./sudokuUtils";