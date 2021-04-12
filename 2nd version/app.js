const $container = document.querySelector(".container");


let myLibrary = [];
let counter = 0

class Book {
  constructor(title, author, wasRead = false) {
    this.id = counter++;
    this.title = title;
    this.author = author;
    this.wasRead = wasRead;
  }
  info() {
    const { title, author, pages, wasRead } = this;
    if (wasRead) {
      return `${title} by ${author}, ${pages} pages, was read`;
    } else {
      return `${title} by ${author}, ${pages} pages, not read yet`;
    }
  }
}

function addDefaultBooks(myLibrary) {
  const harryPotter = new Book("Harry Potter", "J. K. Rolling", true);
  addBookToLibrary(harryPotter, myLibrary);
  const toKillAMockingBird = new Book("To Kill a Mocking Bird", "Harper Lee");
  addBookToLibrary(toKillAMockingBird, myLibrary);
  const sherlockHolmes = new Book("Sherlock Holmes", "Sir Arthur Conan Doyle");
  addBookToLibrary(sherlockHolmes, myLibrary);
  const wizardOfOz = new Book("The Wonderful Wizard of Oz", "L. Frank Baum");
  addBookToLibrary(wizardOfOz, myLibrary);
  const aliceInWonderland = new Book("Alice's Adventures in Wonderland", "Lewis Carroll");
  addBookToLibrary(aliceInWonderland, myLibrary);
  const zivKaplanBio = new Book("Ziv Kaplan's Biography", "Nitai Rach");
  addBookToLibrary(zivKaplanBio, myLibrary);
}

function addBookToLibrary(book, library) {
  library.push(book);
}

function displayBooks(library) {
  $container.innerHTML = '';
  library.forEach((book) => {
    createBookCard(book);
  });
}

function searchBookById(id) {
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].id === parseFloat(id)) {
      return i;
    }
  }
}

function deleteBook(id) {
  document.querySelector(`[data-id="${id}"]`).remove()
  const bookToRemove = searchBookById(id)
  myLibrary.splice(bookToRemove, 1);
}

function createBookCard(book) {
  // create card for the book 
  const bookDiv = document.createElement("div");
  bookDiv.classList.add("bookCard");
  bookDiv.dataset.id = book.id;

  //create belete button
  const deleteBtn = document.createElement("btn");
  deleteBtn.classList.add("deleteBtn");

  // create div for book's title
  const titleDiv = document.createElement("div");
  titleDiv.innerText = book.title;
  titleDiv.classList.add("bookTitle");

  // create div for book's author
  const authorDiv = document.createElement("div");
  authorDiv.innerText = book.author;
  authorDiv.classList.add("bookAuthor");

  // create div for book's was read
  const wasReadDiv = document.createElement("div");
  wasReadDiv.innerHTML = `${book.wasRead ? 'Read <img class="tick display-inline" src="images/tick.png">' : ''}`;
  wasReadDiv.classList.add("bookRead");

  // create edit button
  const editImg = document.createElement("img");
  editImg.src = "images/pencil.png";
  editImg.classList.add("bookEditBtn");


  //placing DIV's
  bookDiv.appendChild(deleteBtn);
  bookDiv.appendChild(titleDiv);
  bookDiv.appendChild(authorDiv);
  bookDiv.appendChild(editImg);
  bookDiv.appendChild(wasReadDiv);
  $container.appendChild(bookDiv);
}
function resetLibraryDisplay() {
  while ($container.firstChild) {
    $container.removeChild($container.lastChild);
  }
}
//main
addDefaultBooks(myLibrary)
displayBooks(myLibrary)
