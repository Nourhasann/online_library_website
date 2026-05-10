
const currentUser = JSON.parse(sessionStorage.getItem("currentUser")); // get current user as a string then convert it into js object

// will be useful in debugging
if (currentUser?.role === "admin") { // will not crach if current user is null
    console.log("Admin view");
} else {
    console.log("User view");
}


function searchBooks() {
  const query = document.querySelector("input").value.trim().toLowerCase(); // remove extra spaces from the query and make is lowercase

  // if query is empty
  if (query === "") {
    alert("Please enter something to search");
    return;
  }

  // get the books & convert it to json object
  const books = JSON.parse(localStorage.getItem("books")) || []; // books is empty, return empty array

  // check query with book title, author name & category
  const results = books.filter(book =>   // results is a new array with the matched books 
    book.title.toLowerCase().includes(query) ||   
    book.author.toLowerCase().includes(query) ||
    book.category.toLowerCase().includes(query)
  );

  displayResults(results); // show the matched books
}


function displayResults(results) {
  const container = document.getElementById("resultsContainer"); // the div that will contain the matched books
  container.innerHTML = "";  // clear the old results

    // if no books are matched
    if (results.length === 0) {
        container.innerHTML = `<p class="no-results">No books found </p>`;
        return;
    }

  results.forEach(book => {  // for each book create a book card 
      const bookCard = `
      <div class="book-card">
          <img src="${book.image}" alt="${book.title}">
          <div class="book-info">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Category:</strong> ${book.category}</p>
          </div>
      </div>
  `;

  container.innerHTML += bookCard; // append each book to the container
  });
}
