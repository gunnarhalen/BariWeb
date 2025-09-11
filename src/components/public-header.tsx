"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface PublicHeaderProps {
  showHomeLink?: boolean;
}

export default function PublicHeader({
  showHomeLink = false,
}: PublicHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Logo width={120} height={30} />
          </div>
          <div className="flex items-center gap-4">
            {showHomeLink && (
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Home
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => router.push("/pricing")}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Planos
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
