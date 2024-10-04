# @vfs/vfs

[![Node.js CI](https://github.com/wintermuted/tree-ts/actions/workflows/node.js.yml/badge.svg)](https://github.com/wintermuted/tree-ts/actions/workflows/node.js.yml)

## Introduction

- This repository uses TypeScript and NPM Workspaces to provide the basic programming environment.  
- NPM Workspaces facilitates the creation of distinct NPM modules, which we will leverage in the future to add additional functionality in a modular manner.
- The repository has no regular dependencies and instead leverages native methods for the implementation.  Basic devDependencies are included to support Typescript compilation, Testing, and linting the code.

## Getting Started

This is partially a completed implementation.  As a result, the core functionality is demonstrated through the associated test suites, which exercises the functionality in an in-memory environment.  Completing the steps below will allow you to see all the passing test cases.

### Install

```
npm run bootstrap
```

### Lint

```
npm run lint
npm run lint:fix
```

### Test

```
npm run test
npm run test:cover
```

## Documentation

### `@vfs/tree`

#### `FileTree.ts` - Datastructure

- Contains `TreeNodeInterface` and it's implementation `TreeNode`.  
- Contains `FileTree`, which makes use of `TreeNode` and provides for the basic construction of a tree datastructure that can be used in a Virtual File System.

#### `VirtualFileSystem.ts` - Virtual File System interface

- Contains `VirtualFileSystem`, which on construction intializes a `FileTree` as `root` to the `root` field, and sets it to the `currentDirectory` field.
- `VirtualFileSystem` implements a collection of public and private methods that help us implement the basics of a unix-like file system that can be interacted with in memory.

##### Implemented

- `pwd`
- `ls`
- `mkdir`
- `touch`
- `cd`
- `rm`
  - (-f flag is not yet implemented)

##### Unimplemented

- `cat`
- `mv`
- `find`
- `ln`

## Future improvement

- While not a completed implementation, this project demonstrates the basic of navigating a file tree and interacting with it.  
- As I implemented `cd` and `rm` I found it necessary to introduce some basic validation of the input path, and a means for memoizing the directory being interacted with.  After doing so, I still feel that the validation needs to be more robust and generalizable so that the code can be reused across implementations like `mv`, `cp` and `ln`  that would require the evaluation of two paths.  This might look something like a regex to eliminate the time cost of the loops that I'm currently performing or a library purpose built for this need.
- The present implementation is just a class that could be used in another programming environment, but I think it would be interesting to create a CLI interface with `oclif`.
