import { useState } from "react";
import { Link } from "react-router"; // Changed from "react-router" to "react-router-dom"
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { z } from "zod";
import { authRegisterSchema } from "../../schemas/auth.schema";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ username?: string[]; password?: string[]; confirmPassword?: string[] }>({}); // Changed type for errors to arrays

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Added type for event
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // Added type for event
    e.preventDefault();
    try {
      authRegisterSchema.parse(formData);
      // Proceed with sign-up logic (e.g., API call)
      console.log("Form submitted successfully", formData);
    } catch (err) {
      if (err instanceof z.ZodError) { // Check if err is an instance of ZodError
        const fieldErrors = err.flatten().fieldErrors;
        setErrors({
          username: fieldErrors.username || [],
          password: fieldErrors.password || [],
          confirmPassword: fieldErrors.confirmPassword || [],
        });
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign up!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* <!-- Username --> */}
                <div>
                  <Label>
                    Username<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    onChange={handleChange}
                  />
                  {errors.username && <p className="text-error-500">{errors.username}</p>}
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <ul className="text-error-500">
                      {Array.isArray(errors.password) ? (
                        errors.password.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))
                      ) : (
                        <li>{errors.password}</li>
                      )}
                    </ul>
                  )}
                </div>
                {/* <!-- Confirm Password --> */}
                <div>
                  <Label>
                    Confirm Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Confirm your password"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.confirmPassword && <p className="text-error-500">{errors.confirmPassword}</p>}
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
