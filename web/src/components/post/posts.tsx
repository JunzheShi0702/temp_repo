import { useStore } from "@nanostores/react";
import InfiniteScroll from "./infinite-scroll";
import Post from "./post";
import useQueryPosts from "@/hooks/use-query-posts";
import { $currentPage, $hasMorePosts } from "@/lib/store";

const Posts = () => {
    const { posts, loadPosts } = useQueryPosts();

    const currentPage = useStore($currentPage);
    const hasMorePosts = useStore($hasMorePosts);

    function loadMorePosts() {
        if (hasMorePosts) loadPosts(currentPage + 1);
    }

    return (
        <>
            <InfiniteScroll loadMore={loadMorePosts}>
                {posts
                    // .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
                    .map((post) => (
                        <Post key={post.id} post={post} />
                    ))}
            </InfiniteScroll>
        </>
    );
};

export default Posts;
