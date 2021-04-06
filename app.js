const container = document.querySelector(".container")

let myLibrary = [];

class Book {
    constructor(title, author, pages = 0, wasRead = false) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.wasRead = wasRead
    }
    info() {
        const { title, author, pages, wasRead } = this;
        if (wasRead) {
            return (`${title} by ${author}, ${pages} pages, was read`);
        } else {
            return (`${title} by ${author}, ${pages} pages, not read yet`);
        }
    }
}


function addBookToLibrary(book, library) {
    library.push(book);
}

function displayBooks(library) {
    library.forEach(book => {
        createBookCard(book);
    });
}

function createBookCard(book) {
    const bookDiv = document.createElement("div");
    const titleDiv = document.createElement("div");
    titleDiv.innerText = book.title;
    const authorDiv = document.createElement("div");
    authorDiv.innerText = book.author;
    bookDiv.appendChild(titleDiv)
    bookDiv.appendChild(authorDiv)
    container.appendChild(bookDiv)
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

displayBooks(myLibrary);

