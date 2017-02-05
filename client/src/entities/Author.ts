import {Post} from "./Post";

export interface Author {
  id?: string;
  firstName?: string;
  lastName?: string;
  posts?: Post[]
}
