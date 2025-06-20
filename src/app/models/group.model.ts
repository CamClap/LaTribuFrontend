import { User } from "./user.model";
import { Post } from "./post.model";

export interface Group{
    id: number;
    name: string;
    users: User[];
    posts: Post[];
}
