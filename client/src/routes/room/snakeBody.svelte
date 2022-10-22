<script lang="ts">
    export let x:number = 1;
    export let y:number = 11;
    export let isHead:boolean = true;
    export let direction:string = "down";
</script>

<style>
    .eyes {
      position: relative;
      background-color: orange;
      border-radius: 50%;
      width: 20%;
      height: 20%;
    }
    #leftEye {
      left: 70%;
      top: 70%;
    }
    #rightEye {
      left: 70%;
      bottom: 10%;
    }
    .snake-body.right {
      transform: rotate(0deg);
    }
    .snake-body.left {
      transform: rotate(180deg);
    }
    .snake-body.up {
      transform: rotate(270deg);
    }
    .snake-body.down {
      transform: rotate(90deg);
    }
    .snake-body{
        background-color: #00ff00;
        border: .25vmin solid #151d15;
    }
  </style>
  
  <!-- <div style="left:{left}px; top:{top}px;" class="snake-body {direction}">
  {#if isHead}
    <div id="leftEye" class="eyes" />
    <div id="rightEye" class="eyes" />
  {/if} -->
    
      <div style="grid-row-start:{y}; grid-column-start:{x}" class="snake-body {direction}">
        {#if isHead}
          <div id="leftEye" class="eyes" />
          <div id="rightEye" class="eyes" />
        {/if}
      </div>
    


  