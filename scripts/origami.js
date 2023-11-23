//Toma el elemento de la pagina para insertar el origami.
const caja = document.getElementById("papel");

// Creo el elemento svg de rabbit ear sobre el cual se va a dibujar
var dibujo = ear.svg();

// define el tamaño del area en que se dibuja el svg. esquina superior izq (x,y), esquina inf derecha (x,y)
dibujo.size(-0.1, -0.1, 8.1, 5.1);
dibujo.scale(1, -1)
//dibujo.background('black');


//Esta es la estructura base. Para utilizar Push es preciso declarar antes los arreglos
var base = ear.graph();
base.vertices_coords = [];
base.edges_vertices = [];
base.edges_assignment = [];

const fil = 4;
const col = 8;

const dx = 0.25;
const dy = Math.sqrt(3)/4;
const cent = 1/( 2 * Math.sqrt(3) );
const EPSILON = 0.001 ;

var nv = 0; //numero de vertices existentes

// Crea la estructura de vertices y edges con asignaciones. Se crea un triangulo a la vez y luego se junta.
for (let i = 0; i < col; i++) {
    for (let j = 0; j < fil; j++) {
        // las posiciones de cada columna cambian dependiendo si es par o impar
        if (i%2 === 0) {
            var posx= i - (i*dx);
            var posy= 2*j*dy;
        } else {
            var posx= i - (i*dx);
            var posy= (2*j+1)*dy;
        }

        //Establesco el numero actual de vertices antes de agregar los nuevos
        nv = ear.graph.count(base, "vertices");

        // Crea los vertices
        base.vertices_coords.push( // inicia en el centro baja al centro y gira contrario al reloj por fuera
            [ posx + 2*dx , posy + cent ], // mediana (centro) [0]
            [ posx + 2*dx , posy ], // base 1 del triangulo [1]
            [ posx + 4*dx , posy ], // base 2 del triangulo [2]
            [ posx + 3*dx , posy + dy ], // mediatriz 1 [3]
            [ posx + 2*dx , posy + 2*dy ], // punta del triangulo [4]
            [ posx + dx , posy + dy ], // mediatriz 2 [5]
            [ posx , posy ] //ultimo (base 3 del triangulo) [6]
        );

        // Crea las aristas
        base.edges_vertices.push(
            [nv, nv+1],
            [nv+1, nv+2], [nv+2, nv+3], [nv+3,nv+4], [nv+4,nv+5], [nv+5,nv+6], [nv+6,nv+1], // Triangulo exterior 1,2,3,4,5,6
            [nv,nv+3], [nv,nv+5], // 0*,7,8 Mediatrices Montaña
            [nv,nv+2], [nv,nv+4], [nv,nv+6] // 9,10,11 Mediatrices Valle
        );

        // Asigna los pliegues, las caras se llenan despues de terminada la red con graph.populate(), ver despues del loop
        base.edges_assignment.push(
            "M", "M", "M", "M", "M", "M", "M", "M", "M",
            "V", "V", "V" );
    }
}

// Elimina duplicados
ear.graph.clean(base, EPSILON)


// Establece los limites externos.
var sospechosos = ear.graph.getPlanarBoundary(base);

let i = 0;
for (ed in sospechosos["edges"]) {
    base.edges_assignment[ sospechosos["edges"][i] ] = "B";
    i++;
}

//cuenta la cantidad de vertices
nv = ear.graph.count(base, "vertices");

//Establece las caras del pliegue una vez han sido definidos las aristas.
base.populate();


//dibuja los vertices
dibujo.origami.vertices(base)
    .childNodes
    .forEach((circle, i, arr) => circle
        .radius(0.03)
        .fill("white"));

dibujo.origami.edges(base).strokeWidth(0.01); // dibuja los edges con el patron de pliegues

//mostrar los numeros de los vertices
/*Toca arreglar el texto*/
dibujo.scale(1, -1)
    .text( nv.toString() , 2, 4.8)
    .fill('gold')
    .fontSize('1px');


caja.appendChild(dibujo);

/*
// Estructura de un triangulo.
const dx = 0.25;
const dy = Math.sqrt(3)/4;
const cent = 1/( 2 * Math.sqrt(3) );

// estructura del triangulo
var base = ear.graph();
base.vertices_coords = [];
base.edges_vertices = [];
base.edges_assignment = [];

base.vertices_coords.push( // inicia en el centro baja al centro y gira contrario al reloj por fuera
    [ 2 * dx , cent ], // mediana [0]
    [ 2 * dx , 0 ], // base 1 del triangulo [1]
    [ 4 * dx , 0 ], // base 2 del triangulo [2]
    [ 3 * dx , dy ], // mediatriz 1 [3]
    [ 2 * dx , 2 * dy ], // punta del triangulo [4]
    [ dx , dy ], // mediatriz 2 [5]
    [ 0 , 0 ], //ultimo (base 3 del triangulo) [6]
);
base.edges_vertices.push(
    [0, 1],
    [1, 2], [2, 3], [3,4], [4,5], [5,6], [6,1], // Triangulo exterior 1,2,3,4,5,6
    [0,3], [0,5], // 0*,7,8 Mediatrices Montaña
    [0,2], [0,4], [0,6], // 9,10,11 Mediatrices Valle
);
base.edges_assignment.push(
    "M", "M", "M", "M","M","M", "M", "M", "M",
    "V", "V", "V",
);
*/