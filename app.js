
// 1. Listings data

const listings = [
    {
        id: 1,
        title: "Casio fx-991EX Calculator",
        price: 4500,
        category: "Electronics",
        condition: "Good",
        description: "Works perfectly, comes with its cover.",
        image: "images/calculator.jpg"
    },
    {
        id: 2,
        title: "Introduction to Algorithms (CLRS)",
        price: 3500,
        category: "Books",
        condition: "Like new",
        description: "3rd edition with minimal highlighting.",
        image: "images/CLRS.jpg"
    },
    {
        id: 3,
        title: "Logitech Wireless Mouse",
        price: 1800,
        category: "Electronics",
        condition: "Good",
        description: "Wireless mouse in good condition.",
        image: "images/logitech.jpg"
    },
    {
        id: 4,
        title: "Discrete Mathematics by Rosen",
        price: 2200,
        category: "Books",
        condition: "Fair",
        description: "Mathematics textbook.",
        image: "images/discrete.jpg"
    },
    {
        id: 5,
        title: "Study Table with Drawer",
        price: 6000,
        category: "Furniture",
        condition: "Good",
        description: "Study table for students.",
        image: "images/studytable.jpg"
    },
    {
        id: 6,
        title: "Geometry Box Set",
        price: 600,
        category: "Stationery",
        condition: "Like new",
        description: "Geometry box in good condition.",
        image: "images/geometry.jpg"
    }
];


// 2. Favourite items

const favorites = new Set();


// 3. Selecting HTML elements

const grid = document.querySelector("#listing-grid");
const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const sortSelect = document.querySelector("#sort");

const resultCount = document.querySelector("#result-count");
const favCount = document.querySelector("#fav-count");
const savedTotal = document.querySelector("#saved-total");
const emptyMessage = document.querySelector("#empty-message");


// 4. Format price

const formatPrice = (amount) => {
    return `Rs ${amount.toLocaleString("en-PK")}`;
};


// 5. Create product card

function createCard(listing) {

    const article = document.createElement("article");
    article.className = "card";
    article.dataset.id = listing.id;

    const img = document.createElement("img");
    img.src = listing.image;
    img.alt = listing.title;
    img.width = 400;
    img.height = 300;

    const body = document.createElement("div");
    body.className = "card-body";

    const h3 = document.createElement("h3");
    h3.textContent = listing.title;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(listing.price);

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `${listing.category} · ${listing.condition}`;

    const description = document.createElement("p");
    description.textContent = listing.description;

    const favBtn = document.createElement("button");
    favBtn.className = "fav-btn";
    favBtn.type = "button";

    favBtn.setAttribute(
        "aria-pressed",
        favorites.has(listing.id)
    );

    favBtn.textContent = favorites.has(listing.id)
        ? "❤️ Saved"
        : "🤍 Save";

    body.append(h3, price, meta, description, favBtn);

    article.append(img, body);

    return article;
}


// 6. Render listings

function render(items) {

    grid.replaceChildren(...items.map(createCard));

    resultCount.textContent = `${items.length} item(s) found`;

    favCount.textContent = favorites.size;

    emptyMessage.hidden = items.length !== 0;

    // Calculate total price of saved items

    const total = listings
        .filter((item) => favorites.has(item.id))
        .reduce((sum, item) => sum + item.price, 0);

    savedTotal.textContent =
        `Total value of saved items: ${formatPrice(total)}`;
}


// 7. Search, category filtering and sorting

function applyFilters() {

    const query = searchInput.value.trim().toLowerCase();

    const category = categorySelect.value;

    const sort = sortSelect.value;

    // Search and category filter

    let filtered = listings.filter((item) => {

        const matchesSearch =
            item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query);

        const matchesCategory =
            category === "All" || item.category === category;

        return matchesSearch && matchesCategory;
    });


    // Sorting

    if (sort === "low-high") {

        filtered = filtered.toSorted(
            (a, b) => a.price - b.price
        );

    } else if (sort === "high-low") {

        filtered = filtered.toSorted(
            (a, b) => b.price - a.price
        );

    } else if (sort === "newest") {

        filtered = filtered.toSorted(
            (a, b) => b.id - a.id
        );
    }

    render(filtered);
}


// 8. Live search event

searchInput.addEventListener("input", applyFilters);


// 9. Category filter event

categorySelect.addEventListener("change", applyFilters);


// 10. Sorting event

sortSelect.addEventListener("change", applyFilters);


// 11. Favourite button using event delegation

grid.addEventListener("click", (event) => {

    const button = event.target.closest(".fav-btn");

    if (!button) return;

    const id = Number(button.closest(".card").dataset.id);

    if (favorites.has(id)) {

        favorites.delete(id);

    } else {

        favorites.add(id);
    }

    applyFilters();
});


// 12. Dark mode toggle

const toggle = document.querySelector("#theme-toggle");

toggle.addEventListener("click", () => {

    const root = document.documentElement;

    const isDark = root.dataset.theme === "dark";

    root.dataset.theme = isDark ? "light" : "dark";

    toggle.textContent = isDark ? "🌙" : "☀️";
});


// 13. Display listings when page loads

render(listings);
