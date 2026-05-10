let form = document.getElementById("addBookForm");


form.addEventListener("submit", function(event) { //when user clicks submit button, this function will be called
    event.preventDefault(); // Prevent the default form submission

    let id = document.getElementById("BOOKID").value;
    let name = document.getElementById("BOOKNAME").value;
    let author = document.getElementById("AUTHOR").value;
    let category = document.getElementById("category").value;
    let description = document.getElementById("desc").value;

    if (id == "" || name == "" || author == "") {
        alert("Please fill in all required fields...");
        return;
    }

    let books = JSON.parse(localStorage.getItem("books")) || []; // Retrieve existing books from localStorage or initialize an empty array

    let exists = books.some(book => book.id === id); //check duplicate id
    if (exists) {
        alert("A book with this ID already exists. Please use a different ID...");
        return;
    }

    let newBook = {
        id: id,
        name: name,
        author: author,
        category: category,
        description: description
    };

    books.push(newBook); // Add the new book to the array

    localStorage.setItem("books", JSON.stringify(books)); // Save the updated array back to localStorage

    alert("Book added successfully!");
    form.reset(); // Clear the form after submission
});
