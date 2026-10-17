// src/app/fe/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'edurecall',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'edurecall-fe',
};

export const keycloakInstance = new Keycloak(keycloakConfig);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    keycloakInstance
      .init({
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        if (authenticated && keycloakInstance.tokenParsed) {
          const parsed = keycloakInstance.tokenParsed;
          const userRoles = (parsed.realm_access?.roles || []).map((r) =>
            r.toUpperCase()
          );
          setRoles(userRoles);
          setUser({
            id: parsed.sub,
            email: parsed.email,
            displayName: parsed.name || parsed.preferred_username,
          });
        }
      })
      .catch(() => {
        console.warn('Keycloak server is not reachable yet. Running in guest/dev mode.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = () => keycloakInstance.login();
  const logout = () => {
    if (keycloakInstance.authenticated) {
      keycloakInstance.logout({ redirectUri: window.location.origin });
    } else {
      setIsAuthenticated(false);
      setRoles([]);
      setUser(null);
    }
  };

  // Hàm hỗ trợ test nhanh giao diện 3 vai trò (FR-03) khi chưa bật Keycloak container
  const mockLoginAs = (role) => {
    setIsAuthenticated(true);
    setRoles([role]);
    setUser({
      id: 'dev-user-id',
      email: `${role.toLowerCase()}@edurecall.local`,
      displayName: `Demo ${role}`,
    });
  };

  const hasRole = (requiredRole) => roles.includes(requiredRole.toUpperCase());

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        roles,
        loading,
        login,
        logout,
        hasRole,
        mockLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};