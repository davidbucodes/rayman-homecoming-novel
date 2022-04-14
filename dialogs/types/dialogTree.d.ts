import { Tree, TreeNode } from "../../common/interfaces/tree";
import { Decision } from "./decision";
import { Dialog } from "./dialog";
import { Effect } from "./effect";

export interface DialogTreeNode extends TreeNode {
    dialogs: Dialog[];
    decisionsTitle?: string;
    decisions: {
        option?: Decision;
        text?: string;
        nextNode: DialogTreeNode;
    }[];
    startEffect?: Effect;
}

export type DialogTree = Tree<DialogTreeNode>;
