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
import { CommentType } from "@/data/types";
import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import useMutationComments from "@/hooks/use-mutation-comments";

type DeleteCommentDialogProps = {
    comment: CommentType;
    postId: string;
};

function DeleteCommentDialog(props: DeleteCommentDialogProps) {
    const { postId, comment } = props;
    const { deleteCommentById } = useMutationComments(postId);

    async function removeComment(): Promise<void> {
        await deleteCommentById(comment.id);
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
                            This will permanently delete your comment, are you
                            sure you want to do this?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={removeComment}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default DeleteCommentDialog;
