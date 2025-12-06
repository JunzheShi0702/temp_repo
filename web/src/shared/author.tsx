import { UserType } from "@/data/types";

type AuthorProps = {
    author: UserType;
};

function Author(props: AuthorProps) {
    const { author } = props;

    return (
        <div className="flex items-center gap-1">
            <p className="text-sm font-median leading-none"> {author.name} </p>
            <p className="text-sm text-muted-foreground">@{author.username}</p>
        </div>
    );
}

export default Author;
