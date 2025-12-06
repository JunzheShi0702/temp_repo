export interface PostType {
    id: string;
    content: string;
    date: string;
    author: UserType;
}

export interface CommentType {
    id: string;
    content: string;
    date: string;
    postId: string;
    author: UserType;
}

export type UserType = {
    id: string;
    name: string;
    username: string;
};
