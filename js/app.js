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

function updateProgress(pageId) {
    visitedPages.add(pageId);

    const total = document.querySelectorAll(".page-section").length;
    const progress = (visitedPages.size / total) * 100;

    const bar = document.getElementById("progress-bar");
    if (bar) {
        bar.style.width = progress + "%";
    }
}

document.getElementById("progress-bar").style.width = "0%"