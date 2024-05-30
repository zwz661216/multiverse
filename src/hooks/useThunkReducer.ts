import { useCallback, Reducer, useRef, useState } from 'react';

export default function useThunkReducer<State, Action extends { [P in keyof Action]: Action[P] }>(
  reducer: Reducer<State, Action>,
  initialArg: State,
  init?: (s: State) => State
): [State, ThunkDispatch<State, Action>] {
  const [hookState, setHookState] = useState(init ? init(initialArg) : initialArg);

  // State management.
  const state = useRef(hookState);
  const getState = useCallback(() => state.current, [state]);
  const setState = useCallback(
    (newState: State) => {
      state.current = newState;
      setHookState(newState);
    },
    [state, setHookState]
  );

  // Reducer.
  const reduce = useCallback(
    (action: Action) => {
      return reducer(getState(), action);
    },
    [reducer, getState]
  );

  const dispatch: ThunkDispatch<State, Action> = useCallback(
    function (action: (<TReturnType>(dispatch: ThunkDispatch<State, Action>, getState: () => State) => TReturnType) | Action) {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      } else {
        setState(reduce(action));
      }
    },
    [getState, setState, reduce]
  );

  return [hookState, dispatch];
}
export interface ThunkDispatch<State, Action> {
  <TReturnType>(ThunkAction: ThunkAction<TReturnType, State, Action>): TReturnType;
  (action: Action): void;
}

export type ThunkAction<TReturnType, State, Action> = (dispatch: ThunkDispatch<State, Action>, getState: () => State) => TReturnType;
