import { CommentType } from "@/data/types";
import { useState } from "react";
import CommentActions from "./comment-actions";
import EditComment from "./edit-comment";
import Author from "@/shared/author";

type CommentProps = {
    postId: string;
    comment: CommentType;
};

const Comment = (props: CommentProps) => {
    const { postId, comment } = props;

    const [showEditForm, setShowEditForm] = useState<boolean>(false);

    if (showEditForm) {
        return (
            <EditComment
                postId={postId}
                comment={comment}
                setShowEditForm={setShowEditForm}
            />
        );
    } else
        return (
            <div className="p-1 border-b">
                <div className="flex items-center justify-between pl-4">
                    <div className="text-xs text-muted-foreground">
                        {new Date(comment.date).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                        })}
                        <Author author={comment.author}></Author>
                    </div>
                    <CommentActions
                        comment={comment}
                        postId={postId}
                        setShowEditForm={setShowEditForm}
                    />
                </div>
                <p className="p-4">{comment.content}</p>
            </div>
        );
};

export default Comment;
