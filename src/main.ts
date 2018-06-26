import {
    BehaviorSubject, combineLatest,
    fromEvent, interval, Observable, of,
} from 'rxjs/index';

import {
    distinctUntilChanged,
    filter, first, map, scan, share,
    skip, startWith, switchMap, takeWhile, tap, withLatestFrom,
} from 'rxjs/internal/operators';
import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';
import {createCanvasElement, renderGameOver, renderScene} from './canvas';
import {DIRECTIONS, FPS, POINTS_PER_APPLE, SNAKE_LENGTH, SPEED} from './constants';
import {IPoint2D, IScene, Key} from './types';
import {eat, generateApples, generateSnake, isGameOver, move, nextDirection} from './utils';

const canvas = createCanvasElement();
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

/* start values */
const INITIAL_DIRECTION = DIRECTIONS[Key.RIGHT];

const ticks$ = interval(SPEED);
const clicks$ = fromEvent(document, 'click');
const keydown$ = fromEvent(document, 'keydown');

function createGame(fps$: Observable<number>): Observable<IScene> {
    const direction$ = keydown$
        .pipe(
            map((event: KeyboardEvent) => DIRECTIONS[event.keyCode]),
            filter(direction => !!direction),
            scan(nextDirection),
            startWith(INITIAL_DIRECTION),
            distinctUntilChanged());

    const length$ = new BehaviorSubject<number>(SNAKE_LENGTH);

    const snakeLength$ = length$
        .pipe(
            scan((step, snakeLength) => snakeLength + step),
            share(),
        );

    const score$ = snakeLength$
        .pipe(
            startWith(0),
            scan((score, _) => score + POINTS_PER_APPLE),
        );

    const snake$ = ticks$
        .pipe(
            withLatestFrom(direction$, snakeLength$,
                (_, direction, snakeLenght) => [direction, snakeLenght]),
            scan(move, generateSnake()),
            share(),
        );

    const apples$: Observable<IPoint2D[]> = snake$
        .pipe(
            scan(eat, generateApples()),
            distinctUntilChanged(),
            share(),
        );

    const appleEaten$ = apples$
        .pipe(
            skip(1),
            tap(() => length$.next(POINTS_PER_APPLE)))
        .subscribe();

    const scene$: Observable<any> = combineLatest(snake$, apples$, score$);

    return fps$.pipe(withLatestFrom(scene$,
        (_, [snake, apples, score]) => ({snake, apples, score})));
}

const game$ = of('Start Game')
    .pipe(
        map(() => interval(1000 / FPS, animationFrame)),
        switchMap(createGame),
        takeWhile(scene => !isGameOver(scene)));

const startGame = () => game$.subscribe({
    next: scene => renderScene(ctx, scene),
    complete: () => {
        renderGameOver(ctx);

        clicks$.pipe(first())
            .subscribe(startGame);
    },
});

startGame();
