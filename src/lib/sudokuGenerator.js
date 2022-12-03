let backtrackCount = 0;
let solveSudokuCount = 0;

function logTestDetails() {

  console.log(`Called solveSudoku() ${solveSudokuCount} times.`);
  console.log(`Backtracked  ${backtrackCount} times.`);
  console.log(`Average bactkrack per solveSudoku() call: ${backtrackCount / solveSudokuCount}`);
}

function generateSudoku() {
  const sudoku = generateInitialSudokuWithSingleSolution(); 

  logTestDetails();

  return sudoku;
}

function canSolveSudoku(sudoku) {
  return isSolved(solveSudoku(sudoku));
}

function generateInitialSudokuWithSingleSolution() {
  const solvedSudoku = generateSolvedSudoku();
  console.log(`initial solved sudoku: ${solvedSudoku}`);

  return minimizeCluesForSingleSolution(solvedSudoku);
}

function minimizeCluesForSingleSolution(solvedSudoku) {
  const allPositions = shuffle(getAllSudokuCoordinates());
  allPositions.forEach(position => {
    // Save this clue in case we can't remove it
    const positionValue = solvedSudoku[position.row][position.column];
    // Remove this clue.
    solvedSudoku[position.row][position.column] = emptySudokuCellValue;

    if (!hasExactlyOneSolution(solvedSudoku)) {
      // We can't remove this clue.
      solvedSudoku[position.row][position.column] = positionValue;
    }
  });

  logTestDetails();
  return solvedSudoku;
}

function hasExactlyOneSolution(sudoku) {
  return countUpToTwoSolutions(sudoku) === 1;
}

// Returns 0 if the sudoku has no solutions, 1 if only has one solution,
// 2 if has at least two solutions.
function countUpToTwoSolutions(sudoku) {
  if (!hasEmptyCell(sudoku)) {
    return isSolved(sudoku) ? 1 : 0;
  }
  
  const maxSolutionsToCheck = 2;

  // Total solutions found so far
  let solutionsCount = 0;

  for (let row = 0; row < sudokuNumbers.length; row++) {
    for (let column = 0; column < sudokuNumbers.length; column++) {
      if (cellIsEmpty(sudoku, row, column)) {
        // Solutions found for this cell. If a sudoku has 2 solutions, a single cell will 
        // have 2 different values that result in a solution.
        let cellSolutionsCount = 0;
        const cellOptions = shuffle(getCellOptions(sudoku, row, column));

        for (let optionIndex = 0; optionIndex < cellOptions.length; optionIndex++) {
          const clonedSudoku = deepClone(sudoku);
          clonedSudoku[row][column] = cellOptions[optionIndex];
          if (canSolveSudoku(clonedSudoku)) {
            cellSolutionsCount++;
            if (cellSolutionsCount === maxSolutionsToCheck) {
              // Found the 2 solutions we were looking for.
              return cellSolutionsCount;
            } else {
              // Ensure 1 solution is noted in case we never find 2 solutions.
              solutionsCount = cellSolutionsCount;
            }
          }
        }
      }
    }
  }
  return solutionsCount;
}

function getAllSudokuCoordinates() {
  const coordinates = [];
  sudokuNumbers.forEach((_, rowIndex) => {
    sudokuNumbers.forEach((_, columnIndex) => {
      coordinates.push({row: rowIndex, column: columnIndex});
    })
  })
  return coordinates;
}

function hasEmptyCell(sudoku) {
  return sudoku.flat().some(value => value === emptySudokuCellValue);
}

function cellIsEmpty(sudoku, row, column) {
  return sudoku[row][column] === emptySudokuCellValue; 
}

function generateSolvedSudoku() {
  return solveSudoku(generateEmptySudoku());
}

function isSolved(sudoku) {
  return allSudokuRulesAreMet(sudoku); 
}

function areAllSudokuValues(sudoku) {
  return sudoku.flat().every(value => sudokuNumbers.includes(value));
}

function allSudokuRulesAreMet(sudoku) {
  return areAllSudokuValues(sudoku) 
    && allRowsHaveDistinctValues(sudoku) 
    && allColumnsHaveDistinctValues(sudoku) 
    && allGroupsHaveDistinctValues(sudoku);
}

function allRowsHaveDistinctValues(sudoku) {
  return sudoku.every(row => allValuesAreUnique(row));
}

function allColumnsHaveDistinctValues(sudoku) {
  return sudokuNumbers.every((_, columnIndex) => {
    const columnValues = getColumnValues(sudoku, columnIndex);
    return allValuesAreUnique(columnValues);
  })
}

function allGroupsHaveDistinctValues(sudoku) {
  const groupStartIndexes = [0, 4, 7];
  const groupRowStartIndexes = groupStartIndexes;
  const groupColumnStartIndexes = groupStartIndexes;

  return groupRowStartIndexes.every(rowIndex => {
    return groupColumnStartIndexes.every(columnIndex => {
      const groupValues = getGroupValues(sudoku, rowIndex, columnIndex);
      return allValuesAreUnique(groupValues);
    });
  });
}

function solveSudokuFaster(sudoku) {
  // Need to return when done trying to solve. (return solved or not sudoku.)
  // 1) Set options for each cell.
  // - When only one option is found for a cell, set it.
  // - - Remove this option from other cells in same row, column or group.
  // 
  // - When a row, column or group has all options set, look for options with only one cell. Set them.

  // Every time we set a cell's value
  // - If there were more than one valid option, we create a snapshot for backtracking.
  // - We add it to the stack of updated cells. This should eventually trigger an update and check of all siblings
  // in row, column and group. Any cells with single option or only option for a number are set, and added to the 
  // update stack.

  // We will need a cell object.
  // - Value
  // - Options
  // - 
  // Will we need a row, column and group objects? Maybe can share cell objects?
  // - Could have some properties such as cells with option N. This could be used to quickly
  // identify rows with only one cell option for a number.

  // Eventually we will have all cell options set and no more cells with only one option, or being only option for 
  // a number. We will need to choose a cell to try and snapshot the other options for backtracking.
  // We will need to do this until all cells are set or all snapshots have been tried.

  // Get cell options should be very thorough, only return options that are known to be valid.

  let snapshots = [];

  let sudokuBoard = buildSudokuBoard(sudoku);
  setAllCellOptions(sudokuBoard); 

  // We now need to set cells with only one option or if they are the only cell in row, column or group 
  // that have a specific number as an option.
  // Whenever we set a cell, we need to remove this option from all sibling cells.
  // This will likely result in more cells to set. This seems recursive, or maybe use a stack or queue to implement.
  // Simple case:
  // - Setting cellA results in cellB known
  //   - Set cellA to x
  //   - Remove x from all cellA's sibling cells' options.
  //   - Set cellB to y
  //   - Remove y from all cellB's sibling cells' options.

  // Maybe, while updating all cellA's siblings' options, add any cells with only one option to a queue (cellB).
  // Once done updating all cellA's siblings, dequeue cellB and update its siblings, while also adding to the queue if needed.

  // setSingleOptionCells(sudokuBoard);


  return sudoku;
}

// todo: could optimize by immediately identifying cells whose values can be set here.
function setAllCellOptions(sudokuBoard) {
  sudokuBoard.rows.forEach(row => {
    row.forEach(cell => {
      if (cell.value === emptySudokuCellValue) {
        setCellOptions(cell, sudokuBoard);
        // if (cellHasNoOptions(cell)) {
        //   // Todo: attempt to backtrack. Maybe set a boolean flag? This should only get called once at the beginning of the work
        // } else if (cellHasOneOptionOnly(cell)) {
        //   // Add to one option cells queue.
        // }
      }
    });
  });
}

function cellHasNoOptions(cell) {
  return cell.value === emptySudokuCellValue && cell.options.every(option => option === emptySudokuCellValue);
}

function setCellOptions(cell, sudokuBoard) {
  sudokuNumbers.forEach(number => {
    const cellHasNumber = (cell) => cell.value === number;
    const rowHasNumber = () => sudokuBoard.rows[cell.rowIndex].some(cellHasNumber);
    const columnHasNumber = () => sudokuBoard.columns[cell.columnIndex].some(cellHasNumber);
    const groupHasNumber = () => sudokuBoard.groups[cell.groupIndex].some(cellHasNumber);
    // Todo: also make sure that options exclude
    // - When a group has all options for a number in a single row/column, these will not be options
    // for the rest of the row/column.
    const isOption = !rowHasNumber() && !columnHasNumber() && !groupHasNumber();
    const numberIndex = number - 1;
    cell.options[numberIndex] = isOption ? number : emptySudokuCellValue;
  });
}

function buildSudokuBoard(sudoku) {
  const emptySudokuGroups = () => Array(9).fill().map(() => Array()); 
  const board = {
    rows: emptySudokuGroups(),
    columns: emptySudokuGroups(),
    groups: emptySudokuGroups(),
  }

  sudoku.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const groupIndex = getGroupIndex(rowIndex, columnIndex);
      const cell = {
        value: value,
        options: Array(9).fill(emptySudokuCellValue),
        rowIndex: rowIndex,
        columnIndex: columnIndex,
        groupIndex: groupIndex
      }
      board.rows[rowIndex].push(cell);
      board.columns[columnIndex].push(cell);
      board.groups[groupIndex].push(cell);
    });
  });

  return board;
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

// Solves the given sudoku by filling cells with values that satisfy
// the sudoku rules, and backtracks to a cell with multiple options 
// when it finds a cell with no options.
function solveSudoku(sudoku) {
  solveSudokuCount++;

  const snapshots = [];
  
  // todo: Should we see if randomizing these improves the time?
  // I'm thinking that we should try to take advantage of order (instead of randomness)
  // when possible. We only need randomness in the initial generated sudoku. It is possible
  // that if we choose some order (left to right / top to bottom) we can optimize the checks...
  // Might not make a difference though...

  // We might want to have a different algorithm for generating a random solved sudoku, than for
  // solving a random sudoku. We need randomness for generating, but for solving it might be better
  // to avoid unnecesary randomness. 

  // So: the more options we can rule out the better, as this will leave less possible
  // wasted paths to traverse.
  // How do we rule out options?
  // - identify ASAP when they lead to a cell with no options.
  // - try to be smarter and figure out more ways to filter them out.
  // Also, if we can prioritize options, we might be able to find a solution faster, and
  // thus, no matter how many options we might have, we will ignore them.
  // So, if we find a way to prioritize, great. But if we can easily rule out more options, great.
  // We might have to spend more time looking for any cell with no options.
  // What about:
  // - we find a cell with > 1 option.
  // - we order the options in a way that increases the likelihood of (failing? winning?)
  // - we choose one.
  // - search for any cell with no option, if find, backtrack.
  // - search for any cell with one option, if find, set. Search for any cell with no option, if find, backtrack.
  // - 
  // What about the order we try cells with multiple options? Should we start with cells having less options?
  // Or start with cells having more options?
  // Cells with less options have less chance of backtracking as there are less options. Finding the
  // the right one will decrease a lot of options for other cells.
  // So, when we only have cells with multiple options, we should find the one with the least of them.
  // This implies we should have a data structure that has each cell's options, and we can simply
  // check the size of the collection.

  // It is important to not only minimize backtracking, but also how far we have to backtrack because
  // that is just wasted work. 

  // So:
  // - we should prioritize finding cells with no options so we can backtrack sooner.
  // - we should start trying cells having less options. This implies finding all options
  // for all cells which sounds like lots of work. But it might be worth it.


  for (let row = 0; row < sudokuNumbers.length; row++) {
    for (let column = 0; column < sudokuNumbers.length; column++) {
      // Todo: what about identifying cells with no options ASAP?
      // For example: here we only backtrack when we find one by accident. If instead, each time we set
      // a value, we check if it results in a some (any) empty cell? This would result in a less backtracking.
      // Hypothesis: the sooner we find we should backtrack the better.
      // - when should we backtrack? When one of multiple options results in a cell with no options.
      // - this can also be triggered by setting a cell with one option.
      // How about: every time we set an option, we immediately check if any cell has no options. We can constrain the 
      // check to only the cells that would be impacted by this choice. 
      setAllCellsWithOnlyOneOption(sudoku);
      if (cellIsEmpty(sudoku, row, column)) {

        // Todo: look into ordering these options such that it is less likely to have to backtrack.
        // - Verify getCellOptions is correct.
        // - - Any more ways to rule out options??
        // - any chance to find options that are more likely to be correct??
        // - -  the option that is most free? Least included in board.

        let options = shuffle(getCellOptions(sudoku, row, column));

        if (options.length === 0) {
          // No options for this cell, have to backtrack to the last cell that 
          // had multiple options and try with a different option.
          const snapshot = snapshots.pop();
          
          backtrackCount++;

          if (snapshot === undefined) {
            // Can't solve this sudoku as there are no more options to try.
            return sudoku;
          }
          sudoku = snapshot.sudoku;
          options = snapshot.options;
          row = snapshot.row;
          column = snapshot.column;
        }
        if (options.length > 1) {
          // Store a snapshot excluding the first option in case we need to backtrack
          snapshots.push({
              sudoku: deepClone(sudoku),
              options: options.slice(1),
              row: row,
              column: column
            });
        }
        // Attempt to solve with the first option.
        sudoku[row][column] = options[0];
      }
    }
  }
  return sudoku;
}

// All right, a fast backtracking sudoku solver should:
// - Minimize backtracking by minimizing options and ordering them intelligently.
// - - Start with cells having less options as there are less backtracking candidates,
// and increased liklihood of correctly choosing an option, which by definition decreases
// other cell's options.
// - Minimize time to find out we need to backtrack by looking for cells without options.
// - - Can constrain check to only cells in same row, column or group (not full board)
// So:
// 1. Iterate through board looking for next cell to process. Find all options for each cell.
// If find a cell with no options, immediately backtrack.
// Keep a list of all cells with only one option.
// If find a cell with same option as other single option cell in same row, column or group, immediatedly backtrack.
// Keep track of cells with least options: one of each should be sufficient. (1 with 2, 1 with 3, 1 with 4, etc).
// When finished going though whole board:
// 2. While list of cells with only one option is not empty:
// - Set the option
// - Check the rest of row, column and group.
// - - if any cell has no options, immediately backtrack
// - - if any cell has one option and 
// - - - if any other cell in same row, column

// Else if find a cell with 1 option, set it. Verify cell in same row, column or group still have at least one option.

// Hmm, how about only finding all cell's options once, and then simply updating each cell's options as we choose
// values for cells in the same row, colum or group? Basically, exactly how I solve it manually?

// Iterate through full board and create a collection of options (probably a boolean array of nine for quick checks).
// Any time we choose a cell's value, we remove this option from other cells in same row, column or group.
// We can maintain a datastructure of relevant cells of interest, for example, those with only one option, 
// with only 2 options, etc.
// We can also have a stack of states that we can pop to backtrack. We push a state when we have to guess
// between two or more options

// Soooo:
// 1. Iterate through board and record each cell's options. Probably have a 2 dimensional array of objects. Each object has 
// a value and an array of options.
//   - Should probably remove option that will need to be in other group.
//   - Any other fancy option removal is probably worth the effort. 
// 1.a. - If a cell has no options, backtrack.
//      - If a cell has only 1 option, or is the only cell in a row, column or group with a specific option, set it. 
//        - Remove this option from sibling cells whose options are already recorded. 
//        - Repeat 1.a. until all single option cells are set and their siblings updated.
// 2. Find the best cell to guess its value and to backtrack to if needed.
//   - Minimal options (likely 2, but could be more).
//     - If are multiple cells with 2 options, choose one having value least set on board?
//     - Other? The higher likelihood of choosing the correct value, the less backtracking needed.
// 2.a. Choose the best value.
//        - ??
// 2.b. Push of snapshot of the state for backtracking.
// 2.c. Set cell's value and repeat 1.a. until all single option cells are set and their siblings updated.

// The main issue is the time to remove all clues that still result in a single solution. We don't simply
// have to solve the sudoku, we need to try to find 2 different solutions. We need to optimize the solver
// to solve it twice. 
// Currently we basically brute force it, as we iterate through each cell's options
// and attempt to solve it twice. Instead, it would be faster to optimize which cell and which option to attempt
// to solve with.
// So we would still need the fastest possible solver. It would be very convenient if we can figure
// out a certain cell and two of its options that most likely will result in two solutions.
// The thing is, if a sudoku only has one solution, we will still need to backtrack through all
// options of all cells to confirm this! Finding 2 solutions faster does not help when the sudoku only
// has one solution!. Additionally, if a sudoku has 0 solutions, we will still have to backtrack
// through all possible cell options to determine this!
// So kind of back to square one!
// A few things are true:
// - Identifying sodokus with 0 solutions fast is helpful.
// - Identifying sudokus with at least 1 solution fast is helpful.
// - It is generally less work to find a solution than to verify that a sudoku has no
// solutions. We can stop when we find a solution, we can't stop until we try to solve an unsolvable
// sudoku with all possible option (combinations!).
// - Finding cell values that result in a solution is better than finding those that 
// do not result in a solution. This is because setting a cell's value decreases the options
// of multiple other cells, while ruling out a cell's option does not help in any other way. This will 
// also result in less backtracking when the sudoku has a solution.
// - Ensuring to only provide valid options is key, as this will result in less options to backtrack.
// - Ordering options such that those most likely to solve a sudoku are check first would be great.

// So:
// - Main thing is to create a fast sudoku solver.
//   - Starts with cells and options that are most likely to solve it.
//   - Quickly identifies options that result in no solutions.
//   - Avoids wasted work.


function generateEmptySudoku() {
  const sudoku = [];
  for (let i = 0; i < sudokuNumbers.length; i++) {
    const row = Array(sudokuNumbers.length).fill(emptySudokuCellValue);
    sudoku.push(row);
  }
  return sudoku;
}

function setAllCellsWithOnlyOneOption(sudoku) {
  let cell = findCellWithOnlyOneOption(sudoku);

  while (cell != null) {
    sudoku[cell.row][cell.column] = cell.value;
    
    cell = findCellWithOnlyOneOption(sudoku);
  }
}

function findCellWithOnlyOneOption(sudoku) {
  for (let row = 0; row < sudokuNumbers.length; row++) {
    for (let column = 0; column < sudokuNumbers.length; column++) {
      if (cellIsEmpty(sudoku, row, column)) {
        const cellOptions = getCellOptions(sudoku, row, column, true);
        if (cellOptions.length === 1) {
          return {
            row: row,
            column: column,
            value: cellOptions[0]
          }
        }
      }
    }
  }
  return null;
}

function getCellOptions(sudoku, row, column, searchingForSingleOptionCell = false) {
  const rowValues = getRowValues(sudoku, row);
  const columnValues = getColumnValues(sudoku, column);
  const groupValues = getGroupValues(sudoku, row, column);
  
  // When not searching for single option cells to set, in some cases we prioritize a subset
  // of options by returning them only. Since we solve this row by row, from left to right,
  // when solving a group's middle row, we need to make sure we use all the third group's first row 
  // values by the end of the second group, as these are no longer valid for the third group.

  // Todo: would this approach help to prune out some from the column perspective?
  if (!searchingForSingleOptionCell && isSecondGroupIn(column) && isMiddleRowOfGroup(row)) {
    const lastColumnIndex = 8;
    const thirdGroupInValues = getGroupValues(sudoku, row, lastColumnIndex);
    // Todo: can't we simplify this to filter by not included in allValues below?? It will provide different results.
    // Also is this correct? Looks like will only filter out the ones in ALL of the groups, which does not make sense! (i think)
    const unusedThirdGroupInValues = thirdGroupInValues
      .filter(v => !rowValues.includes(v) && !columnValues.includes(v) && !groupValues.includes(v)); 
    if (unusedThirdGroupInValues.length > 0) {
      return unusedThirdGroupInValues;
    }
  }

  const allValues = [...rowValues, ...columnValues, ...groupValues];
  const allUnusedValues = sudokuNumbers.filter(v => !allValues.includes(v));

  return allUnusedValues;
}

function isSecondGroupIn(columnIndex) {
  const secondGroupInColumnIndexes = [3, 4, 5];
  return secondGroupInColumnIndexes.includes(columnIndex);
}

function isMiddleRowOfGroup(rowIndex) {
  const middleRowIndexes = [1, 4, 7];
  return middleRowIndexes.includes(rowIndex);
}

function getGroupValues(sudoku, rowIndex, columnIndex) {
  const groupIndexes = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const rowGroupIndexes = groupIndexes.find(group => group.includes(rowIndex));
  const columnGroupIndexes = groupIndexes.find(group => group.includes(columnIndex));
  const groupValues = [];

  rowGroupIndexes.forEach(row => {
    columnGroupIndexes.forEach(column => {
      groupValues.push(sudoku[row][column]);
    });
  });

  return filterOutEmptyCells(groupValues);
}

function getColumnValues(sudokuBoard, columnIndex) {
  const columnValues = [];
  for (let rowIndex = 0; rowIndex < sudokuNumbers.length; rowIndex++) {
    columnValues.push(sudokuBoard[rowIndex][columnIndex]);
  }
  return filterOutEmptyCells(columnValues);
}

function getRowValues(sudoku, rowIndex) {
  return filterOutEmptyCells(sudoku[rowIndex]);
}

function filterOutEmptyCells(sudokuGroup) {
  return sudokuGroup.filter(v => v !== emptySudokuCellValue);
}


export { solveSudoku, isSolved, generateEmptySudoku, generateSudoku, minimizeCluesForSingleSolution, solveSudokuFaster };

// Todo: figure out why putting this statement at the start of this file screws up debugging the 
// unit tests.
import { sudokuNumbers, shuffle, allValuesAreUnique, deepClone, emptySudokuCellValue } from "./sudokuUtils";
