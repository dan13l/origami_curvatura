//Toma el elemento de la pagina para insertar el origami.
var caja = document.getElementById("papel");

// Creo el elemento svg de rabbit ear sobre el cual se va a dibujar
var dibujo = ear.svg();

// define el tamaño del area en que se dibuja el svg. esquina superior izq (x,y), esquina inf derecha (x,y)
dibujo.size(-0.1, -0.1, 8.1, 5.3);
dibujo.background('white');
const w = dibujo.getWidth() ;
const h = dibujo.getHeight() ;

// Creamos el patron y el loop para construirlo
var patron = ear.graph();
patron.vertices_coords = [];
patron.edges_vertices = [];
patron.edges_assignment = [];
const fil = 8; //8
const col = 48; //48 -- Realmente son col + 1/3*col
const da = Math.PI/(2*col);


/*Calculo los radios y distancias de acuerdo al numero de filas y columnas
minimo 4 columnas y 1 fila
necesito radios = 2*filas +1
distancias = 2*filas+1
*/

var radios = [1];
var dist = [ Math.sqrt( 2 * (radios[0]**2) * (1 - Math.cos(2*da))) ]; //distancia entre puntos de la base [2] [3]

/*para encontrar el nuevo radio, debo intersectar el circulo de dist[i] centrado en [r1,0]
con el segmento radio[i]*cos(2*da)
x = cos^2(a) (r - sqrt(tan^2(a) (d^2 - r^2) + d^2)) and sec(a)!=0
*/

// como ya iniciamos radios, la posicion radios[i] es justo la anterior
for (let i = 0; i < 2*fil+1; i++) {
    dist.push( Math.sqrt( 2 * (radios[i]**2) * (1 - Math.cos(2*da))) );//
    radios.push( ( (Math.cos(da))**2 ) * (radios[i] - Math.sqrt( ((Math.tan(da))**2) * (dist[i]**2 - radios[i]**2) + dist[i]**2)) );
}

var posda = 0 ; //posicion en radianes
var r1 = 0 ; // radio externo, aca iniciado de una vez
var r2 = 0 ; // radio mediatriz y externo de col vecina
var r3 = 0 ; // radio mediatriz y externo de col vecina
let nv = 0; // numero de vertices del patron
let ne = 0; // numero de edges del patron

const EPSILON = 0.001 ;

/* Ubica cada vertice de acuerdo al radio en donde se encuentra, por eso primero van las filas, luego las columnas
Debo aumentar en un tercio la cantidad de columnas debido a posda= 3*i*da
elimino uno para que el algoritmo que detecta los bordes funcione al interior
*/
for (let i = 0; i < col+1/3*col; i++) {
    for (let j = 0; j < fil; j++) {
        posda= 3*i*da; //no se porque funciona, pero asi es...
        // Los radios y distancias dependen de la fila en que estamos
        if (i % 2 === 0) {
            r1 = radios[2*j];
            r2 = radios[2*j+1];
            r3 = radios[2*j+2];
        } else {
            r1 = radios[2*j+1];
            r2 = radios[2*j+2];
            r3 = radios[2*j+3];
        }

        //Establesco el numero actual de vertices y edges antes de agregar los nuevos
        nv = ear.graph.count(patron, "vertices");
        ne = ear.graph.count(patron, "edges");

        //iniciemos con circulo externo [1] [2] [6]
        patron.vertices_coords.push(
            [ ( r3 + 2*(r1-r3)/3 )*Math.cos(posda + 2*da) , ( r3 + 2*(r1-r3 )/3)*Math.sin(posda + 2*da) ], //  mediana (centro) [0] el radio esta aproximado [ posx + 2*dx , posy + cent ]
            [ r1*Math.cos(posda + 2*da) , r1*Math.sin(posda + 2*da) ],  // base 1 del triangulo [1] [ posx + 2*dx , posy ],
            [ r1*Math.cos(posda + 4*da) , r1*Math.sin(posda + 4*da) ],  // base 2 del triangulo [2] [ posx + 2*dx , posy ]
            [ r2*Math.cos(posda + 3*da) , r2*Math.sin(posda + 3*da) ],  // mediatriz 1 [3] [ posx + 3*dx , posy + dy ],
            [ r3*Math.cos(posda + 2*da) , r3*Math.sin(posda + 2*da) ],  // punta del triangulo [4] [ posx + 2*dx , posy + 2*dy ],
            [ r2*Math.cos(posda + da) , r2*Math.sin(posda + da) ],      // mediatriz 2 [5] [ posx + dx , posy + dy ],
            [ r1*Math.cos(posda) , r1*Math.sin(posda) ]                 //ultimo (base 3 del triangulo) [6] [ posx , posy ]
        );

        // Crea las aristas
        patron.edges_vertices.push(
            [nv, nv+1], // 0 mediatriz montaña inicio del triangulo
            [nv+1, nv+2], [nv+2, nv+3], [nv+3,nv+4], [nv+4,nv+5], [nv+5,nv+6], [nv+6,nv+1], // Triangulo exterior 1,2,3,4,5,6
            [nv,nv+3], [nv,nv+5], // 7,8 Mediatrices Montaña
            [nv,nv+2], [nv,nv+4], [nv,nv+6] // 9,10,11 Mediatrices Valle
        );

        // Asigna los pliegues, las caras se llenan despues de terminada la red con graph.populate(), ver despues del loop
        if (j === 0) {
            if (i%2 === 0) {
                // Agrega los bordes en el anillo exterior del disco
                patron.edges_assignment.push(
                    "M", "B", "B", "M", "M", "B", "B", "M", "M",
                    "V", "V", "V"
                );
            }  else {
                patron.edges_assignment.push(
                    "M", "B", "M", "M", "M", "M", "B", "M", "M",
                    "V", "V", "V"
                );
            }
        } else if ( j === fil-1) {
             // Agrega los bordes en el anillo interior del disco.
            if (i%2 === 0) {
                patron.edges_assignment.push(
                    "M", "M", "M", "B", "B", "M", "M", "M", "M",
                    "V", "V", "V"
                );
            } else {
                patron.edges_assignment.push(
                    "M", "M", "B", "B", "B", "B", "M", "M", "M",
                    "V", "V", "V"
                );
            }
        } else {
            // Triangulo interior del patron de pliegos
            patron.edges_assignment.push(
                "M", "M", "M", "M", "M", "M", "M", "M", "M",
                "V", "V", "V"
            );
        }

    }
}

// elimina vertices duplicados (el patron produce muchos)
ear.graph.clean(patron, EPSILON);

//Establece las caras del pliegue una vez han sido definidos las aristas, tiene problemas con el borde interno
patron.populate();

// Busca la cara en donde se encuentra incluido el origen y la elimina
let cara = ear.graph.faceContainingPoint(patron, [0,0]);
patron.faces_vertices.splice(cara,1);

// Proyeccion estereografica.
zTrans = [];

for (let i=0; i < patron.vertices_coords.length; i++) {
    zTrans.push( [
        ( 2 * patron.vertices_coords[i][0] )/( patron.vertices_coords[i][0]**2 + patron.vertices_coords[i][1]**2 + 1 ) , // x = 2x/(x²+y²+1)
        ( 2 * patron.vertices_coords[i][1] )/( patron.vertices_coords[i][0]**2 + patron.vertices_coords[i][1]**2 + 1 ) , // y = 2y/(x²+y²+1)
        ( patron.vertices_coords[i][0]**2 + patron.vertices_coords[i][1]**2 - 1 )/( patron.vertices_coords[i][0]**2 + patron.vertices_coords[i][1]**2 + 1 ) // z = (x²+y²-1)/(x²+y²+1)
    ]);
}


//////////////// Para el SVG escala y centra
patron.scale((h-0.4)/2);
patron.translate(w/2,h/2);



/*
//Dibuja un circulo por cada vertice
dibujo.origami.vertices(patron)
    .childNodes
    .forEach((circle, i, arr) => circle
        .radius(0.022)
        .fill("white"));
*/

// dibuja las aristas con el patron de pliegues
dibujo.origami.edges(patron).strokeWidth(0.01);

/*
// Dibuja las caras del patron
dibujo.origami.faces(patron).fill('gold');

//muestra un texto en el SVG
dibujo.text( cara.toString() , w/2 - 0.6  , h/2 + 0.4)
    .fill('gold')
    .fontSize('1px');
*/


///////////////////Ultimo paso, publica el pliegue generado.
caja.appendChild(dibujo);

//////////// Crear el objeto Fold

/* estos dos crean el JSON pero no lo reconoce origami simulator,
Corto y pego el resultado en un .FOLD
*/

//este = "vertices_coords: " + JSON.stringify(zTrans) ;
//este = "vertices_coords: " + JSON.stringify(patron.vertices_coords) ;
//este = "edges_vertices:" + JSON.stringify(patron.edges_vertices) ;
//este = "edges_assignment" + JSON.stringify(patron.edges_assignment) ;
//este = "faces_vertices" + JSON.stringify(patron.faces_vertices) ;
//este = "edges_foldAngle" + JSON.stringify(patron.edges_foldAngle) ;


/*
este = "vertices_coords " + JSON.stringify(zTrans) +
    "edges_vertices " + JSON.stringify(patron.edges_vertices) +
    "edges_assignment" + JSON.stringify(patron.edges_assignment) +
    "faces_vertices" + JSON.stringify(patron.faces_vertices) +
    "edges_foldAngle" + JSON.stringify(patron.edges_foldAngle) ;
*/

/*
este = "vertices: " + patron.vertices.length.toString() +
    ", edges: " + patron.edges.length.toString() +
    ", faces: " + patron.faces.length.toString()
;
*/



/*
////////////////////////////////////para visualizacion de proyeccion
//Eliminar el patron.scale((h-0.4)/2) y patron.translate(w/2,h/2);
//debo incluir el 0 en la coordenada z y sumar los vertices para tener los nuevos edges

mismo = [];

for (let i=0; i < patron.vertices_coords.length; i++) {
    mismo.push( [
        patron.vertices_coords[i][0],
        patron.vertices_coords[i][1],
        0
    ]);
}


//2175+vertice
cupula = [];
var mas = 2176;

// debe darme los nuevos edges, despues de haber agregado los vertices de la cupula
for (let i=0; i < patron.edges_vertices.length; i++) {
    cupula.push( [ patron.edges_vertices[i][0] + mas ,
        patron.edges_vertices[i][1] + mas
    ]);
}

este = "mismos vertices_coords" + JSON.stringify(mismo);
//este = "nuevos edges_vertices" + JSON.stringify(cupula);
*/

const myFold = document.getElementById("objFold");
myFold.textContent = este;
