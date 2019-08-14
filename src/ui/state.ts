import {Action} from "../actions.js";

export interface UIState {
    clear_color: [number, number, number, number];
}

export const INIT_UI_STATE: UIState = {
    clear_color: [1, 0.3, 0.3, 1],
};

export function reducer(state: UIState, action: Action, args: Array<unknown>): UIState {
    switch (action) {
        case Action.ToggleClearColor:
            return {
                ...state,
                clear_color: [
                    1 - state.clear_color[0],
                    1 - state.clear_color[1],
                    1 - state.clear_color[2],
                    state.clear_color[3],
                ],
            };
        default:
            return state;
    }
}
