export const sudokuNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function getInitialSudokuCells() {
  const cells = Array();
  for (let row = 1; row <= sudokuNumbers.length; row++) {
    for (let column = 1; column <= sudokuNumbers.length; column++) {
      cells.push({
        column: column,
        row: row,
        value: '',
        isSelected: false,
        isSiblingSelected: false,
        possibleNumbers: Array(9).fill('')
      });
    }
  }
  return cells;
}

export function isSiblingSelected(cell, selectedColumn, selectedRow) {
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
