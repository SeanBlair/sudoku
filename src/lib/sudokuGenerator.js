export function generateSolvedSudoku() {
  // Should return a list of sudoku cells with column, row and value.
  // Should be a complete solved sudoku. Can then use as a game starter by only
  // displaying a small subset of the solution.
  // Should have a random component, ideally each call will result in a different
  // solution.

  // How to do this?
  // Recursion? Iteration? Randomness?

  // Each row, column and group requires all of 1, 2, 3, 4, 5, 6, 7, 8, 9.

  // Maybe start with a random value in [1, 9].
  // Check if valid (no duplicates in either row, column or group).
  // If valid, go to the next cell and add a random? value.
  // Check if valid.
  // If not, try a different.
  // Looks like we would want to randomly order the nine [1, 9], and try each one. This should 
  // be faster than completely randomly trying each one.
  // We could iterate through each row.

  // Recursion could be useful, as it is kind of like a search of possible solutions.
  // If a doesn't work, try b, then c, etc.

  // Ok, might want to try recursion. Breadth first search? Depth first search?
  // What if we have a list of 81 unordered values. Complete, but in random order.
  // What if we then add these to a new list and check if correct. In a single list with some 
  // math we can find out if is valid sudoku.
  // We need to find a way to:
  // - figure out when we have tried all possible options from a point.
  // - - go back one point and retry all options, if doesn't work, go back one point.
  // - - - when going back, ensure that the previous selection will be put on the end of the list (to avoid going in circles)
  // - figure out how to backtrack to give ourselves more options as needed.
  // - when we get to a place where none of the remaining options suffice, we need to be able to 
  // backtrack to give ourselves more options.
  // 
  // Another way would be breadth first search: all invalid paths would get discarded. If all combinations are
  // all the paths, some combinations would not be valid, these would be discarded. As soon as we find
  // a path to the finish, we are done.

  // a recursive function calls itself, ideally in the tail. Also, stacks are used instead of recursive functions.
  // we basically need to sort a list in such a way that it is a valid sudoku.
  // If we have a list we have the first, the second, the third, the rest.
  // To get all possible combinations of first, second and the rest, we need to: 
  // - first, second, the rest
  // - first, the rest, second
  // - second, first, the rest
  // - second, the rest, first
  // - the rest, first, second
  // - the rest, second, first

  // To get all combinations of first and the rest, we need to:
  // first, the rest
  // the rest, first

  // In recursive algorithms there is a concept of unrolling: the algorithm gets to the end of the list (adding a bunch
  // of calls on the call stack), before it knows if a given path is correct.



  // Solve 4 option sudoku first!
  // 1234
  // 3412
  // 2341
  // 4123

  // step  options choose options result
  // 1)    1234    1      234     1

  // 2)    234     2      34      12
  
  // 3)    34      3      4       123
  
  // 4)    4       4      -       1234
  
  // 5)    34      3      4       1234
                                  3

  // 6)    4       4      -       1234
                                  34

  // 7)    12      1      2       1234
                                  341

  // 8)    2       2      -       1234
                                  3412

  // 9)    24      2      4       1234
                                  3412
                                  2

  // 10)   13      1      3       1234
                                  3412
                                  21

  // 11)   4       4      -       1234
                                  3412
                                  214

  // 12)   3       3      -       1234
                                  3412
                                  2143

  // 13)   4       4      -       1234
                                  3412
                                  2143  
                                  4
  
  // 14)   3       3      -       1234
                                  3412
                                  2143
                                  43

  // 15)   2       2      -       1234
                                  3412
                                  2143
                                  432

  // 16)   1       1      -       1234
                                  3412
                                  2143
                                  4321

  // Aha!
  // As long as we always choose a valid one for the solution so far, the sudoku will be finishable.
  // So
  // For each sudoku cell
  //   Find the valid options
  //   Choose one at random

  const randomOrderOptions = getRandomSudokuList();

  // Array methods: 
  // pop remove last item in the array
  // push add to end of the array
  // unshift add to the beginning of the array
  // shift remove first item in the array

  // lets grab by using shift and put back by using push.

  const solvedSudoku = [];
  for (let i = 0; i < 9; i++) {
    const row = Array(9).fill(0);
    solvedSudoku.push(row);
  }

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      setAllCellsWithOnlyOneOption(solvedSudoku);
      if (!solvedSudoku[row][column]) {
        const randomValidValue = getRandomValidValue(solvedSudoku, row, column);
        solvedSudoku[row][column] = randomValidValue;
        // Todo: Need to handle the case when setting this value results in a cell with no options.
        // Ideally we would set to another option.
        console.log(`Set row: ${row} column: ${column} to: ${randomValidValue}`)

        const cellWithNoOption = findCellWithNoOption(solvedSudoku);
        if (cellWithNoOption != null) {
          console.log(`NO OPTION!!!!!!!!!!!!!!!!!!!!!!!!! row: ${cellWithNoOption.row}, column: ${cellWithNoOption.column}`);
        }
      }
    }
  }

  return solvedSudoku;

  function setAllCellsWithOnlyOneOption(sudoku) {
    let cellWithOnlyOneOption = findCellWithOnlyOneOption(sudoku);
    while (cellWithOnlyOneOption != null) {
      sudoku[cellWithOnlyOneOption.row][cellWithOnlyOneOption.column] = cellWithOnlyOneOption.value;
      console.log(`One option! row: ${cellWithOnlyOneOption.row} column: ${cellWithOnlyOneOption.column} value: ${cellWithOnlyOneOption.value}`);
      
// this sometimes breaks it, interestingly mostly on row 8 column 5.
// not sure what to do here though as since it has only one option can't change it...

      const cellWithNoOption = findCellWithNoOption(sudoku);
        if (cellWithNoOption != null) {
          console.log(`NO OPTION!!!! row: ${cellWithNoOption.row}, column: ${cellWithNoOption.column}`);
        }
      
      cellWithOnlyOneOption = findCellWithOnlyOneOption(sudoku);
    }
  }

  function findCellWithNoOption(sudoku) {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (!sudoku[row][column]) {
          const cellOptions = getCellOptions(sudoku, row, column, true);
          if (cellOptions.length === 0) {
            return {
              row: row,
              column: column
            }
          }
        }
      }
    }
    return null;
  }

  function findCellWithOnlyOneOption(sudoku) {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (!sudoku[row][column]) {
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
    const rowValues = sudoku[row].filter(v => v > 0);
    
    if (!searchingForSingleOptionCell && isSecondGroupIn(column) && isMiddleRowOfGroup(row)) {
      const lastColumn = 8;
      const thirdGroupInValues = getGroupValues(sudoku, row, lastColumn);
      if (thirdGroupInValues.length > 0) {
        // A third group value has been set
        const unusedThirdGroupInValues = thirdGroupInValues.filter(v => !rowValues.includes(v));
        if (unusedThirdGroupInValues.length > 0) {
          // We need to make sure we use all the third group's values by the 
          // end of the second group, as these are no longer valid for the third group.

          return unusedThirdGroupInValues;
        }
      }
    }

    const columnValues = getColumnValues(sudoku, column);
    const groupValues = getGroupValues(sudoku, row, column);
    const allValues = [...rowValues, ...columnValues, ...groupValues];
    const allUnusedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => !allValues.includes(v));

    return allUnusedValues;
  }

  function getRandomValidValue(sudoku, row, column) {
    const options = getCellOptions(sudoku, row, column);

    return options[getRandomInt(0, options.length)];
  }

  function isSecondGroupIn(column) {
    const secondGroupInColumns = [3, 4, 5];
    return secondGroupInColumns.includes(column);
  }

  function isMiddleRowOfGroup(row) {
    const middleRows = [1, 4, 7];
    return middleRows.includes(row);
  }

  function getGroupValues(sudokuBoard, row, column) {
    const groups = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const rowGroup = groups.find(group => group.includes(row));
    const columnGroup = groups.find(group => group.includes(column));
    const groupValues = [];

    rowGroup.forEach(row => {
      columnGroup.forEach(column => {
        const value = sudokuBoard[row][column];
        if (value > 0) {
          groupValues.push(value);
        }
      });
    });

    return groupValues;
  }

  function getColumnValues(sudokuBoard, column) {
    const columnValues = [];
    for (let row = 0; row < 9; row++) {
      const value = sudokuBoard[row][column];
      if (value > 0) {
        columnValues.push(value);
      }
    }
    return columnValues;
  }

  
}

// Returns true if there are no duplicates in row, column or group.
function isValidSudoku(sudoku) {
  return areValidRows(sudoku) && areValidColumns(sudoku) && areValidGroups(sudoku);
}


function areValidRows(sudoku) {
  return sudoku.every(row => {
    const values = row.filter(item => item > 0);
    return new Set(values).size === values.length;
  });
}


function areValidColumns(sudoku) {
  for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
    const column = [];
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      column.push(sudoku[rowIndex][columnIndex]);   
    }
    const values = column.filter(item => item > 0);
    if (new Set(values).size !== values.length) {
      return false;
    }
  }
  return true;
}


function areValidGroups(sudoku) {
  throw Error();
}




function getRandomSudokuList() {
  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const randomOptions = [];
  while (options.length > 0) {
    // remove a random element from the list
    const randomOption = options.splice(getRandomInt(0, options.length), 1)[0];
    randomOptions.push(randomOption);
  }
  return randomOptions;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


