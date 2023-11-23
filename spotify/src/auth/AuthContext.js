import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('authState'); // Limpiar al cerrar sesión
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, { isAuthenticated: false, user: null });

  // Efecto para cargar la información de autenticación al cargar la aplicación
  useEffect(() => {
    try {
      const storedAuthState = localStorage.getItem('authState');
      if (storedAuthState) {
        const parsedAuthState = JSON.parse(storedAuthState);
        if (parsedAuthState.isAuthenticated) {
          dispatch({ type: 'LOGIN', payload: parsedAuthState.user });
        }
      }
    } catch (error) {
      console.error('Error al cargar la información de autenticación:', error);
    }
  }, []);

  // Efecto para almacenar la información de autenticación al cambiar el estado
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('authState', JSON.stringify({
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
      }));
    }
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, AuthContext };
