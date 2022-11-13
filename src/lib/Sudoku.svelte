<script>
  import Cell from './Cell.svelte'

  const listOfNine = Array(9);
</script>

<div class="sudoku-game">
  <h1>My Sudoku</h1>
  <div class="board">
    {#each listOfNine as x}
      {#each listOfNine as x}
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