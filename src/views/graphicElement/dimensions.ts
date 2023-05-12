export interface Dimensions extends Size, Coordinates {}

export interface Size {
	width: number;
	height: number;
}

export interface Coordinates {
	x: number;
	y: number;
}

export interface RelativeCoordinates {
	relativeX: number;
	relativeY: number;
}
