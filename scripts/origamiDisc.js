//Toma el elemento de la pagina para insertar el origami.
const caja = document.getElementById("papel");

// Creo el elemento svg de rabbit ear sobre el cual se va a dibujar
var dibujo = ear.svg()

// define el tamaño del area en que se dibuja el svg. esquina superior izq (x,y), esquina inf derecha (x,y)
dibujo.size(-0.1, -0.1, 8.1, 5.3);

//dibujo.background('black');


//Esta es la estructura base. Para utilizar Push es preciso declarar antes los arreglos
var base = ear.graph();
base.vertices_coords = [];
base.edges_vertices = [];
base.edges_assignment = [];

const fil = 1;
const col = 10;
const w = dibujo.getWidth();
const h = dibujo.getHeight();

//Estoy hay que volverlo circular...
const da = Math.PI/(col*2) ; // este no cambia
const r = 2.5 ;
const m = Math.sqrt(3)/4;
const cent = 1/( 2 * Math.sqrt(3) );
const EPSILON = 0.001 ;


//variables que van cambiando conforme el loop va realizandose
var rt=0; //cambio en el radio
var mt=0; //cambio en la posicion de las mediatrices
var centt=0;
var pt =0;

//Borrar, pero esperemos mientras gharantizo que funcione...
const dx = 0.25;

var nv = 0; //numero de vertices existentes


// Crea la estructura de vertices y edges con asignaciones. Se crea un triangulo a la vez y luego se junta.
for (let i = 0; i < col+1; i++) {
    for (let j = 0; j < fil; j++) {
        // las posiciones de cada columna cambian dependiendo si es par o impar debe subir y bajar
        if (i%2 === 0) {
            //deben estar a la altura del radio externo
            rt = r ;
            mt = r - m * (2* Math.sin(4*da)) ;
            centt = r - cent * (2* Math.sin(4*da)) ;
            pt = r - 2*m * (2* Math.sin(4*da)) ;
        } else {
            /*
            //deben iniciar a la altura de la mediatriz del triangulo de la columna par
            rt = r - m * (2* Math.sin(4*da)) ;
            mt = rt - mt * (2* Math.sin(4*da)) ;
            centt = rt - centt * (2* Math.sin(4*da)) ;
            pt = rt - 2*mt * (2* Math.sin(4*da)) ;
            */
        }

        base.vertices_coords.push( // inicia en el centro baja al centro y gira contrario al reloj por fuera
            [ w/2 + (rt-0.2) * Math.cos( (4*i + 2 )* da ), h/2 + (rt-0.2) * Math.sin( (4*i + 2) * da ) ], // mediana
            [ w/2 + rt * Math.cos( (4*i + 2) * da ), h/2 + rt * Math.sin( (4*i + 2) * da ) ], // centro de la base
            [ w/2 + rt * Math.cos( (4*i + 4) * da ), h/2 + rt * Math.sin( (4*i + 4) * da ) ], // base del triangulo
            [ w/2 + mt * Math.cos( (4*i + 3) * da ), h/2 + mt * Math.sin( (4*i + 3) * da ) ], // mediatriz
            [ w/2 + pt * Math.cos( (4*i + 2) * da ), h/2 + pt * Math.sin( (4*i + 2) * da ) ], // punta
            [ w/2 + mt * Math.cos( (4*i + 1) * da ), h/2 + mt * Math.sin( (4*i + 1) * da ) ], // mediatriz
            [ w/2 + rt * Math.cos( (4*i) * da ), h/2 + rt * Math.sin( (4*i) * da ) ], // ultimo (completa base del triangulo)
        );


        //Establesco el numero actual de vertices antes de agregar los nuevos
        nv = ear.graph.count(base, "vertices");

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
dibujo.text( nv.toString() , w/2 - 0.5  , h/2 + 0.5)
    .fill('gold')
    .fontSize('1px');

caja.appendChild(dibujo);