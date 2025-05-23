import { createContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { LOGIN, SIGNUP } from "../utils/graphql/mutations";
import { GET_ME } from "../utils/graphql/queries";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(SIGNUP);

  const { data: userData, loading: userLoading } = useQuery(GET_ME, {
    skip: !localStorage.getItem("token"),
    onError: (error) => {
      console.error("Error fetching current user:", error);
      handleLocalStorageFallback();
    },
  });

  const handleLocalStorageFallback = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt_decode(token);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          setCurrentUser(null);
          return;
        }

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
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwt_decode(token);

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

      localStorage.setItem("token", token);

      setCurrentUser(user);

      return user;
    } catch (error) {
      console.error("Login error:", error);
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.username === username);

      if (user && user.password === password) {
        const mockToken = btoa(
          JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
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

      localStorage.setItem("token", token);

      setCurrentUser(user);

      return user;
    } catch (error) {
      console.error("Signup error:", error);
      try {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.some((u) => u.username === userData.username)) {
          throw new Error("Username already exists");
        }

        const newUser = {
          id: String(Date.now()),
          username: userData.username,
          password: userData.password,
          role: userData.isStudent ? "student" : "admin",
          universityId: userData.isStudent ? userData.universityId : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        const mockToken = btoa(
          JSON.stringify({
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
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
    localStorage.removeItem("token");

    setCurrentUser(null);

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
