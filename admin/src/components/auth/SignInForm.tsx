import { useState } from "react";
import { Link } from "react-router"; 
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { z } from "zod";
import { AuthLoginModel } from "../../types/auth.type";
import { authLoginSchema } from "../../schemas/auth.schema";

export default function SignInForm({ onSubmit, loginError, loading }: { onSubmit: (authData: AuthLoginModel) => void; loginError: string | null, loading: boolean }) { // Using AuthLoginModel
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AuthLoginModel>({ // Using AuthLoginModel
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ username?: string[]; password?: string[] }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      authLoginSchema.parse(formData);
      setErrors({});
      // Proceed with sign-in logic (e.g., API call)
      onSubmit(formData);
      console.log("Form submitted successfully", formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = err.flatten().fieldErrors;
        setErrors({
          username: fieldErrors.username || [],
          password: fieldErrors.password || [],
        });
      }
    }
  }
    
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  onChange={handleChange}
                />
                {errors.username && (
                  <ul className="text-error-500">
                    {Array.isArray(errors.username) ? (
                      errors.username.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))
                    ) : (
                      <li>{errors.username}</li>
                    )}
                  </ul>
                )}
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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

                {errors.password && Array.isArray(errors.password) ? (
                    <ul className="text-error-500">
                      {errors.password.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-error-500">{errors.password}</p>
                  )}
              </div>
              {loginError && <p className="text-error-500">{loginError}</p>}
              <div>
                <Button className="w-full" size="sm">
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account? {""}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
