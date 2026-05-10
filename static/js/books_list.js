document.addEventListener("DOMContentLoaded", function() {

    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const isAdmin = currentUser && currentUser.role === "admin";
    if (isAdmin) {
        document.getElementById("addBookDiv").style.display = "block";
    }
    if (isAdmin) {
        document.getElementById("statusHeader").style.display = "none";
    }

    function getBooks() {
        return JSON.parse(localStorage.getItem("books")) || [];
    }

    function getBorrowedBooks() {
        return JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    }

    function isBookBorrowed(bookId) {
        return getBorrowedBooks().some(
            b => String(b.bookId) === String(bookId) && b.status === "Borrowed"
        );
    }

    function getStatus(book) {
        return (!book.available || isBookBorrowed(book.id)) ? "Borrowed" : "Available";
    }

    function handleBorrow(bookId) {
        let books = getBooks();
        let borrowedBooks = getBorrowedBooks();
        let book = books.find(b => String(b.id) === String(bookId));

        if (!book) return;

        let alreadyBorrowed = borrowedBooks.some(
            b => String(b.bookId) === String(bookId) && b.status === "Borrowed"
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

        // Mark book unavailable
        book.available = false;
        localStorage.setItem("books", JSON.stringify(books));

        alert("Book borrowed successfully!");
        renderTable();
    }

    function handleReturn(bookId) {
        let books = getBooks();
        let borrowedBooks = getBorrowedBooks();

        borrowedBooks = borrowedBooks.map(b => {
            if (String(b.bookId) === String(bookId) && b.status === "Borrowed") {
                return {...b, status: "Returned" };
            }
            return b;
        });
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

        // Mark book available
        let book = books.find(b => String(b.id) === String(bookId));
        if (book) {
            book.available = true;
            localStorage.setItem("books", JSON.stringify(books));
        }

        alert("Book returned successfully!");
        renderTable();
    }

    function deleteBook(bookId) {
        if (!confirm("Are you sure you want to delete this book?")) return;

        let books = getBooks().filter(b => String(b.id) !== String(bookId));
        localStorage.setItem("books", JSON.stringify(books));

        alert("Book deleted successfully!");
        renderTable();
    }

    function renderTable() {
        let books = getBooks();
        let tbody = document.getElementById("bookTableBody");
        tbody.innerHTML = "";

        if (books.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">No books available.</td>
                </tr>
            `;
            return;
        }

        books.forEach(book => {
            let status = getStatus(book);
            let isBorrowed = status === "Borrowed";
            let borrowedByMe = getBorrowedBooks().some(
                b => String(b.bookId) === String(book.id) && b.status === "Borrowed"
            );

            // Action column logic:
            // - If available → green Borrow button
            // - If borrowed by this user → red Return button
            // - If borrowed by someone else → dash (no action)
            let editBtn = isAdmin ?
                `<button class="edit-btn" onclick="window.location.href='edit_book.html?id=${book.id}&from=list'">Edit</button>
                  &nbsp;&nbsp;
                  <button class="delete-btn" onclick="deleteBook('${book.id}')">Delete</button>` :
                "";

            let actionCell = "";
            if (!isBorrowed) {
                actionCell = isAdmin ?
                    `${editBtn}` :
                    `<button class="borrow-btn" onclick="handleBorrow('${book.id}')">Borrow</button>`;
            } else if (borrowedByMe) {
                actionCell = isAdmin ?
                    `${editBtn}` :
                    `<button class="return-btn" onclick="handleReturn('${book.id}')">Return</button>`;
            } else {
                actionCell = isAdmin ?
                    `${editBtn}` :
                    `<span style="color:#999;">—</span>`;
            }

            let row = document.createElement("tr");
            row.innerHTML = `
              <td>${book.id}</td>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${book.category}</td>
              <td class="${isBorrowed ? 'borrowed' : 'available'}" ${isAdmin ? 'style="display:none;"' : ''}>${status}</td>
              <td><a href="book_details.html?id=${book.id}">View</a></td>
              <td>${actionCell}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Expose handlers globally so onclick attributes can reach them
    window.handleBorrow = handleBorrow;
    window.handleReturn = handleReturn;
    window.deleteBook = deleteBook;



    renderTable();
});
