import { API_URL } from "@/env";
import { CommentType, PostType, UserType } from "./types";

export const fetchPosts = async (
    page: number = 1,
    limit: number = 10,
    username?: string,
): Promise<{ data: PostType[]; total: number }> => {
    let fetchUrl = `${API_URL}/posts?&page=${page}&limit=${limit}`;
    if (username) {
        fetchUrl += `&username=${username}`;
    }
    const response = await fetch(fetchUrl, { credentials: "include" });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const json = await response.json();

    const data: PostType[] = json.data;
    const total: number = json.total;

    return { data, total };
};

export const deletePost = async (id: string): Promise<PostType> => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: PostType = await response.json();

    return data;
};

export const createPost = async (content: string): Promise<PostType> => {
    const newPost = {
        content,
    };

    const response = await fetch(`${API_URL}/posts`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(newPost),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: PostType = await response.json();

    return data;
};

export const updatePost = async (
    id: string,
    content: string,
): Promise<PostType> => {
    const updatedPost = {
        content,
    };

    const response = await fetch(`${API_URL}/posts/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify(updatedPost),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: PostType = await response.json();

    return data;
};

export const fetchComments = async (
    postId: string,
    username?: string,
): Promise<CommentType[]> => {
    let fetchUrl = `${API_URL}/posts/${postId}/comments`;
    if (username) {
        fetchUrl += `&username=${username}`;
    }

    const response = await fetch(fetchUrl, { credentials: "include" });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: CommentType[] = await response.json();

    return data;
};

export const deleteComment = async (
    postId: string,
    commentId: string,
): Promise<CommentType> => {
    const response = await fetch(
        `${API_URL}/posts/${postId}/comments/${commentId}`,
        {
            method: "DELETE",
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: CommentType = await response.json();

    return data;
};

export const createComment = async (
    postId: string,
    content: string,
): Promise<CommentType> => {
    const newComment = {
        content,
        postId,
    };

    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(newComment),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: CommentType = await response.json();

    return data;
};

export const updateComment = async (
    postId: string,
    commentId: string,
    content: string,
): Promise<CommentType> => {
    const updatedComment = {
        content,
    };

    const response = await fetch(
        `${API_URL}/posts/${postId}/comments/${commentId}`,
        {
            headers: { "Content-Type": "application/json" },
            method: "PATCH",
            body: JSON.stringify(updatedComment),
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: CommentType = await response.json();

    return data;
};

export async function signUp(
    name: string,
    username: string,
    password: string,
): Promise<UserType> {
    const response = await fetch(`${API_URL}/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            name,
            username,
            password,
        }),
    });

    if (!response.ok) throw new Error("Unable to create new user account");

    const { user } = await response.json();

    return user;
}

export async function signIn(
    username: string,
    password: string,
): Promise<UserType> {
    const response = await fetch(`${API_URL}/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (!response.ok) throw new Error("Unable to sign you in!");

    const { user } = await response.json();

    return user;
}

export async function signOut(): Promise<boolean> {
    const response = await fetch(`${API_URL}/sign-out`, {
        credentials: "include",
        method: "POST",
    });

    if (!response.ok) throw new Error("Unable to sign you out");

    return true;
}
