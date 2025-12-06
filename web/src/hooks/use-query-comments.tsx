import { useEffect } from "react";
import { fetchComments } from "@/data/api";
import { useStore } from "@nanostores/react";
import { setComments, $comments, $enableFilter } from "@/lib/store";

import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";

function useQueryComments(postId: string) {
    const comments = useStore($comments);
    const { user } = useAuth();
    const enableFilter = useStore($enableFilter);

    const loadComments = async (page: number = 1, limit: number = 20) => {
        try {
            const fetchedComments = await fetchComments(
                postId,
                enableFilter ? user?.username : undefined,
            );
            setComments([...fetchedComments]);
        } catch (error) {
            const errorMessage =
                (error as Error).message ?? "Please try again later!";
            toast.error("Sorry! There was an error reading the comments 🙁", {
                description: errorMessage,
                style: {
                    border: "#dd524f",
                    background: "#dd524f",
                },
            });
        }
    };

    useEffect(() => {
        loadComments(1);
    }, [postId, enableFilter]);

    return { comments };
}

export default useQueryComments;
