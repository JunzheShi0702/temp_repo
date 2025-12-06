import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { PostType } from "@/data/types";
import useMutationPosts from "@/hooks/use-mutation-posts";

type EditPostProps = {
    setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
    post: PostType;
};

const EditPost = (props: EditPostProps) => {
    const { setShowEditForm, post } = props;

    const [content, setContent] = useState<string>("");
    const { updatePostById } = useMutationPosts();

    useEffect(() => {
        if (post && post.content !== content) setContent(post.content);
    }, [post]);

    async function handleSave(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (content.trim()) {
            await updatePostById(post.id, content);

            setContent("");
            setShowEditForm(false);
        }
    }

    return (
        <form className="grid w-full p-4 border-b gap-1.5">
            <Label htmlFor="content">Your Post</Label>
            <Textarea
                placeholder="Type your new post here"
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
                <Button type="submit" onClick={handleSave}>
                    Post
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

export default EditPost;
