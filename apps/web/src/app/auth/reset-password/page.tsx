"use client";

import { Suspense } from "react";
import { ResetPasswordScreen } from "../../../components/organisms/auth/PasswordResetScreen";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordScreen />
    </Suspense>
  );
}
