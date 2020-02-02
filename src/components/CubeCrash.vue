<template>
  <div class="app">
    <div class="controls">
      <h2>Score: {{score}}</h2>
      <div>
        <button @click="startNewGame">New game</button>
      </div>
    </div>
    <CubeBoard :cubes="cubes" :handleCubeClick="handleCubeClick" />
    <div class="footer">
      Built with <a href="https://vuejs.org/" target="_blank">Vue.js</a>
      and ❤️  by <a href="https://github.com/slaweet" target="_blank">slaweet</a>
    </div>
    <div class="overlay" v-if="gameStatus">
      <div class="modal">
        <h1>{{gameStatus}}</h1>
        <HighScoreBoard :scores="highScores" :currentScore="score" />
        <div>
          <button @click="startNewGame">New game</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CubeBoard from './CubeBoard.vue';
import HighScoreBoard from './HighScoreBoard.vue';
import { CubeGrid, Coordinates } from '../types';
import {
  areCrashable,
  fiterCrashedCubes,
  generateCubes,
  getCrashedCubesValue,
  getCubesToCrash,
  setHighScore,
  getHighScores,
} from '../utils';

@Component({
  components: {
    CubeBoard,
    HighScoreBoard,
  },
})
export default class CubeCrash extends Vue {
  private cubes:CubeGrid = [];

  private score:number = 0;

  private gameStatus:string = '';

  private highScores:number[] = [];

  mounted() {
    this.startNewGame();
  }

  startNewGame() {
    this.score = 0;
    this.highScores = getHighScores();
    this.cubes = generateCubes();
    this.gameStatus = '';
  }

  handleCubeClick(coordinates: Coordinates):void {
    const cubesToCrash = getCubesToCrash(this.cubes, coordinates);
    if (areCrashable(cubesToCrash)) {
      this.cubes = fiterCrashedCubes(this.cubes, cubesToCrash);
      this.score += getCrashedCubesValue(cubesToCrash);
      this.checkEndOfGame();
    }
  }

  checkEndOfGame():void {
    if (this.cubes.length === 0) {
      this.gameStatus = 'You have won!';
    } else if (this.noGroupOfThreeLeft()) {
      this.gameStatus = 'Game over!';
    }
    if (this.gameStatus) {
      setHighScore(this.score);
      this.highScores = getHighScores();
    }
  }

  noGroupOfThreeLeft():Boolean {
    return this.cubes.map((column, y) => (
      column.filter((cube, x) => (
        areCrashable(getCubesToCrash(this.cubes, { y, x }))
      ))
    )).filter((column) => column.length > 0).length === 0;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app {
  margin: 0 auto;
  min-height: 98vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
}

.controls {
  display: flex;
  width: 442px;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin: 0;
}

h2 {
  padding-right: 10px;
}

button {
  font-size: 15px;
  padding: 8px 16px;
  border : 2px solid gray;
  border-radius: 3px;
  cursor: pointer;
}

.overlay {
  background: rgba(0,0,0,0.5);
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal {
  background: #fff;
  border-radius: 6px;
  margin: 20px auto;
  padding: 40px;
  min-width: 400px;
  box-shadow: 0 2px 4px 0 rgba(12, 21, 46, 0.24);

}
</style>
