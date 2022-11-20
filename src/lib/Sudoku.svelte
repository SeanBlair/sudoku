<script>
  import { fade } from 'svelte/transition';
  import Cell from './Cell.svelte';
  import { sudokuNumbers, getInitialSudokuCells, updateSelectedCell, 
    setNumber, deepClone, cloneSelectedCell, getEmptySudokuOptions, 
    getRemainingNumbers, isValid } from './utils.js';

  // When false, inputs will set a selected cell's value, otherwise will update its list of options.
  let optionsMode = false;

  // Todo: these names are a little confusing. Maybe change to selected cell, which has both a value and options?
  let selectedSetNumber = null;
  let selectedSetOptions = getEmptySudokuOptions();

  $: remainingNumbers = getRemainingNumbers(sudokuCells);

  let valid = true;
  let displayValidity = false;

  let sudokuCells;
  let sudokuGameHistory = [];
  if (localStorageHasAGame()) {
    sudokuGameHistory = getGameFromLocalStorage();
    sudokuCells = deepClone(sudokuGameHistory.at(-1));
    updateSelectedValues();
  }
  else {
    sudokuCells = getInitialSudokuCells();
    updateGameHistory();
  }

  function newGame() {
    sudokuCells = getInitialSudokuCells();
    sudokuGameHistory = [];
    updateGameHistory();
  }

  function updateGameHistory() {
    sudokuGameHistory.push(deepClone(sudokuCells));
    setGameInLocalStorage(sudokuGameHistory);
  }

  function onCellClick(row, column) {
    sudokuCells = updateSelectedCell(sudokuCells, row, column);
    updateSelectedValues();
  }

  function updateSelectedValues() {
    const selectedCell = cloneSelectedCell(sudokuCells);
    if (!selectedCell) return;

    // Todo: probably should just have a single selected cell, and ensure the reactivity is triggered
    // in all cases.
    selectedSetNumber = selectedCell.value;
    selectedSetOptions = selectedCell.options;
  }

  function onNumberClick(number) {
    sudokuCells = setNumber(sudokuCells, number, optionsMode);
    updateSelectedValues();
    updateGameHistory();
  }

  function undo() {
    if (sudokuGameHistory.length > 1) {
      sudokuGameHistory.pop();
      setGameInLocalStorage(sudokuGameHistory);
      sudokuCells = deepClone(sudokuGameHistory.at(-1));
      updateSelectedValues();
    }
  }

  // Returns true if the index is the last of the 1st or 2nd 3 sudoku items.
  function requiresHorizontalDivider(index) {
    return index === 2 || index === 5;
  }

  // Returns true if the given index is not for the last sudoku item
  function requiresDivider(index) {
    return index < 8;
  }

  // Todo: sudoku should probably be a named constant like 'storageKey'
  function localStorageHasAGame() {
    return localStorage.getItem('sudoku') !== null;
  }

  function getGameFromLocalStorage() {
    const gameHistoryString = localStorage.getItem('sudoku');
    return JSON.parse(gameHistoryString);
  }

  function setGameInLocalStorage(gameHistory) {
    localStorage.setItem('sudoku', JSON.stringify(gameHistory));
  }

  function validate() {
    valid = isValid(sudokuCells);
    displayValidity = true;

    setTimeout(() => displayValidity = false, 2000);
  }

  // Todo:
  // - Allow select a difficulty when starting a new game.
  // - Clean up code files, figure out how to make more concise and cohesive. 
  // - Clean up state management, it is currently spread out among a few different functions...
  // - Add some icons.
  // - Clean up, figure out a good name for the sudoku board structure and use it consistently.
  // - Clean up, there is lots of mutation going on, but it also appears functional... For example,
  // returning a mutated array, instead of returning a copy, or simply mutating without returning.
</script>

<div>
  <div class="board">
    {#each sudokuCells as cellGroup, cellGroupIndex}
      <div class="cell-group">
        {#each cellGroup as c, cellIndex}
          <Cell 
            isSelected={c.isSelected} 
            isSiblingSelected={c.isSiblingSelected}
            value={c.value}
            options={c.options}
            numberToHighlight={selectedSetNumber}
            isLocked={c.isLocked}
            on:click={() => onCellClick(c.row, c.column)} 
          />
          {#if requiresDivider(cellIndex)}
            <div class="{`${requiresHorizontalDivider(cellIndex) ? 'horizontal' : 'vertical'}-divider`}"></div>
          {/if}
        {/each}
      </div>
      {#if requiresDivider(cellGroupIndex)}
        <div class="{`${requiresHorizontalDivider(cellGroupIndex) ? 'horizontal' : 'vertical'}-divider`}"></div>
      {/if}
    {/each}
  </div>

  <div class="number-inputs">
    {#each sudokuNumbers as number}
      <button 
        class:highlight={optionsMode && selectedSetOptions.includes(number)} 
        on:click={() => onNumberClick(number)}
      >
        <div class="number-input">{number}</div>
        <div>{remainingNumbers[number - 1]}</div>
      </button>
    {/each}
    <button 
      class:optionsMode 
      on:click={() => optionsMode = !optionsMode}
    >/</button>
  </div>
  <div class="controls">
    <button on:click={() => newGame()}>New Game</button>
    <button on:click={() => validate()}>Validate</button>
    <button on:click={() => undo()}>Undo</button>
  </div>
  {#if displayValidity}
    <div class="validity" class:valid out:fade>{valid ? 'Is' : 'Is Not'} Valid!</div>
  {/if}
</div>

<style>
  .board, .cell-group, .number-inputs, .controls {
    width: fit-content;
    margin: 0 auto;
  }

  .board {
    margin-top: 2rem;
  }

  .board, .cell-group {
    display: grid;
    grid-template-columns: 1fr 1px 1fr 1px 1fr;
    grid-template-rows: 1fr 1px 1fr 1px 1fr;
  }

  .cell-group {
    grid-template-columns: 1fr .1px 1fr .1px 1fr;
    grid-template-rows: 1fr .1px 1fr .1px 1fr;
  }

  .horizontal-divider {
    grid-column: 1 / 6;
  }

  .horizontal-divider, .vertical-divider {
    border: solid 1px yellow;
    background-color: yellow;
  }

  .cell-group .horizontal-divider, .cell-group .vertical-divider {
    border: solid .1px;
    background-color: rgba(255, 255, 255, 0.87);
  }

  .number-inputs {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    margin-top: 1rem;
  }

  button {
    border: solid;
    border-radius: 50%;

    width: 4rem;
    height: 4rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: .2rem;

    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
  }  

  .controls {
    display: flex;
  }

  .number-input {
    font-size: 1.7rem;
  }

  .optionsMode, .highlight {
    color: orange;
  }

  .validity {
    color: lightgreen;
  }

  .validity:not(.valid) {
    color: red;
  }
</style>