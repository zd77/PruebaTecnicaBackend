export class NodoArbol {
  valor: number;
  izquierda: NodoArbol | null;
  derecha: NodoArbol | null;

  constructor(valor: number) {
    this.valor = valor;
    this.izquierda = null;
    this.derecha = null;
  }
}

export class ArbolBinario {
  raiz: NodoArbol | null;

  constructor() {
    this.raiz = null;
  }

  insertar(valor: number) {
    const nuevoNodo = new NodoArbol(valor);

    if (this.raiz === null) {
      this.raiz = nuevoNodo;
    } else {
      this.insertarNodo(this.raiz, nuevoNodo);
    }
  }

  private insertarNodo(nodo: NodoArbol, nuevoNodo: NodoArbol) {
    if (nuevoNodo.valor < nodo.valor) {
      if (nodo.izquierda === null) {
        nodo.izquierda = nuevoNodo;
      } else {
        this.insertarNodo(nodo.izquierda, nuevoNodo);
      }
    } else {
      if (nodo.derecha === null) {
        nodo.derecha = nuevoNodo;
      } else {
        this.insertarNodo(nodo.derecha, nuevoNodo);
      }
    }
  }

  buscar(valor: number): boolean {
    return this.buscarEnArbol(this.raiz, valor);
  }

  private buscarEnArbol(nodo: NodoArbol | null, valor: number): boolean {
    if (nodo === null) {
      return false;
    }

    if (valor === nodo.valor) {
      return true;
    }

    if (valor < nodo.valor) {
      return this.buscarEnArbol(nodo.izquierda, valor);
    } else {
      return this.buscarEnArbol(nodo.derecha, valor);
    }
  }

  construirDesdeArray(numeros: number[]) {
    for (const num of numeros) {
      this.insertar(num);
    }
  }

  imprimirArbol() {
    this.imprimirNodo(this.raiz, 0);
  }

  private imprimirNodo(nodo: NodoArbol | null, nivel: number) {
    if (nodo === null) {
      return;
    }

    this.imprimirNodo(nodo.derecha, nivel + 1);
    console.log(' '.repeat(nivel * 4) + `${nodo.valor}`);
    this.imprimirNodo(nodo.izquierda, nivel + 1);
  }
}

export function valoresComunesEnArboles(
  arbol1: ArbolBinario,
  arbol2: ArbolBinario
): boolean {
  return verificarValoresComunes(arbol1.raiz, arbol2);
}

export function verificarValoresComunes(
  nodo: NodoArbol | null,
  arbol: ArbolBinario
): boolean {
  if (nodo === null) {
    return false;
  }

  if (arbol.buscar(nodo.valor)) {
    return true;
  }

  return (
    verificarValoresComunes(nodo.izquierda, arbol) ||
    verificarValoresComunes(nodo.derecha, arbol)
  );
}

/*
// Uso de la función:
const array1 = [3, 6, 9, 12, 15];
const array2 = [8, 9, 10];
 
const arbol1 = new ArbolBinario();
const arbol2 = new ArbolBinario();
 
arbol1.construirDesdeArray(array1);
arbol2.construirDesdeArray(array2);
 
const tieneValoresComunes = valoresComunesEnArboles(arbol1, arbol2);
console.log(`¿Los árboles tienen valores en común?: ${tieneValoresComunes}`);
*/
