<script>
  import Cell from './Cell.svelte';
  import { sudokuNumbers, getInitialSudokuCells, updateSelectedCell, setNumber, deepCloneArray } from './utils.js';

  // When false, inputs will set a selected cell's value, otherwise will update its possible numbers.
  let possibleNumbersMode = false;

  let sudokuGameHistory = [];
  let sudokuCells = getInitialSudokuCells();
  updateGameHistory();

  function updateGameHistory() {
    sudokuGameHistory.push(deepCloneArray(sudokuCells));
  }

  function onCellClick(column, row) {
    sudokuCells = updateSelectedCell(sudokuCells, column, row);
  }

  function onNumberClick(number) {
    sudokuCells = setNumber(sudokuCells, number, possibleNumbersMode);
    updateGameHistory();
  }

  function undo() {
    if (sudokuGameHistory.length > 1) {
      sudokuGameHistory.pop();
      sudokuCells = deepCloneArray(sudokuGameHistory.at(-1));
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
  // - Highlight numbers (both set and possible ones)
  // - Generate valid starting sudoku.
  //   - Create a random solved sudoku.
  //   - Provide a subset of the values.
</script>

<div>
  <h1>My Sudoku</h1>
  <div class="board">
    {#each sudokuCells as cellGroup, cellGroupIndex}
      <div class="cell-group">
        {#each cellGroup as c, cellIndex}
          <Cell 
            isSelected={c.isSelected} 
            isSiblingSelected={c.isSiblingSelected}
            value={c.value}
            possibleNumbers={c.possibleNumbers}
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
      <button on:click={() => onNumberClick(number)}>{number}</button>
    {/each}
    <button 
      class:possibleNumbersMode 
      on:click={() => possibleNumbersMode = !possibleNumbersMode}
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

  .possibleNumbersMode {
    color: orange;
  }
</style>