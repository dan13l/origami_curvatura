
document.querySelector("img").addEventListener("click", () => {
  //Ejemplo de un listener
  alert("Ouch! Stop poking me!");
});


const body = document.body;
//const body = document.getElementById("body")


//Como selecciono el lugar para colocar el texto y no que siempre este de ultimo
const panel = document.createElement("div");
panel.setAttribute("class", "picaSale");
body.appendChild(panel);


//Como hago para que aparezca despues del Nav, que es fijo del html.
const msg = document.createElement("p");
msg.textContent = "This is a message box";
panel.appendChild(msg);


function createParagraph() {
  // Agrega el parrafo <p>
  const para = document.createElement("p");
  para.textContent = "You clicked the button!";
  document.body.appendChild(para);
}

const buttons = document.querySelectorAll("button");


for (const button of buttons) {
  button.addEventListener("click", createParagraph);
}




const picaElBoton = body.createElement("button");
picaElBoton.textContent = "aja x";
panel.appendChild(picaElBoton);



picaElBoton.addEventListener("click", () =>
  panel.parentNode.removeChild(panel),
);


