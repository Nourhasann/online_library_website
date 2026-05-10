function loadBorrowedBooks() {
    let borrowedBooks = [];
    try {
        borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    } catch(e) { borrowedBooks = []; }

    // Only show books that are currently borrowed
    let myBorrows = borrowedBooks.filter(b => b.status === "Borrowed");

    let tbody = document.getElementById("borrowedTableBody");
    tbody.innerHTML = "";

    if (myBorrows.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>You have no borrowed books.</td></tr>";
        return;
    }

    for (let i = 0; i < myBorrows.length; i++) {
        let borrow = myBorrows[i];
        let row = document.createElement("tr");
        row.innerHTML =
            "<td>" + borrow.bookId + "</td>" +
            "<td>" + borrow.bookName + "</td>" +
            "<td>" + borrow.author + "</td>" +
            "<td>" + borrow.category + "</td>" +
            "<td>" + borrow.status + "</td>" +
            "<td><button class='return-btn' onclick='returnBook(" + borrow.borrowId + ")'>Return</button></td>";
        tbody.appendChild(row);
    }
}

function returnBook(borrowId) {
    let confirmed = confirm("Are you sure you want to return this book?");
    if (!confirmed) return;

    let borrowedBooks = [];
    try {
        borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    } catch(e) { borrowedBooks = []; }

    let record = borrowedBooks.find(b => Number(b.borrowId) === Number(borrowId));
    if (!record) {
        alert("Record not found.");
        return;
    }

    // Mark as returned in storage (keeps history intact)
    record.status = "Returned";
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

    // Mark book as available again
    let books = [];
    try {
        books = JSON.parse(localStorage.getItem("books")) || [];
    } catch(e) { books = []; }

    let book = books.find(b => String(b.id) === String(record.bookId));
    if (book) {
        book.available = true;
        localStorage.setItem("books", JSON.stringify(books));
    }

    alert("Book returned successfully!");
    loadBorrowedBooks();
}

loadBorrowedBooks();
