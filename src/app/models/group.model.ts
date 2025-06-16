import { Person } from "./person.model";
import { Post } from "./post.model";

export interface Group{
    id: number;
    name: string;
    users: Person[];
    posts: Post[];
}