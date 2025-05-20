import { createContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { LOGIN, SIGNUP } from "../utils/graphql/mutations";
import { GET_ME } from "../utils/graphql/queries";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // GraphQL mutations
  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(SIGNUP);

  // Get current user
  const { data: userData, loading: userLoading } = useQuery(GET_ME, {
    skip: !localStorage.getItem("token"),
    onError: (error) => {
      console.error("Error fetching current user:", error);
      // Don't remove token on error, check if we can use localStorage as fallback
      handleLocalStorageFallback();
    },
  });

  // Fallback to localStorage for user authentication
  const handleLocalStorageFallback = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Try to decode token to get user info
        const decodedToken = jwt_decode(token);

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          setCurrentUser(null);
          return;
        }

        // Try to get user from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.id === decodedToken.id);

        if (user) {
          setCurrentUser(user);
        }
      }
    } catch (error) {
      console.error("Fallback authentication error:", error);
      localStorage.removeItem("token");
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode token to get user info
        const decodedToken = jwt_decode(token);

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    }

    if (!userLoading && userData && userData.me) {
      setCurrentUser(userData.me);
    } else if (!userLoading && (!userData || !userData.me)) {
      // If GraphQL failed, try localStorage fallback
      handleLocalStorageFallback();
    }

    setLoading(false);
  }, [userData, userLoading]);

  const signin = async (username, password) => {
    try {
      const { data } = await loginMutation({
        variables: { username, password },
      });

      const { token, user } = data.login;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Update current user
      setCurrentUser(user);

      return user;
    } catch (error) {
      console.error("Login error:", error);
      // Try localStorage fallback
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.username === username);

      if (user && user.password === password) {
        // Create a mock token (not secure, but works for fallback)
        const mockToken = btoa(
          JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
          })
        );

        localStorage.setItem("token", mockToken);
        setCurrentUser(user);
        return user;
      }

      throw new Error(error.message || "Authentication failed");
    }
  };

  const signup = async (userData) => {
    try {
      const { data } = await signupMutation({
        variables: {
          username: userData.username,
          password: userData.password,
          isStudent: userData.isStudent,
          universityId: userData.universityId,
        },
      });

      const { token, user } = data.signup;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Update current user
      setCurrentUser(user);

      return user;
    } catch (error) {
      console.error("Signup error:", error);
      // Try localStorage fallback
      try {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if username already exists
        if (users.some((u) => u.username === userData.username)) {
          throw new Error("Username already exists");
        }

        // Create new user
        const newUser = {
          id: String(Date.now()),
          username: userData.username,
          password: userData.password,
          role: userData.isStudent ? "student" : "admin",
          universityId: userData.isStudent ? userData.universityId : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Add to users array
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // Create mock token
        const mockToken = btoa(
          JSON.stringify({
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
          })
        );

        localStorage.setItem("token", mockToken);
        setCurrentUser(newUser);

        return newUser;
      } catch (fallbackError) {
        console.error("Fallback signup error:", fallbackError);
        throw new Error(fallbackError.message || "Registration failed");
      }
    }
  };

  const signout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear current user
    setCurrentUser(null);

    // Reload the page to clear Apollo cache
    window.location.href = "/signin";
  };

  const value = {
    currentUser,
    signin,
    signup,
    signout,
    loading: loading || userLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
