import { TileGrid } from './types';

const size = 10;
const colors = ['#7da3e0', '#F6546A', '#5AC18E'];
let id = 1;

// eslint-disable-next-line import/prefer-default-export
export const generateTiles: () => TileGrid = () => (
  [...new Array(size)].map(() => (
    [...new Array(size)].map(
      () => ({
        color: colors[Math.floor(Math.random() * 1000) % colors.length],
        id: id++, // eslint-disable-line no-plusplus
      }),
    )
  ))
);
