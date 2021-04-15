const $container = document.querySelector(".container");
const $form = document.querySelector(".form");
const $formContent = $form.querySelector(".form .content");
const $openFormBtn = document.querySelector(".addBookBtn label");
const $closeBtn = $form.querySelector(".form .closeBtn");
const $addBtn = $form.querySelector(".form .addBtn");
const $saveBtn = $form.querySelector(".form .saveBtn");
const $deleteBtn = $form.querySelector(".form .deleteBtn");
const $showAllBtn = document.querySelector("#showAll");
const $showReadBtn = document.querySelector("#showRead");
const $showUnreadBtn = document.querySelector("#showUnread");
const $logInBtn = document.querySelector(".logIn");
const $loggedInBtn = document.querySelector(".loggedIn");
const $logOutBtn = document.querySelector(".logOut");


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
  wasReadDiv.classList.add("bookWasRead");

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
$openFormBtn.addEventListener("click", (e) => {
  $openFormBtn.innerHTML = `<img class="display-inline" src="images/plus.png"
  alt="plus sign for adding a book">Add a book`;
  $form.querySelector('input[name="title"]').value = "";
  $form.querySelector('input[name="author"]').value = "";
  $form.querySelector('input[type="checkbox"]').checked = false;
  $formContent.classList.toggle("active");
  $formContent.classList.toggle("slideOut");
  $addBtn.classList.remove("hidden");
  $saveBtn.classList.add("hidden")
  $deleteBtn.classList.add("hidden")
})

$closeBtn.addEventListener("click", (e) => {
  closeAddBook();
})

$container.addEventListener("click", (e) => {
  if (!e.target.closest("img.bookEditBtn")) return;
  const bookCard = e.target.parentElement;

  $openFormBtn.innerHTML = `<img class="display-inline" src="images/pencil.png"
  alt="edit sign for editing book's details" style="transform: rotate(90deg)">Edit book`;

  $form.querySelector('input[name="title"]').value = bookCard.querySelector(".bookTitle").innerText;
  $form.querySelector('input[name="author"]').value = bookCard.querySelector(".bookAuthor").innerText;
  if (bookCard.querySelector(".bookWasRead").innerText) {
    $form.querySelector('input[type="checkbox"]').checked = true;
  } else {
    $form.querySelector('input[type="checkbox"]').checked = false;
  }

  document.querySelector("#addBook").checked = true; //activating the "+ Add a book" buttom so it will move
  $formContent.classList.toggle("active");
  $formContent.classList.toggle("slideOut");
  $addBtn.classList.add("hidden");
  $saveBtn.classList.remove("hidden");
  $form.dataset.id = bookCard.dataset.id;
  $deleteBtn.classList.remove("hidden");
})

$saveBtn.addEventListener('click', (e) => {
  const { id } = $form.dataset;
  const bookCard = document.querySelector(`[data-id="${id}"]`)
  const bookIndex = myLibrary.findIndex((book) => book.id === parseInt(id));
  console.log(bookIndex)
  const title = $form.querySelector('input[name="title"]').value;
  const author = $form.querySelector('input[name="author"]').value;
  const wasRead = $form.querySelector('input[type="checkbox"]').checked;

  if (title === "" || author === "") return;

  myLibrary[bookIndex].title = title;
  myLibrary[bookIndex].author = author;
  myLibrary[bookIndex].wasRead = wasRead;
  bookCard.querySelector(".bookTitle").innerText = title;
  bookCard.querySelector(".bookAuthor").innerText = author;
  bookCard.querySelector(".bookWasRead").innerHTML = `${wasRead ? 'Read <img class="tick display-inline" src="images/tick.png">' : ''}`;
  closeAddBook();
  saveUserData();
})

$deleteBtn.addEventListener('click', (e) => {
  const { id } = $form.dataset;
  myLibrary = myLibrary.filter(book => book.id !== parseInt(id));
  document.querySelector(`[data-id="${id}"]`).remove();
  closeAddBook();
  saveUserData();
})

$addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const title = $form.querySelector('input[name="title"]').value;
  const author = $form.querySelector('input[name="author"]').value;
  const wasRead = $form.querySelector('input[name="wasRead"]').checked;
  const newBook = new Book(title, author, wasRead);
  if (title !== "" && author !== "") {
    addBookToLibrary(newBook, myLibrary);
    createBookCard(newBook);
    saveUserData();
    document.querySelector("#addBook").checked = false;
    $formContent.classList.remove("active");
    $formContent.classList.add("slideOut");
  }

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


function closeAddBook() {
  $openFormBtn.innerHTML = `<img class="display-inline" src="images/plus.png"
  alt="plus sign for adding a book">Add a book`;
  document.querySelector("#addBook").checked = false;
  $formContent.classList.remove("active");
  $formContent.classList.add("slideOut");
}

$logInBtn.addEventListener("click", () => {
  googleLogin();
})

$logOutBtn.addEventListener("click", () => {
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
    userId = firebase.auth().currentUser.uid;
    $logInBtn.classList.add('hidden')
    $loggedInBtn.classList.remove('hidden')
    $loggedInBtn.querySelector("span.username").innerText = user.displayName.split(' ').slice(0, -1).join(' ');
    await storageCheck();
    resetLibraryDisplay();
    displayBooks(myLibrary);
  } else {
    userId = null;
    $logInBtn.classList.remove('hidden')
    $loggedInBtn.classList.add('hidden')
    storageCheck();
    resetLibraryDisplay();
    displayBooks(myLibrary)
  }
}, function (error) {
  console.log(error);
});


