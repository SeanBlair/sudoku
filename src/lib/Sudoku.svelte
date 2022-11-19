<script>
  import Cell from './Cell.svelte';
  import { sudokuNumbers, getInitialSudokuCells, updateSelectedCell, 
    setNumber, deepClone, cloneSelectedCell, getEmptySudokuOptions } from './utils.js';

  // When false, inputs will set a selected cell's value, otherwise will update its possible options.
  let optionsMode = false;
  let selectedSetNumber = null;
  let selectedSetOptions = getEmptySudokuOptions();

  let sudokuGameHistory = [];
  let sudokuCells = getInitialSudokuCells();
  updateGameHistory();

  function updateGameHistory() {
    sudokuGameHistory.push(deepClone(sudokuCells));
  }

  function onCellClick(column, row) {
    sudokuCells = updateSelectedCell(sudokuCells, column, row);
    updateSelectedValues();
  }

  function updateSelectedValues() {
    const selectedCell = cloneSelectedCell(sudokuCells);
    if (!selectedCell) return;

    selectedSetNumber = selectedCell.value;
    selectedSetOptions = selectedCell.possibleNumbers;
  }

  function onNumberClick(number) {
    sudokuCells = setNumber(sudokuCells, number, optionsMode);
    updateSelectedValues();
    updateGameHistory();
  }

  function undo() {
    if (sudokuGameHistory.length > 1) {
      sudokuGameHistory.pop();
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

  // Todo:
  // - Original numbers have different color than added numbers.
  //   - can not change original numbers, can change others
  // - Store state in local storage to be able to refresh the page and get the previous state.
  // - Start a new game, select a difficulty.
</script>

<div>
  <h2>My Sudoku</h2>
  <div class="board">
    {#each sudokuCells as cellGroup, cellGroupIndex}
      <div class="cell-group">
        {#each cellGroup as c, cellIndex}
          <Cell 
            isSelected={c.isSelected} 
            isSiblingSelected={c.isSiblingSelected}
            value={c.value}
            possibleNumbers={c.possibleNumbers}
            numberToHighlight={selectedSetNumber}
            on:click={() => onCellClick(c.column, c.row)} 
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
        on:click={() => onNumberClick(number)}>
          {number}
      </button>
    {/each}
    <button 
      class:optionsMode 
      on:click={() => optionsMode = !optionsMode}
    >/</button>
  </div>
  <div class="controls">
    <button on:click={() => undo()}>Undo</button>
  </div>
</div>

<style>
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
    justify-content: center;
    align-items: center;

    margin: .2rem;

    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;

    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
  }  

  .optionsMode, .highlight {
    color: orange;
  }
</style>