export interface IPoint2D {
    x: number;
    y: number;
}

export interface IScene {
    snake: IPoint2D[];
    apples: IPoint2D[];
    score: number;
}

export interface IDirections {
    [key: number]: IPoint2D;
}

export enum Key {
    LEFT = 37,
    RIGHT = 39,
    UP = 38,
    DOWN = 40,
}
