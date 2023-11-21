//Toma el elemento de la pagina para insertar el origami.
const caja = document.getElementById("papel");

// Creo el elemento svg de rabbit ear sobre el cual se va a dibujar
var dibujo = ear.svg();

// define el tamaño del area en que se dibuja el svg. esquina superior izq (x,y), esquina inf derecha (x,y)
dibujo.size(-0.1, -0.1, 8.1, 5.3);
dibujo.background('black');
const w = dibujo.getWidth() ;
const h = dibujo.getHeight() ;


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


// Creamos el patron y el loop para construirlo
var patron = ear.graph();
patron.vertices_coords = [];
patron.edges_vertices = [];
patron.edges_assignment = [];
const fil = 1;
const col = 20;
const da = Math.PI/(2*col);
var r1= 2.5; // radio externo
var r2= r1 - 0.5 * Math.sin( (Math.Pi/2) ); // radio mediana
var r3= 0; // radio mediatriz y externo de col vecina
var r4= r1 - 1.5; // radio interno y externo de siguiente fila de la misma columna
const EPSILON = 0.001 ;
var d=0;

// Ubica cada vertice de acuerdo al radio en donde se encuentra, por eso primero van las filas, luego las columnas
for (let i = 0; i < col; i++) {
    for (let j = 0; j < fil; j++) {

        // separo el comportamiento de acuerdo a columna par o impar (importante para el tamaño y ubicacion de base)
        if (i % 2 === 0) {
            //iniciemos con circulo externo [1] [2] [6]
            patron.vertices_coords.push(
                //[ 2 * dx , cent ], // mediana [0]
                [w / 2 + r1 * Math.cos(da * ( (i * 4) + 2 ) ), h / 2 + r1 * Math.sin(da * ( (i * 4) + 2 ) ) ], // base 1 del triangulo [1]
                [w / 2 + r1 * Math.cos(da * ( (i * 4) + 4 ) ), h / 2 + r1 * Math.sin(da * ( (i * 4) + 4 ) ) ], // base 2 del triangulo [2]
                //[ 3 * dx , dy ], // mediatriz 1 [3]
                //[ 2 * dx , 2 * dy ], // punta del triangulo [4]
                //[ dx , dy ], // mediatriz 2 [5]
                [w / 2 + r1 * Math.cos(da * (i * 4)), h / 2 + r1 * Math.sin(da * (i * 4))], //ultimo (base 3 del triangulo) [6]
            );
            d = ear.math.distance(patron.vertices_coords[0], patron.vertices_coords[1]) ;
            r3 = r1 - d; //este esta desfasado, pero parece bien
            //r4 = r1 - 2 * d ; // aca estoy adivinando
            patron.vertices_coords.push(
                //[ 3 * dx , dy ], // mediatriz 1 [3]
                //[ 2 * dx , 2 * dy ], // punta del triangulo [4]
                //[ dx , dy ], // mediatriz 2 [5]
            );
        } else {
            //iniciemos con circulo externo [1] [2] [6]
            patron.vertices_coords.push(
                //[ 2 * dx , cent ], // mediana [0]
                [w / 2 + r3 * Math.cos(da * ( (i * 4) + 2 ) ), h / 2 + r3 * Math.sin(da * ( (i * 4) + 2 ) ) ], // base 1 del triangulo [1]
                [w / 2 + r3 * Math.cos(da * ( (i * 4) + 4 ) ), h / 2 + r3 * Math.sin(da * ( (i * 4) + 4 ) ) ], // base 2 del triangulo [2]
                //[ 3 * dx , dy ], // mediatriz 1 [3]
                //[ 2 * dx , 2 * dy ], // punta del triangulo [4]
                //[ dx , dy ], // mediatriz 2 [5]
                [w / 2 + r3 * Math.cos(da * ( (i * 4)  )), h / 2 + r3 * Math.sin(da * ( (i * 4)  ))], //ultimo (base 3 del triangulo) [6]
                //[ vxt[0]*Math.cos(da*t) + w/2,  vxt[1]*Math.sin(da*t) + h/2]
            );

        }

        /*
        for (edg of aux.edges_vertices) {
            patron.edges_vertices.push( edg );
        }

        for ( asg of aux.edges_assignment) {
            patron.edges_assignment.push( asg );
        }
        */
    }

}

//ear.graph.clean(patron, EPSILON);

//patron.populate();
var nv = 0; //numero de vertices existentes

//cuenta la cantidad de vertices
nv = ear.graph.count(patron, "vertices");

//Establece las caras del pliegue una vez han sido definidos las aristas.
// patron.populate();


//dibuja los vertices

dibujo.origami.vertices(patron)
    .childNodes
    .forEach((circle, i, arr) => circle
        .radius(0.03)
        .fill("white"));

dibujo.origami.edges(patron).strokeWidth(0.01); // dibuja los edges con el patron de pliegues

//mostrar los numeros de los vertices
/*Toca arreglar el texto*/
dibujo.text( nv.toString() , w/2 - 0.5  , h/2 + 0.5)
    .fill('gold')
    .fontSize('1px');


caja.appendChild(dibujo);