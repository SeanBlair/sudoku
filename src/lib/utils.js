import { generateSolvedSudoku, getRandomInt } from './sudokuGenerator.js';

export const sudokuNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function getEmptySudokuOptions() {
  return Array(9).fill('');
} 

export function getInitialSudokuCells() {
  const groupIndexes = [[1,2,3],[4,5,6],[7,8,9]];
  const rowGroups = groupIndexes;
  const columnGroups = groupIndexes;
  const groupedSudokuCells = [];

  const solvedSudoku = generateSolvedSudoku();

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
    possibleNumbers: getEmptySudokuOptions(),
    isLocked: includeValue
  }
}
 
function getSudokuValue(sudoku, row, column) {
  // Sudoku is 0 indexed, row & column are 1 indexed...
  return sudoku[row - 1][column - 1];
}

export function updateSelectedCell(cells, column, row) {
  return cells.map(cellGroup => {
    return cellGroup.map(cell => {
      cell.isSelected = cell.column === column && cell.row === row;
      cell.isSiblingSelected = isSiblingSelected(cell, column, row);
      return cell;
    });
  });
}

function isSiblingSelected(cell, selectedColumn, selectedRow) {
  const isSelectedCell = cell.column === selectedColumn && cell.row === selectedRow;
  if (isSelectedCell) return false;

  const isSelectedColumn = cell.column === selectedColumn;
  const isSelectedRow = cell.row === selectedRow;

  if (isSelectedColumn || isSelectedRow) return true;

  return isInSelectedGroup(cell, selectedColumn, selectedRow);
}

function isInSelectedGroup(cell, selectedColumn, selectedRow) {
  const groups = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const selectedColumnGroup = groups.find(group => group.includes(selectedColumn));
  const selectedRowGroup = groups.find(group => group.includes(selectedRow));

  return selectedColumnGroup.includes(cell.column) && selectedRowGroup.includes(cell.row);
}

// Todo: clean this up...
export function setNumber(cells, number, optionsMode) {
  // Need to either set a cell's value or update its possible numbers depending on optionsMode
  // When setting a cell's value, we need to also remove this value from other relevant
  // cells' possible numbers. Relevant: same row, column or group.
  // We need to
  // - find the one 'selected' cell.
  // - if locked return.
  // - if options mode, update the possible numbers
  // - if not options mode
  // - - update its value
  // - - find all relevant cells and ensure this value is not in its possible numbers.

  // Algo:
  // - find the selected cell
  // - - if locked return
  // - - if options mode update options (either add or remove)
  // - - else
  // - - - set the value
  // - - - empty the possible numbers
  // - - - iterate through the board and ensure option removed from relavant cells.

  return cells.map(cellGroup => {
    return cellGroup.map(cell => {
      if (cell.isSelected) {
        if (!cell.isLocked) {
          if (optionsMode) {
            const index = number - 1;
            const possibleNumberAlreadySet = cell.possibleNumbers[index];
            if (possibleNumberAlreadySet) {
              // Remove from possible numbers
              cell.possibleNumbers[index] = '';
            }
            else {
              // Add to possible numbers
              cell.possibleNumbers[index] = number;
            }
          }
          else {
            // Set value as we are not in options mode
            cell.value = number;
            // Reset options since we have a value.
            cell.possibleNumbers = getEmptySudokuOptions();
          }
        }
      }
      return cell;
    });
  });
}

export function deepClone(array) {
  return JSON.parse(JSON.stringify(array));
}

export function cloneSelectedCell(sudokuCells) {
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
