import { Button } from "@/components/ui/button";
import { PostType } from "@/data/types";
import { ChatBubbleIcon, Pencil2Icon } from "@radix-ui/react-icons";
import DeletePostDialog from "./delete-post-dialog";
import { openPage } from "@nanostores/router";
import $router from "@/lib/router";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";

type PostActionProps = {
    post: PostType;
    setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostActions = (props: PostActionProps) => {
    const { post, setShowEditForm } = props;
    const { user } = useAuth();

    const showMutateAction = user && user.username === post.author.username;

    const authGuard = () => {
        if (user.username) return true;
        toast.error("Sorry! You need to be signed in to do that 🙁", {
            description: "Please sign in or create an account to continue.",
        });
        return false;
    };

    function openComments(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        authGuard() && openPage($router, "post", { postId: post.id });
    }

    return (
        <div className="flex justify-end">
            <Button variant={"ghost"} size={"icon"} onClick={openComments}>
                <ChatBubbleIcon className="w-4 h-4" />
            </Button>
            {showMutateAction && (
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => setShowEditForm(true)}
                >
                    <Pencil2Icon className="w-4 h-4" />
                </Button>
            )}
            {showMutateAction && <DeletePostDialog post={post} />}
        </div>
    );
};

export default PostActions;
