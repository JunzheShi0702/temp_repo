import { CommentType, PostType, UserType } from "@/data/types";
import { persistentMap } from "@nanostores/persistent";
import { atom } from "nanostores";

export const $hasMorePosts = atom<boolean>(true);

export function setHasMorePosts(hasMore: boolean) {
    $hasMorePosts.set(hasMore);
}

export const $currentPage = atom<number>(1);

export function incrementPage() {
    $currentPage.set($currentPage.get() + 1);
}

export const $posts = atom<PostType[]>([]);

export function setPosts(posts: PostType[]) {
    $posts.set(posts);
}

export function addPost(post: PostType) {
    $posts.set([post, ...$posts.get()]);
}

export function appendPosts(posts: PostType[]) {
    $posts.set([...$posts.get(), ...posts]);
}

export function removePost(id: string) {
    $posts.set($posts.get().filter((post) => post.id !== id));
}

export function updatePostContent(id: string, content: string) {
    $posts.set(
        $posts.get().map((post) => {
            if (post.id !== id) return post;
            return { ...post, content };
        }),
    );
}

export const $showAddPost = atom<boolean>(false);

export function toggleShowAddPost() {
    $showAddPost.set(!$showAddPost.get());
}

export const $comments = atom<CommentType[]>([]);

export function setComments(comments: CommentType[]) {
    $comments.set(comments);
}

export function addComment(comment: CommentType) {
    $comments.set([comment, ...$comments.get()]);
}

export function removeComment(id: string) {
    $comments.set($comments.get().filter((comment) => comment.id !== id));
}

export function updateCommentContent(id: string, content: string) {
    $comments.set(
        $comments.get().map((comment) => {
            if (comment.id !== id) return comment;
            return { ...comment, content };
        }),
    );
}

export const $showAddComment = atom<boolean>(false);

export function toggleShowAddComment() {
    $showAddComment.set(!$showAddComment.get());
}

const defaultUser: UserType = {
    id: "",
    username: "",
    name: "",
};

export const $user = persistentMap<UserType>("user:", defaultUser);

export function setUser(user: UserType) {
    $user.set(user);
}

export function clearUser() {
    $user.set(defaultUser);
}

export const $enableFilter = atom<boolean>(false);

export function setEnableFilter(value: boolean) {
    $enableFilter.set(value);
}
