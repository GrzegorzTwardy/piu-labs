import { Ajax } from "./ajax.js";

const api = new Ajax({
    baseUrl: "https://jsonplaceholder.typicode.com/",
    timeout: 5000
});

const getBtn = document.getElementById('getB');
const errBtn = document.getElementById('errB');
const resetBtn = document.getElementById('resetB');
const logger = document.getElementById('logger');
const loader = document.getElementsByClassName('loader')[0];

function resetLogger() {
    logger.innerHTML = "";
    logger.appendChild(loader);
}

function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
}

function setupListeners() {

    getBtn.addEventListener('click', async () => {
        resetLogger();
        showLoader();

        try {
            const res = await api.get("posts/");
            const ul = document.createElement("ul");

            res.forEach(item => {
                const li = document.createElement("li");
                li.textContent = JSON.stringify(item);
                ul.appendChild(li);
            });

            logger.appendChild(ul);

        } catch (err) {
            const p = document.createElement("p");
            p.textContent = "Something went wrong: " + err.message;
            logger.appendChild(p);
        }

        hideLoader();
    });


    errBtn.addEventListener('click', async () => {
        resetLogger();
        showLoader();

        const p = document.createElement("p");

        try {
            const result = await api.get("rjeb432432b b324htfkejbhkjewbter");
            p.textContent = JSON.stringify(result, null, 2);
        } catch (err) {
            p.textContent = err.message;
        }

        logger.appendChild(p);
        hideLoader();
    });


    resetBtn.addEventListener('click', resetLogger);
}

setupListeners();