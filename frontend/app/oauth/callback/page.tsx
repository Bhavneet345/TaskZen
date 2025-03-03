"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            localStorage.setItem("token", token); // ✅ Store JWT
            window.history.replaceState({}, document.title, "/dashboard"); // ✅ Remove token from URL
            router.push("/dashboard"); // ✅ Redirect to Dashboard
        } else {
            router.push("/login"); // ✅ Redirect to Login if token is missing
        }
    }, []);

    return <p>🔄 Logging in... Please wait.</p>;
}
