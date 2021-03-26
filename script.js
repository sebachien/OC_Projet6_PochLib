const addButtonNewBook = () => {
    var selectButtonPosition = document.querySelector("#myBooks > h2");
    var button = document.createElement("BUTTON");
    button.innerHTML = "Ajouter un livre";
    button.setAttribute("id","addBook");
    console.log(selectButtonPosition);
    selectButtonPosition.after(button);
    newBookButtonClick();
    initFavListIfExist();

}

const initFavListIfExist = () => {
    if (window.sessionStorage.getItem("Fav")) {
        var recupFavs = window.sessionStorage.getItem("Fav");
        var favsList = JSON.parse(recupFavs);
        addFavResult(favsList);
    }

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
        removeSearchResult(); 
        ApiCallback();
        removeNewFormSearch();
        addNewFormSearch();
    });
}

const ApiCallback = () => {
    var title = document.getElementById("title");
    var author = document.getElementById("author");
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
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

const addSearchBookToSessionStorage = (books) => {
    if (window.sessionStorage.getItem("SearchBook")) {
        console.log("SearchBook exsiste");
        window.sessionStorage.removeItem("SearchBook");
        var stringBooks = JSON.stringify(books);
        console.log(stringBooks);
        window.sessionStorage.setItem("SearchBook", stringBooks);
    } else {
        var stringBooks = JSON.stringify(books);
        console.log(stringBooks);
        window.sessionStorage.setItem("SearchBook", stringBooks);    
    }
}

const addSearchResult = (books) => {
    addSearchBookToSessionStorage(books);
    var resultPosition = document.querySelector("#myBooks > hr");
    var resultTitle = document.createElement("div");
    resultTitle.setAttribute("id","bookResults");
    resultTitle.innerHTML =  "<h2>Résultats de recherche</h2>";
    resultPosition.after(resultTitle);
    resultPosition = document.querySelector("#bookResults > h2");
    var section = document.createElement("section");
    section.setAttribute("id","sectionResults");
    if (books.length > 0 ) {
        for (let book of books) {
            section.innerHTML += '<article class=sectionBook ><div class="titleAndBookmark"><p class="titleBooks">Titre du livre : ' + book.title + '</p><button id="' + book.id + '" class="bookmarkButton fas fa-bookmark"  </button></div><p class="idBooks">Id : ' + book.id + '</p><p class="authorBooks">Auteur : ' + book.author + '</p><p class="descriptionBooks">Description : ' + book.description + '</p><img class = "imageBook" src=' + book.image + '></article>';
        }
    } else {
        section.innerHTML = '<p class="searchNull">Aucun livre n’a été trouvé</p>'
    }
    resultPosition.after(section);
    bookmarkButtonClick();

}

const addFavResult = (favs) => {
    removeFavResult();
    var resultPosition = document.querySelector("#content > h2");
    var section = document.createElement("section");
    section.setAttribute("id","sectionFav");
    if (favs.length > 0 ) {
        for (let fav of favs) {
            section.innerHTML += '<article class=sectionBook ><div class="titleAndBookmark"><p class="titleBooks">Titre du livre : ' + fav.title + '</p><button id="' + fav.id + '" class="trashButton fas fa-trash-alt" </button></div><p class="idBooks">Id : ' + fav.id + '</p><p class="authorBooks">Auteur : ' + fav.author + '</p><p class="descriptionBooks">Description : ' + fav.description + '</p><img class = "imageBook" src=' + fav.image + '></article>';
        }
    } else {
        section.innerHTML = '<p class="searchNull">Aucun livre n’a été trouvé</p>'
    }
    resultPosition.after(section);
    trashButtonClick();

}

const addBookToSessionStorage = (id) => {
    var recupSearchBook = window.sessionStorage.getItem("SearchBook");
    var searchBookList = JSON.parse(recupSearchBook);
    for (let book of searchBookList) {
        if (book.id == id) {
            var bookToAdd = book;
        } 
    }
    var exist = false;
    if (window.sessionStorage.getItem("Fav")) {
        console.log("fav exsiste");
        var recupFavs = window.sessionStorage.getItem("Fav");
        var favsList = JSON.parse(recupFavs);

        for (let fav of favsList ) {
            if(bookToAdd.id == fav.id && exist == false) {
                console.log("elert");
                alert("déja dans les favoris");
                exist = true;
            }
            
        }
        if (exist == false) {
            favsList.push(bookToAdd);
            var myFavs = JSON.stringify(favsList);
            window.sessionStorage.setItem('Fav', myFavs);
            

        }
    } else {
            var favsList = [];
            favsList.push(bookToAdd);
            var myFavs = JSON.stringify(favsList);
            window.sessionStorage.setItem('Fav', myFavs);      
    }
    console.log(favsList);
    addFavResult(favsList);
}

const removeBookToSessionStorage = (id) => {
    var recupFavs = window.sessionStorage.getItem("Fav");
    var favsList = JSON.parse(recupFavs);
        for (let favNum in favsList ) {
            if(id == favsList[favNum].id ) {
                console.log("suppression de : " + favsList[favNum].title);
                if (favsList.length > 1) {
                    var newFavsList = favsList.splice(favNum, 1);
                    console.log("newFavsList : " + newFavsList);
                    var myFavs = JSON.stringify(newFavsList);
                    window.sessionStorage.setItem('Fav', myFavs);  
                } else {
                    window.sessionStorage.removeItem("Fav");
                    favsList= [] ;
                }
            }
        }
        addFavResult(favsList);
}

const bookmarkButtonClick = () => {
    var bookmarkButtons = document.getElementsByClassName("bookmarkButton");
    for (let bookmarkButton of bookmarkButtons) {
        bookmarkButton.addEventListener('click', function(e) {
            addBookToSessionStorage(e.target.id);              
        });
    }
}

const trashButtonClick = () => {
    var trashButtons = document.getElementsByClassName("trashButton");
    for (let trashButton of trashButtons) {
        trashButton.addEventListener('click', function(e) {
            removeBookToSessionStorage(e.target.id);              
        });
    }
}

const removeSearchResult = () => {
    var bookResults = document.getElementById("bookResults");
    if (bookResults != null) {
            console.log(bookResults);
            bookResults.remove();
    }
}

const removeFavResult = () => {
    var favResults = document.getElementById("content");
    favResults.innerHTML = "<h2>Ma poch'liste</h2>"
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
