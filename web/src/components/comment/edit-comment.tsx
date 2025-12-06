import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { CommentType } from "@/data/types";
import useMutationComments from "@/hooks/use-mutation-comments";

type EditCommentProps = {
    setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string;
    comment: CommentType;
};

const EditComment = (props: EditCommentProps) => {
    const { setShowEditForm, postId, comment } = props;

    const [content, setContent] = useState<string>("");
    const { updateCommentById } = useMutationComments(postId);

    useEffect(() => {
        if (comment && comment.content !== content) setContent(comment.content);
    }, [comment]);

    async function handleSave(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (content.trim()) {
            await updateCommentById(comment.id, content);

            setContent("");
            setShowEditForm(false);
        }
    }

    return (
        <form className="grid w-full p-4 border-b gap-1.5">
            <Label htmlFor="content">Your Comment</Label>
            <Textarea
                placeholder="Type your new comment here"
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
                <Button type="submit" onClick={handleSave}>
                    Comment
                </Button>
                <Button
                    type="reset"
                    variant="secondary"
                    onClick={() => {
                        setShowEditForm(false);
                        setContent("");
                    }}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default EditComment;
