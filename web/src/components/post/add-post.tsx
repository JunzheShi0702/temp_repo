import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toggleShowAddPost } from "@/lib/store";
import useMutationPosts from "@/hooks/use-mutation-posts";

const AddPost = () => {
    const [content, setContent] = useState<string>("");

    const { addNewPost } = useMutationPosts();

    async function handleSave(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        addNewPost(content);

        setContent("");
        toggleShowAddPost();
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
                        toggleShowAddPost();
                        setContent("");
                    }}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default AddPost;
