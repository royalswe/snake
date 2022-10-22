<script lang="ts">
    import SnakeBody from "./snakeBody.svelte";
    export let direction:string;
    export let snakeTiles: {x: number, y: number}[] = [];    
</script>

{#each snakeTiles as tile, i}
    <SnakeBody
    isHead={i==0} 
    y={tile.y} 
    x={tile.x}
    {direction}/>
{/each}