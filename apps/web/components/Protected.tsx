"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { setTokens } from "@/store/slices/authSlice";

export default function Protected({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const accessToken = useAppSelector(
    (state: RootState) => state.auth.accessToken
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (accessToken) {
      setAllowed(true);
      return;
    }

    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");
    if (storedAccess) {
      dispatch(
        setTokens({
          accessToken: storedAccess,
          refreshToken: storedRefresh || undefined,
        })
      );
      setAllowed(true);
      return;
    }

    const redirectTo = encodeURIComponent(pathname || "/");
    router.replace(`/login?redirect=${redirectTo}`);
  }, [accessToken, dispatch, pathname, router]);
  if (!allowed && !accessToken) {
    return (
      <div className="card">
        <p>Prüfe Anmeldung...</p>
      </div>
    );
  }

  return <>{children}</>;
}
