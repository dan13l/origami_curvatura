//Toma el elemento de la pagina para insertar el origami.
const caja = document.getElementById("papel");

// Creo el elemento svg de rabbit ear sobre el cual se va a dibujar
var dibujo = ear.svg()

// define el tamaño del area en que se dibuja el svg. esquina superior izq (x,y), esquina inf derecha (x,y)
dibujo.size(-0.1, -0.1, 8.1, 5.1);

//dibujo.background('black');


//Esta es la estructura base. Para utilizar Push es preciso declarar antes los arreglos
var base = ear.graph();
base.vertices_coords = [];
base.edges_vertices = [];
base.edges_assignment = [];

const fil = 1;
const col = 10;

//Estoy hay que volverlo circular...
const r = 3 ;

const da = Math.PI/(col*4) ;

const dy = Math.sqrt(3)/4;
const cent = 1/( 2 * Math.sqrt(3) );
const EPSILON = 0.001 ;

//Borrar, pero esperemos mientras gharantizo que funcione...
const dx = 0.25;

var nv = 0; //numero de vertices existentes


// Crea la estructura de vertices y edges con asignaciones. Se crea un triangulo a la vez y luego se junta.
for (let i = 0; i < col; i++) {
    for (let j = 0; j < fil; j++) {
        // las posiciones de cada columna cambian dependiendo si es par o impar
        if (i%2 === 0) {
            var posx= i - (i*dx);
            //var posx = Math.cos(i*4*da); //rastrea el sector angular en que nos encontramos
            var posy= 2*j*dy;
            //var posy = Math.sin(i*4*da)
        } else {
            var posx= i - (i*dx);
            var posy= (2*j+1)*dy;
        }

        base.vertices_coords.push( // inicia en el centro baja al centro y gira contrario al reloj por fuera
            [ r * Math.cos(da*(i+2)) + 2 , r * Math.sin(da*(i+2)) + 2 ] //centro [ posx + 2*dx , posy + cent ],
            //[ posx + 2*dx , posy ], [ posx + 4*dx , posy ], // base del triangulo sospecha
            //[ posx + 3*dx , posy + dy ], // costado
            //[ posx + 2*dx , posy + 2*dy ], // punta del triangulo
            //[ posx + dx , posy + dy ], // costado
            //[ posx , posy ] //ultimo
        );

        /*
        //Establesco el numero actual de vertices antes de agregar los nuevos
        nv = ear.graph.count(base, "vertices");

        // Crea los vertices
        base.vertices_coords.push( // inicia en el centro baja al centro y gira contrario al reloj por fuera
            [ posx + 2*dx , posy + cent ], //centro
            [ posx + 2*dx , posy ], [ posx + 4*dx , posy ], // base del triangulo sospecha
            [ posx + 3*dx , posy + dy ], // costado
            [ posx + 2*dx , posy + 2*dy ], // punta del triangulo
            [ posx + dx , posy + dy ], // costado
            [ posx , posy ] //ultimo
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
         */
    }
}

// Elimina duplicados
ear.graph.clean(base, EPSILON)

// Establece los limites externos.

//ear.graph.transform(graph, matrix)

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
dibujo.text( nv.toString() , 2, 4.8)
    .fill('gold')
    .fontSize('3px');


caja.appendChild(dibujo)

/*
// Estructura de un triangulo.
var nuevo = {
    vertices_coords: [ // inicia en el centro baja al centro y gira contrario al reloj por fuera
        [ posx + 2*dx, posy + cent ], //centro
        [ posx + 2*dx, posy ], [ posx + 4*dx, posy ], // base del triangulo sospecha
        [ posx + 3*dx, posy + dy ], // costados
        [ posx + 2*dx, posy + 2*dy ], // punta del triangulo
        [ posx + dx, posy + dy ],
        [ posx, posy ], //ultimo
    ],
    edges_vertices: [
        [0, 1],
        [1, 2], [2, 3], [3,4], [4,5], [5,6], [6,1], // Triangulo exterior 1,2,3,4,5,6
        [0,3], [0,5], // 0*,7,8 Mediatrices Montaña
        [0,2], [0,4], [0,6], // 9,10,11Mediatrices Valle
    ],
    faces_vertices: [ [0,1,9], [9,2,7], [7,3,10], [8,4,10], [8,5,11], [11,6,0] ],
    edges_assignment: [
        "M", "M", "M", "M","M","M", "M", "M", "M",
        "V", "V", "V",
    ],
};
base=nuevo;
*/