export interface Tile {
  id: number
  color: string
}

export interface TileGrid extends Array<Array<Tile>> { }

export interface Coordinates {
  x: number
  y: number
}
