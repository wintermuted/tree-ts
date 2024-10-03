declare module "@vfs/tree" {
  export class FileTree {
    constructor(parent: FileTree | null, name: string);
  }

  export class TreeNode {
    constructor(parent: TreeNodeInterface | null);
  }
}

declare interface TreeNodeInterface {
  parent: TreeNodeInterface | null;
  children: TreeNodeInterface[];
}
