<script>
  export let isSelected;
  export let isSiblingSelected;
  export let value;
  export let possibleNumbers;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
  class:isSet={value}
  class:isSelected
  class:isSiblingSelected
  on:click
>
  {#if value}
    {value}
  {:else}
    {#each possibleNumbers as number}
      <span>{number}</span>
    {/each}
  {/if}
</div>

<style>
  div {
    width: 3rem;
    height: 3rem;
    
    font-size: .7rem;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  div.isSet, span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div.isSet {
    font-size: 2rem;
  }
  
  span {
    height: 1rem;
  }

  div.isSelected {
    background-color: rgba(154, 205, 50, .5);
  }
  div.isSiblingSelected {
    background-color: rgba(0, 128, 0, .5);
  }
</style>