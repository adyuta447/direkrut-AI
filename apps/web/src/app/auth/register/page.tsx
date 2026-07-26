import { AuthScreen } from "../../../components/organisms/auth/AuthScreen";

interface RegisterPageProps {
  searchParams: Promise<{ role?: string | string[] }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { role } = await searchParams;

  return (
    <AuthScreen
      mode="register"
      initialRole={role === "hrd" ? "hrd" : "candidate"}
    />
  );
}
