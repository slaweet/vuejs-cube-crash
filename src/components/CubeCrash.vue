<template>
  <div class="app">
    <div class="controls">
      <h2>Score: {{score}}</h2>
      <div>
        <button v-on:click="startNewGame">New game</button>
      </div>
    </div>
    <TileBoard :tiles="tiles" :handleTileClick="handleTileClick" />
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
import TileBoard from './TileBoard.vue';
import { TileGrid, Coordinates } from '../types';
import { generateTiles } from '../utils';

@Component({
  components: {
    TileBoard,
  },
})
export default class CubeCrash extends Vue {
  private tiles:TileGrid = [];

  private score:number = 0;

  private gameStatus:string = '';

  mounted() {
    this.startNewGame();
  }

  getNeighborTiles({ y, x }: Coordinates):Coordinates[] {
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

  getTilesToCrash({ y, x }: Coordinates, tilesToCrash:Set<string> = new Set()):Set<string> {
    const thisTile = this.tiles[y][x];
    tilesToCrash.add(JSON.stringify({ y, x }));
    const neighborTiles = this.getNeighborTiles({ y, x });
    neighborTiles.forEach((neighborTile) => {
      if (thisTile.color === this.tiles[neighborTile.y][neighborTile.x].color
        && !tilesToCrash.has(JSON.stringify({ y: neighborTile.y, x: neighborTile.x }))) {
        this.getTilesToCrash(neighborTile, tilesToCrash);
      }
    });
    return tilesToCrash;
  }

  handleTileClick(coordinates: Coordinates):void {
    const tilesToCrash = this.getTilesToCrash(coordinates);
    if (tilesToCrash.size > 2) {
      this.removeTiles(tilesToCrash);
    }
  }

  removeTiles(tilesToCrash:Set<string>):void {
    this.tiles = this.tiles.map((column, y) => (
      column.filter((tile, x) => (
        !tilesToCrash.has(JSON.stringify({ y, x }))
      ))
    )).filter((column) => column.length > 0);

    this.score = this.score + Math.floor(tilesToCrash.size ** 1.5) * 100;
    this.checkEndOfGame();
  }

  checkEndOfGame():void {
    if (this.tiles.length === 0) {
      this.gameStatus = 'You won!';
    }
    if (this.noGroupOfThreeLeft()) {
      this.gameStatus = 'Game over!';
    }
  }

  noGroupOfThreeLeft():Boolean {
    return this.tiles.map((column, y) => (
      column.filter((tile, x) => (
        [...this.getTilesToCrash({ y, x })].length > 2
      ))
    )).filter((column) => column.length > 0).length === 0;
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
