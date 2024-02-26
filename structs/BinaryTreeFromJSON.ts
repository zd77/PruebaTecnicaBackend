import * as fs from 'fs'
import * as path from 'path'
import { InsureData } from '../api/v1/example/interfaces/insureData';

export const initDataTreeFromJSON = () => {
  const filepath = path.resolve(__dirname,"../tasas/vidaInsure.json")
  const jsonData = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  const arbolDatos = new BinaryTreeFromJSON();

  jsonData.forEach((data: InsureData) => {
    arbolDatos.insertar(data);
  });

  return arbolDatos
}

class TreeNode {
  data: InsureData;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(data: InsureData) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export class BinaryTreeFromJSON {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  insertar(data: InsureData) {
    const nuevoNodo = new TreeNode(data);

    if (this.root === null) {
      this.root = nuevoNodo;
    } else {
      this.insertarNodo(this.root, nuevoNodo);
    }
  }

  private insertarNodo(nodo: TreeNode, nuevoNodo: TreeNode) {
    if (nuevoNodo.data.Edad < nodo.data.Edad) {
      if (nodo.left === null) {
        nodo.left = nuevoNodo;
      } else {
        this.insertarNodo(nodo.left, nuevoNodo);
      }
    } else {
      if (nodo.right === null) {
        nodo.right = nuevoNodo;
      } else {
        this.insertarNodo(nodo.right, nuevoNodo);
      }
    }
  }

  buscarPorEdad(edad: number): InsureData | null {
    return this.buscarEnArbol(this.root, edad);
  }

  private buscarEnArbol(node: TreeNode | null, edad: number): InsureData | null {
    if (node === null) {
      return null;
    }

    if (edad === node.data.Edad) {
      return node.data;
    }

    if (edad < node.data.Edad) {
      return this.buscarEnArbol(node.left, edad);
    } else {
      return this.buscarEnArbol(node.right, edad);
    }
  }
}