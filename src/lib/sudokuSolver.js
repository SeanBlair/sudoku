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
  setAllCellOptionsAndAddKnownCellsToQueues(board);
  setValuesOfAllKnownCells(board);

  if (!isSolved(board)) {
    board = solveBoardByBacktracking(board);
  }

  return sudokuBoardToTwoDimensionalArray(board);
}


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


  // This while loop is for optimizing the next cell to snapshot.
  // Todo: implement.
  // while (!isSolved(board)) {
  //   if (!canBeSolved(board)) {
  //     if (boardSnapshots.length > 0) {
  //       backtrack(board, boardSnapshots);
  //     } else {
  //       // Can't solve this sudoku
  //       break;
  //     }
  //   } 

  //   // We basically have to treat the next cell as a only option cell.
  //   const nextCellToTry = getNextCellToTry();
  //   // We will have at least 2 options on this cell. We need to choose one
  //   // which we will set this cell's value to.
  //   // If there are 2 options, if we backtrack this cell will be a single option cell.
  //   // If there are more than 2 options, if we backtrack this cell will not be a single option cell.
  //   const nextOptionToTry = getAndRemoveNextOptionToTry(nextCellToTry)
  //   if (nextCellToTry.optionsCount > 0) {
  //     takeSnapshot(board, boardSnapshots);
  //   }
  //   addNextGuessToQueue(nextCellToTry, nextOptionToTry, board);
  //   setValuesOfAllKnownCells(board);
  // }

  // No optimization on what cell and which of its options to try next.
  // Simply iterate through the all the board's cells and all the cell options 
  // until find a solution or try all cells and all their options.

  // For each cell in board:
  // If is unset:
  // If no options, backtrack.
  // Grab first option.
  // If cell has more than 1 option remaining, create snapshot excluding first option.
  //  If we have to use this snapshot it is because we have determined that the first option
  //  is not actually a valid option. 
  //  Snapshot should include:
  //    - Current cell's coords (so we know what cell to try the next option).
  //    - The board's current state except for the current cell's first option
  //      - Todo: ensure that the board's state correctly reflects the removal of the first option.
  // 
  // Set the cell's value to the first option.
  //  - Update the board's state accordingly.
  //  - Should likely be done by adding the first option to a queue and call
  //    setValuesOfAllKnownCells.
  //  - Todo: look into how to best implement this.
  //    - Adding it to the only option cells queue might work, but it is not actually an only 
  //      option cell (or is it???). 
  //    - Looks like we will need to call setCellValue()
  //        - Removes this option from sibling cells.
  //            - Identifies new single option cells.
  //            - Identifies cells with no options.
  //        - Updates the parent groups to no longer track option counts for this value.
  //    - Also removeCellOptions()
  //    - Also decrementParentOptionCountsForOtherOptions() to identify new only option cells.
  //    - We will likely have to set the is in queue flag to avoid reprocessing.

  // Call setValuesOfAllKnownCells() to handle any new single/only option cells identified 
  // by setting this cell's value.

function solveBoardByBacktracking(boardToSolve) {
  let board = deepClone(boardToSolve);
  const snapshots = [];

  for (let rowIndex = 0; rowIndex < sudokuNumbers.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < sudokuNumbers.length; columnIndex++) {

      // Process any known cells in queues resulting from setting the previous
      // cell's value. Todo: do we need this? How about calling this at end of previous iteration?
      setValuesOfAllKnownCells(board);


      if (!canBeSolved(board)) {
        if (snapshots.length > 0) {
          const snapshot = snapshots.pop(); 
          board = snapshot.board;
          rowIndex = snapshot.rowIndex;
          columnIndex = snapshot.columnIndex;
        } else {
          // Can't solve this board as we have tried all possible combinations of
          // cell options.
          return board;
        }
      }

      const cell = board.rows[rowIndex].cells[columnIndex];

      if (!cellValueIsSet(cell)) {
        // 3 cases:
        // 1) Cell has more than 1 option.
        //  - Remove first option from cell and board state
        //    - Handle fact that this can result in other cells becoming only option cells in the snapshot:
        //      - Example: cell A and B both have 1 as an option. We remove it from A, and snapshot it, but
        //                 if we need to backtrack, we would now have B being the only option for 1. 
        //    - We might be able to handle this by adding it to the queue in the snapshot. Would require dealing
        //      with it when we pop it, prior to setting the new guess. Unfortunately, this could also result in
        //      finding an unsolveable sudoku and having to pop again. Sort of like a while !isValid, pop snapshot, set all known.
        //    - We could also simply call set all known options prior to adding to the snapshot. This seems like the better option.
        //  - Push snapshot
        //  - Set value, update board state and add any new known cells to queues.
        //    - Any new known cells will get set next iteration (the last one is not required as there are no more unknowns)
        // 2) Cell has 1 option. (only happens after popping a snapshot)
        //  - Set value, update board state and add any new known cells to queues.
        // 3) Cell has 0 option. (I don't think this is possible as zero option cells are not snapshot)
        //  - Probably would have to backtrack if this is possible.

        const cellOptions = cell.options.filter(o => o !== emptySudokuCellValue);

        if (cellOptions.length > 1) {
          // Clone board
          // Find cell
          // Remove first option from the cell.
          // Add any new only option cells to the queue.
          // Set all known options.
          // Add to snapshots.

          // Create snapshot
          const clonedBoard = cloneSudokuBoard(board); // Todo: seems like this is not cloning as expected.
          // looks like the row, column and group all have different cell objects...
          // Deep clone creates new objects instead of reusing the same object everywhere...

          // I think we should actually stop using the same cell in a row, column, group, only/single option collection.
          // Instead we should have a 2d array of cells, and then a collection of row, column and group objects that stores
          // the optionCounts. For the only/single option collections, we could have arrays of objects having rowIndex, columnIndex properties.
          // This way there is no confusing mutating, and we can actually deep clone...........


          
          const clonedCell = clonedBoard.rows[rowIndex].cells[columnIndex];

          // Cell option we are removing from the clone
          const firstOption = cellOptions[0];

          // Remove option from cell
          clonedCell.options[firstOption] = emptySudokuCellValue; // Todo: do we need to set the in queue flag?
          clonedCell.optionsCount--;

          // Remove this option from the cell's groups and add any new only option cells to queue
          decrementGroupsOptionCountForOption(firstOption, clonedCell, clonedBoard);

          // Set values of any new known cells.
          setValuesOfAllKnownCells(clonedBoard);

          snapshots.push({
            board: clonedBoard,
            rowIndex: rowIndex,
            columnIndex, columnIndex
          });
        } else if (cellOptions.length === 0) {
          // Todo: is this even possible???
          // If is possible we probably have to backtrack...
          // And skip the next block!
        }

        const value = cellOptions[0];
        setCellValue(cell, value, board);

        const otherOptions = cell.options.filter(o => o !== value && o !== emptySudokuCellValue);

        // Todo: there is some repeated code here, might want to refactor to a single function to ensure
        // we can change the logic in one place if required.

        // Remove this cell's options so it is not considered an only option cell for other options.
        removeCellOptions(cell);
        
        // Set the in queue flag (todo: this is smelly, any way to avoid this flag? Or simplify it? Maybe rename it?)
        cell.isInQueue = true;

        decrementGroupsOptionsCountsForOtherOptionsOfCellGettingSet(cell, otherOptions, board);

        // We are done processing this only option cell.
        cell.isInQueue = false;



    // Will set any siblings and their siblings in next iteration. Todo: how about setting them here?? Might be easier to reason about.??


        // When this is initially called an unset cell will have at least 2 
        // options (otherwise it would be set by setValuesOfAllKnownCells).

        // However, in this backtracking logic, it is valid for a cell to only have one option,
        // as we already tried its other options and had to backtrack.
        // Additionally, it is also valid for a cell to have no options, as this is when we know
        // we need to backtrack.

        // A bit of a chicken and egg scenario:
        // We need to set a value to see if it is valid. It is valid if we never have to try its sibling
        // values by backtracking. When we set a value, its siblings get updated with any new known cells.



        // Basic algorithmn
        // - Create snapshot if required.
        // - Set cell to next option, update all state.
        // - Call setValuesOfAllKnownCells() to handle any new single/only option cells identified 
        // - if can't be solved backtrack.
        // - if can't backtrack return board.

        // todo:
        // - handle happy path: either of 2 options result in a solved sudoku (no backtracking needed)
        // - handle backtracking: first option is wrong, second is right
        //  - 1) Identified as a side-effect of setting a cell.
        //  - 2) Identified after running out of options for a next cell.
      }
    }
  }

  return board;
}

function setAllCellOptionsAndAddKnownCellsToQueues(board) {
  setAllCellOptionsAndHandleCellsWithLessThanTwoOptions(board);
  addAllOnlyOptionCellsToQueue(board);
}

function addNextGuessToQueue(cell, value, board) {
  
}

function takeSnapshot(board, snapshots) {

}

function getNextCellToTry() {
  // Intended to return the next cell with multiple options to choose a
  // a value to set it to and try and solve the sudoku.

  // Ideally this would find the next cell with the highest likelihood
  // of resulting in either solving the sudoku, or quickly finding that it
  // the sudoku is not solveable with one of its options...

  // Initially could just find the first unset cell, as this should only 
  // get called when the sudoku is not solved, has not been determined to 
  // be unsolveable, and therefore all unset cells have multiple options.

  // Should return the actual cell, not a clone as we need to mutate its value
  // and have all the rows, columns and groups collections have an updated cell.


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

  // Initially we could just get the first option.
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
  while (board.onlyOptionCellCoordinates.length > 0 && canBeSolved(board)) {
    const coordinates = board.onlyOptionCellCoordinates.shift();
    const onlyOptionCell = board.cellRows[coordinates.rowIndex][coordinates.columnIndex];
    
    const value = onlyOptionCell.onlyOptionValue;
    setCellValue(onlyOptionCell, value, board);

    const otherOptions = onlyOptionCell.options.filter(o => o !== value && o !== emptySudokuCellValue);
    removeCellOptions(onlyOptionCell);
    decrementGroupsOptionsCountsForOtherOptionsOfCellGettingSet(onlyOptionCell, otherOptions, board);

    // We are done processing this only option cell.
    onlyOptionCell.isInQueue = false;
  }
}

function decrementGroupsOptionsCountsForOtherOptionsOfCellGettingSet(cellGettingSet, otherOptions, board) {
  otherOptions.forEach(otherOption => {
    decrementGroupsOptionCountForOption(otherOption, cellGettingSet, board);
  });
}

function decrementGroupsOptionCountForOption(option, cellThatHadOption, board) {
  const rowOptionsCounts = board.rowsOptionsCounts[cellThatHadOption.rowIndex];
  const columnOptionsCounts = board.columnsOptionsCounts[cellThatHadOption.columnIndex];
  const squareOptionsCounts = board.squaresOptionsCounts[cellThatHadOption.squareIndex];

  rowOptionsCounts[option]--;
  columnOptionsCounts[option]--;
  squareOptionsCounts[option]--;

  if (rowOptionsCounts[option] === 1) {
    addOnlyOptionCellInRowToQueue(option, cellThatHadOption.rowIndex, board);
  }
  if (columnOptionsCounts[option] === 1) {
    addOnlyOptionCellInColumnToQueue(option, cellThatHadOption.columnIndex, board);
  }
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

  const board = {
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

  sudokuTwoDimensionalArray.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const squareIndex = getSquareIndex(rowIndex, columnIndex);
      const cell = buildCell(value, rowIndex, columnIndex, squareIndex);
      
      if (value !== emptySudokuCellValue) {
        board.valuesCount++;
        removeCellOptions(cell);
      }

      board.cellRows[rowIndex].push(cell);
    });
  });

  return board;
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
    if (onlyOptionCell.isInQueue) {
      // If is already in the queue and its onlyOptionValue is equal to onlyOption, the cell is an
      // only option for 2 or more of its row, column or square. No need to add it again.
      const isOnlyOptionForMultipleValues = onlyOptionCell.onlyOptionValue !== onlyOption;
      if (isOnlyOptionForMultipleValues) {
        // Board can not be solved.
        board.hasCellThatIsOnlyOptionForMultipleValues = true;
      }
    } else {
      // Track the value this cell should be set to.
      onlyOptionCell.onlyOptionValue = onlyOption;
      // Set flag to indicate already in queue to avoid re-adding if the cell is an only option
      // for 2 or more of its row, column or square.
      onlyOptionCell.isInQueue = true;

      // Add to queue so its value will get set.
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
  removeOptionFromGroups(cell, value, board);
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

function removeOptionFromSiblingCells(cell, option, board) {
  const siblingCells = getUniqueSiblingCellsWithOptions(cell, board);
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
    }
  });
}

function removeOptionFromGroups(cell, option, board) {
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

import { sudokuNumbers, emptySudokuCellValue, deepClone } from "./sudokuUtils";