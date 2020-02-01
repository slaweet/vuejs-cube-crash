import { CubeGrid, Coordinates } from './types';

const gridSize = 10;
const minimumCrashSize = 3;
const colors = ['#7da3e0', '#F6546A', '#5AC18E'];
let id = 1;

export const generateCubes = (): CubeGrid => (
  [...new Array(gridSize)].map(() => (
    [...new Array(gridSize)].map(
      () => ({
        color: colors[Math.floor(Math.random() * 1000) % colors.length],
        id: id++, // eslint-disable-line no-plusplus
      }),
    )
  ))
);

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

export const fiterCrashedCubes = (
  cubes: CubeGrid,
  cubesToCrash: Set<string>,
): CubeGrid => (
  cubes.map((column, y) => (
    column.filter((cube, x) => (
      !cubesToCrash.has(JSON.stringify({ y, x }))
    ))
  )).filter((column) => column.length > 0)
);

export const getCrashedCubesValue = (cubesToCrash: Set<string>): number => (
  Math.floor(cubesToCrash.size ** 1.5) * 100
);

export const areCrashable = (cubesToCrash: Set<string>): Boolean => (
  cubesToCrash.size >= minimumCrashSize
);
