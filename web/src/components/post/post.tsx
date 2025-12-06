import { PostType } from "@/data/types";
import PostActions from "./post-actions";
import { useState } from "react";
import EditPost from "./edit-post";
import Author from "@/shared/author";

type PostProps = {
    post: PostType;
};

const Post = (props: PostProps) => {
    const { post } = props;

    const [showEditForm, setShowEditForm] = useState<boolean>(false);

    if (showEditForm) {
        return <EditPost post={post} setShowEditForm={setShowEditForm} />;
    } else
        return (
            <div className="p-1 border-b">
                <div className="flex items-center justify-between pl-4">
                    <div className="text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                        })}
                        <Author author={post.author}></Author>
                    </div>
                    <PostActions
                        post={post}
                        setShowEditForm={setShowEditForm}
                    />
                </div>
                <p className="p-4">{post.content}</p>
            </div>
        );
};

export default Post;
