// Holds functions called by Sudoku.svelte that are not directly related with
// state management or UI stuff.

import { generateSolvedSudoku, generateSudoku} from './sudokuGenerator';
import { getRandomInt, getEmptySudokuOptions, deepClone, allValuesAreUnique } from './sudokuUtils';

// Should explain why is a collection of groups instead of a collection of rows, 
// as this is unexpected.
export function getInitialSudokuBoard() {
  const groupIndexes = [[1,2,3],[4,5,6],[7,8,9]];
  const rowGroups = groupIndexes;
  const columnGroups = groupIndexes;

  // const solvedSudoku = generateSolvedSudoku();
  const sudokuValues = generateSudoku();
  const groupedSudokuCells = [];

  rowGroups.forEach(rowGroup => {
    columnGroups.forEach(columnGroup => {
      const cellGroup = [];
      rowGroup.forEach(r => {
        columnGroup.forEach(c => {
          cellGroup.push(initialSudokuCell(sudokuValues, r, c));
        });
      });
      groupedSudokuCells.push(cellGroup);
    })
  })
  return groupedSudokuCells;
}

function initialSudokuCell(sudokuValues, row, column) {
  const cell = emptySudokuCell(row, column);
  const cellValue = getSudokuValue(sudokuValues, row, column);
  if (cellValue !== 0) {
    cell.value = cellValue;
    cell.isLocked = true;
  }
  return cell;
}

function emptySudokuCell(row, column) {
  return {
    row: row,
    column: column,
    value: '',
    isSelected: false,
    isSiblingSelected: false,
    options: getEmptySudokuOptions(),
    isLocked: false
  }
}

function getSudokuValue(solvedSudoku, row, column) {
  // solvedSudoku is 0 indexed, row & column are 1 indexed...
  return solvedSudoku[row - 1][column - 1];
}

export function updateSelectedCell(sudokuBoard, selectedRow, selectedColumn) {
  return sudokuBoard.map(cellGroup => {
    return cellGroup.map(cell => {
      cell.isSelected = cell.row === selectedRow && cell.column === selectedColumn;
      cell.isSiblingSelected = areSiblings(cell, emptySudokuCell(selectedRow, selectedColumn));
      return cell;
    });
  });
}

// Returns true if the given cell has a 'sibling' that is selected.
// A sibling is a different cell in the same row, column or group as the given cell.
function areSiblings(cell, otherCell) {
  const areSameCell = cell.row === otherCell.row && cell.column === otherCell.column;
  if (areSameCell) return false;

  const areInSamRow = cell.row === otherCell.row;
  const areInSameColumn = cell.column === otherCell.column;

  return areInSamRow || areInSameColumn || areInSameGroup(cell, otherCell);
}

function areInSameGroup(cell, otherCell) {
  const groups = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

  const cellRowGroup = groups.find(group => group.includes(cell.row));
  const cellColumnGroup = groups.find(group => group.includes(cell.column));

  return cellRowGroup.includes(otherCell.row) && cellColumnGroup.includes(otherCell.column);
}

export function setSelectedCellValue(sudokuBoard, value, optionsMode) {
  const selectedCell = getSelectedCell(sudokuBoard);
  if (!selectedCell || selectedCell.isLocked) {
    return;
  }
  if (optionsMode) {
    updateCellOptions(selectedCell, value);
  } else {
    selectedCell.value = value;
    // Reset cell's options since it now has a value.
    selectedCell.options = getEmptySudokuOptions();
    // This value is no longer a valid option for siblings
    removeOptionFromSiblingsOfSelectedCell(sudokuBoard, selectedCell, value);
  }
  return sudokuBoard;
}

function removeOptionFromSiblingsOfSelectedCell(sudokuBoard, selectedCell, option) {
  const optionIndex = option - 1;
  sudokuBoard.forEach(group => {
    group.forEach(cell => {
      if (areSiblings(cell, selectedCell)) {
        cell.options[optionIndex] = '';
      }
    });
  });
}

function updateCellOptions(cell, option) {
  const optionIndex = option - 1;
  const optionAlreadySet = cell.options[optionIndex];
  if (optionAlreadySet) {
    // Remove from options
    cell.options[optionIndex] = '';
  }
  else {
    // Add to options
    cell.options[optionIndex] = option;
  }
}

export function cloneSelectedCell(sudokuBoard) {
  const selectedCell = getSelectedCell(sudokuBoard);

  return selectedCell ? deepClone(selectedCell) : emptySudokuCell(0, 0);
}

function getSelectedCell(sudokuBoard) {
  return sudokuBoard.flat().find(c => c.isSelected);
}

export function getRemainingNumbersCount(sudokuBoard) {
  // Count of all remaining numbers indexed by the number.
  const remainingNumbersCount = Array(9 + 1);

  for (let number = 1; number <= 9; number++) {
    remainingNumbersCount[number] = getRemaining(sudokuBoard, number);
  }
  return remainingNumbersCount;
}

function getRemaining(sudokuBoard, number) {
  let remaining = 9;
  sudokuBoard.forEach(group => {
    group.forEach(cell => {
      if (cell.value === number) {
        remaining--;
      }
    });
  });
  return remaining;
}

export function isValidBoard(sudokuBoard) {
  return allRowsHaveUniqeValues(sudokuBoard)
    && allColumnsHaveUniqueValues(sudokuBoard)
    && allGroupsHaveUniqueValues(sudokuBoard);
}

function allRowsHaveUniqeValues(sudokuBoard) {
  const cells = sudokuBoard.flat();
  for (let row = 1; row <= 9; row++) {
    const rowValues = cells
      .filter(c => c.row === row && c.value > 0)
      .map(c => c.value);
    if (!allValuesAreUnique(rowValues)) {
      return false;
    }  
  }
  return true;
}

function allColumnsHaveUniqueValues(sudokuBoard) {
  const cells = sudokuBoard.flat();
  for (let column = 1; column <= 9; column++) {
    const columnValues = cells
      .filter(c => c.column === column && c.value > 0)
      .map(c => c.value);
    if (!allValuesAreUnique(columnValues)) {
      return false;
    }  
  }
  return true;
}

function allGroupsHaveUniqueValues(sudokuBoard) {
  sudokuBoard.forEach(group => {
    const groupValues = group.filter(c => c.value > 0);
    if (!allValuesAreUnique(groupValues)) {
      return false;
    }
  })
  return true;
}
