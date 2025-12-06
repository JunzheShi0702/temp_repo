import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toggleShowAddComment } from "@/lib/store";
import useMutationComments from "@/hooks/use-mutation-comments";

type AddCommentProps = {
    postId: string;
};

const AddComment = (props: AddCommentProps) => {
    const { postId } = props;

    const [content, setContent] = useState<string>("");

    const { addNewComment } = useMutationComments(postId);

    async function handleSave(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        addNewComment(content);

        setContent("");
        toggleShowAddComment();
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
                        toggleShowAddComment();
                        setContent("");
                    }}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default AddComment;
