import useAuth from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { getPagePath, redirectPage } from "@nanostores/router";
import $router from "@/lib/router";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

function Login() {
    const { login } = useAuth();

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        await login(username, password);
        redirectPage($router, "homepage");
    }

    return (
        <div className="space-y-8">
            <div className="text-3xl font-bold">Sign into your account</div>
            <p>
                Or{" "}
                <a
                    href={getPagePath($router, "register")}
                    className="hover:underline"
                >
                    create a new account
                </a>
            </p>
            <form
                className="flex flex-col gap-3"
                onSubmit={handleFormSubmit}
                method="POST"
            >
                <Label htmlFor="username">Username</Label>
                <Input
                    required
                    type="text"
                    autoComplete="username"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                />

                <Label htmlFor="password">Password</Label>
                <Input
                    required
                    type="password"
                    autoComplete="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                />

                <Button type="submit">Sign In</Button>
            </form>
        </div>
    );
}

export default Login;
