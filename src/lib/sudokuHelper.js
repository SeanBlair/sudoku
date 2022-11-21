import { generateSolvedSudoku} from './sudokuGenerator';
import {  getRandomInt, getEmptySudokuOptions, deepClone } from './sudokuUtils';

// Should explain why is a collection of groups instead of a collection of rows, 
// as this is unexpected.
export function getInitialSudokuBoard() {
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
  
  const cell = emptySudokuCell();
  cell.row = row;
  cell.column = column;
  if (includeValue) {
    cell.value = getSudokuValue(solvedSudoku, row, column);
    cell.isLocked = true;
  }

  return cell;
}

function emptySudokuCell() {
  return {
    row: 0,
    column: 0,
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
    selectedCell.options = getEmptySudokuOptions();
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
        cell.options[optionIndex] = '';
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

export function cloneSelectedCell(sudokuCells) {
  // Todo: Looks like this is repeated, should extract to a function.
  const selectedCell = sudokuCells.flat().find(c => c.isSelected);

  return selectedCell ? deepClone(selectedCell) : emptySudokuCell();
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

export function isValid(sudoku) {
  return allRowsHaveUniqeValues(sudoku)
    && allColumnsHaveUniqueValues(sudoku)
    && allGroupsHaveUniqueValues(sudoku);
}

function allRowsHaveUniqeValues(sudoku) {
  const flatSudoku = sudoku.flat();
  for (let row = 1; row <= 9; row++) {
    const rowValues = flatSudoku
      .filter(c => c.row === row && c.value > 0)
      .map(c => c.value);
    if (new Set(rowValues).size !== rowValues.length) {
      return false;
    }  
  }
  return true;
}

function allColumnsHaveUniqueValues(sudoku) {
  const flatSudoku = sudoku.flat();
  for (let column = 1; column <= 9; column++) {
    const columnValues = flatSudoku
      .filter(c => c.column === column && c.value > 0)
      .map(c => c.value);
    if (new Set(columnValues).size !== columnValues.length) {
      return false;
    }  
  }
  return true;
}

function allGroupsHaveUniqueValues(sudoku) {
  sudoku.forEach(group => {
    const groupValues = group.filter(c => c.value > 0);
    if (new Set(groupValues).size !== groupValues.length) {
      return false;
    }
  })
  return true;
}
