import useAuth from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { getPagePath, redirectPage } from "@nanostores/router";
import $router from "@/lib/router";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

function Register() {
    const { register } = useAuth();

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const name = formData.get("name") as string;
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        await register(name, username, password);
        redirectPage($router, "homepage");
    }

    return (
        <div className="space-y-8">
            <div className="text-3xl font-bold">Register a new account</div>
            <p>
                Or{" "}
                <a
                    href={getPagePath($router, "login")}
                    className="hover:underline"
                >
                    sign in to an existing account
                </a>
            </p>
            <form
                className="flex flex-col gap-3"
                onSubmit={handleFormSubmit}
                method="POST"
            >
                <Label htmlFor="name">Name</Label>
                <Input
                    required
                    type="text"
                    autoComplete="name"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                />

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

                <Button type="submit">Sign Up</Button>
            </form>
        </div>
    );
}

export default Register;
