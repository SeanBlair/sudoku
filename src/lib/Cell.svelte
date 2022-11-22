<script>
  export let isSelected;
  export let isSiblingSelected;
  export let value;
  export let options;
  export let numberToHighlight;
  export let isLocked;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
  class:isSet={value}
  class:isSelected
  class:isSiblingSelected
  class:isLocked
  on:click
>
  {#if value}
    <span class:highlight={numberToHighlight === value}>{value}</span>
  {:else}
    {#each options as option}
      <span class:highlight={numberToHighlight === option}>{option}</span>
    {/each}
  {/if}
</div>

<style>
  div {
    width: 3rem;
    height: 3rem;

    padding: 1px;
    
    font-size: .7rem;

    display: grid;
    grid-template-columns: repeat(3, 1fr);

    color: silver;
  }

  div.isSet, span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div.isSet {
    font-size: 2.5rem;
  }

  div.isLocked {
    color: inherit;
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

  .highlight {
    color: yellow;
  }
</style>