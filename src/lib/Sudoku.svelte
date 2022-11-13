<script>
  let rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let columns = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<div class="sudoku-game">
  <h1>My Sudoku</h1>
  <div class="board">
    {#each rows as row}
      {#each columns as column}
        <div class="cell">{`${row}`}</div>
      {/each}
    {/each}
  </div>
  <div class="number-inputs"></div>
</div>


<style>
  .sudoku-game {
    --width: 400px;
  }
  
  .board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    /* gap: 1px 1px; */
    width: fit-content;

    /* width: var(--width);
    height: 200px; */
    background-color: aliceblue;
    color: black;
    margin: 0 auto;
  }

  .cell {
    border: 1px solid;
    width: 30px;
    height: 30px;
    text-align: center;

    display: flex;
    justify-content: center;
    align-items: center;
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