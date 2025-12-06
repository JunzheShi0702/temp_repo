import { signIn, signOut, signUp } from "@/data/api";
import { $user, clearUser, setUser } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";

function useAuth() {
    const user = useStore($user);

    async function login(username: string, password: string) {
        try {
            const user = await signIn(username, password);
            setUser(user);
        } catch (err) {
            const errorMessage =
                (err as Error).message ?? "Please try again later";

            toast.error("Sorry, there was an error logging in!", {
                description: errorMessage,
            });
            throw err;
        }
    }

    async function register(name: string, username: string, password: string) {
        try {
            const user = await signUp(name, username, password);
            setUser(user);
        } catch (err) {
            const errorMessage =
                (err as Error).message ?? "Please try again later";

            toast.error("Sorry, there was an error signing up!", {
                description: errorMessage,
            });
            throw err;
        }
    }

    async function logout() {
        try {
            await signOut();
            clearUser();
        } catch (err) {
            const errorMessage =
                (err as Error).message ?? "Please try again later";

            toast.error("Sorry, there was an error logging out!", {
                description: errorMessage,
            });
            throw err;
        }
    }

    return {
        user,
        login,
        logout,
        register,
    };
}

export default useAuth;
