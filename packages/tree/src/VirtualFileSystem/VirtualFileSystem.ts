import { FileTree, TreeNodeInterface } from "../FileTree/FileTree";

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
  public mkdir(input: string): void {
    this.makeDirectory(this.currentDirectory, input);
  }

  private findChild(
    children: TreeNodeInterface[],
    label: string,
  ): TreeNodeInterface {
    return children.find((child) => {
      return child.label === label;
    }) as FileTree;
  }

  private getLevelsToRoot(node: FileTree): number {
    let levelsToRoot = 0;
    let memoCurrentDirectory = node;
    while (memoCurrentDirectory !== this.root) {
      memoCurrentDirectory = memoCurrentDirectory.parent as FileTree;
      levelsToRoot++;
    }

    return levelsToRoot;
  }

  private goUpLevels(levels: number): FileTree {
    let tempCurrentDirectory = this.currentDirectory;
    for (let i = 0; i < levels; i++) {
      tempCurrentDirectory = tempCurrentDirectory.parent as FileTree;
    }
    return tempCurrentDirectory;
  }

  private goDownLevels(
    tempCurrentDirectory: FileTree,
    levels: string[],
  ): FileTree {
    levels.forEach((level) => {
      const childNode = this.findChild(
        tempCurrentDirectory.children,
        level,
      ) as FileTree;

      if (!childNode) {
        throw new Error(
          `Cannot change directory to: '${level}' The directory does not exist.`,
        );
      }

      if (childNode.isFile) {
        throw new Error(
          `Cannot change directory to: '${level}'.  It is a file.`,
        );
      }

      if (childNode) {
        tempCurrentDirectory = childNode;
      }
    });
    return tempCurrentDirectory;
  }

  // cd - change directory
  public cd(input: string): void {
    const levels = input.split("/").filter((level) => level);

    // if label is / go to root
    if (input === "/") {
      this.currentDirectory = this.root;
      return;
    }

    // if label is ".." go up one level
    if (input === "..") {
      if (this.currentDirectory !== this.root) {
        this.currentDirectory = this.currentDirectory.parent as FileTree;
      }
      return;
    }

    // if label leads ../ go up as many levels as specified
    if (input.startsWith("../")) {
      // Check how manu levels up to go
      const levelsUp = levels.filter((level) => level === "..").length;
      // Calculate the number of levels to root from current directory
      const levelsToRoot = this.getLevelsToRoot(this.currentDirectory);

      if (levelsUp > levelsToRoot) {
        throw new Error(
          `Cannot change directory to: '${input}'.  It is too many levels up.`,
        );
      }

      // Go up the the number of levels specified
      const tempCurrentDirectory = this.goUpLevels(levelsUp);
      // Go down the number of levels specified
      this.currentDirectory = this.goDownLevels(
        tempCurrentDirectory,
        levels.slice(levelsUp),
      );
      return;
    }

    // Change the directory to the levels specified
    this.currentDirectory = this.goDownLevels(this.currentDirectory, levels);
  }

  // Modify the children of a node to remove the node with the matching name
  private removeNode(children: TreeNodeInterface[], name: string) {
    // const modifiedChildren = children.filter((child) => {
    //   return child.label !== name;
    // });

    const indexOf = children.findIndex((child) => {
      return child.label === name;
    });

    if (indexOf !== -1) {
      children.splice(indexOf, 1);
    }
  }

  // rm - remove file or directory
  // @TODO - implement force
  public rm(input: string, recursive?: boolean): void {
    const levels = input.split("/").filter((level) => level);
    let tempCurrentDirectory = this.currentDirectory;

    // if label leads ../ go up as many levels as specified
    if (input.startsWith("../")) {
      // Check how manu levels up to go
      const levelsUp = levels.filter((level) => level === "..").length;
      // Calculate the number of levels to root from current directory
      const levelsToRoot = this.getLevelsToRoot(this.currentDirectory);

      if (levelsUp > levelsToRoot) {
        throw new Error(
          `Cannot change directory to: '${input}'.  It is too many levels up.`,
        );
      }

      // Go up the the number of levels specified
      tempCurrentDirectory = this.goUpLevels(levelsUp);
      // Go down the number of levels specified
      tempCurrentDirectory = this.goDownLevels(
        tempCurrentDirectory,
        levels.slice(levelsUp),
      );
    }

    let labelOfNodeToRemove = input;
    if (levels.length > 1) {
      tempCurrentDirectory = this.goDownLevels(
        tempCurrentDirectory,
        levels.slice(0, levels.length - 1),
      );
      labelOfNodeToRemove = levels[levels.length - 1];
    }

    const nodeToRemove = tempCurrentDirectory.children.find((child) => {
      return child.label === labelOfNodeToRemove;
    });

    // If the node specified does not exist, throw an error
    if (!nodeToRemove) {
      throw new Error(`Cannot remove: '${input}'.  It does not exist.`);
    }

    // @TODO: handle force
    // If node is a file, and recursive is true, remove the file
    if (nodeToRemove.isFile) {
      this.removeNode(tempCurrentDirectory.children, labelOfNodeToRemove);
    } else if (!nodeToRemove.isFile) {
      if (!recursive) {
        throw new Error(`rm: '${input}' is a directory.`);
      }
      // If node is a directory and recursive is false, throw an error
      this.removeNode(tempCurrentDirectory.children, labelOfNodeToRemove);
    }

    this.currentDirectory = tempCurrentDirectory;
    if (levels.length > 1) {
      this.currentDirectory = this.goUpLevels(levels.length - 1);
    }
  }

  // cat - concatenate files and print on the standard output
  public cat(): void {
    // Implement cat
  }

  // mv - move file or directory
  public mv(): void {
    // Implement mv
  }

  // find - search for files in a directory hierarchy
  public find(): void {
    // Implement find
  }

  // ln - create links
  public ln(): void {
    // Implement ln
  }

  // touch - create file
  public touch(input: string): void {
    this.makeFile(this.currentDirectory, input);
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
