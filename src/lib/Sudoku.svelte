<script>
  import Cell from './Cell.svelte'

  const listOfNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
  <div class="number-inputs">
    {#each listOfNine as number}
      <span>{number}</span>
    {/each}
    <span>/</span>
  </div>
</div>


<style>
  /* .sudoku-game {
  } */
  
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