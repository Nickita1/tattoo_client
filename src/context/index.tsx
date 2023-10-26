import { useReducer, createContext, useEffect, ReactNode, Dispatch } from 'react';
import { UserAction, State } from './interface';
import { UserActionTypeEnum } from './enum';

const initialState: State = {
  user: null
};

const Context = createContext<{ state: State; dispatch: Dispatch<UserAction> }>({
  state: initialState,
  dispatch: () => {}
});

const rootReducer = (state: State, action: UserAction): State => {
  switch (action.type) {
  case UserActionTypeEnum.LOGIN:
    return { ...state, user: action.payload || null};
  case UserActionTypeEnum.LOGOUT:
    return { ...state, user: null};
  default:
    return state;
          
  }
};

const Provider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'LOGIN',
      payload: JSON.parse(window.localStorage.getItem('user') as string)
    });
  }, []);

  return (
    <Context.Provider value = {{ state, dispatch }}>
      { children }
    </Context.Provider>
  );
};

export { Context, Provider };