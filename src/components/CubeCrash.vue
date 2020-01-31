<template>
  <div class="app">
    <div class="controls">
      <h2>Score: {{score}}</h2>
      <button v-on:click="startNewGame">New game</button>
    </div>
    <div class="wrapper">
      <div v-for="(row, i) in tiles" v-bind:key="i" class="column">
        <div v-for="(tile, j) in row"
             v-bind:key="tile.id"
             v-on:click="removeTile(i, j)">
          <transition name="slide-fade" mode="out-in">
            <div class="tile"
               :style="{ background: tile.color }"
                 ></div>

          </transition>
        </div>
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

  mounted() {
    this.tiles = generateTiles();
  }

  getNeighborTiles(i:number, j:number) {
    const neighborTiles = [];
    if (this.tiles[i][j + 1]) {
      neighborTiles.push({ i, j: j + 1 });
    }
    if (this.tiles[i][j - 1]) {
      neighborTiles.push({ i, j: j - 1 });
    }
    if (this.tiles[i + 1] && this.tiles[i + 1][j]) {
      neighborTiles.push({ i: i + 1, j });
    }
    if (this.tiles[i - 1] && this.tiles[i - 1][j]) {
      neighborTiles.push({ i: i - 1, j });
    }
    return neighborTiles;
  }

  getTilesToCrush(i:number, j:number, tilesToCrush = new Set()) {
    const thisTile = this.tiles[i][j];
    tilesToCrush.add(JSON.stringify({ i, j }));
    const neighborTiles = this.getNeighborTiles(i, j);
    neighborTiles.forEach((neighborTile) => {
      if (thisTile.color === this.tiles[neighborTile.i][neighborTile.j].color
        && !tilesToCrush.has(JSON.stringify({ i: neighborTile.i, j: neighborTile.j }))) {
        this.getTilesToCrush(neighborTile.i, neighborTile.j, tilesToCrush);
      }
    });
    return tilesToCrush;
  }

  removeTile(x:number, y:number) {
    const tilesToCrush = this.getTilesToCrush(x, y);
    const tilesToCrushCount = [...tilesToCrush].length;
    if (tilesToCrushCount > 2) {
      this.tiles = this.tiles.map((column, i) => (
        column.map((tile, j) => (
          tilesToCrush.has(JSON.stringify({ i, j })) ? null : tile)).filter(tile => tile !== null)
      )).filter(column => column.length > 0);

      this.score = this.score + Math.floor(tilesToCrushCount ** 1.5) * 100;
    }
  }

  startNewGame() {
    this.score = 0;
    this.tiles = generateTiles();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app {
  width: 476px;
}
.controls {
  display: flex;
  width: 100%;
  justify-content: space-between;
  font-size: 15px;
}

.wrapper {
  height: 500px;
  width: 100%;
  display: flex;
  flex-direction: row;
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
