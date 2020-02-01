<template>
  <div class="wrapper">
    <div v-for="(column, y) in tiles" v-bind:key="y" class="column">
      <div v-for="(tile, x) in column"
           v-bind:key="tile.id"
           v-on:click="handleTileClick({ y, x })">
        <transition name="slide-fade" mode="out-in">
          <button class="tile" :style="{ background: tile.color }"></button>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Coordinates, TileGrid } from '../types';

@Component
export default class TileBoard extends Vue {
  @Prop() tiles:TileGrid;

  @Prop() handleTileClick:(coordinates: Coordinates)=>void;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.wrapper {
  height: 450px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.column {
  display: flex;
  flex-direction: column-reverse;
}

.tile {
  display: flex;
  width : 40px;
  height : 40px;
  border : 2px solid gray;
  border-radius: 3px;
  margin: 2px;
  transition: all 200ms;
  cursor: pointer;
}

.tile:hover {
  transform: scale(0.9);
}

</style>
