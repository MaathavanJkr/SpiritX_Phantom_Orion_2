import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

import { login } from "../../services/auth.service";
import { AuthLoginModel } from "../../types/auth.type";

import { useNavigate } from "react-router";

export default function SignIn() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit = (authData: AuthLoginModel) => {
    setLoading(true);
    login(authData)
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user_id", response.user.id);
        localStorage.setItem("username", response.user.username);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setLoginError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm
          onSubmit={onSubmit}
          loginError={loginError}
          loading={loading}
        />
      </AuthLayout>
    </>
  );
}
