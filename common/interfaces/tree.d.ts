export interface TreeNode {
    decisions: {
        text?: string;
        nextNode: TreeNode;
    }[];
}

export interface Tree<T extends TreeNode> {
    startNode: T;
}
