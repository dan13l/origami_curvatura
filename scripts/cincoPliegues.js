//Toma el elemento de la pagina para insertar el origami.
const caja = document.getElementById("papel");

// Creo el elemento svg de rabbit ear sobre el cual se va a dibujar
var dibujo = ear.svg();

// define el tamaño del area en que se dibuja el svg. esquina superior izq (x,y), esquina inf derecha (x,y)
dibujo.size(-0.2,-0.2, 2.5,2.5);
dibujo.background('white');

//Esta es la estructura base. Para utilizar Push es preciso declarar antes los arreglos
var patron = ear.graph();

patron.vertices_coords = [
    [0,0], [1,0], [2,0],
    [0,1], [1,1], [2,1],
    [0,2], [1,2], [2,2]
];
patron.edges_vertices = [
    //Borde
    [0,1], [1,2], [2,5], [5,8], [8,7], [7,6], [6,3], [3,0],
    //cruz interior
    [1,4], [3,4], [5,4], [7,4],
    //pata
    [4,8]
];
patron.edges_assignment = [
    //Borde
    "B", "B", "B", "B", "B", "B", "B", "B",
    //cruz
    "V","V","V","V",
    //pata
    "M"
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
