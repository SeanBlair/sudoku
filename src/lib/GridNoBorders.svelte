<div class="container">
  <div class="cell">1</div>
  <div class="vertical-divider"></div>
  <div class="cell">2</div>
  <div class="vertical-divider"></div>
  <div class="cell">3</div>
  <div class="horizontal-divider"></div>
  <div class="cell">4</div>
  <div class="vertical-divider"></div>
  <div class="cell">5</div>
  <div class="vertical-divider"></div>
  <div class="cell">6</div>
  <div class="horizontal-divider"></div>
  <div class="cell">7</div>
  <div class="vertical-divider"></div>
  <div class="cell">8</div>
  <div class="vertical-divider"></div>
  <div class="cell">9</div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 2px 1fr 2px 1fr;
    grid-template-rows: 1fr 2px 1fr 2px 1fr;
    width: fit-content;
    margin: 0 auto;
  }

  .cell {
    width: 3rem;
    height: 3rem;

    font-size: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .horizontal-divider {
    grid-column: 1 / 6;
    border: solid 1px;
    background-color: rgba(255, 255, 255, 0.87);
  }

  .vertical-divider {
    border: solid 1px;
    background-color: rgba(255, 255, 255, 0.87);
  }

</style>