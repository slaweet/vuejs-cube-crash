export interface Cube {
  id: number
  color: string
}

export interface CubeGrid extends Array<Array<Cube>> { }

export interface Coordinates {
  x: number
  y: number
}
