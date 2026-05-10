document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    // Move isAdmin to the TOP so all functions can use it
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const isAdmin = currentUser ? currentUser.role === "admin" : false;

    if (!bookId) {
        alert("No book selected.");
        window.location.href = "User_books_list.html";
        return;
    }

    let books = JSON.parse(localStorage.getItem("books")) || [];
    let book = books.find(b => String(b.id) === String(bookId));
    if (!book) {
        alert("Book not found.");
        window.location.href = "User_books_list.html";
        return;
    }

    function isBorrowedByUser() {
        let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
        return borrowedBooks.some(
            b => String(b.bookId) === String(book.id) && b.status === "Borrowed"
        );
    }

    function getStatus() {
        return (!book.available || isBorrowedByUser()) ? "Borrowed" : "Available";
    }

    // Fill static data
    document.getElementById("bookTitle").textContent = book.title;
    document.getElementById("bookAuthor").textContent = book.author;
    document.getElementById("bookCategory").textContent = book.category;
    document.getElementById("bookDescription").textContent = book.description;
    document.getElementById("bookImage").src = book.image;

    function renderStatusAndButtons() {
        const status = getStatus();
        const statusElement = document.getElementById("bookStatus");
        statusElement.textContent = status;
        statusElement.className = "";
        statusElement.classList.add(status === "Available" ? "available" : "borrowed");

        const borrowSection = document.getElementById("borrowSection");

        // Borrow/Return only for regular users
        if (isAdmin) {
            borrowSection.innerHTML = "";
            return;
        }

        if (status === "Available") {
            borrowSection.innerHTML = `
                <button id="borrowBtn" class="borrow-btn">Borrow</button>
            `;
            document.getElementById("borrowBtn").addEventListener("click", handleBorrow);
        } else if (isBorrowedByUser()) {
            borrowSection.innerHTML = `
                <button id="returnBtn" class="return-btn">Return Book</button>
            `;
            document.getElementById("returnBtn").addEventListener("click", handleReturn);
        } else {
            borrowSection.innerHTML = `<p class="unavailable-msg">This book is currently unavailable.</p>`;
        }
    }

    function handleBorrow() {
        let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

        let alreadyBorrowed = borrowedBooks.some(
            b => String(b.bookId) === String(book.id) && b.status === "Borrowed"
        );
        if (alreadyBorrowed) {
            alert("You have already borrowed this book. Please return it first.");
            return;
        }

        borrowedBooks.push({
            borrowId: Date.now(),
            userId: "guest",
            userName: "Guest",
            bookId: String(book.id),
            bookName: book.title,
            author: book.author || "",
            category: book.category || "",
            status: "Borrowed"
        });
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

        let books = JSON.parse(localStorage.getItem("books")) || [];
        let b = books.find(b => String(b.id) === String(book.id));
        if (b) {
            b.available = false;
            localStorage.setItem("books", JSON.stringify(books));
            book.available = false;
        }

        alert("Book borrowed successfully!");
        renderStatusAndButtons();
    }

    function handleReturn() {
        let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
        borrowedBooks = borrowedBooks.map(b => {
            if (String(b.bookId) === String(book.id) && b.status === "Borrowed") {
                return {...b, status: "Returned" };
            }
            return b;
        });
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

        let books = JSON.parse(localStorage.getItem("books")) || [];
        let b = books.find(b => String(b.id) === String(book.id));
        if (b) {
            b.available = true;
            localStorage.setItem("books", JSON.stringify(books));
            book.available = true;
        }

        alert("Book returned successfully!");
        renderStatusAndButtons();
    }

    // Show Edit and Delete buttons if admin
    if (isAdmin) {
        document.getElementById("adminSection").innerHTML = `
            <button class="edit-btn" onclick="window.location.href='edit_book.html?id=${book.id}&from=details'">Edit</button>
            &nbsp;&nbsp;
            <button class="delete-btn" onclick="deleteBook()">Delete</button>
        `;
    }

    function deleteBook() {
        if (!confirm("Are you sure you want to delete this book?")) return;

        let books = JSON.parse(localStorage.getItem("books")) || [];
        books = books.filter(b => String(b.id) !== String(bookId));
        localStorage.setItem("books", JSON.stringify(books));

        alert("Book deleted successfully!");
        window.location.href = "books_list.html";
    }

    window.deleteBook = deleteBook;

    renderStatusAndButtons();
});
