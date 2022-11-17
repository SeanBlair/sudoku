export const sudokuNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function getInitialSudokuCells() {
  const groupIndexes = [[1,2,3],[4,5,6],[7,8,9]];
  const rowGroups = groupIndexes;
  const columnGroups = groupIndexes;
  const groupedSudokuCells = [];

  rowGroups.forEach(rowGroup => {
    columnGroups.forEach(columnGroup => {
      const cellGroup = [];
      
      rowGroup.forEach(r => {
        columnGroup.forEach(c => {
          cellGroup.push({
            column: c,
            row: r,
            value: '',
            isSelected: false,
            isSiblingSelected: false,
            possibleNumbers: Array(9).fill('')
          });
        });
      });

      groupedSudokuCells.push(cellGroup);
    })
  })
  return groupedSudokuCells;
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

export function setNumber(cells, number, optionsMode) {
  return cells.map(cellGroup => {
    return cellGroup.map(cell => {
      if (cell.isSelected) {
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
          // Set value as we are not in possible numbers mode
          cell.value = number;
        }
      }
      return cell;
    });
  });
}

export function deepCloneArray(array) {
  return JSON.parse(JSON.stringify(array));
}
