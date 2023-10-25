document.querySelector("img").addEventListener("click", () => {
  //Ejemplo de un listener que actua solo sobre la imagen
  alert("Ouch! Stop poking me!");
});

const contenido = document.getElementById("contenido");

///////////////////Crea el Div sobre el que actua el JS
const panel = document.createElement("div");
panel.setAttribute("class", "picaSale");
contenido.appendChild(panel);

//Ingresa texto base
const msg = document.createElement("p");
msg.textContent = "Esta caja cambiará, jaja";
panel.appendChild(msg);


/////////////////Boton del color
const picaloBt = document.createElement("button");
picaloBt.textContent = "aja x";
panel.appendChild(picaloBt);


function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

picaloBt.addEventListener("click", () => {
  const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
  panel.style.backgroundColor = rndCol;
});



///////////////////Boton de agregar texto
const msjBt = document.createElement("button");
//msjBt.setAttribute("class", "otro"); //no es necesario
msjBt.textContent = "Click me, el otro";
panel.appendChild(msjBt);

msjBt.addEventListener("click", createParagraph);

function createParagraph() {
  // Agrega el parrafo <p>
  const para = document.createElement("p");
  para.textContent = "You clicked the button!";
  panel.appendChild(para);
}