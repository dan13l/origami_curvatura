//Toma el elemento de la pagina para insertar el origami.
const caja = document.getElementById("papel");

// Creo el elemento de rabbit ear
var dibujo = ear.svg()
dibujo.size(2, 1);

const base = {
  vertices_coords: [
      //Ordenados a partir de (0,0) y en el sentido de las manecillas del relog, El centro es 7
      [0,0], [0.5,0], [1, 0], [0.75, Math.sqrt(3)/4], [0.5, Math.sqrt(3)/2], [0.25, Math.sqrt(3)/4], [0.5,1/(2*Math.sqrt(3))],
    ],
  edges_vertices: [
      [0, 1], [1, 2], [2, 3],[3,4],[4,5],[5,0], //Triangulo exterior 0,1,2,3,4,5
      [0,6],[6,3],[2,6],[6,5],[4,6],[6,1], // Mediatrices 6,7, 8,9, 10,11
  ],
  faces_vertices: [[0,1,6],[1,2,6],[2,3,6],[3,4,6],[4,5,6],[5,0,6]],
  edges_assignment: [
      "M", "M", "M","M", "M","M", //triangulo exterior
      "V","M", "V","M", "V","M",
  ]
}

//base.vertices_coords= base.vertices_coords*0.5

/* Hay que organizar un loop que nos de el graph completo
const graph = {
  vertices_coords: [[0, 1], [0.7, 1], [0.7, 0.5]],
  edges_vertices: [[0, 1], [1, 2], [2, 0]],
  faces_vertices: [[0,1,2]],
  edges_assignment: ["M", "M", "V"]
}*/

//Establece el cambio de color
const hsl = (hue) => { return "hsl(" + hue + ", 100%, 50%)"; }

dibujo.origami.vertices(base)
    .childNodes
    .forEach((circle, i, arr) => circle
        .radius(0.03)
        .fill(hsl(i + 180)));

dibujo.origami.edges(base).strokeWidth(0.01);

/* Algo asi deberia intentar
dibujo.size(ear.svg.origami.getViewBox(base))
	.padding(SIZE / 20)
	.strokeWidth(SIZE / 80);
*/

caja.appendChild(dibujo)