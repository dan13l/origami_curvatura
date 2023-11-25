//Toma el elemento de la pagina para insertar el origami.
var caja = document.getElementById("papel");

FOLD = require('fold');

// Creo el elemento svg de rabbit ear sobre el cual se va a dibujar
var dibujo = ear.svg();

// define el tamaño del area en que se dibuja el svg. esquina superior izq (x,y), esquina inf derecha (x,y)
dibujo.size(-0.1, -0.1, 8.1, 5.3);
//dibujo.background('black');
const w = dibujo.getWidth() ;
const h = dibujo.getHeight() ;

// Creamos el patron y el loop para construirlo
var patron = ear.graph();
patron.vertices_coords = [];
patron.edges_vertices = [];
patron.edges_assignment = [];
const fil = 2; //8
const col = 12; //48 -- Realmente son col + 1/3*col
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

        //Establesco el numero actual de vertices antes de agregar los nuevos
        nv = ear.graph.count(patron, "vertices");

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
            [nv, nv+1],
            [nv+1, nv+2], [nv+2, nv+3], [nv+3,nv+4], [nv+4,nv+5], [nv+5,nv+6], [nv+6,nv+1], // Triangulo exterior 1,2,3,4,5,6
            [nv,nv+3], [nv,nv+5], // 0*,7,8 Mediatrices Montaña
            [nv,nv+2], [nv,nv+4], [nv,nv+6] // 9,10,11 Mediatrices Valle
        );


        // Asigna los pliegues, las caras se llenan despues de terminada la red con graph.populate(), ver despues del loop
        if (j === 0) {
        // Agrega el borde de la base
            if (i%2 === 0) {
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
            // Asigna los pliegues, las caras se llenan despues de terminada la red con graph.populate(), ver despues del loop
            patron.edges_assignment.push(
                "M", "M", "M", "M", "M", "M", "M", "M", "M",
                "V", "V", "V"
            );
        }

    }
}

// elimina vertices duplicados (el patron produce muchos)
ear.graph.clean(patron, EPSILON);

//Establece las caras del pliegue una vez han sido definidos las aristas.
patron.populate();

//cuenta la cantidad de vertices
nv = ear.graph.count(patron, "vertices");

// Proyeccion estereografica.
zTrans = [];

for (let i=0; i < patron.vertices_coords.length; i++) {
    zTrans.push( [
        ( 2 * patron.vertices_coords[0] )/( patron.vertices_coords[0]**2 + patron.vertices_coords[1]**2 + 1 ) , // x = 2x/(x²+y²+1)
        ( 2 * patron.vertices_coords[1] )/( patron.vertices_coords[0]**2 + patron.vertices_coords[1]**2 + 1 ) , // y = 2y/(x²+y²+1)
        ( patron.vertices_coords[0]**2 + patron.vertices_coords[1]**2 - 1 )/( patron.vertices_coords[0]**2 + patron.vertices_coords[1]**2 + 1 ) // z = (x²+y²-1)/(x²+y²+1)
    ]);
}

//////////////// Para el SVG escala y centra
patron.scale((h-0.4)/2);
patron.translate(w/2,h/2);

dibujo.origami.vertices(patron)
    .childNodes
    .forEach((circle, i, arr) => circle
        .radius(0.022)
        .fill("white"));

dibujo.origami.edges(patron).strokeWidth(0.01); // dibuja los edges con el patron de pliegues

//mostrar los numeros de los vertices
/*Toca arreglar el texto
dibujo.text( (col + 1/3*col).toString() , w/2 - 0.6  , h/2 + 0.4)
    .fill('gold')
    .fontSize('1px');
*/

caja.appendChild(dibujo);

//////////// Crear el objeto Fold

//este = JSON.stringify(patron);
//este = FOLD.convert.toJSON(patron);
este = patron.prototype.toString;

const myFold = document.getElementById("objFold");
myFold.textContent = este;