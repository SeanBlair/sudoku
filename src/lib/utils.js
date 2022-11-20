// Todo: utils is kind of vague...???

import { generateSolvedSudoku, getRandomInt } from './sudokuGenerator.js';

export const sudokuNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function getEmptySudokuOptions() {
  return Array(9).fill('');
} 

// Todo: this name is too specific.
// Should explain why is a collection of groups instead of a collection of rows, 
// as this is unexpected.
export function getInitialSudokuCells() {
  const groupIndexes = [[1,2,3],[4,5,6],[7,8,9]];
  const rowGroups = groupIndexes;
  const columnGroups = groupIndexes;

  const solvedSudoku = generateSolvedSudoku();
  const groupedSudokuCells = [];

  rowGroups.forEach(rowGroup => {
    columnGroups.forEach(columnGroup => {
      const cellGroup = [];
      rowGroup.forEach(r => {
        columnGroup.forEach(c => {
          cellGroup.push(initialSudokuCell(solvedSudoku, r, c));
        });
      });
      groupedSudokuCells.push(cellGroup);
    })
  })
  return groupedSudokuCells;
}

function initialSudokuCell(solvedSudoku, row, column) {
  // Display ~33% of values.
  const includeValue = getRandomInt(0, 3) === 0;

  return {
    row: row,
    column: column,
    value: includeValue ? getSudokuValue(solvedSudoku, row, column) : '',
    isSelected: false,
    isSiblingSelected: false,
    options: getEmptySudokuOptions(),
    isLocked: includeValue
  }
}
 
function getSudokuValue(sudoku, row, column) {
  // Sudoku is 0 indexed, row & column are 1 indexed...
  return sudoku[row - 1][column - 1];
}

export function updateSelectedCell(cells, row, column) {
  return cells.map(cellGroup => {
    return cellGroup.map(cell => {
      cell.isSelected = cell.row === row && cell.column === column;
      cell.isSiblingSelected = isSiblingSelected(cell, row, column);
      return cell;
    });
  });
}

function isSiblingSelected(cell, selectedRow, selectedColumn) {
  const isSelectedCell = cell.row === selectedRow && cell.column === selectedColumn;
  if (isSelectedCell) return false;

  const isSelectedRow = cell.row === selectedRow;
  const isSelectedColumn = cell.column === selectedColumn;

  if (isSelectedRow || isSelectedColumn) return true;

  return isInSelectedGroup(cell, selectedRow, selectedColumn);
}

// Todo: selected is too specific and confusing here. Hard to call in a different context.
function isInSelectedGroup(cell, selectedRow, selectedColumn) {
  const groups = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const selectedRowGroup = groups.find(group => group.includes(selectedRow));
  const selectedColumnGroup = groups.find(group => group.includes(selectedColumn));

  return selectedRowGroup.includes(cell.row) && selectedColumnGroup.includes(cell.column);
}

export function setNumber(sudoku, number, optionsMode) {
  const selectedCell = sudoku.flat().find(c => c.isSelected);
  if (!selectedCell || selectedCell.isLocked) {
    return;
  }
  if (optionsMode) {
    updateCellOptions(selectedCell, number);
  } else {
    selectedCell.value = number;
    // Reset options since we have a value.
    selectedCell.possibleNumbers = getEmptySudokuOptions();
    // This number is no longer a valid option for siblings
    removeOptionFromSiblings(sudoku, selectedCell.row, selectedCell.column, number);
  }
  return sudoku;
}

function removeOptionFromSiblings(sudoku, row, column, option) {
  const optionIndex = option - 1;
  sudoku.forEach(group => {
    group.forEach(cell => {
      if (isSibling(cell, row, column)) {
        cell.possibleNumbers[optionIndex] = '';
      }
    });
  });
}

// Todo: this is a little confusing: who is the sibling? the cell? What are the row and columns??
function isSibling(cell, row, column) {
  if (cell.row === row && cell.column === column) {
    return false;
  }
  const inSameRow = cell.row === row;
  const inSameColumn = cell.column === column;
  const inSameGroup = () => isInSelectedGroup(cell, row, column)

  return inSameRow || inSameColumn || inSameGroup();
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

export function deepClone(object) {
  return JSON.parse(JSON.stringify(object));
}

export function cloneSelectedCell(sudokuCells) {
  // Todo: Looks like this is repeated, should extract to a function.
  const selectedCell = sudokuCells.flat().find(c => c.isSelected);

  return selectedCell ? deepClone(selectedCell) : null;
}

export function getRemainingNumbers(sudoku) {
  const remainingNumbers = Array(9);

  for (let number = 1; number <= 9; number++) {
    remainingNumbers[number - 1] = getRemaining(sudoku, number);
  }
  return remainingNumbers;
}

function getRemaining(sudoku, number) {
  let remaining = 9;
  sudoku.forEach(group => {
    group.forEach(cell => {
      if (cell.value === number) {
        remaining--;
      }
    });
  });
  return remaining;
}
