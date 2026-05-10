const params = new URLSearchParams(window.location.search);
const from = params.get("from");
const bookId = params.get("id");

// Back button
function goBack() {
    if (from === "details") {
        window.location.href = `book_details.html?id=${bookId}`;
    } else {
        window.location.href = "books_list.html";
    }
}

// Pre-fill form with book data
if (bookId) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let book = books.find(b => String(b.id) === String(bookId));
    if (book) {
        document.getElementById("BOOKID").value = book.id;
        document.getElementById("BOOKNAME").value = book.name || book.title || "";
        document.getElementById("AUTHOR").value = book.author || "";
        document.getElementById("category").value = book.category || "Programming";
        document.getElementById("desc").value = book.description || "";
    }
}

// Update book
let form = document.getElementById("editBookForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();

    let id = document.getElementById("BOOKID").value;
    let name = document.getElementById("BOOKNAME").value;
    let author = document.getElementById("AUTHOR").value;
    let category = document.getElementById("category").value;
    let description = document.getElementById("desc").value;

    let books = JSON.parse(localStorage.getItem("books")) || [];
    let book = books.find(b => String(b.id) === String(id));
    if (!book) {
        alert("Book not found!");
        return;
    }

    if (name != "") { book.name = name;
        book.title = name; }
    if (author != "") book.author = author;
    if (category != "") book.category = category;
    if (description != "") book.description = description;

    localStorage.setItem("books", JSON.stringify(books));
    alert("Book updated successfully!");
    goBack(); // goes back to where user came from
});

// Delete book
function deleteBook() {
    let id = document.getElementById("BOOKID").value;
    if (id == "") {
        alert("Please enter the book ID to delete...");
        return;
    }
    if (confirm("Are you sure you want to delete this book?")) {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        let newbooks = books.filter(b => String(b.id) !== String(id));
        localStorage.setItem("books", JSON.stringify(newbooks));
        alert("Book deleted successfully!");
        window.location.href = "books_list.html";
    }
}
