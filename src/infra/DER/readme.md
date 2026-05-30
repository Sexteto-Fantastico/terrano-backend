# DER Folder

This folder documents the database architecture for the project. It explains the data model and provides diagrams and source files used to define the database structure.

## Contents

- `database-structure.dbml`
  - A DBML file that contains the database schema in a human-readable modeling language.
  - Use this file to understand the tables, columns, keys, and relationships before generating diagrams or SQL.

- `database-structure.dbdiagram`
  - A file in the DBDiagram format that defines the same schema as the DBML file visually (it is an auto-generated file).
  - This file is useful when you want to open the model directly in the DBDiagram editor or share it with others.

## Using the DBDiagram extension

To view and edit these files more easily, install the `dbdiagram` extension in VS Code.

1. Open the Extensions view in VS Code (`Ctrl+Shift+X`).
2. Search for `dbdiagram`.
3. Install the extension named `dbdiagram`.
4. Open `database-structure.dbml`.
5. Use the extension features to visualize the database schema and generate diagrams (Use `Ctrl+Shift+P` and search for `DBML: Open Preview to the Side`).

> The files in this folder document the database entity relationships and are intended as a reference for the project data model.
