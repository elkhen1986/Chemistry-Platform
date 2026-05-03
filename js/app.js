async function loadHeader() {
    const res = await fetch("components/header.html");
    const data = await res.text();
    document.getElementById("header").innerHTML = data;
}

loadHeader();

async function loadFooter() {
    const res = await fetch("components/footer.html");
    const data = await res.text();
    document.getElementById("footer").innerHTML = data;
}

loadFooter();

async function loadPage(page) {
    const res = await fetch(`pages/${page}.html`);
    const data = await res.text();
    document.getElementById("app").innerHTML = data;
}

loadPage("home");

window.onload = () => {
    loadTheme();
    loadPage("home");

    // استنى الهيدر والفوتر يتحملوا
    setTimeout(fixLayoutSpacing, 200);
};

let visitedPages = new Set();

