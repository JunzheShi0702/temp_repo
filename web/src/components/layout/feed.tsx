import AddPost from "../post/add-post";
import Header from "./header";
import { useStore } from "@nanostores/react";
import { $showAddComment, $showAddPost } from "@/lib/store";
import Comments from "../comment/comments";
import Posts from "../post/posts";
import AddComment from "../comment/add-comment";

type FeedProps = {
    postId?: string;
};

const Feed = (props: FeedProps) => {
    const { postId } = props;

    if (postId) {
        const showAddComment = useStore($showAddComment);

        return (
            <div className="flex flex-col w-full min-h-screen border-x">
                <Header />
                {showAddComment && <AddComment postId={postId} />}
                {<Comments postId={postId} />}
            </div>
        );
    } else {
        const showAddPost = useStore($showAddPost);

        return (
            <div className="flex flex-col w-full min-h-screen border-x">
                <Header />
                {showAddPost && <AddPost />}
                <Posts />
            </div>
        );
    }
};

export default Feed;
