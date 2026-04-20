import { createContext, useContext, useEffect, useReducer, ReactNode } from "react";

interface User {
  _id: string;
  username: string;
  email?: string;
  profilePic?: string;
}

interface AuthState {
  user: User | null;
  isFetching: boolean;
  error: boolean;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" };

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { user: null, isFetching: true, error: false };
    case "LOGIN_SUCCESS":
      return { user: action.payload, isFetching: false, error: false };
    case "LOGIN_FAILURE":
      return { user: null, isFetching: false, error: true };
    case "LOGOUT":
      return { user: null, isFetching: false, error: false };
    default:
      return state;
  }
};

const INITIAL_STATE: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isFetching: false,
  error: false,
};

const AuthContext = createContext<{
  user: User | null;
  isFetching: boolean;
  error: boolean;
  dispatch: React.Dispatch<AuthAction>;
}>({
  ...INITIAL_STATE,
  dispatch: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
