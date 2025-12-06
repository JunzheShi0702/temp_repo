import { createPost, deletePost, updatePost } from "@/data/api";
import { addPost, removePost, updatePostContent } from "@/lib/store";
import { toast } from "sonner";

function useMutationPosts() {
    async function deletePostById(id: string) {
        await deletePost(id);
        removePost(id);
    }

    async function updatePostById(id: string, content: string) {
        await updatePost(id, content);
        updatePostContent(id, content);
    }

    async function addNewPost(content: string) {
        try {
            if (!content) throw new Error("Content cannot be empty!");

            const post = await createPost(content);
            addPost(post);
        } catch (error) {
            const errorMessage =
                (error as Error).message ?? "Please try again later!";
            toast.error("Sorry! There was an error adding a new post 🙁", {
                description: errorMessage,
            });
        }
    }

    return {
        deletePostById,
        updatePostById,
        addNewPost,
    };
}

export default useMutationPosts;
