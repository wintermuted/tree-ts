import { FileTree, VirtualFileSystem } from "./index";

describe("FileTree", () => {
  test("root has no children", () => {
    const root = new FileTree(null, "root");
    expect(root.label).toBe("root");
    expect(root.parent).toBe(null);
  });

  test("root has children", () => {
    const root = new FileTree(null, "root");
    const child_A = new FileTree(root, "child_A");
    const child_B = new FileTree(root, "child_B");

    expect(root.children.length).toBe(2);

    expect(child_A.parent).toBe(root);
    expect(child_A.label).toBe("child_A");

    expect(child_B.parent).toBe(root);
    expect(child_B.label).toBe("child_B");
  });

  test("print children to one level", () => {
    const root = new FileTree(null, "root");
    new FileTree(root, "child_A");
    new FileTree(root, "child_B");

    expect(root.listChildren()).toEqual(["child_A", "child_B"]);
  });

  test("print children to two levels", () => {
    const root = new FileTree(null, "root");
    const child_A = new FileTree(root, "child_A");
    new FileTree(root, "child_B");
    new FileTree(child_A, "child_A_A");
    new FileTree(child_A, "child_A_B");

    expect(root.listChildren()).toEqual(["child_A", "child_B"]);
    expect(child_A.listChildren()).toEqual(["child_A_A", "child_A_B"]);
  });
});

describe("VirtualFileSystem", () => {
  test("when initialized, creates a root file tree", () => {
    const fs = new VirtualFileSystem();

    expect(fs.root.label).toBe("root");
    expect(fs.currentDirectory.label).toBe("root");
  });

  describe("cd", () => {
    test("cd with / changes to root directory", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");

      expect(fs.currentDirectory.label).toBe("root");

      fs.cd("child_A");

      expect(fs.currentDirectory.label).toBe("child_A");

      fs.cd("/");

      expect(fs.currentDirectory.label).toBe("root");
    });

    test("cd with with direct child provided changes to that directory", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");

      expect(fs.currentDirectory.label).toBe("root");

      fs.cd("child_A");

      expect(fs.currentDirectory.label).toBe("child_A");
    });

    test("cd to a deeply nested directory", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.cd("child_A");

      expect(fs.currentDirectory.label).toBe("child_A");

      fs.mkdir("child_A_A");
      fs.cd("child_A_A");

      expect(fs.currentDirectory.label).toBe("child_A_A");

      fs.mkdir("child_A_A_A");

      fs.cd("child_A_A_A");

      expect(fs.currentDirectory.label).toBe("child_A_A_A");

      fs.cd("../../../");

      expect(fs.currentDirectory.label).toBe("root");

      fs.cd("child_A/child_A_A/child_A_A_A");

      expect(fs.currentDirectory.label).toBe("child_A_A_A");
    });

    describe('cd with ".."', () => {
      test('cd with ".." from root does nothing', () => {
        const fs = new VirtualFileSystem();
        fs.mkdir("child_A");
        fs.mkdir("child_B");

        expect(fs.currentDirectory.label).toBe("root");

        fs.cd("..");

        expect(fs.currentDirectory.label).toBe("root");
      });

      test('cd with ".." changes to parent directory', () => {
        const fs = new VirtualFileSystem();
        fs.mkdir("child_A");
        fs.mkdir("child_B");

        expect(fs.currentDirectory.label).toBe("root");

        fs.cd("child_A");

        expect(fs.currentDirectory.label).toBe("child_A");

        fs.cd("..");

        expect(fs.currentDirectory.label).toBe("root");
      });

      test('cd with "../child_A" from "child_B" changes to child_A directory', () => {
        const fs = new VirtualFileSystem();
        fs.mkdir("child_A");
        fs.mkdir("child_B");

        expect(fs.currentDirectory.label).toBe("root");

        fs.cd("child_A");

        expect(fs.currentDirectory.label).toBe("child_A");

        fs.cd("../child_B");

        expect(fs.currentDirectory.label).toBe("child_B");
      });
    });

    test('cd with "../child_A/child_A_A" from "child_B" changes to child_A_A directory', () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");
      fs.cd("child_A");
      fs.mkdir("child_A_A");

      expect(fs.currentDirectory.label).toBe("child_A");

      fs.cd("child_A_A");

      expect(fs.currentDirectory.label).toBe("child_A_A");

      fs.cd("../");

      expect(fs.currentDirectory.label).toBe("child_A");

      fs.cd("../");

      expect(fs.currentDirectory.label).toBe("root");

      fs.cd("child_B");

      expect(fs.currentDirectory.label).toBe("child_B");

      fs.cd("../child_A/child_A_A");

      expect(fs.currentDirectory.label).toBe("child_A_A");
    });

    xtest('cd with "~" changes to root directory', () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");

      expect(fs.currentDirectory.label).toBe("root");

      fs.cd("child_A");

      expect(fs.currentDirectory.label).toBe("child_A");

      fs.cd("~");

      expect(fs.currentDirectory.label).toBe("root");
    });
  });

  describe("ls", () => {
    test("ls lists children of current directory", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");

      expect(fs.ls()).toEqual(["child_A", "child_B"]);

      fs.cd("child_A");

      expect(fs.ls()).toEqual([]);
    });
  });

  describe("pwd", () => {
    test("pwd prints working directory when in root", () => {
      const fs = new VirtualFileSystem();

      expect(fs.pwd()).toBe("/");
    });
    test("pwd prints working directory one level down", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");
      fs.cd("child_A");

      expect(fs.pwd()).toBe("/child_A");
    });
    test("pwd prints working directory two levels down", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");
      fs.cd("child_A");
      fs.mkdir("child_A_A");
      fs.mkdir("child_A_B");
      fs.cd("child_A_A");

      expect(fs.pwd()).toBe("/child_A/child_A_A");
    });
  });
});
