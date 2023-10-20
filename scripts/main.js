document.querySelector("img").addEventListener("click", () => {
  //Ejemplo de un listener que actua solo sobre la imagen
  alert("Ouch! Stop poking me!");
});


//Creo un Div nuevo para ingresar un texto despues de activar un boton.
const body = document.body;

//¿Como selecciono el lugar del DOM para colocar lo que se inserta? <main> no sirve...
const panel = document.createElement("div");
panel.setAttribute("class", "picaSale");
body.appendChild(panel);

const msg = document.createElement("p");
msg.textContent = "Esta caja desaparecerá, jaja";
panel.appendChild(msg);

const picaloBt = document.createElement("button");
picaloBt.textContent = "aja x";
panel.appendChild(picaloBt);

picaloBt.addEventListener("click", () =>
  panel.parentNode.removeChild(panel));


const msjBt = document.createElement("button");
msjBt.setAttribute("class", "otro");
msjBt.textContent = "Click me, el otro";
panel.appendChild(msjBt);

msjBt.addEventListener("click", createParagraph);

function createParagraph() {
  // Agrega el parrafo <p>
  const para = document.createElement("p");
  para.textContent = "You clicked the button!";
  body.appendChild(para);
}

const colorBt = body.querySelector("button");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

colorBt.addEventListener("click", () => {
  const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
  //picaloBt.style.backgroundColor = rndCol;
  body.style.backgroundColor = rndCol;
});
