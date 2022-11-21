<script>
  import { fade } from 'svelte/transition';
  import Cell from './Cell.svelte';
  import { sudokuNumbers, deepClone } from './sudokuUtils';
  import { 
    localStorageHasBoardHistory, 
    getBoardHistoryFromLocalStorage, 
    setBoardHistoryInLocalStorage } from './localStorage';
  import { getInitialSudokuBoard, cloneSelectedCell, updateSelectedCell, 
    setNumber, getRemainingNumbers, isValid  } from './sudokuHelper';

  // When true, number inputs will update the selected cell's options, otherwise will set its value.
  let optionsMode = false;

  let valid = false;
  let displayValidity = false;

  let boardCells = [];
  let boardHistory = [];

  $: selectedCell = cloneSelectedCell(boardCells);
  $: remainingNumbers = getRemainingNumbers(boardCells);

  initializeGame();

  function initializeGame() {
    if (localStorageHasBoardHistory()) {
      boardHistory = getBoardHistoryFromLocalStorage();
      boardCells = deepClone(boardHistory.at(-1));
    }
    else {
      boardCells = getInitialSudokuBoard();
      updateBoardHistory();
    }
  }

  function newGame() {
    boardCells = getInitialSudokuBoard();
    boardHistory = [];
    updateBoardHistory();
  }

  function updateBoardHistory() {
    boardHistory.push(deepClone(boardCells));
    setBoardHistoryInLocalStorage(boardHistory);
  }

  function onCellClick(row, column) {
    boardCells = updateSelectedCell(boardCells, row, column);
  }

  function onNumberClick(number) {
    boardCells = setNumber(boardCells, number, optionsMode);
    updateBoardHistory();
  }

  function undo() {
    if (boardHistory.length > 1) {
      boardHistory.pop();
      setBoardHistoryInLocalStorage(boardHistory);
      boardCells = deepClone(boardHistory.at(-1));
    }
  }

  function validate() {
    valid = isValid(boardCells);
    displayValidity = true;

    setTimeout(() => displayValidity = false, 2000);
  }

  // Returns true if the index is the last of the 1st or 2nd 3 sudoku items.
  function requiresHorizontalDivider(index) {
    return index === 2 || index === 5;
  }

  // Returns true if the given index is not for the last sudoku item
  function requiresDivider(index) {
    return index < 8;
  }

  // Todo:
  // - Allow select a difficulty when starting a new game.
  // - Clean up code files, figure out how to make more concise and cohesive. 
  // - Add some icons.
  // - Clean up, figure out a good name for the sudoku board structure and use it consistently.
  // - Clean up, there is lots of mutation going on, but it also appears functional... For example,
  // returning a mutated array, instead of returning a copy, or simply mutating without returning.
  // - Clean up this file, maybe create a couple simple components to encapsulate their state, structure and style?
  // - Clean up css, use variable for colors and other repeated values.
</script>

<div class="game">
  <div class="board">
    {#each boardCells as cellGroup, cellGroupIndex}
      <div class="cell-group">
        {#each cellGroup as c, cellIndex}
          <Cell 
            isSelected={c.isSelected} 
            isSiblingSelected={c.isSiblingSelected}
            value={c.value}
            options={c.options}
            numberToHighlight={selectedCell.value}
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
        class:highlight={optionsMode && selectedCell.options.includes(number)} 
        on:click={() => onNumberClick(number)}
        disabled={remainingNumbers[number - 1] <= 0}
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
  <div>
    {#if displayValidity}
      <div class="validity" class:valid out:fade>{valid ? 'Is' : 'Is Not'} Valid!</div>
    {/if}
  </div>
</div>

<style>
  .game {
    padding: 1rem;
    text-align: center;
  }

  .board, .cell-group, .number-inputs, .controls {
    width: fit-content;
    margin: 0 auto;
  }

  .board, .cell-group {
    display: grid;
    grid-template-columns: 1fr 1px 1fr 1px 1fr;
    grid-template-rows: 1fr 1px 1fr 1px 1fr;
  }

  .cell-group {
    grid-template-columns: 1fr 0.1px 1fr 0.1px 1fr;
    grid-template-rows: 1fr 0.1px 1fr 0.1px 1fr;
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
    margin-top: 0.5rem;
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
  
  button:disabled {
    color: grey;
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