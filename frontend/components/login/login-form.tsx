"use client"

import type React from "react"

import { useState } from "react"
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
import { login } from "@/services/authService"

// Login form schema
const loginSchema = z.object({
  username: z.string().min(8, { message: "Username must be at least 8 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()

  // Login form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    setLoginError(null)

    try {
      const response = await login(values.username, values.password)
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("user_role", response.user.role)
      localStorage.setItem("user_name", response.user.username)
      localStorage.setItem("user_id", response.user.id.toString())
      router.push("/dashboard")
    } catch (error) {
      setLoginError("Invalid username or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">Login to your Acme Inc account</p>
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
                      </FormItem>
                    )}
                  />

                  {loginError && <div className="text-red-500 text-sm font-medium text-center">{loginError}</div>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </Form>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/auth/sign-up" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-white md:block">
            <img src="/l.png" alt="Image" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

