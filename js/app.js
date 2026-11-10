import { fetcher_api } from "/js/api.js";
import { card_lister, cards_state } from "/js/ui.js";

const state_cards = {
    cards: []
}

function card_page_loader() {
    cards_state("loading");

    fetcher_api()
        .then(data => {
            console.log("The cards are loaded, boss.", state_cards);
            state_cards.cards = data;
            card_lister(state_cards.cards);
            cards_state("success");
        })
        .catch(error => {
            console.error(error);
            cards_state("error");
        });
}
card_page_loader();

document.getElementById("btn-retry").addEventListener("click", card_page_loader);

document.getElementById('form-add-card').addEventListener('submit', function (event) {
    event.preventDefault();

    const regex_title = /^.{3,100}$/;
    const regex_description = /^[\s\S]{5,300}$/;
    const regex_status = /^(todo|in-progress|done)$/;
    const regex_priority = /^(low|medium|high)$/;
    const regex_assignee = /^[a-zA-ZÀ-ÿ\s]{2,40}$/;
    const regex_duedate = /^\d{4}-\d{2}-\d{2}$/;
    const regex_tags = /^[a-zA-Z0-9\s]+(,[a-zA-Z0-9\s]+)*$/;

    let title = document.getElementById("input-title");
    let description = document.getElementById("input-description");
    let status = document.getElementById("input-status");
    let priority = document.getElementById("input-priority");
    let assignee = document.getElementById("input-assignee");
    let duedate = document.getElementById("input-duedate");
    let tags = document.getElementById("input-tags");
    let error_msg = document.getElementById("form-error");

    if (!regex_title.test(title.value.trim())) {
        title.classList.add("outline", "outline-2", "outline-red-500");
        error_msg.textContent = "Titre invalide (3 à 100 caractères).";
        error_msg.classList.remove("hidden");
        return;
    }
    title.classList.remove("outline", "outline-2", "outline-red-500");

    if (!regex_description.test(description.value.trim())) {
        description.classList.add("outline", "outline-2", "outline-red-500");
        error_msg.textContent = "Description invalide (5 à 300 caractères).";
        error_msg.classList.remove("hidden");
        return;
    }
    description.classList.remove("outline", "outline-2", "outline-red-500");

    if (!regex_status.test(status.value)) {
        status.classList.add("outline", "outline-2", "outline-red-500");
        error_msg.textContent = "Statut invalide.";
        error_msg.classList.remove("hidden");
        return;
    }
    status.classList.remove("outline", "outline-2", "outline-red-500");

    if (!regex_priority.test(priority.value)) {
        priority.classList.add("outline", "outline-2", "outline-red-500");
        error_msg.textContent = "Priorité invalide.";
        error_msg.classList.remove("hidden");
        return;
    }
    priority.classList.remove("outline", "outline-2", "outline-red-500");

    if (!regex_assignee.test(assignee.value.trim())) {
        assignee.classList.add("outline", "outline-2", "outline-red-500");
        error_msg.textContent = "Assigné invalide (lettres uniquement, 2 à 40 caractères).";
        error_msg.classList.remove("hidden");
        return;
    }
    assignee.classList.remove("outline", "outline-2", "outline-red-500");

    if (!regex_duedate.test(duedate.value)) {
        duedate.classList.add("outline", "outline-2", "outline-red-500");
        error_msg.textContent = "Date invalide (choisissez une date).";
        error_msg.classList.remove("hidden");
        return;
    }
    duedate.classList.remove("outline", "outline-2", "outline-red-500");

    if (!regex_tags.test(tags.value.trim())) {
        tags.classList.add("outline", "outline-2", "outline-red-500");
        error_msg.textContent = "Tags invalides (ex: front, api).";
        error_msg.classList.remove("hidden");
        return;
    }
    tags.classList.remove("outline", "outline-2", "outline-red-500");

    error_msg.classList.add("hidden");

    let new_card = {
        title: title.value.trim(),
        description: description.value.trim(),
        status: status.value,
        priority: priority.value,
        assignee: assignee.value.trim(),
        dueDate: duedate.value,
        tags: tags.value.split(",")
    };

    state_cards.cards.push(new_card);
    card_lister(state_cards.cards);
    event.target.reset();
    document.getElementById("modal_add_card").close();
})