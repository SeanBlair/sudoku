<script>
  import Cell from './Cell.svelte';
  import { getInitialSudokuCells, sudokuNumbers, isSiblingSelected } from './utils.js';

  let cells = getInitialSudokuCells();

  function onCellSelect(event) {
    updateSelectedCell(event.detail.column, event.detail.row);
  }

  function updateSelectedCell(column, row) {
    cells = cells.map(c => {
      c.isSelected = c.column === column && c.row === row ? true : false;
      c.isSiblingSelected = isSiblingSelected(c, column, row);
      return c;
    });
  }


</script>

<div class="sudoku-game">
  <h1>My Sudoku</h1>
  <div class="board">
    {#each cells as cell}
      <Cell {...cell} on:select={onCellSelect} />
    {/each}
  </div>
  <div class="number-inputs">
    {#each sudokuNumbers as number}
      <span>{number}</span>
    {/each}
    <span>/</span>
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

  span {
    border: solid;
    border-radius: 50%;
    width: 4rem;
    height: 4rem;

    display: flex;
    justify-content: center;
    align-items: center;

    margin: .2rem;
  }

</style>