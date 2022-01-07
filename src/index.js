import "./style.css";

function component() {
  const element = document.createElement("div");

  element.innerText = "Hello"
  element.classList.add("hello");

  // Add the image to our existing div.
  const myIcon = new Image();
  myIcon.src = Book;

  element.appendChild(myIcon);

  return element;
}

// document.body.appendChild(component());
