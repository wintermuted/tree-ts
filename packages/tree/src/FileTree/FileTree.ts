export interface TreeNodeInterface {
  parent: TreeNodeInterface | null;
  children: TreeNodeInterface[];
  label: string;
  isFile?: boolean;
}

export class TreeNode implements TreeNodeInterface {
  public parent: TreeNodeInterface | null;
  public children: TreeNodeInterface[] = [];
  public label: string = "";
  public isFile: boolean = false;

  constructor(parent: TreeNodeInterface | null) {
    this.parent = parent;
    if (this.parent) this.parent.children.push(this);
  }
}

export class FileTree extends TreeNode {
  constructor(
    parent: TreeNodeInterface["parent"],
    label: string,
    isFile: boolean = false,
  ) {
    super(parent);
    this.label = label;
    this.isFile = isFile;
  }

  listChildren(): string[] {
    return this.children.map((child) => {
      return child.label;
    });
  }
}
