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


// Creamos el patron y el loop para construirlo
var patron = ear.graph();
patron.vertices_coords = [];
patron.edges_vertices = [];
patron.edges_assignment = [];
const fil = 1;
const col = 30;
const da = Math.PI/(2*col);
const r = 2.5 ;


/*Calculo los radios y distancias de acuerdo al numero de filas y columnas
minimo 4 columnas y 1 fila
necesito radios = 2*filas
distancias = 2*filas+1
*/
var radios = [r];
var dist = [];
//dist = [ radios[-1] * ear.math.distance( [ 1 , 0 ], [ Math.cos(2*da) , Math.sin(2*da) ] ) ]; //distancia entre puntos de la base [2] [3]

for (let i = 0; i < col+1; i++) {
    dist.push(
        [ ear.math.distance(
        [ 1 , 0 ],
        [ Math.cos(2*da) , Math.sin(2*da) ] ) ]
    );//
    radios.push( radios[-1]-dist[-1] );
}

var posda = 0 ; //posicion en radianes
var r1 = 0 ; // radio externo, aca iniciado de una vez
var r2 = 0 ; // radio mediatriz y externo de col vecina
let nv = 0; // numero de vertices del patron

const EPSILON = 0.001 ;


// Ubica cada vertice de acuerdo al radio en donde se encuentra, por eso primero van las filas, luego las columnas
for (let i = 0; i < col; i++) {
    for (let j = 0; j < fil; j++) {
        posda= 4*i*da;
        // Los radios y distancias dependen de la fila en que estamos
        if (i % 2 === 0) {
            r1 = radios[j];
            r2 = radios[j+1];
        } else {
            r1 = radios[j+1];
            r2 = radios[j+2];
        }

        //Establesco el numero actual de vertices antes de agregar los nuevos
        nv = ear.graph.count(patron, "vertices");

        //iniciemos con circulo externo [1] [2] [6]
        patron.vertices_coords.push(
            //[ posx + 2*dx , posy + cent ], // mediana (centro) [0]
            [ w/2 + r1*Math.cos(posda + 2*da) , h/2 + r1*Math.sin(posda + 2*da) ], //[ posx + 2*dx , posy ], // base 1 del triangulo [1]
            [ w/2 + r1*Math.cos(posda + 4*da) , h/2 + r1*Math.sin(posda + 4*da) ], // base 2 del triangulo [2]
            [ w/2 + r2*Math.cos(posda + 3*da) , h/2 + r2*Math.sin(posda + 3*da) ],//[ posx + 3*dx , posy + dy ], // mediatriz 1 [3]
            //[ posx + 2*dx , posy + 2*dy ], // punta del triangulo [4]
            [ w/2 + r2*Math.cos(posda + da) , h/2 + r2*Math.sin(posda + da) ],//[ posx + dx , posy + dy ], // mediatriz 2 [5]
            [ w/2 + r1*Math.cos(posda) , h/2 + r1*Math.sin(posda) ] //ultimo (base 3 del triangulo) [6]
        );
        /*
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

//ear.graph.clean(patron, EPSILON);

//patron.populate();


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
dibujo.text( radios[1].toString() , w/2 - 0.5  , h/2 + 0.5)
    .fill('gold')
    .fontSize('1px');


caja.appendChild(dibujo);

/*
Esto era como estaba medio funcionando anteriormente
// separo el comportamiento de acuerdo a columna par o impar (importante para el tamaño y ubicacion de base)

if (i % 2 === 0) {
    posda = 4*i*da ;
    r1=2.5 ;
    //r2 = cent*r1;
} else {
    posda = 4*(i-1)*da ;
    d = ear.math.distance(patron.vertices_coords[nv], patron.vertices_coords[nv+1]);
    r1 = r1 - d; //este esta desfasado, pero parece ir en buen camino
    //r2 = r1 - cent*d ;
}

patron.vertices_coords.push(
            //[w / 2 + r2 * Math.cos(da * ( (i * 4) + 2 ) ), h / 2 + r2 * Math.sin(da * ( (i * 4) + 2 ) ) ], // mediana [0]
            [w / 2 + r1 * Math.cos(da * ( (i * 4) + 2 ) ), h / 2 + r1 * Math.sin(da * ( (i * 4) + 2 ) ) ], // base 1 del triangulo [1]
            [w / 2 + r1 * Math.cos(da * ( (i * 4) + 4 ) ), h / 2 + r1 * Math.sin(da * ( (i * 4) + 4 ) ) ], // base 2 del triangulo [2]
            //[ 3 * dx , dy ], // mediatriz 1 [3]
            //[ 2 * dx , 2 * dy ], // punta del triangulo [4]
            //[ dx , dy ], // mediatriz 2 [5]
            [w / 2 + r1 * Math.cos(da * (i * 4)), h / 2 + r1 * Math.sin(da * (i * 4))], //ultimo (base 3 del triangulo) [6]
        );

 */