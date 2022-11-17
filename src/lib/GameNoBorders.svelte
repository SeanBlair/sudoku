<script>
  import GridNoBorders from "./GridNoBorders.svelte";
</script>

<h1>My game no borders</h1>
<div class="container">
  <GridNoBorders />
  <div class="vertical-divider"></div>
  <GridNoBorders />
  <div class="vertical-divider"></div>
  <GridNoBorders />
  <div class="horizontal-divider"></div>
  <GridNoBorders />
  <div class="vertical-divider"></div>
  <GridNoBorders />
  <div class="vertical-divider"></div>
  <GridNoBorders />
  <div class="horizontal-divider"></div>
  <GridNoBorders />
  <div class="vertical-divider"></div>
  <GridNoBorders />
  <div class="vertical-divider"></div>
  <GridNoBorders />
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 4px 1fr 4px 1fr;
    grid-template-rows: 1fr 4px 1fr 4px 1fr;
    width: fit-content;
    margin: 0 auto;
  }

  .horizontal-divider {
    grid-column: 1 / 6;
    border: solid 2px yellow;
    background-color: yellow;
  }

  .vertical-divider {
    border: solid 2px yellow;
    background-color: yellow;
  }

</style>