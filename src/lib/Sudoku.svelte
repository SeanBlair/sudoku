<script>
  import Cell from './Cell.svelte'

  let rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let columns = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<div class="sudoku-game">
  <h1>My Sudoku</h1>
  <div class="board">
    {#each rows as row}
      {#each columns as column}
        <Cell />
      {/each}
    {/each}
  </div>
  <div class="number-inputs"></div>
</div>


<style>
  /* .sudoku-game {
  } */
  
  .board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    width: fit-content;

    background-color: aliceblue;
    color: black;
    margin: 0 auto;
  }

  .number-inputs {
    display: grid;
    width: var(--width);
    height: 100px;
    background-color: beige;
    margin: 0 auto;
    margin-top: 1rem;
  }

</style>