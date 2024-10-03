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

export class VirtualFileSystem {
  public root: FileTree;
  public currentDirectory: FileTree;

  // Initialize the file system with a root directory
  constructor() {
    this.root = new FileTree(null, "root");
    this.currentDirectory = this.root;
  }

  // pwd - print working directory
  public pwd(): string {
    let path = "";
    let currentDirectory = this.currentDirectory;

    if (currentDirectory === this.root) {
      path = "/";
    } else {
      while (currentDirectory !== this.root) {
        path = `/${currentDirectory.label}${path}`;
        currentDirectory = currentDirectory.parent as FileTree;
      }
    }

    return path;
  }

  // ls - list children of current directory
  public ls(): string[] {
    return this.listChildren(this.currentDirectory);
  }

  // mkdir - make directory
  public mkdir(label: string): void {
    this.makeDirectory(this.currentDirectory, label);
  }

  // cd - change directory
  public cd(label: string): void {
    const levels = label.split("/").filter((level) => level);

    // if label is / go to root
    if (label === "/") {
      this.currentDirectory = this.root;
      return;
    }

    // if label is ".." go up one level
    if (label === "..") {
      if (this.currentDirectory !== this.root) {
        this.currentDirectory = this.currentDirectory.parent as FileTree;
      }
      return;
    }

    // if label leads ../ go up as many levels as specified
    if (label.startsWith("../")) {
      // Check how manu levels up to go
      const levelsUp = levels.filter((level) => level === "..").length;

      // Calculate the number of levels to root from current directory
      let levelsToRoot = 0;
      let memoCurrentDirectory = this.currentDirectory;
      while (memoCurrentDirectory !== this.root) {
        memoCurrentDirectory = memoCurrentDirectory.parent as FileTree;
        levelsToRoot++;
      }

      // Go up the the number of levels specified
      let tempCurrentDirectory = this.currentDirectory;
      if (levelsUp <= levelsToRoot) {
        for (let i = 0; i < levelsUp; i++) {
          tempCurrentDirectory = tempCurrentDirectory.parent as FileTree;
        }
      }

      // Go down the number of levels specified
      if (levelsUp < levels.length) {
        const levelsDown = levels.slice(levelsUp);
        levelsDown.forEach((level) => {
          const childNode = tempCurrentDirectory.children.find((child) => {
            return child.label === level;
          }) as FileTree;

          if (childNode) {
            tempCurrentDirectory = childNode;
          }
        });
      }
      this.currentDirectory = tempCurrentDirectory;
      return;
    }

    // Change the directory to the levels specified
    let tempCurrentDirectory = this.currentDirectory;
    levels.forEach((level) => {
      const childNode = tempCurrentDirectory.children.find((child) => {
        return child.label === level;
      }) as FileTree;

      if (childNode) {
        tempCurrentDirectory = childNode;
      }
    });

    this.currentDirectory = tempCurrentDirectory;
    return;
  }

  // rm - remove file or directory
  public rm(): void {
    // Implement rm
  }

  public cat(): void {
    // Implement cat
  }

  // mv - move file or directory
  public mv(): void {
    // Implement mv
  }

  public find(): void {
    // Implement find
  }

  public ln(): void {
    // Implement ln
  }

  // touch - create file
  public touch(label: string): void {
    this.makeFile(this.currentDirectory, label);
  }

  // list children of a node
  private listChildren(node: FileTree): string[] {
    return node.listChildren();
  }

  // create directory
  private makeDirectory(parent: FileTree, label: string): FileTree {
    return new FileTree(parent, label);
  }

  // create file
  private makeFile(parent: FileTree, label: string): FileTree {
    return new FileTree(parent, label, true);
  }
}
