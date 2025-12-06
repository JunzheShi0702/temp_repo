import Sidebar from "@/components/layout/sidebar";
import Feed from "./components/layout/feed";
import { Toaster } from "@/components/ui/sonner";
import { useStore } from "@nanostores/react";
import $router from "./lib/router";
import Register from "./components/register";
import Login from "./components/login";
import UserMenu from "./components/layout/user-menu";

function App() {
    const page = useStore($router);

    if (!page) {
        return <>404 Not Found</>;
    }

    if (page.route === "login" || page.route === "register") {
        return (
            <div className="flex items-center justify-center min-h-dvh">
                {page.route === "login" && <Login />}
                {page.route === "register" && <Register />}
            </div>
        );
    }

    return (
        <div className="flex min-h-dvh">
            <div className="flex-1 min-w-14">
                <Sidebar />
            </div>
            <div className="w-full max-w-md mx-auto md:max-w-lg">
                {page.route === "homepage" && <Feed />}
                {page.route === "post" && <Feed postId={page.params.postId} />}
            </div>
            <div className="flex-1 min-w-14">
                <UserMenu />
            </div>
            <Toaster />
        </div>
    );
}

export default App;
