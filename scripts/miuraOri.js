//Toma el elemento de la pagina para insertar el origami.
const caja = document.getElementById("papel");

// Creo el elemento svg de rabbit ear sobre el cual se va a dibujar
var dibujo = ear.svg();

// define el tamaño del area en que se dibuja el svg. esquina superior izq (x,y), esquina inf derecha (x,y)
dibujo.size(-0.2,-0.2, 1.5,1.5);
//dibujo.scale(1, -1)
dibujo.background('white');

//Esta es la estructura base. Para utilizar Push es preciso declarar antes los arreglos
var patron = ear.graph();

const dx = 1/5 ;
const dy = 1/3 ;
const d = 1/20 ;

patron.vertices_coords = [
    //hagamos con 3 filas, 7 columnas
    [0, 0], [dx, d], [2*dx, 0], [3*dx, d], [4*dx, 0], [5*dx, d],
    [0, dy], [dx, dy+d], [2*dx, dy], [3*dx, dy+d], [4*dx, dy], [5*dx, dy+d],
    [0, 2*dy], [dx, 2*dy+d], [2*dx, 2*dy], [3*dx, 2*dy+d], [4*dx, 2*dy], [5*dx, 2*dy+d]
];
patron.edges_vertices = [
    //Borde
    [0,1], [1,2], [2,3], [3,4], [4,5], [5,11], [11,17], [17,16], [16,15], [15,14], [14,13], [13,12], [12,6], [6,0],
    //fila del medio
    [6,7], [7,8], [8,9], [9,10], [10,11],
    // columnas
    [1,7], [2,8], [3,9], [4,10],
    [7,13], [8,14], [9,15], [10,16]
];
patron.edges_assignment = [
    //Borde
    "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B",
    //fila del medio
    "M", "M", "V", "M", "M",
    // columnas
    "M", "M", "M", "V",
    "V", "M", "M", "M"
];


//Establece las caras del pliegue una vez han sido definidos las aristas.
patron.populate();

//////////////// Para el SVG escala y centra

// dibuja las aristas con el patron de pliegues
dibujo.origami.edges(patron).strokeWidth(0.01);

caja.appendChild(dibujo);

//////////// Crear el objeto Fold

/* estos dos crean el JSON pero no lo reconoce origami simulator,
Corto y pego el resultado en un .FOLD
*/


// Coloca todos los componentes para construir el FOLD
este = "vertices_coords: " + JSON.stringify(patron.vertices_coords) +
    "edges_vertices " + JSON.stringify(patron.edges_vertices) +
    "edges_assignment" + JSON.stringify(patron.edges_assignment) +
    "faces_vertices" + JSON.stringify(patron.faces_vertices) +
    "edges_foldAngle" + JSON.stringify(patron.edges_foldAngle) ;


//este = "vertices_coords: " + JSON.stringify(patron.vertices_coords) ;
//este = "edges_vertices:" + JSON.stringify(patron.edges_vertices) ;
//este = "edges_assignment" + JSON.stringify(patron.edges_assignment) ;
//este = "faces_vertices" + JSON.stringify(patron.faces_vertices) ;
//este = "edges_foldAngle" + JSON.stringify(patron.edges_foldAngle) ;



/*
// Muestra la cantidad de componentes
este = "vertices: " + patron.vertices.length.toString() +
    ", edges: " + patron.edges.length.toString() +
    ", faces: " + patron.faces.length.toString()
;
*/


const myFold = document.getElementById("objFold");
myFold.textContent = este;
