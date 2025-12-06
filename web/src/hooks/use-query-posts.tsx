import { useEffect, useState } from "react";
import { fetchPosts } from "@/data/api";
import { useStore } from "@nanostores/react";
import {
    $posts,
    appendPosts,
    incrementPage,
    setHasMorePosts,
    setPosts,
    $enableFilter,
} from "@/lib/store";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";

function useQueryPosts() {
    const posts = useStore($posts);
    const enableFilter = useStore($enableFilter);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const loadPosts = async (page: number = 1, limit: number = 20) => {
        setIsLoading(true);
        try {
            const { data: fetchedPosts, total } = await fetchPosts(
                page,
                limit,
                enableFilter ? user?.username : undefined,
            );
            setHasMorePosts(posts.length + fetchedPosts.length < total);
            if (page === 1) {
                setPosts(fetchedPosts);
            } else {
                appendPosts(fetchedPosts);
                incrementPage();
            }
        } catch (error) {
            const errorMessage =
                (error as Error).message ?? "Please try again later!";
            toast.error("Sorry! There was an error reading the posts 🙁", {
                description: errorMessage,
                style: {
                    border: "#dd524f",
                    background: "#dd524f",
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPosts(1);
    }, [enableFilter]);

    return { posts, loadPosts, isLoading };
}

export default useQueryPosts;
