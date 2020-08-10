import { createContext } from "react";

import { Action, Reducer } from "redux";
import { IModuleStore } from "redux-dynamic-modules";

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

export const Context: React.Context<IModuleStore<any> | null> = createContext<IModuleStore<any> | null>(null);
export const ReduxHooksStoreProvider = Context.Provider;

export type RT<T extends (...args: any[]) => any> = ReturnType<T> extends Promise<infer U> ? U : ReturnType<T>;
