import { TileGrid, Coordinates } from './types';

const size = 10;
const colors = ['#7da3e0', '#F6546A', '#5AC18E'];
let id = 1;

export const generateTiles = ():TileGrid => (
  [...new Array(size)].map(() => (
    [...new Array(size)].map(
      () => ({
        color: colors[Math.floor(Math.random() * 1000) % colors.length],
        id: id++, // eslint-disable-line no-plusplus
      }),
    )
  ))
);

export const getNeighborTiles = (tiles: TileGrid, { y, x }: Coordinates):Coordinates[] => {
  const neighborTiles = [];
  if (tiles[y][x + 1]) {
    neighborTiles.push({ y, x: x + 1 });
  }
  if (tiles[y][x - 1]) {
    neighborTiles.push({ y, x: x - 1 });
  }
  if (tiles[y + 1] && tiles[y + 1][x]) {
    neighborTiles.push({ y: y + 1, x });
  }
  if (tiles[y - 1] && tiles[y - 1][x]) {
    neighborTiles.push({ y: y - 1, x });
  }
  return neighborTiles;
};

export const getTilesToCrash = (
  tiles: TileGrid,
  { y, x }: Coordinates,
  tilesToCrash:Set<string> = new Set(),
):Set<string> => {
  const thisTile = tiles[y][x];
  tilesToCrash.add(JSON.stringify({ y, x }));
  const neighborTiles = getNeighborTiles(tiles, { y, x });
  neighborTiles.forEach((neighborTile) => {
    if (thisTile.color === tiles[neighborTile.y][neighborTile.x].color
      && !tilesToCrash.has(JSON.stringify({ y: neighborTile.y, x: neighborTile.x }))) {
      getTilesToCrash(tiles, neighborTile, tilesToCrash);
    }
  });
  return tilesToCrash;
};
