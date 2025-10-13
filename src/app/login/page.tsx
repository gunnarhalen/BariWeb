"use client";

import Logo from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const Router = useRouter();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <Button
              variant="ghost"
              onClick={() => Router.push("/")}
              className="cursor-pointer hover:bg-transparent"
            >
              <Logo width={120} />
            </Button>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/login_background.png')",
            backgroundSize: "70%",
            backgroundRepeat: "repeat",
            opacity: 0.3,
          }}
        />
      </div>
    </div>
  );
}
