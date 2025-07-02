import { useState } from "react";
import { useRouter } from 'next/router'
import { cn } from "../lib/utils";
import { Button } from "@components/button";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/card";
import { Input } from "@components/input";
import { Label } from "@components/label";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please, enter the correct email");
      return;
    }
    if (password.length < 6) {
      setError("Password should be longer, than 6 symbols");
      return;
    }

    const HOST = window.location.host;

    try {
      const response = await fetch('http://' + HOST + ':8052/api/user/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({email, password}),
      });

      if (!response.ok) {
        try {
          const errorText = await response.text();
          const errorData = errorText ? JSON.parse(errorText) : {};
          setError(errorData.message || "Login failed");
        } catch {
          setError("Login failed");
        }
        return;
      }

      try {
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        console.log("Полученный ответ с сервера:", data); // <--- Добавь этот лог
        if (data.token) {
          console.log("Токен к сохранению:", data.token);  // <--- И этот
          localStorage.setItem('token', data.token);
        }
        router.push('/dashboard')
      } catch {
        setError("Invalid server response");
      }

      
    } catch {
      setError("Server error, please try again later")
    }
  };

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Login with your Email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-600 cursor-pointer">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm mt-4">
                Don&apos;t have an account?{" "}
                <Link href="/registration" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
  );
}
