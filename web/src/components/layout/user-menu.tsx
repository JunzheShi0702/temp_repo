import $router from "@/lib/router";
import { Button } from "../ui/button";
import { openPage } from "@nanostores/router";
import useAuth from "@/hooks/use-auth";

function UserMenu() {
    const { user, logout } = useAuth();

    function navigateToLogin(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        openPage($router, "login");
    }

    if (!user.name) {
        return (
            <div className="space-y-2 m-3">
                <div>Welcome to Posts!</div>
                <Button onClick={navigateToLogin}>Sign In</Button>
            </div>
        );
    } else {
        return (
            <div className="space-y-2 m-3">
                <div> {`Welcome ${user.name}`}</div>
                <Button onClick={logout} variant="secondary">
                    Sign Out
                </Button>
            </div>
        );
    }
}

export default UserMenu;
