import { useContext, useState } from "react";
import { toast } from "react-toastify";

import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../Context/ContextProvider";

const Login = () => {
  const { loginUser, setUser, loginWithGoogle } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  console.log(loginUser);

  // Get the desired route or default to home page
  const from = location.state?.from?.pathname || "/";

  //   handle login from
  const handleLogin = (e) => {
    e.preventDefault();

    // Validate input
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    // Attempt to log in the user with email and password
    loginUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "No Name",
          photoURL: user.photoURL || "https://via.placeholder.com/150",
        };
        setUser(userData);
        localStorage.setItem("authToken", user.accessToken);
        toast.success("Login successful!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        // Handle errors based on Firebase error codes
        const errorMessage = error.code;

        if (errorMessage === "auth/user-not-found") {
          toast.error("User not found. Please check the email.");
        } else if (errorMessage === "auth/wrong-password") {
          toast.error("Incorrect password. Please try again.");
        } else if (errorMessage === "auth/invalid-email") {
          toast.error("Invalid email format.");
        } else {
          toast.error("Login failed. Please try again.");
        }
      });
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Google login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Google login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100 px-4 py-20 mb-3 dark:bg-gray-900 dark:text-white">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          User Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 dark:text-white font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full dark:border-gray-600 dark:bg-gray-700  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="dark:text-white block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full dark:border-gray-600 dark:bg-gray-700  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
            />
            <div
              className="absolute right-3 top-11 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#031741] via-[#03d2fc] to-[#022d33] text-white font-bold rounded-lg hover:bg-gradient-to-r from-blue-400 to-green-500 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 dark:text-white">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-[#031741] text-white font-bold rounded-lg  transition duration-300 flex gap-3 justify-center items-center"
        >
          <FaGoogle /> Continue with Google
        </button>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6 dark:text-white">
          Dont have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-teal-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
