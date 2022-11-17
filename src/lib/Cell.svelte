<script>
  import { createEventDispatcher } from "svelte";

  export let column;
  export let row;
  export let isSelected;
  export let isSiblingSelected;
  export let value;
  export let possibleNumbers;

  let isSet = Boolean(value);

  const dispatch = createEventDispatcher();

  function handleClick() {
    if (!isSelected) {
      dispatch('select', {
        column: column,
        row: row
      });
    }
  }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
  class:isSet 
  class:isSelected
  class:isSiblingSelected 
  on:click={handleClick}
>
  {#if isSet}
    {value}
  {:else}
    {#each possibleNumbers as number}
      <span>{number}</span>
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

  div.isSelected {
    background-color: rgba(154, 205, 50, .5);
  }
  div.isSiblingSelected {
    background-color: rgba(0, 128, 0, .5);
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>