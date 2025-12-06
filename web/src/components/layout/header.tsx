import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import $router from "@/lib/router";
import { setEnableFilter } from "@/lib/store";
import { useStore } from "@nanostores/react";

const Header = () => {
    const page = useStore($router);

    const { user } = useAuth();

    const showUserFilter = user && user.username != "";

    if (!page) return null;

    const word = page.route === "homepage" ? "Posts" : "Comments";

    return (
        <div className="flex justify-center gap-3 p-1 border-b">
            {showUserFilter && (
                <Button variant={"link"} onClick={() => setEnableFilter(true)}>
                    My {word}
                </Button>
            )}
            <Button
                variant={"link"}
                disabled={!showUserFilter}
                onClick={() => setEnableFilter(false)}
            >
                All {word}
            </Button>
        </div>
    );
};

export default Header;
