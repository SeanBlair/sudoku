<script>
  let possibleNumbers = [1, null, 3, 4, null, null, 7, 8, 9];

  let isSet = true;

  let value = 7;
</script>

<div class:isSet>
  {#if isSet}
    {value}
  {:else}
    {#each possibleNumbers as number}
      <span>{number !== null ? number : ''}</span>
    {/each}
  {/if}
</div>

<style>
    div {
    border: 1px solid;
    width: 3rem;
    height: 3rem;
    
    font-size: .7rem;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  div.isSet {
    font-size: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>