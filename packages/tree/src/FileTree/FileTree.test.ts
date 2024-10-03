import { FileTree } from "./FileTree";

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
