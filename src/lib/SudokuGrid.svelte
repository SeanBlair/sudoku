<script>
    import { each } from "svelte/internal";


  let nine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<h1>My Sudoku Grid</h1>
<div class="board">
  {#each nine as group}
    <div class="group">
      {#each nine as cell}
        <div class="cell">{cell}</div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .board, .group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 2px solid; 
    width: fit-content;   
  }

  .cell {
    border: 1px solid;
    width: 3rem;
    height: 3rem;

    font-size: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }


</style>