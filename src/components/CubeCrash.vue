<template>
  <div class="app">
    <div class="controls">
      <h2>Score: {{score}}</h2>
      <div>
        <button v-on:click="startNewGame">New game</button>
      </div>
    </div>
    <div class="wrapper">
      <div v-for="(column, y) in tiles" v-bind:key="y" class="column">
        <div v-for="(tile, x) in column"
             v-bind:key="tile.id"
             v-on:click="handleTileClick(y, x)">
          <transition name="slide-fade" mode="out-in">
            <div class="tile"
               :style="{ background: tile.color }"
                 ></div>

          </transition>
        </div>
      </div>
    </div>
    <div class="status" v-if="gameStatus">
      <h1>{{gameStatus}}</h1>
      <div>
        <button v-on:click="startNewGame">New game</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

const size = 10;
const colors = ['#7da3e0', '#F6546A', '#5AC18E'];
let id = 1;
const generateTiles = () => (
  [...new Array(size)].map(() => (
    [...new Array(size)].map(
      () => ({
        color: colors[Math.floor(Math.random() * 1000) % colors.length],
        id: id++, // eslint-disable-line no-plusplus
      }),
    )
  ))
);

@Component
export default class CubeCrash extends Vue {
  @Prop() private tiles:{ color: string; id: number; }[][] = [];

  @Prop() private score:number = 0;

  @Prop() private gameStatus:string = '';

  mounted() {
    this.tiles = generateTiles();
  }

  getNeighborTiles(y:number, x:number) {
    const neighborTiles = [];
    if (this.tiles[y][x + 1]) {
      neighborTiles.push({ y, x: x + 1 });
    }
    if (this.tiles[y][x - 1]) {
      neighborTiles.push({ y, x: x - 1 });
    }
    if (this.tiles[y + 1] && this.tiles[y + 1][x]) {
      neighborTiles.push({ y: y + 1, x });
    }
    if (this.tiles[y - 1] && this.tiles[y - 1][x]) {
      neighborTiles.push({ y: y - 1, x });
    }
    return neighborTiles;
  }

  getTilesToCrash(y:number, x:number, tilesToCrash:Set<string> = new Set()) {
    const thisTile = this.tiles[y][x];
    tilesToCrash.add(JSON.stringify({ y, x }));
    const neighborTiles = this.getNeighborTiles(y, x);
    neighborTiles.forEach((neighborTile) => {
      if (thisTile.color === this.tiles[neighborTile.y][neighborTile.x].color
        && !tilesToCrash.has(JSON.stringify({ y: neighborTile.y, x: neighborTile.x }))) {
        this.getTilesToCrash(neighborTile.y, neighborTile.x, tilesToCrash);
      }
    });
    return tilesToCrash;
  }

  handleTileClick(x:number, y:number) {
    const tilesToCrash = this.getTilesToCrash(x, y);
    if (tilesToCrash.size > 2) {
      this.removeTiles(tilesToCrash);
    }
  }

  removeTiles(tilesToCrash:Set<string>) {
    this.tiles = this.tiles.map((column, y) => (
      column.filter((tile, x) => (
        !tilesToCrash.has(JSON.stringify({ y, x }))
      ))
    )).filter(column => column.length > 0);

    this.score = this.score + Math.floor(tilesToCrash.size ** 1.5) * 100;
    this.checkEndOfGame();
  }

  checkEndOfGame() {
    if (this.tiles.length === 0) {
      this.gameStatus = 'You won!';
    }
    if (this.noGroupOfThreeLeft()) {
      this.gameStatus = 'Game over!';
    }
  }

  noGroupOfThreeLeft() {
    return this.tiles.map((column, y) => (
      column.filter((tile, x) => (
        [...this.getTilesToCrash(y, x)].length > 2
      ))
    )).filter(column => column.length > 0).length === 0;
  }

  startNewGame() {
    this.score = 0;
    this.tiles = generateTiles();
    this.gameStatus = '';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app {
  width: 476px;
  margin: 20px auto;
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
  cursor: pointer;
}

.wrapper {
  height: 500px;
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
