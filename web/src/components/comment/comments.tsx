import useQueryComments from "@/hooks/use-query-comments";
import Comment from "./comment";

type CommentsProps = {
    postId: string;
};

const Comments = (props: CommentsProps) => {
    const { postId } = props;
    const { comments } = useQueryComments(postId);

    return (
        <>
            {comments.map((comment) => (
                <Comment key={comment.id} postId={postId} comment={comment} />
            ))}
        </>
    );
};

export default Comments;
