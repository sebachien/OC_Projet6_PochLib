const addButtonNewBook = () => {
    var selectButtonPosition = document.querySelector("#myBooks > h2");
    var button = document.createElement("BUTTON");
    button.innerHTML = "Ajouter un livre";
    button.setAttribute("id","addBook");
    console.log(selectButtonPosition);
    selectButtonPosition.after(button);
    newBookButtonClick();
}

const removeButtonNewBook = () => {
    var selectButtonNewBook = document.getElementById("addBook");
    selectButtonNewBook.remove();
}

const addNewFormSearch = () => {
    var selectFormPosition = document.querySelector("#myBooks > h2");
    var form = document.createElement("form");
    form.setAttribute("id","form");
    form.innerHTML ='<div class="formAddBook"><label for="title">Titre du livre </label><br/><input type="text" name="title" id="title" required></div><div class="formAddBook"><label for="author">Auteur </label><br/><input type="text" name="author" id="author" required></div><div class="formAddBook"><input type="submit" value="Rechercher" id ="search"></div><div class="formAddBook"><input type="submit" value="Annuler" id ="cancel"></div>';
    selectFormPosition.after(form);
    cancelButtonCLick();
    searchButtonClick();
}

const removeNewFormSearch = () => {
    var selectFormPosition = document.getElementById("form");
    selectFormPosition.remove();
}

const cancelButtonCLick = () => {
    var cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener('click', function(e) {
        e.preventDefault(); 
        removeNewFormSearch();
        addButtonNewBook();
        removeSearchResult();

    });
}

const newBookButtonClick = () => {
    var newBookButton = document.getElementById("addBook");
    newBookButton.addEventListener('click', function() {
        removeButtonNewBook();
        addNewFormSearch();               
    });
}

const searchButtonClick = () => {
    var searchButton = document.getElementById("search");
    searchButton.addEventListener('click', function(e) {
        e.preventDefault(); 
        ApiCallback();
    });
}

const ApiCallback = () => {
    var title = document.getElementById("title");
    var author = document.getElementById("author");
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(response);
            searchResult(response);
        }
    };
    request.open("GET", "https://www.googleapis.com/books/v1/volumes?q=" + title.value + "+inauthor:" + author.value);
    request.send();
}

const searchResult = (response) => {
    var Books = [];
    var image = "unavailable.png";
    var description = "Information manquante";
    if (response.totalItems > 0) {
        for (let i of response.items) {
            if (i.volumeInfo.imageLinks != null) {
                image = i.volumeInfo.imageLinks.smallThumbnail;
            }
            if (i.volumeInfo.description != "" && i.volumeInfo.description != null) {
                description = i.volumeInfo.description;
            }
            Books.push(new Book(i.id, i.volumeInfo.title, i.volumeInfo.authors[0], image, description));
            
        }
    }
    console.log(Books);
    addSearchResult(Books);

}

const addSearchResult = (books) => {
    var resultPosition = document.querySelector("#myBooks > hr");
    var resultTitle = document.createElement("h2");
    resultTitle.setAttribute("class","bookResults");
    resultTitle.innerHTML +=  'Résultats de recherche';
    resultPosition.after(resultTitle);
    var section = document.createElement("section");
    section.setAttribute("class","bookResults");
    if (books.length > 0 ) {
        for (let book of books) {
            section.innerHTML += '<article class=sectionBook ><div class="titleAndBookmark"><p class="titleBooks">Titre du livre : ' + book.title + '</p><button id="' + book.id + '" class="bookmarkButton fas fa-bookmark"  </button></div><p class="idBooks">Id : ' + book.id + '</p><p class="authorBooks">Auteur : ' + book.author + '</p><p class="descriptionBooks">Description : ' + book.description + '</p><img class = "imageBook" src=' + book.image + '></article>';
        }
    } else {
        section.innerHTML = '<p class="searchNull">Aucun livre n’a été trouvé</p>'
    }
    resultTitle.after(section);
    bookmarkButtonClick();

}

const addBookToFav = (id) => {
    var ids = [];
    if (sessionStorage.getItem("Fav")) {  
        ids.push(sessionStorage.getItem("Fav"));
        ids.push(id);
        sessionStorage.setItem('Fav', ids);
      } else {
            ids.push(id);
            sessionStorage.setItem('Fav', ids);
      }
}

const bookmarkButtonClick = () => {
    var bookmarkButtons = document.getElementsByClassName("bookmarkButton");
    for (let bookmarkButton of bookmarkButtons) {
        bookmarkButton.addEventListener('click', function(e) {
            addBookToFav(e.target.id);              
        });
    }
}


const removeSearchResult = () => {
    var bookResults = document.getElementsByClassName("bookResults");
    if (bookResults != null) {
        for (let bookResult of bookResults ) {
            console.log(bookResult);
            bookResult.remove();
        }
    }
}

class Book  {
    constructor(id,title,author,image,description) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.image = image;
        this.description = description;
    }
}

addButtonNewBook();


//window.localStorage.getItem('item', 123)

// author : .items[].volumeInfo.authors[0]
// title : .items[].volumeInfo.title
// id :  .items[].accessInfo.id
//image : items[].volumeInfo.imageLinks.thumbmail
// description : items[].volumeInfo.description   (200 caractère max)
