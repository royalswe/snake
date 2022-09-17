<style>
    #game-board{
        background-color: #fafafa;
        width: 90vmin;
        height: 90vmin;
        display: grid;
        grid-template-rows: repeat(21, 1fr);
        grid-template-columns: repeat(21, 1fr);
        border: .1vmin solid #000;
    }
</style>
<div id="game-board">
    <slot/>
</div>