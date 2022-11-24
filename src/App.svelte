<script>
  import Sudoku from './lib/Sudoku.svelte';
  import { generateSudoku } from './lib/sudokuGenerator'
</script>

<main>
  <button on:click={generateSudoku}>Generate Sudoku</button>


  <Sudoku />

  
</main>

<style>
  main {
    height: 100%;
  }
</style>
