import { DialogTree } from "./dialogTree";

export interface World {
    dialogTrees: Record<string, DialogTree>;
    name: string;
}
