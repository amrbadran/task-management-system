import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Custom hook for using the AuthContext
 * @returns {Object} - All auth-related values and functions
 */
const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return auth;
};

export default useAuth;
