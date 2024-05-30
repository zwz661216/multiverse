import { createContext, ReactNode, useContext } from 'react';

import useThunkReducer, { ThunkDispatch } from '../hooks/useThunkReducer';

export enum EActionTypes {
  UPDATE_DISTANCE = 'UPDATE_DISTANCE',
  UPDATE_NAV = 'UPDATE_NAV',
  UPDATE_LOADING = 'UPDATE_LOADING',
}

type State = {
  distance: number;
  nav: 'introduction' | 'technology';
  loading: boolean;
};
export type Action = {
  type: EActionTypes;
  payload: Partial<State>;
};

export const updateDistance = (distance: number) => {
  return {
    type: EActionTypes.UPDATE_DISTANCE,
    payload: { distance },
  };
};
export const updateNav = (nav: 'introduction' | 'technology') => {
  return {
    type: EActionTypes.UPDATE_NAV,
    payload: { nav },
  };
};

export const updateLoading = (loading: boolean) => {
  return {
    type: EActionTypes.UPDATE_LOADING,
    payload: { loading },
  };
};

const initialState: State = {
  distance: 0,
  nav: 'introduction',
  loading: true,
};

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<ThunkDispatch<State, Action> | undefined>(undefined);

export function reducers(state: State, action: Action): State {
  switch (action.type) {
    case EActionTypes.UPDATE_DISTANCE:
      return {
        ...state,
        ...action.payload,
      };
    case EActionTypes.UPDATE_NAV:
      return {
        ...state,
        ...action.payload,
      };
    case EActionTypes.UPDATE_LOADING:
      return {
        ...state,
        ...action.payload,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const Provider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useThunkReducer(reducers, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export function useContextData() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useState must be used within a Provider');
  }
  return context;
}

export function useDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDispatch must be used within a Provider');
  }
  return context;
}
