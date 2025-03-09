// import AuthForm from "@/components/auth/auth-form"

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
//       <AuthForm />
//     </main>
//   )
// }

import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10" style={{ backgroundImage: 'url(/path/to/your/image.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
