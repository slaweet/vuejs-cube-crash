<template>
  <div class="app">
    <div class="controls">
      <h2>Score: {{score}}</h2>
      <div>
        <button v-on:click="startNewGame">New game</button>
      </div>
    </div>
    <CubeBoard :cubes="cubes" :handleCubeClick="handleCubeClick" />
    <div class="status" v-if="gameStatus">
      <h1>{{gameStatus}}</h1>
      <div>
        <button v-on:click="startNewGame">New game</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CubeBoard from './CubeBoard.vue';
import { CubeGrid, Coordinates } from '../types';
import { generateCubes, getCubesToCrash } from '../utils';

@Component({
  components: {
    CubeBoard,
  },
})
export default class CubeCrash extends Vue {
  private cubes:CubeGrid = [];

  private score:number = 0;

  private gameStatus:string = '';

  mounted() {
    this.startNewGame();
  }

  handleCubeClick(coordinates: Coordinates):void {
    const cubesToCrash = getCubesToCrash(this.cubes, coordinates);
    if (cubesToCrash.size > 2) {
      this.removeCubes(cubesToCrash);
    }
  }

  removeCubes(cubesToCrash:Set<string>):void {
    this.cubes = this.cubes.map((column, y) => (
      column.filter((cube, x) => (
        !cubesToCrash.has(JSON.stringify({ y, x }))
      ))
    )).filter((column) => column.length > 0);

    this.score = this.score + Math.floor(cubesToCrash.size ** 1.5) * 100;
    this.checkEndOfGame();
  }

  checkEndOfGame():void {
    if (this.cubes.length === 0) {
      this.gameStatus = 'You won!';
    }
    if (this.noGroupOfThreeLeft()) {
      this.gameStatus = 'Game over!';
    }
  }

  noGroupOfThreeLeft():Boolean {
    return this.cubes.map((column, y) => (
      column.filter((cube, x) => (
        getCubesToCrash(this.cubes, { y, x }).size > 2
      ))
    )).filter((column) => column.length > 0).length === 0;
  }

  startNewGame() {
    this.score = 0;
    this.cubes = generateCubes();
    this.gameStatus = '';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app {
  width: 437px;
  margin: 0 auto;
}

.controls {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

button {
  font-size: 15px;
  padding: 8px 16px;
  border : 2px solid gray;
  border-radius: 3px;
  cursor: pointer;
}

.status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  background: rgba(0,0,0,0.5);
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
