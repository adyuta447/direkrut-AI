import { AuthScreen } from "../../../components/organisms/auth/AuthScreen";

interface LoginPageProps {
  searchParams: Promise<{ role?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { role } = await searchParams;

  return (
    <AuthScreen
      mode="login"
      initialRole={role === "hrd" ? "hrd" : "candidate"}
    />
  );
}
