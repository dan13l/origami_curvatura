const myHeading = document.querySelector("h1");
myHeading.textContent = "La curvatura de Gauss";


document.querySelector("img").addEventListener("click", () => {
  //Ejemplo de un listener
  alert("Ouch! Stop poking me!");
});


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

