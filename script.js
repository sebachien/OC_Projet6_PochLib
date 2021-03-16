const addButtonNewBook = () => {
    var selectButtonPosition = document.querySelector("#myBooks > h2");
    var button = document.createElement("BUTTON");
    button.innerHTML = "Ajouter un livre";
    button.setAttribute("id","addBook");
    console.log(selectButtonPosition);
    selectButtonPosition.after(button);
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
}

const removeNewFormSearch = () => {
    var selectFormPosition = document.getElementById("form");
    selectFormPosition.remove();
}


addButtonNewBook();
addNewFormSearch();