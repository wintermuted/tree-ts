import { VirtualFileSystem } from "./VirtualFileSystem";

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

      test('thows an error when trying to cd with too many ".."', () => {
        const fs = new VirtualFileSystem();
        fs.mkdir("child_A");
        fs.mkdir("child_B");

        expect(fs.currentDirectory.label).toBe("root");

        fs.cd("child_A");

        expect(fs.currentDirectory.label).toBe("child_A");

        expect(() => fs.cd("../../")).toThrow(
          "Cannot change directory to: '../../'.  It is too many levels up.",
        );
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

    test("cd to a non-existent directory throws an error", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");

      expect(() => fs.cd("child_C")).toThrow(
        "Cannot change directory to: 'child_C' The directory does not exist.",
      );
    });

    test("cd to a file throws an error", () => {
      const fs = new VirtualFileSystem();
      fs.touch("file_A");

      expect(() => fs.cd("file_A")).toThrow(
        "Cannot change directory to: 'file_A'.  It is a file.",
      );
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

  describe("mkdir", () => {
    test("mkdir creates a new directory in the current directory", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");

      expect(fs.ls()).toEqual(["child_A", "child_B"]);

      fs.cd("child_A");

      expect(fs.currentDirectory.isFile).toBe(false);
    });
  });

  describe("touch", () => {
    test("touch creates a new file in the current directory", () => {
      const fs = new VirtualFileSystem();
      fs.touch("file_A");
      fs.touch("file_B");

      expect(fs.ls()).toEqual(["file_A", "file_B"]);
      expect(() => fs.cd("file_A")).toThrow(
        "Cannot change directory to: 'file_A'.  It is a file.",
      );
    });
  });

  describe("rm", () => {
    test("rm removes a file from the current directory", () => {
      const fs = new VirtualFileSystem();
      fs.touch("file_A");
      fs.touch("file_B");

      expect(fs.ls()).toEqual(["file_A", "file_B"]);

      fs.rm("file_A");

      expect(fs.ls()).toEqual(["file_B"]);

      fs.rm("file_B");

      expect(fs.ls()).toEqual([]);
    });

    test("rm throws an error if recursive is not true when calling rm on a directory", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");

      expect(fs.ls()).toEqual(["child_A", "child_B"]);
      expect(() => fs.rm("child_A")).toThrow("rm: 'child_A' is a directory.");
    });

    test("rm removes a directory when recursive and force is true", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.mkdir("child_B");

      expect(fs.ls()).toEqual(["child_A", "child_B"]);

      fs.rm("child_A", true);

      expect(fs.ls()).toEqual(["child_B"]);
    });

    test("rm throws an error when trying to remove a non-existent file", () => {
      const fs = new VirtualFileSystem();
      fs.touch("file_A");
      fs.touch("file_B");

      expect(() => fs.rm("file_C")).toThrow(
        "Cannot remove: 'file_C'.  It does not exist.",
      );
    });

    test("rm removes nested directories when recursive is true", () => {
      const fs = new VirtualFileSystem();
      fs.mkdir("child_A");
      fs.cd("child_A");
      fs.mkdir("child_A_A");
      fs.cd("child_A_A");
      fs.mkdir("child_A_A_A");

      expect(fs.ls()).toEqual(["child_A_A_A"]);

      fs.cd("../../");

      expect(fs.ls()).toEqual(["child_A"]);

      fs.rm("child_A/child_A_A/child_A_A_A", true);

      expect(fs.currentDirectory.label).toBe("root");
      expect(fs.ls()).toEqual(["child_A"]);

      fs.cd("child_A");

      expect(fs.ls()).toEqual(["child_A_A"]);

      fs.cd("child_A_A");

      expect(fs.ls()).toEqual([]);
    });
  });
});
