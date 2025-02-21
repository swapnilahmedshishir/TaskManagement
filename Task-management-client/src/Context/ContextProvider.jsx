import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth, googleProvider } from "../Auth/FirebaseAuth";
import { useAxiospublic } from "../Hook/useAxiospublic";

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  // axios public import
  const axiosPublic = useAxiospublic();
  // api url
  const apiUrl = "http://localhost:5001";
  // const apiUrl = "https://server-side-seven-beta.vercel.app";

  // user State
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [isLoading, setIsLoading] = useState(true);

  // singup or Register user
  const RegisterUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  // sinIn or login user
  const loginUser = (email, password) => {
    setIsLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google login
  const loginWithGoogle = () => {
    setIsLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
  // updateUser
  const updateUser = (updatedInfo) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedInfo,
    }));
  };

  const updateProfileData = async (updatedInfo) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: updatedInfo.name,
          email: updatedInfo.email,
          photoURL: updatedInfo.photoURL,
        });

        // Send updated info to backend
        const response = await axiosPublic.put(
          "/api/update-profile",
          updatedInfo
        );
        if (response.status === 200) {
          const updatedUser = await response.data;
          console.log(updatedUser);
          setUser((prev) => ({
            ...prev,
            displayName: updatedUser.displayName,
            photoURL: updatedUser.photoURL,
            email: updatedUser.email,
          }));
          toast.success("Profile updated successfully!");
          return updateUser;
        } else {
          const error = await response.json();
          toast.error(error.message || "Failed to update profile.");
        }
      } catch (error) {
        toast.error("Failed to update profile.");
      }
    }
  };

  // Logout User
  const logoutUser = () => {
    return signOut(auth);
  };

  // any change user Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const loggedInUser = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        };
        axiosPublic.post("/api/jwt", loggedInUser).then((res) => {
          if (res.data.success) {
            localStorage.setItem("access-token", res.data.token);
            setIsLoading(false);
          }
        });

        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access-token");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  const contextApiValue = {
    apiUrl,
    user,
    setUser,
    RegisterUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUser,
    updateProfileData,
    isLoading,
  };

  return (
    <AppContext.Provider value={contextApiValue}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
