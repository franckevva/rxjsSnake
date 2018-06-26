import {IPoint2D, IScene} from './types';

export const COLS = 30;
export const ROWS = 30;
export const GAP_SIZE = 1;
export const CELL_SIZE = 10;
export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);

export function createCanvasElement() {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    return canvas;
}

export function renderScene(ctx: CanvasRenderingContext2D, scene: IScene) {
    renderBackground(ctx);
    renderScore(ctx, scene.score);
    renderApples(ctx, scene.apples);
    renderSnake(ctx, scene.snake);
}

export function renderScore(ctx: CanvasRenderingContext2D, score: number) {
    const textX = CANVAS_WIDTH / 2;
    const textY = CANVAS_HEIGHT / 2;

    drawText(ctx, score.toString(), textX, textY, 'rgba(0, 0, 0, 0.1)', 150);
}

export function renderApples(ctx: CanvasRenderingContext2D, apples: any[]) {
    apples.forEach(apple => paintCell(ctx, apple, 'red'));
}

export function renderSnake(ctx: CanvasRenderingContext2D, snake: IPoint2D[]) {
    snake.forEach((segment, index) => paintCell(ctx, wrapBounds(segment), getSegmentColor(index)));
}

export function renderGameOver(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const textX = CANVAS_WIDTH / 2;
    const textY = CANVAS_HEIGHT / 2;

    drawText(ctx, 'GAME OVER!', textX, textY, 'black', 25);
}

export function getRandomPosition(snake: IPoint2D[] = []): IPoint2D {
    const position = {
        x: getRandomNumber(0, COLS - 1),
        y: getRandomNumber(0, ROWS - 1),
    };
    if (isEmptyCell(position, snake)) {
        return position;
    }
    return getRandomPosition(snake);
}

export function checkCollision(a: IPoint2D, b: IPoint2D): boolean {
    return a.x === b.x && a.y === b.y;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isEmptyCell(position: IPoint2D, snake: IPoint2D[]): boolean {
    return !snake.some(segment => checkCollision(segment, position));
}

function renderBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#EEE';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fillStyle: string,
                  fontSize: number, horizontalAlign: string = 'center', verticalAlign: string = 'middle') {

    ctx.fillStyle = fillStyle;
    ctx.font = `bold ${fontSize}px sans-serif`;

    const textX = x;
    const textY = y;

    ctx.textAlign = horizontalAlign;
    ctx.textBaseline = verticalAlign;

    ctx.fillText(text, textX, textY);
}

function getSegmentColor(index: number) {
    return index === 0 ? 'black' : '#2196f3';
}

function wrapBounds(point: IPoint2D) {
    point.x = point.x >= COLS ? 0 : point.x < 0 ? COLS - 1 : point.x;
    point.y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

    return point;
}

function paintCell(ctx: CanvasRenderingContext2D, point: IPoint2D, color: string) {
    const x = point.x * CELL_SIZE + (point.x * GAP_SIZE);
    const y = point.y * CELL_SIZE + (point.y * GAP_SIZE);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}
