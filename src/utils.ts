import {checkCollision, getRandomPosition} from './canvas';
import {APPLE_COUNT, SNAKE_LENGTH} from './constants';
import {IPoint2D, IScene} from './types';

export function nextDirection(previous: IPoint2D, next: IPoint2D) {
    const isOpposite = (prev: IPoint2D, nxt: IPoint2D) => {
        return nxt.x === prev.x * -1 || nxt.y === prev.y * -1;
    };
    if (isOpposite(previous, next)) {
        return previous;
    }
    return next;
}

export function move(snake: IPoint2D[], [direction, snakeLength]: [IPoint2D, number]) {
    let nx = snake[0].x;
    let ny = snake[0].y;

    nx += direction.x;
    ny += direction.y;

    let tail;

    if (snakeLength > snake.length) {
        tail = {x: nx, y: ny};
    } else {
        tail = snake.pop();
        tail.x = nx;
        tail.y = ny;
    }

    snake.unshift(tail);

    return snake;
}

export function isGameOver(scene: IScene) {
    const snake = scene.snake;
    const head = snake[0];
    const body = snake.slice(1, snake.length);

    return body.some(segment => checkCollision(segment, head));
}

export function generateSnake() {
    const snake: IPoint2D[] = [];
    for (let i = SNAKE_LENGTH - 1; i >= 0; i--) {
        snake.push({x: i, y: 0});
    }
    return snake;
}

export function generateApples(): IPoint2D[] {
    const apples = [];
    for (let i = 0; i < APPLE_COUNT; i++) {
        apples.push(getRandomPosition());
    }
    return apples;
}

export function eat(apples: IPoint2D[], snake) {
    const head = snake[0];
    for (let i = 0; i < apples.length; i++) {
        if (checkCollision(apples[i], head)) {
            apples.slice(i, 1);
            return [...apples, getRandomPosition(snake)];
        }
    }
    return apples;
}
