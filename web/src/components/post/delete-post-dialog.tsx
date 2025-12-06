import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PostType } from "@/data/types";
import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import useMutationPosts from "@/hooks/use-mutation-posts";

type DeletePostDialogProps = {
    post: PostType;
};

function DeletePostDialog(props: DeletePostDialogProps) {
    const { post } = props;
    const { deletePostById } = useMutationPosts();

    async function removePost(): Promise<void> {
        await deletePostById(post.id);
    }

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your post, are you sure
                            you want to do this?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={removePost}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default DeletePostDialog;
