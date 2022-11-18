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

  debugger;
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    const randomValues = getRandomSudokuList();
    columnLoop:
    for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
      for (let randomValueIndex = 0; randomValueIndex < randomValues.length; randomValueIndex++ ) {
        solvedSudoku[rowIndex][columnIndex] = randomValues.shift();
        if (isValidSudoku(solvedSudoku)) {
          continue columnLoop;
        } else {
          // Not valid, put back in list
          randomValues.push(solvedSudoku[rowIndex][columnIndex]);
        }
      }
      // If we get this far, we failed.
      console.log(solvedSudoku);
      return solvedSudoku;
    }
  }
  return solvedSudoku;
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
  return true;
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


