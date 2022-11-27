const sudokuNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function getEmptySudokuOptions() {
  return Array(9).fill('');
} 

function deepClone(object) {
  return JSON.parse(JSON.stringify(object));
}

// Returns a random integer greater or equal than min and lesser than max 
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function allValuesAreUnique(array) {
  return new Set(array).size === array.length;
}

function shuffle(array) {
  return array.sort((a, b) => 0.5 - Math.random());
}

export { getRandomInt, sudokuNumbers, shuffle, allValuesAreUnique, deepClone };

