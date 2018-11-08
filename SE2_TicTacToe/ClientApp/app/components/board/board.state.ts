﻿class BoardDimension {
	static DEFAULT_WIDTH = 3;
	static DEFAULT_HEIGHT = 3;

	static SHAPE_SQUARE = "SQUARE"
	static SHAPE_PORTRAIT = "PORTAIT"
	static SHAPE_LANDSCAPE = "LANDSCAPE"
}

class BoardShape {
	static SHAPE_SQUARE = "SQUARE"
	static SHAPE_PORTRAIT = "PORTAIT"
	static SHAPE_LANDSCAPE = "LANDSCAPE"
}

class Result {
	static DRAW = "DRAW"
}

class Threshold {
	static DEFAULT_TIME = 20
}

export {
	BoardDimension,
	BoardShape,
	Result,
	Threshold
}