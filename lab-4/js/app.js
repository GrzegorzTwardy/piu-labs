let id_assigner = 0;

function setId() {
    return id_assigner++;
}

function setupColumnClick(column) {
    column.addEventListener('click', (e) => {
        if (e.target.tagName === "INPUT") {
            const newCard = document.createElement("div");
            newCard.classList.add("card");
            newCard.id = setId();
            column.appendChild(newCard);
        }
        else 
    });
}

const columns = document.getElementsByClassName("column");
Array.from(columns).forEach(setupColumnClick);
