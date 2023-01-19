// Holds functions called by Sudoku.svelte that are not directly related with
// state management or UI stuff.

import { getEmptySudokuOptions, deepClone, allValuesAreUnique, 
  emptySudokuCellValue, empty, sudokuNumbers } from './sudoku/utils';

// Returns a collection of 'square groups' that represent a 9 X 9 sudoku board.
// They are grouped in 'squares' (instead of rows or columns) as each square
// is bordered by lines and it is simpler to implement the needed HTML by iterating
// through groups.
export function getInitialSudokuBoard(initialSudokuValues) {
  const groupIndexes = [[1,2,3],[4,5,6],[7,8,9]];
  const rowGroups = groupIndexes;
  const columnGroups = groupIndexes;

  const groupedSudokuCells = [];

  rowGroups.forEach(rowGroup => {
    columnGroups.forEach(columnGroup => {
      const squareGroup = [];
      rowGroup.forEach(r => {
        columnGroup.forEach(c => {
          squareGroup.push(initialSudokuCell(initialSudokuValues, r, c));
        });
      });
      groupedSudokuCells.push(squareGroup);
    })
  })
  return groupedSudokuCells;
}

export function isValidBoard(sudokuBoard) {
  return allRowsHaveUniqeValues(sudokuBoard)
    && allColumnsHaveUniqueValues(sudokuBoard)
    && allGroupsHaveUniqueValues(sudokuBoard);
}

export function getRemainingNumbersCount(sudokuBoard) {
  // Count of all remaining numbers indexed by the number.
  const remainingNumbersCount = Array(sudokuNumbers.length + 1);

  for (let number = 1; number <= 9; number++) {
    remainingNumbersCount[number] = getRemaining(sudokuBoard, number);
  }
  return remainingNumbersCount;
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

export function cloneSelectedCell(sudokuBoard) {
  const selectedCell = getSelectedCell(sudokuBoard);

  return selectedCell ? deepClone(selectedCell) : emptySudokuCell(0, 0);
}

function initialSudokuCell(sudokuValues, row, column) {
  const cell = emptySudokuCell(row, column);
  const cellValue = getSudokuValue(sudokuValues, row, column);
  if (cellValue !== emptySudokuCellValue) {
    cell.value = cellValue;
    cell.isLocked = true;
  }
  return cell;
}

function emptySudokuCell(row, column) {
  return {
    row: row,
    column: column,
    value: empty,
    isSelected: false,
    isSiblingSelected: false,
    options: getEmptySudokuOptions(),
    isLocked: false
  }
}

function getSudokuValue(solvedSudoku, row, column) {
  return solvedSudoku[oneIndexedToZeroIndexed(row)][oneIndexedToZeroIndexed(column)];
}

// Returns true if the given cell has a 'sibling' that is selected.
// A sibling is a different cell in the same row, column or square as the given cell.
function areSiblings(cell, otherCell) {
  const areSameCell = cell.row === otherCell.row && cell.column === otherCell.column;
  if (areSameCell) return false;

  const areInSamRow = cell.row === otherCell.row;
  const areInSameColumn = cell.column === otherCell.column;

  return areInSamRow || areInSameColumn || areInSameSquare(cell, otherCell);
}

function areInSameSquare(cell, otherCell) {
  const squareIndexes = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

  const cellRowSquareIndexes = squareIndexes.find(group => group.includes(cell.row));
  const cellColumnSquareIndexes = squareIndexes.find(group => group.includes(cell.column));

  return cellRowSquareIndexes.includes(otherCell.row) && cellColumnSquareIndexes.includes(otherCell.column);
}

function removeOptionFromSiblingsOfSelectedCell(sudokuBoard, selectedCell, option) {
  sudokuBoard.forEach(group => {
    group.forEach(cell => {
      if (areSiblings(cell, selectedCell)) {
        cell.options[oneIndexedToZeroIndexed(option)] = empty;
      }
    });
  });
}

function updateCellOptions(cell, option) {
  const optionIndex = oneIndexedToZeroIndexed(option);
  const optionAlreadySet = cell.options[optionIndex];
  if (optionAlreadySet) {
    // Remove from options
    cell.options[optionIndex] = empty;
  }
  else {
    // Add to options
    cell.options[optionIndex] = option;
  }
}

function oneIndexedToZeroIndexed(index) {
  return index - 1;
}

function getSelectedCell(sudokuBoard) {
  return sudokuBoard.flat().find(c => c.isSelected);
}

function getRemaining(sudokuBoard, number) {
  let remaining = sudokuNumbers.length;
  sudokuBoard.forEach(group => {
    group.forEach(cell => {
      if (cell.value === number) {
        remaining--;
      }
    });
  });
  return remaining;
}

function allRowsHaveUniqeValues(sudokuBoard) {
  const cells = sudokuBoard.flat();
  for (let row = 1; row <= 9; row++) {
    const rowValues = cells
      .filter(c => c.row === row && c.value !== empty)
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
      .filter(c => c.column === column && c.value !== empty)
      .map(c => c.value);
    if (!allValuesAreUnique(columnValues)) {
      return false;
    }  
  }
  return true;
}

function allGroupsHaveUniqueValues(sudokuBoard) {
  sudokuBoard.forEach(group => {
    const groupValues = group.filter(c => c.value !== empty);
    if (!allValuesAreUnique(groupValues)) {
      return false;
    }
  })
  return true;
}
