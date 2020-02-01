<template>
  <div class="wrapper">
    <div v-for="(column, y) in cubes" v-bind:key="y" class="column">
      <div v-for="(cube, x) in column"
           v-bind:key="cube.id"
           v-on:click="handleCubeClick({ y, x })">
        <transition name="slide-fade" mode="out-in">
          <button class="cube" :style="{ background: cube.color }"></button>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Coordinates, CubeGrid } from '../types';

@Component
export default class CubeBoard extends Vue {
  @Prop() cubes:CubeGrid;

  @Prop() handleCubeClick:(coordinates: Coordinates)=>void;
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

.cube {
  display: flex;
  width : 40px;
  height : 40px;
  border : 2px solid gray;
  border-radius: 3px;
  margin: 2px;
  transition: all 200ms;
  cursor: pointer;
}

.cube:hover {
  transform: scale(0.9);
}

</style>
