import { Group } from "./group.model";
import { User } from "./user.model";

export interface Post {
   id?: number;
   title: string;
   format: string;
   content: string;
   creator: string;
   groupOfPost?: string;
   date: Date;
}
