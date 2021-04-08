const $container = document.querySelector(".container");
const $form = document.querySelector(".form");
const $newFormBtn = document.querySelector(".newBtn");
const $closeBtn = document.querySelector(".form .closeBtn");
const $addBtn = document.querySelector(".form .addBtn");


let myLibrary = [];
let counter = 0;

class Book {
  constructor(title, author, pages = 0, wasRead = false) {
    this.id = counter++;
    this.title = title;
    this.author = author;
    this.pages = pages;
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

const harryPotter = new Book("Harry Potter", "J. K. Rolling", 587, true);
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


function addBookToLibrary(book, library) {
  library.push(book);
}

function displayBooks(library) {
  $container.innerHTML = '';
  library.forEach((book) => {
    createBookCard(book);
  });
}

function localStorageCheck() {
  if (!localStorage.getItem('bookLibrary')) {
    populateStorage()
  }
  myLibrary = JSON.parse(localStorage.getItem('bookLibrary'));
}

function populateStorage() {
  localStorage.removeItem('bookLibrary');
  localStorage.setItem('bookLibrary', JSON.stringify(myLibrary));
  console.log(JSON.parse(localStorage.getItem('bookLibrary')))
}

function searchBookById(id) {
  for (let i = 0; i < myLibrary.length; i++) {
    console.log(myLibrary[i].id, parseFloat(id))
    if (myLibrary[i].id === parseFloat(id)) {
      return i;
    }
  }
}

function deleteBook(id) {
  document.querySelector(`[data-id="${id}"]`).remove()
  const bookToRemove = searchBookById(id)
  myLibrary.splice(bookToRemove, 1);
  console.log(myLibrary, bookToRemove)
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
  titleDiv.classList.add("bookTitle", "bookContent");

  // create div for book's author
  const authorDiv = document.createElement("div");
  authorDiv.innerText = book.author;
  authorDiv.classList.add("bookAuthor", "bookContent");

  // create div for book's was read
  const wasReadDiv = document.createElement("div");
  wasReadDiv.innerText = `${book.wasRead ? 'marked as read' : 'marked a unread'}`;
  wasReadDiv.classList.add("bookContent");

  // create div for book's pages
  const pagesDiv = document.createElement("div");
  pagesDiv.innerText = `${book.pages ? book.pages : '?'} pages long`;
  pagesDiv.classList.add("bookContent");

  //placing DIV's
  bookDiv.appendChild(deleteBtn);
  bookDiv.appendChild(titleDiv);
  bookDiv.appendChild(authorDiv);
  bookDiv.appendChild(pagesDiv);
  bookDiv.appendChild(wasReadDiv);
  $container.appendChild(bookDiv);
}

//main
localStorageCheck();
displayBooks(myLibrary)

$newFormBtn.addEventListener("click", (e) => {
  $form.classList.remove("hidden");
})

$closeBtn.addEventListener("click", (e) => {
  $form.classList.add("hidden");
})

$addBtn.addEventListener("click", (e) => {
  const title = $form.querySelector('input[name="title"]').value;
  const author = $form.querySelector('input[name="author"]').value;
  const pages = $form.querySelector('input[name="numOfPages"]').value;
  const wasRead = $form.querySelector('input[name="wasRead"]').checked;
  const newBook = new Book(title, author, pages, wasRead);
  $form.classList.add("hidden");
  addBookToLibrary(newBook, myLibrary);
  createBookCard(newBook);
  populateStorage();
})

$container.addEventListener("click", (e) => {
  if (!e.target.closest(".deleteBtn")) return;
  deleteBook(e.target.parentNode.dataset.id);
  populateStorage();
})
