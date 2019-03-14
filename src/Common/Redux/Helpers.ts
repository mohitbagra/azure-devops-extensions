import { Action, Reducer } from "redux";

// tslint:disable-next-line:interface-name
export interface IAction<T> extends Action<T> {
    /**
     * The meta property for the action (see Flux Standard Actions)
     */
    meta?: { [key: string]: any };
}

/**
 * A better typing for the Redux Action
 */
// tslint:disable-next-line:interface-name
export interface IActionWithPayload<T extends string, P> extends IAction<T> {
    /**
     * The payload of this action
     */
    payload: P;
}

/**
 * Create a new action with type and payload
 * @param type The action type
 * @param payload The payload
 */
export function createAction<T extends string>(type: T): IAction<T>;
export function createAction<T extends string, P>(type: T, payload: P, meta?: { [key: string]: string }): IActionWithPayload<T, P>;
// tslint:disable-next-line:typedef
export function createAction<T extends string, P>(type: T, payload?: P, meta?: { [key: string]: string }) {
    return { type, payload, meta };
}

/**
 * @copyright Copyright (c) 2018 Martin Hochel
 * Borrowed from the rex-tils library
 */

type ActionsCreatorsMapObject = { [actionCreator: string]: (...args: any[]) => any };
export type ActionsUnion<A extends ActionsCreatorsMapObject> = ReturnType<A[keyof A]>;
export type ActionsOfType<ActionUnion, ActionType extends string> = ActionUnion extends IAction<ActionType> ? ActionUnion : never;

/**
 * A utility function which reduces a list of reducer functions into one root reducer function. This is similar to redux's combineReducer function,
 * the only difference is that each reducer passed in combineReducer works with only a portion of app state, while all the reducers passed in reduceReducers
 * works with the full App state. This helps when the app has too many reducer functions that works on the same state.
 * @param initialState The initial state passed to the reducer
 * @param reducers Array of reducers to combine
 * @returns A combined root reducer
 */
export function reduceReducers<S = any, A extends Action = Action>(initialState: S, ...reducers: Reducer<S, A>[]): Reducer<S, A> {
    return (prevState: S, action: A) => {
        return reducers.reduce((newState: S, reducer: Reducer<S, A>) => reducer(newState, action), !prevState ? initialState : prevState);
    };
}

const hasOwn = Object.prototype.hasOwnProperty;

function is(x: any, y: any) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}

export function shallowEqual(objA: any, objB: any) {
    if (is(objA, objB)) {
        return true;
    }

    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < keysA.length; i++) {
        if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}

export function isObject(x: any): boolean {
    return x && typeof x === "object" && !Array.isArray(x);
}
