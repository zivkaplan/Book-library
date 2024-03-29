const $container = document.querySelector(".container");
const $form = document.querySelector(".form");
const $newFormBtn = document.querySelector(".newBtn");
const $closeBtn = $form.querySelector(".form .closeBtn");
const $addBtn = $form.querySelector(".form .addBtn");
const $clearLocalStorageBtn = document.querySelector(".clearLocalStorageBtn");
const $signInBtn = document.querySelector(".signInBtn");
const $signOutBtn = document.querySelector(".signOutBtn");
const $showAllBtn = document.querySelector(".showAllBtn");
const $showReadBtn = document.querySelector(".showReadBtn");
const $showUnreadBtn = document.querySelector(".showUnreadBtn");
const $clearLocalStorage = document.querySelector(".clearLocalStorage");
const $clearLocalCancelBtn = $clearLocalStorage.querySelector(".clearLocalStorage .cancel");
const $clearLocalDeleteBtn = $clearLocalStorage.querySelector(".clearLocalStorage .delete");

let myLibrary = [];
let userId = null;
let counter = 0

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

async function storageCheck() {
  if (userId) {
    await readUserData()
    return
  }
  if (!localStorage.getItem('bookLibrary')) {
    myLibrary = [];
    addDefaultBooks(myLibrary);
    populateStorage()
  }
  myLibrary = JSON.parse(localStorage.getItem('bookLibrary'));
}

function populateStorage() {
  localStorage.setItem('bookLibrary', JSON.stringify(myLibrary));
}

function saveUserData() {
  if (userId) {
    firebase.database().ref('users/' + userId).set(myLibrary);
    return
  }
  populateStorage();
}

function readUserData() {
  return new Promise(function (resolve, reject) {
    firebase.database().ref().child("users").child(userId).get().then(function (snapshot) {
      if (snapshot.exists() && snapshot.val()) {
        myLibrary = snapshot.val();
      } else {
        myLibrary = [];
        addDefaultBooks(myLibrary);
        saveUserData();
        readUserData();
      }
      return resolve();
    }).catch(function (error) {
      console.error(error);
    });
  })
};

function addDefaultBooks(myLibrary) {
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
function resetLibraryDisplay() {
  while ($container.firstChild) {
    $container.removeChild($container.lastChild);
  }
}
//main

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
  saveUserData();

  //clear inputs
  $form.querySelector('input[name="title"]').value = '';
  $form.querySelector('input[name="author"]').value = '';
  $form.querySelector('input[name="numOfPages"]').value = '';
  $form.querySelector('input[name="wasRead"]').checked = false;
})

$container.addEventListener("click", (e) => {
  if (!e.target.closest(".deleteBtn")) return;
  deleteBook(e.target.parentNode.dataset.id);
  saveUserData();
})

$clearLocalStorageBtn.addEventListener("click", (e) => {
  $clearLocalStorage.classList.remove("hidden");
})

$clearLocalCancelBtn.addEventListener("click", (e) => {
  $clearLocalStorage.classList.add("hidden");
})

$clearLocalDeleteBtn.addEventListener("click", (e) => {
  $clearLocalStorage.classList.add("hidden");
  resetLibraryDisplay();
  window.localStorage.clear();
  storageCheck();
  displayBooks(myLibrary);
})

$showReadBtn.addEventListener("click", (e) => {
  resetLibraryDisplay();
  displayBooks(myLibrary.filter(book => book.wasRead));
})

$showUnreadBtn.addEventListener("click", (e) => {
  resetLibraryDisplay();
  displayBooks(myLibrary.filter(book => !book.wasRead));
})

$showAllBtn.addEventListener("click", (e) => {
  resetLibraryDisplay();
  displayBooks(myLibrary);
})

$signInBtn.addEventListener("click", () => {
  googleLogin();
})

$signOutBtn.addEventListener("click", () => {
  firebase.auth().signOut();
  location.reload();
})

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(error)
      // ...
    });
}

firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
    userId = firebase.auth().currentUser.uid
    $signInBtn.innerText = user.displayName;
    $clearLocalStorageBtn.classList.add('hidden')
    $signOutBtn.classList.remove('hidden')
    await storageCheck();
    console.log(myLibrary)
    resetLibraryDisplay();
    displayBooks(myLibrary);
  } else {
    userId = null;
    storageCheck();
    resetLibraryDisplay();
    displayBooks(myLibrary)
    $signInBtn.innerText = "Sign in";
    $signOutBtn.classList.add('hidden')

  }
}, function (error) {
  console.log(error);
});