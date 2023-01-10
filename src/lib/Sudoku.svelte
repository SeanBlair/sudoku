<script>
  import { fade } from 'svelte/transition';
  import Cell from './Cell.svelte';
  import { sudokuNumbers, deepClone } from './sudokuUtils';
  import { storageHasHistory, getHistoryFromStorage, setHistoryInStorage } from './localStorage';
  import { getInitialSudokuBoard, cloneSelectedCell, updateSelectedCell, 
    setSelectedCellValue, getRemainingNumbersCount, isValidBoard  } from './sudokuHelper';
  
  // A sudoku game

  // The current state of the sudoku board.
  let boardCells = [];

  // All changes to the board's state.
  let boardHistory = [];
  
  // Values in the currently selected cell.
  $: selectedCell = cloneSelectedCell(boardCells);

  // When true, number inputs will update the selected cell's options, 
  // otherwise will set its value.
  let optionsMode = false;
  
  // List of counts of each remaining number indexed by the number.
  $: remainingNumbersCount = getRemainingNumbersCount(boardCells);

  // Updated when user validates the current sudoku board.
  let isValid = false;
  // Toggles the validity display.
  let displayValidity = false;

  initializeGame();

  function initializeGame() {
    if (storageHasHistory()) {
      boardHistory = getHistoryFromStorage();
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
    setHistoryInStorage(boardHistory);
  }

  function onCellClick(selectedRow, selectedColumn) {
    boardCells = updateSelectedCell(boardCells, selectedRow, selectedColumn);
  }

  function onNumberClick(number) {
    boardCells = setSelectedCellValue(boardCells, number, optionsMode);
    updateBoardHistory();
  }

  function undo() {
    if (boardHistory.length > 1) {
      boardHistory.pop();
      setHistoryInStorage(boardHistory);
      boardCells = deepClone(boardHistory.at(-1));
    }
  }

  function validate() {
    isValid = isValidBoard(boardCells);
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
  // - Add some icons.
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

  <div class="inputs">
    <div class="number-inputs">
      {#each sudokuNumbers as number}
        <button 
          class:highlight={optionsMode && selectedCell.options.includes(number)} 
          on:click={() => onNumberClick(number)}
          disabled={remainingNumbersCount[number] <= 0}
        >
          <div class="number-input">{number}</div>
          <div>{remainingNumbersCount[number]}</div>
        </button>
      {/each}
      <button 
        class:optionsMode 
        on:click={() => optionsMode = !optionsMode}
      >Options Mode</button>
    </div>
  
    <div class="controls">
      <button on:click={() => newGame()}>New Game</button>
      <button on:click={() => undo()}>Undo</button>
      <button on:click={() => validate()}>Validate</button>
    </div>

    <div class="validity">
      {#if displayValidity}
        <div class:isValid out:fade>{isValid ? 'Is' : 'Is Not'} Valid!</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .game {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .board, .cell-group {
    display: grid;
    grid-template-columns: 1fr 0.5px 1fr 0.5px 1fr;
    grid-template-rows: 1fr 0.5px 1fr 0.5px 1fr;
  }

  .board {
    grid-template-columns: 1fr 2px 1fr 2px 1fr;
    grid-template-rows: 1fr 2px 1fr 2px 1fr;
  }

  .horizontal-divider {
    grid-column: 1 / 6;
  }

  .horizontal-divider, .vertical-divider {
    background-color: yellow;
  }

  .cell-group .horizontal-divider, .cell-group .vertical-divider {
    background-color: green;
  }

  .number-inputs {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }

  .inputs, .number-inputs, .controls {
    margin-top: 0.5rem;
  }

  button {
    border: solid 2px;
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

  .controls, .validity {
    display: flex;
    justify-content: space-around;
  }

  .number-input {
    font-size: 1.7rem;
  }

  .optionsMode, .highlight {
    color: orange;
  }

  .validity {
    color: red;
    height: 1rem;
  }

  .validity .isValid {
    color: lightgreen;
  }
</style>