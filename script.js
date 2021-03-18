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
            if (i.volumeInfo.description != "" || i.volumeInfo.description != "") {
                description = i.volumeInfo.description;
            }
            Books.push(new Book(i.id, i.volumeInfo.title, i.volumeInfo.authors[0], image, i.volumeInfo.description));
            
        }
    }
    console.log(Books);
    addSearchResult(Books);

}

const addSearchResult = (books) => {
    var content = document.getElementById("content");
    content.innerHTML = "<h2>Résultats de recherhce</h2>";
    var resultPosition = document.querySelector("#content > h2");
    var section = document.createElement("section");
    section.setAttribute("class","bookResults");
    if (books.length > 0 ) {
        for (let book of books) {
            section.innerHTML += '<article class=sectionBook ><p class="titleBooks">Titre du livre : ' + book.title + '</p><i class="fas fa-bookmark"></i><p class="idBooks">Id : ' + book.id + '</p><p class="authorBooks">Auteur : ' + book.author + '</p><p class="descriptionBook">Description : ' + book.description + '</p><img class = "imageBook" src=' + book.image + '></article>';
            resultPosition.after(section);
        }
    } else {
        section.innerHTML = '<p class="searchNull">Aucun livre n’a été trouvé</p>'
        resultPosition.after(section);
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
