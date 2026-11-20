
const articleGrid = document.getElementById("articleGrid");

const writeModal = document.getElementById("writeModal");
const readModal = document.getElementById("readModal");

let articles = JSON.parse(
    localStorage.getItem("beyondArticles") || "[]"
);

let activeArticleId = null;


// STARTER ARTICLES

if (articles.length === 0) {

    articles = [
        {
            id: 1,
            title: "The Psychology of Overthinking",
            author: "Beyond Editorial",
            category: "Psychology",
            content: "Sometimes our minds create endless possibilities out of a single moment. We revisit conversations, question decisions and imagine outcomes that may never happen.\n\nBut why do we think so much? Perhaps the human mind is constantly trying to understand uncertainty. Learning to observe our thoughts without accepting every thought as truth can help us see things differently.",
            date: "20 Nov 2026",
            comments: []
        },
        {
            id: 2,
            title: "Are We Really Free?",
            author: "Beyond Editorial",
            category: "Philosophy",
            content: "We make choices every day. But how many of those choices are truly our own?\n\nOur experiences, surroundings and beliefs influence the way we see the world. The question of freedom is more complicated than it first appears.",
            date: "20 Nov 2026",
            comments: []
        },
        {
            id: 3,
            title: "The Beauty of Being Different",
            author: "Beyond Editorial",
            category: "Life",
            content: "Not every person sees the world in the same way. Different perspectives make conversations meaningful and help us discover ideas we might never have considered.",
            date: "20 Nov 2026",
            comments: []
        }
    ];

    saveArticles();
}


// SAVE ARTICLES

function saveArticles() {

    localStorage.setItem(
        "beyondArticles",
        JSON.stringify(articles)
    );

}


// FORMAT DATE

function getDate() {

    return new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// SAFE TEXT OUTPUT

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(char) {

        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];

    });

}


// DISPLAY ARTICLES

function displayArticles() {

    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const category = document.getElementById("categoryFilter")
        .value;

    const filtered = articles.filter(article => {

        const matchesSearch =
            article.title.toLowerCase().includes(search) ||
            article.content.toLowerCase().includes(search) ||
            article.author.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" ||
            article.category === category;

        return matchesSearch && matchesCategory;

    });

    articleGrid.innerHTML = "";

    document.getElementById("articleCount").textContent =
        String(articles.length).padStart(2, "0") + " STORIES";

    document.getElementById("emptyMessage").style.display =
        filtered.length === 0 ? "block" : "none";


    filtered.forEach((article, index) => {

        const card = document.createElement("article");

        card.className = "article-card";

        const preview = article.content.slice(0, 125);

        card.innerHTML = `
            <span class="card-category">
                ${escapeHTML(article.category)}
            </span>

            <h3>${escapeHTML(article.title)}</h3>

            <p>
                ${escapeHTML(preview)}
                ${article.content.length > 125 ? "..." : ""}
            </p>

            <div class="card-footer">

                <span>
                    By ${escapeHTML(article.author)}
                </span>

                <button class="read-link">
                    READ MORE ↗
                </button>

            </div>
        `;

        card.style.animationDelay = `${index * 0.08}s`;

        card.querySelector(".read-link").addEventListener(
            "click",
            () => openArticle(article.id)
        );

        articleGrid.appendChild(card);

    });

}


// OPEN WRITE WINDOW

document.getElementById("openWrite").addEventListener(
    "click",
    () => {
        writeModal.classList.add("active");
    }
);


// CLOSE WRITE WINDOW

document.getElementById("closeWrite").addEventListener(
    "click",
    () => {
        writeModal.classList.remove("active");
    }
);


// PUBLISH NEW ARTICLE

document.getElementById("articleForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const article = {

            id: Date.now(),

            author: document.getElementById("authorName")
                .value.trim(),

            title: document.getElementById("articleTitle")
                .value.trim(),

            category: document.getElementById("articleCategory")
                .value,

            content: document.getElementById("articleContent")
                .value.trim(),

            date: getDate(),

            comments: []

        };

        if (
            !article.author ||
            !article.title ||
            !article.category ||
            article.content.length < 20
        ) {
            alert("Please complete all fields.");
            return;
        }

        articles.unshift(article);

        saveArticles();

        displayArticles();

        this.reset();

        writeModal.classList.remove("active");

        window.location.hash = "articles";

        alert("Your thought has been published!");

    }
);


// OPEN ARTICLE

function openArticle(id) {

    activeArticleId = id;

    const article = articles.find(item => item.id === id);

    if (!article) return;

    document.getElementById("readCategory").textContent =
        article.category;

    document.getElementById("readTitle").textContent =
        article.title;

    document.getElementById("readAuthor").textContent =
        "Written by " + article.author +
        " · " + article.date;

    document.getElementById("readContent").textContent =
        article.content;

    displayComments(article);

    readModal.classList.add("active");

}


// CLOSE ARTICLE

document.getElementById("closeRead").addEventListener(
    "click",
    () => {
        readModal.classList.remove("active");
    }
);


// DISPLAY COMMENTS

function displayComments(article) {

    const commentsList = document.getElementById("commentsList");

    commentsList.innerHTML = "";

    if (article.comments.length === 0) {

        commentsList.innerHTML =
            '<p class="no-comments">No comments yet. Start the conversation.</p>';

        return;

    }

    article.comments.forEach(comment => {

        const div = document.createElement("div");

        div.className = "comment";

        div.innerHTML = `
            <strong>${escapeHTML(comment.name)}</strong>
            <p>${escapeHTML(comment.text)}</p>
        `;

        commentsList.appendChild(div);

    });

}


// ADD COMMENT

document.getElementById("commentForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const article = articles.find(
            item => item.id === activeArticleId
        );

        if (!article) return;

        const name = document.getElementById("commentName")
            .value.trim();

        const text = document.getElementById("commentText")
            .value.trim();

        if (!name || !text) return;

        article.comments.push({
            name: name,
            text: text
        });

        saveArticles();

        displayComments(article);

        this.reset();

    }
);


// SEARCH ARTICLES

document.getElementById("searchInput").addEventListener(
    "input",
    displayArticles
);


// CATEGORY FILTER

document.getElementById("categoryFilter").addEventListener(
    "change",
    displayArticles
);


// CLOSE MODALS BY CLICKING OUTSIDE

[writeModal, readModal].forEach(modal => {

    modal.addEventListener("click", function(event) {

        if (event.target === modal) {
            modal.classList.remove("active");
        }

    });

});


// INITIALIZE WEBSITE

displayArticles();
