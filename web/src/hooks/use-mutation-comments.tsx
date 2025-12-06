import { deleteComment, updateComment, createComment } from "@/data/api";
import { addComment, removeComment, updateCommentContent } from "@/lib/store";
import { toast } from "sonner";

function useMutationComments(postId: string) {
    async function deleteCommentById(commentId: string) {
        await deleteComment(postId, commentId);
        removeComment(commentId);
    }

    async function updateCommentById(commentId: string, content: string) {
        await updateComment(postId, commentId, content);
        updateCommentContent(commentId, content);
    }

    async function addNewComment(content: string) {
        try {
            if (!content) throw new Error("Content cannot be empty!");

            const comment = await createComment(postId, content);
            addComment(comment);
        } catch (error) {
            const errorMessage =
                (error as Error).message ?? "Please try again later!";
            toast.error("Sorry! There was an error adding a new comment 🙁", {
                description: errorMessage,
            });
        }
    }

    return {
        deleteCommentById,
        updateCommentById,
        addNewComment,
    };
}

export default useMutationComments;
