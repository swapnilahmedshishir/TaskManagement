import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

import { AppContext } from "../Context/ContextProvider";
import { useAxiospublic } from "../Hook/useAxiospublic";

const Registration = () => {
  const { RegisterUser, setUser, loginWithGoogle } = useContext(AppContext);
  const axiosPublic = useAxiospublic();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // Password validation function
  const validatePassword = (password) => {
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const minLength = 6;
    const specialCharacter = /[!@#$%^&*(),.?":{}|<>]/;

    if (!specialCharacter.test(password)) {
      return "Password must contain at least one special character.";
    }

    if (!uppercase.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!lowercase.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (password.length < minLength) {
      return "Password must be at least 6 characters long.";
    }
    return "";
  };

  // Registration function
  const handleRegister = async (e) => {
    e.preventDefault();
    const passwordValidationMessage = validatePassword(password);

    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      toast.error(passwordValidationMessage);
      return;
    }

    try {
      // Firebase registration
      const userCredential = await RegisterUser(email, password);
      const user = userCredential.user;

      // Firebase profile update
      await updateProfile(user, {
        displayName: name,
        photoURL: photoUrl,
      });

      // Backend API sync
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        photoURL: photoUrl,
      };

      // Use Axios to make the POST request
      const response = await axiosPublic.post("/api/register", userData);
      if (response.status === 201 && response.data.newUser) {
        // New user successfully registered
        setUser(response.data.newUser);
        toast.success("Registration successfully!");
        navigate("/dashbord");
      } else if (response.data.existingUser) {
        // User already exists
        setUser(response.data.existingUser);
        toast.info("Welcome back! You are already registered.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use. Please login.");
      }
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      // Log in with Google
      const userCredential = await loginWithGoogle();
      const user = userCredential.user;
      // Extract user data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      // Send the user data to the server to check or register
      const response = await axiosPublic.post("/api/register", userData);
      if (response.status === 201 && response.data.newUser) {
        // New user successfully registered
        setUser(response.data.newUser);
        toast.success("Google account registered successfully!");
        navigate("/");
      } else if (response.data.existingUser) {
        // User already exists
        setUser(response.data.existingUser);
        toast.info("Welcome back! You are already registered.");
      }
    } catch (error) {
      console.error("Google registration error:", error);
      toast.error("Google registration failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white px-4 py-20 mb-3">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center dark:text-white text-gray-800 mb-6">
          User Registration
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block dark:text-white text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full dark:border-gray-600 dark:bg-gray-700 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block dark:text-white text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full dark:border-gray-600 dark:bg-gray-700 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
            />
          </div>

          {/* Photo URL Field */}
          <div>
            <label className="block dark:text-white text-gray-700 font-medium mb-2">
              Photo URL
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Enter your photo URL"
              className="w-full dark:border-gray-600 dark:bg-gray-700 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block dark:text-white text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter your password"
              className="w-full dark:border-gray-600 dark:bg-gray-700 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
            />
            <div
              className="absolute right-3 top-11 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {passwordError && (
              <p className="text-red-600 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#031741] via-[#03d2fc] to-[#022d33] text-white font-bold rounded-lg hover:bg-gradient-to-r from-blue-400 to-green-500 transition duration-300"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 dark:text-white">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google register Button */}
        <button
          onClick={handleGoogleRegister}
          className="w-full py-3 bg-[#031741] text-white font-bold rounded-lg  transition duration-300 flex gap-3 justify-center items-center"
        >
          <FaGoogle /> Continue with Google
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 dark:text-white mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-teal-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
