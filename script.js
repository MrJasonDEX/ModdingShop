/* =========================================================
   MODDINGXZ
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {

    telegram:
        "https://t.me/ModdingXZ",

    support:
        "https://t.me/ModdingXZ_Support_Bot",

    github:
        "https://github.com/MrJasonDEX",

    communityMembers:
        1800

};


/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        const loader =
            document.getElementById("loader");

        if (loader) {
            loader.classList.add("hide");
        }

    }, 800);

});


/* =========================================================
   AOS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof AOS !== "undefined") {

        AOS.init({

            duration: 650,

            easing: "ease-out-cubic",

            once: true,

            offset: 50

        });

    }

});


/* =========================================================
   NAVBAR
========================================================= */

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


navLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            navLinks.forEach(item =>
                item.classList.remove("active")
            );

            link.classList.add("active");

        }
    );

});


/* =========================================================
   COUNTERS
========================================================= */

function animateCounter(element) {

    const target =
        Number(
            element.dataset.counter
        );

    if (!target) return;

    let current = 0;

    const duration = 1500;

    const start =
        performance.now();


    function update(now) {

        const progress =
            Math.min(
                (now - start) / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        current =
            Math.floor(
                target * eased
            );


        element.textContent =
            current.toLocaleString();


        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target.toLocaleString();

        }

    }


    requestAnimationFrame(update);

}


const counters =
    document.querySelectorAll(
        "[data-counter]"
    );


const counterObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    animateCounter(
                        entry.target
                    );

                    counterObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: .5
        }
    );


counters.forEach(counter =>
    counterObserver.observe(counter)
);


/* =========================================================
   SERVICE FILTERING
========================================================= */

const filterButtons =
    document.querySelectorAll(
        ".filter"
    );


const serviceItems =
    document.querySelectorAll(
        ".service-item"
    );


const searchInput =
    document.getElementById(
        "serviceSearch"
    );


let currentFilter = "all";


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            currentFilter =
                button.dataset.filter;

            if (searchInput) {
                searchInput.value = "";
            }

            updateServices();

        }
    );

});


if (searchInput) {

    searchInput.addEventListener(
        "input",
        updateServices
    );

}


function updateServices() {

    const query =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    let visible = 0;


    serviceItems.forEach(card => {

        const category =
            card.dataset.category;


        const searchable =
            (
                card.dataset.search +
                " " +
                card.innerText
            ).toLowerCase();


        const categoryMatch =
            currentFilter === "all" ||
            category === currentFilter;


        const searchMatch =
            !query ||
            searchable.includes(query);


        const show =
            categoryMatch &&
            searchMatch;


        card.style.display =
            show
                ? ""
                : "none";


        if (show) {
            visible++;
        }

    });


    const noResults =
        document.getElementById(
            "noResults"
        );


    if (noResults) {

        noResults.style.display =
            visible === 0
                ? "block"
                : "none";

    }

}


/* =========================================================
   SERVICE MODAL
========================================================= */

let serviceModal = null;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const modalElement =
            document.getElementById(
                "serviceModal"
            );


        if (
            modalElement &&
            typeof bootstrap !== "undefined"
        ) {

            serviceModal =
                new bootstrap.Modal(
                    modalElement
                );

        }

    }
);


function showService(
    title,
    price,
    items
) {

    const titleElement =
        document.getElementById(
            "modalTitle"
        );


    const priceElement =
        document.getElementById(
            "modalPrice"
        );


    const listElement =
        document.getElementById(
            "modalList"
        );


    if (!titleElement ||
        !priceElement ||
        !listElement) {

        return;

    }


    titleElement.textContent =
        title;


    priceElement.textContent =
        price;


    listElement.innerHTML = "";


    items.forEach(item => {

        const li =
            document.createElement(
                "li"
            );


        const icon =
            document.createElement(
                "i"
            );


        icon.className =
            "fa-solid fa-check";


        icon.style.marginRight =
            "8px";


        li.appendChild(icon);


        li.appendChild(
            document.createTextNode(
                item
            )
        );


        listElement.appendChild(
            li
        );

    });


    const orderButton =
        document.getElementById(
            "modalOrder"
        );


    if (orderButton) {

        orderButton.onclick =
            () => {

                openOrder(
                    `${title} — ${price}`
                );

            };

    }


    if (serviceModal) {
        serviceModal.show();
    }

}


/* =========================================================
   ORDER
========================================================= */

function openOrder(service) {

    const url =
        CONFIG.support +
        "?start=" +
        encodeURIComponent(
            service
        );


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );


    showToast(
        "Opening ModdingXZ Support..."
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    const text =
        toast.querySelector(
            "span"
        );


    if (text) {
        text.textContent =
            message;
    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   KEYBOARD SEARCH
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const active =
            document.activeElement;


        const isInput =
            active &&
            (
                active.tagName === "INPUT" ||
                active.tagName === "TEXTAREA"
            );


        if (
            event.key === "/" &&
            !isInput
        ) {

            event.preventDefault();


            if (searchInput) {

                searchInput.focus();

            }

        }


        if (
            event.key === "Escape" &&
            isInput
        ) {

            searchInput.blur();

        }

    }
);


/* =========================================================
   MOBILE NAV AUTO CLOSE
========================================================= */

document.querySelectorAll(
    ".navbar .nav-link"
).forEach(link => {

    link.addEventListener(
        "click",
        () => {

            const navbar =
                document.getElementById(
                    "mainNav"
                );


            if (
                navbar &&
                navbar.classList.contains(
                    "show"
                )
            ) {

                const collapse =
                    bootstrap.Collapse
                        .getInstance(navbar);


                if (collapse) {
                    collapse.hide();
                }

            }

        }
    );

});


/* =========================================================
   SMOOTH ANCHORS
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {

    anchor.addEventListener(
        "click",
        event => {

            const targetID =
                anchor.getAttribute(
                    "href"
                );


            if (
                !targetID ||
                targetID === "#"
            ) {

                return;

            }


            const target =
                document.querySelector(
                    targetID
                );


            if (!target) return;


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});


/* =========================================================
   PARALLAX HERO
========================================================= */

const hero =
    document.querySelector(
        ".hero-card"
    );


if (hero) {

    hero.addEventListener(
        "mousemove",
        event => {

            if (
                window.innerWidth < 900
            ) return;


            const rect =
                hero.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width -
                .5;


            const y =
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height -
                .5;


            const art =
                hero.querySelector(
                    ".hero-decoration"
                );


            if (art) {

                art.style.transform =
                    `
                    translate(
                        ${x * 12}px,
                        ${y * 12}px
                    )
                    `;

            }

        }
    );


    hero.addEventListener(
        "mouseleave",
        () => {

            const art =
                hero.querySelector(
                    ".hero-decoration"
                );


            if (art) {

                art.style.transform =
                    "";

            }

        }
    );

}


/* =========================================================
   SERVICE CARD RANDOM GLOW
========================================================= */

setInterval(
    () => {

        const cards =
            document.querySelectorAll(
                ".service-card"
            );


        if (!cards.length) return;


        const card =
            cards[
                Math.floor(
                    Math.random() *
                    cards.length
                )
            ];


        card.style.boxShadow =
            `
            0 0 40px
            rgba(139,92,246,.12)
            `;


        setTimeout(
            () => {

                card.style.boxShadow =
                    "";

            },
            900
        );

    },
    5000
);


/* =========================================================
   CONSOLE BRANDING
========================================================= */

console.log(
    "%c MODDINGXZ ",
    `
    background:#8b5cf6;
    color:white;
    font-size:20px;
    font-weight:bold;
    padding:8px 15px;
    border-radius:8px;
    `
);


console.log(
    "Gaming • Modding • Tools • Services"
);


/* =========================================================
   FINAL INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateServices();

    }
);