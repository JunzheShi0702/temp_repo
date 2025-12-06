import { Button } from "@/components/ui/button";
import { CommentType } from "@/data/types";
import { Pencil2Icon } from "@radix-ui/react-icons";
import DeleteCommentDialog from "./delete-comment-dialog";
import useAuth from "@/hooks/use-auth";

type CommentActionProps = {
    postId: string;
    comment: CommentType;
    setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentActions = (props: CommentActionProps) => {
    const { comment, postId, setShowEditForm } = props;

    const { user } = useAuth();

    const showMutateAction = user && user.username === comment.author.username;

    return (
        <div className="flex justify-end">
            {showMutateAction && (
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => setShowEditForm(true)}
                >
                    <Pencil2Icon className="w-4 h-4" />
                </Button>
            )}
            {showMutateAction && (
                <DeleteCommentDialog comment={comment} postId={postId} />
            )}
        </div>
    );
};

export default CommentActions;
