<script>
  import Cell from './Cell.svelte';
  import { getInitialSudokuCells, sudokuNumbers, isSiblingSelected } from './utils.js';

  // When false, inputs will set a selected cell's value, otherwise will update its possible numbers.
  let possibleNumbersMode = false;

  let cells = getInitialSudokuCells();

  function updateSelectedCell(column, row) {
    cells = cells.map(cell => {
      cell.isSelected = cell.column === column && cell.row === row;
      cell.isSiblingSelected = isSiblingSelected(cell, column, row);
      return cell;
    });
  }

  function setNumber(number) {
    cells = cells.map(cell => {
      if (cell.isSelected) {
        if (possibleNumbersMode) {
          const index = number - 1;
          const possibleNumberAlreadySet = cell.possibleNumbers[index];
          if (possibleNumberAlreadySet) {
            // Remove from possible numbers
            cell.possibleNumbers[index] = '';
          }
          else {
            // Add to possible numbers
            cell.possibleNumbers[index] = number;
          }
        }
        else {
          // Set value as we are not in possible numbers mode
          cell.value = number;
        }
      }
      return cell;
    });
  }
</script>

<div>
  <h1>My Sudoku</h1>
  <div class="board">
    {#each cells as c}
      <Cell 
        isSelected={c.isSelected} 
        isSiblingSelected={c.isSiblingSelected}
        value={c.value}
        possibleNumbers={c.possibleNumbers}
        on:click={() => updateSelectedCell(c.column, c.row)} />
    {/each}
  </div>
  <div class="number-inputs">
    {#each sudokuNumbers as number}
      <button on:click={() => setNumber(number)}>{number}</button>
    {/each}
    <button 
      class:possibleNumbersMode 
      on:click={() => possibleNumbersMode = !possibleNumbersMode}
    >/</button>
  </div>
</div>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    width: fit-content;
    margin: 0 auto;
  }

  .number-inputs {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    width: fit-content;
    margin: 0 auto;
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