"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { register } from "@/services/authService"

const getPasswordStrength = (password: string) => {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score === 5) return { label: "Strong", textColor: "text-green-500", value: 100 }
  if (score >= 3) return { label: "Medium", textColor: "text-yellow-500", value: 60 }
  return { label: "Weak", textColor: "text-red-500", value: 30 }
}

// Sign up form schema
const signUpSchema = z
  .object({
    username: z.string().min(8, { message: "Username must be at least 8 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState({ label: "", textColor: "", value: 0 })
  const router = useRouter()

  // Sign up form
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(form.watch("password")))
  }, [form.watch("password")])

  async function onSubmit(values: SignUpFormValues) {
    setIsLoading(true)
    setRegisterError(null)
    setRegisterSuccess(null)

    try {
      await register(values.username, values.password)
      setRegisterSuccess("Registration successful! Redirecting to login...")

      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error) {
      setRegisterError(`${error || "An error occurred during registration."}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
        <div className="relative hidden bg-white md:block">
        <img src="/l.png" alt="Image" className="absolute inset-0 h-full w-full object-cover" />
          </div>

          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-balance text-muted-foreground">Sign up to join Acme Inc</p>
              </div>

              <Form {...form}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} {...field} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          <li className={field.value.length >= 8 ? "text-green-500" : ""}>• At least 8 characters</li>
                          <li className={/[A-Z]/.test(field.value) ? "text-green-500" : ""}>
                            • At least one uppercase letter
                          </li>
                          <li className={/[a-z]/.test(field.value) ? "text-green-500" : ""}>
                            • At least one lowercase letter
                          </li>
                          <li className={/[0-9]/.test(field.value) ? "text-green-500" : ""}>• At least one number</li>
                          <li className={/[^A-Za-z0-9]/.test(field.value) ? "text-green-500" : ""}>
                            • At least one special character
                          </li>
                        </ul>
                      </FormItem>
                    )}
                  />

                  {/* Password Strength Indicator */}
                  {form.watch("password") && (
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${passwordStrength.textColor}`}>{passwordStrength.label}</p>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {registerError && <div className="text-red-500 text-sm font-medium text-center">{registerError}</div>}

                  {registerSuccess && (
                    <div className="text-green-500 text-sm font-medium text-center">{registerSuccess}</div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </Form>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

