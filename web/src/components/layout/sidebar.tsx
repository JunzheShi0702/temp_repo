import {
    HomeIcon,
    MagnifyingGlassIcon,
    PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useStore } from "@nanostores/react";
import {
    $showAddComment,
    $showAddPost,
    toggleShowAddComment,
    toggleShowAddPost,
} from "@/lib/store";
import $router from "@/lib/router";
import { openPage } from "@nanostores/router";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";

const Sidebar = () => {
    const page = useStore($router);

    if (!page) return null;

    const showAddPost = useStore($showAddPost);
    const showAddComment = useStore($showAddComment);

    const { user } = useAuth();

    function goHome(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        openPage($router, "homepage");
    }

    function authGuard() {
        if (user && user.username !== "") return true;
        toast.error("Sorry! You need to be signed in to do that 🙁", {
            description: "Please sign in or create an account to continue.",
        });
        return false;
    }

    return (
        <div className="flex flex-col items-end p-2 space-y-2">
            <Button
                aria-label={"Home"}
                variant="ghost"
                size="icon"
                onClick={goHome}
            >
                <HomeIcon className="w-5 h-5" />
            </Button>
            <Button aria-label={"Search"} variant="ghost" size="icon">
                <MagnifyingGlassIcon className="w-5 h-5" />
            </Button>

            {page.route === "homepage" && !showAddPost && (
                <Button
                    aria-label={"Make a Post"}
                    variant="default"
                    size="icon"
                    onClick={() => authGuard() && toggleShowAddPost()}
                >
                    <PlusCircledIcon className="w-5 h-5" />
                </Button>
            )}

            {page.route === "post" && !showAddComment && (
                <Button
                    aria-label={"Make a Comment"}
                    variant="secondary"
                    size="icon"
                    onClick={() => authGuard() && toggleShowAddComment()}
                >
                    <PlusCircledIcon className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
};

export default Sidebar;
