let myLibrary = [];

//Book constructor
function Book(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = status;
}
//Manually setting Book prototype
Book.prototype = {
  constructor : Book, //redefining constructor property 
  info : function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.status == true ? 'already read':'not read yet'}`;
  },
};

const hobbit = new Book("The Hobbit", "J.R.R Tolkien", 295, false);
console.log(hobbit.info());

//Filter field and event
const filter = document.getElementById('filter');
filter.addEventListener('keyup', filterBooks);

//Book Shelf (container)
const shelf = document.querySelector('.book-container')

//"NEW BOOK 📚" card/button
const newBookCard = document.querySelector('.add-new');
//displayForm event
newBookCard.addEventListener("click", displayForm);

//Form
const form = document.querySelector('.newBookForm');
//Form submit event
form.addEventListener("submit", addToShelf);


//'Change status' buttons and events
shelf.addEventListener('click', changeStatus);

//'Remove' buttons and events
shelf.addEventListener('click', removeBook);

//Display form on card
function displayForm(e) {
  //Selecting inner div containing the "NEW BOOK 📚" box
  let div = document.querySelector('.bookDiv');

  form.classList.toggle('displayContent');
  //Removing div
  newBookCard.removeChild(div);
  //Preventing re-use of event
  newBookCard.removeEventListener("click", displayForm);
}

//Prepend new book card to shelf [and to myLibrary array as a new Book object]
function addToShelf(e) {
  
  e.preventDefault();

  let title = document.getElementById('title').value;
  let author = document.getElementById('author').value;
  let pages = document.getElementById('pages').value;
  let status = (document.querySelector('input[name=status]:checked').value == 'true'); //parsing string to boolean

  //creating current Book object and prepending it to myLibrary array
  let currentBook = new Book(title, author, pages, status);
  myLibrary.push(currentBook);
  let idx = myLibrary.indexOf(currentBook);

  //new card element (li) 
  let li = document.createElement('li');
  li.innerHTML =
    "<p>Title: <span>"+myLibrary[idx].title+"</span></p>" +
    "<p>Author: "+myLibrary[idx].author+"</p>" +
    "<p>Pages: "+myLibrary[idx].pages+"</p>" +
    "<p>Status: "+`${myLibrary[idx].readStatus == true ? 'already read':'not read yet'}`+"</p>";
  li.className = 'book-item book-card';
  li.setAttribute('data-book-idx', `${idx}`); //associating DOM element with the actual book object in myLibrary array (via a data-attribute)

  //background color: green → read-already |  gray → not-read-yet
  if(myLibrary[idx].readStatus) {
    li.classList.add('read-already');
  } else {
    li.classList.add('not-read-yet');
  }

  // card options (div and buttons)
  let div = document.createElement('div');
  div.className = 'options';

  let changeStatusBtn = document.createElement('button');
  changeStatusBtn.className = 'changeStatus';
  changeStatusBtn.appendChild(document.createTextNode('Change Status'));
  
  let removeBookBtn = document.createElement('button');
  removeBookBtn.className = 'removeBook';
  removeBookBtn.appendChild(document.createTextNode('Remove'));
  
  div.appendChild(changeStatusBtn);
  div.appendChild(removeBookBtn);

  //appending options to card
  li.appendChild(div);
  
  //prepending card to shelf
  shelf.prepend(li);

  e.target.reset(); //clearing form

}
//Switch read status' (not read yet / read already)
function changeStatus(e) {
  if(e.target.classList.contains('changeStatus')) { //refering to 'change status' btn

    let bookCard = e.target.parentElement.parentElement; //'change status' btn parent's parent (i.e the whole card)
    let idx = bookCard.getAttribute('data-book-idx'); //current book index on myLibrary array

    if (myLibrary[idx].readStatus == true) {
      myLibrary[idx].readStatus = false; //switching the 'Book' object readStatus attribute
      bookCard.children[3].textContent = "Status: not read yet";
      bookCard.classList.remove('read-already');
      bookCard.classList.add('not-read-yet');
    } else {
      myLibrary[idx].readStatus = true; //switching the 'Book' object readStatus attribute
      bookCard.children[3].textContent = "Status: read already";
      bookCard.classList.remove('not-read-yet');
      bookCard.classList.add('read-already');
    }
    
  }
}

//Remove Book object from myLibrary and remove book card from shelf
function removeBook(e) {
  if(e.target.classList.contains('removeBook')) { //refering to 'change status' btn
    if(confirm('Are you sure?')) {
      let bookCard = e.target.parentElement.parentElement; //'change status' btn parent's parent (i.e the whole card)
      let idx = bookCard.getAttribute('data-book-idx'); //current book index on myLibrary array

      myLibrary.splice(idx, 1); //removing Book object from myLibrary array
      shelf.removeChild(bookCard); //removing card from shelf
    }

    //rearrange data-book-idx's for books left;
    let booksLeft = Array.from(shelf.getElementsByClassName('book-card'));
    booksLeft.forEach(function(bookCardLeft, idx) {
      bookCardLeft.setAttribute('data-book-idx', `${booksLeft.length-1-idx}`);
    });
  }
}

//Filter bookshelf by book title
function filterBooks(e) {
  //convert input text to lowercase
  let text = e.target.value.toLowerCase();
  //get books
  let books = shelf.getElementsByClassName('book-card');


  Array.from(books).forEach(function(book) {
    let bookTitle = book.firstChild.lastChild.textContent; //text content inside <span></span>
    if(bookTitle.includes(text)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}