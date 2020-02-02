import hash from 'object-hash';
import { CubeGrid, Coordinates } from './types';
import {
  gridSize, minimumCrashSize, colors, highScoreListLength,
} from './config';

let id = 0;

export const getNeighborCubes = (cubes: CubeGrid, { y, x }: Coordinates): Coordinates[] => {
  const neighborCubes = [];
  if (cubes[y][x + 1]) {
    neighborCubes.push({ y, x: x + 1 });
  }
  if (cubes[y][x - 1]) {
    neighborCubes.push({ y, x: x - 1 });
  }
  if (cubes[y + 1] && cubes[y + 1][x]) {
    neighborCubes.push({ y: y + 1, x });
  }
  if (cubes[y - 1] && cubes[y - 1][x]) {
    neighborCubes.push({ y: y - 1, x });
  }
  return neighborCubes;
};

export const getCubesToCrash = (
  cubes: CubeGrid,
  { y, x }: Coordinates,
  cubesToCrash: Set<string> = new Set(),
): Set<string> => {
  const thisCube = cubes[y][x];
  cubesToCrash.add(JSON.stringify({ y, x }));
  const neighborCubes = getNeighborCubes(cubes, { y, x });
  neighborCubes.forEach((neighborCube) => {
    if (thisCube.color === cubes[neighborCube.y][neighborCube.x].color
      && !cubesToCrash.has(JSON.stringify({ y: neighborCube.y, x: neighborCube.x }))) {
      getCubesToCrash(cubes, neighborCube, cubesToCrash);
    }
  });
  return cubesToCrash;
};

export const areCrashable = (cubesToCrash: Set<string>): Boolean => (
  cubesToCrash.size >= minimumCrashSize
);

const addGroupHashes = (cubes: CubeGrid): CubeGrid => (
  cubes.map((column, y) => (
    column.map((cube, x) => {
      const cubesToCrash = getCubesToCrash(cubes, { x, y });
      const groupHash = areCrashable(cubesToCrash) ? hash(cubesToCrash).substr(0, 10) : '';
      return {
        ...cube,
        groupHash,
      };
    })
  ))
);

export const generateCubes = (): CubeGrid => (
  addGroupHashes([...new Array(gridSize)].map(() => (
    [...new Array(gridSize)].map(
      () => ({
        color: colors[Math.floor(Math.random() * 1000) % colors.length],
        id: id++, // eslint-disable-line no-plusplus
      }),
    )
  )))
);

export const fiterCrashedCubes = (
  cubes: CubeGrid,
  cubesToCrash: Set<string>,
): CubeGrid => (
  addGroupHashes(cubes.map((column, y) => (
    column.filter((cube, x) => (
      !cubesToCrash.has(JSON.stringify({ y, x }))
    ))
  )).filter((column) => column.length > 0))
);

export const getCrashedCubesValue = (cubesToCrash: Set<string>): number => (
  Math.floor(cubesToCrash.size ** 1.5) * 100
);

export const getHighScores = (): number[] => (
  (localStorage.getItem('scores') || '').split(',').filter((x) => x).map((x) => parseInt(x, 10))
);

const addHighScore = (highScores: number[], score: number): number[] => (
  [
    ...highScores,
    score,
  ].sort((a, b) => b - a).slice(0, highScoreListLength)
);

export const setHighScore = (score: number): void => {
  localStorage.setItem('scores', addHighScore(getHighScores(), score).join(','));
};
