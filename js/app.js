import { fetcher_api, add_to_card_api, edit_card_api } from "/js/api.js";
import { card_lister, cards_state, validate_form, edit_mode } from "/js/ui.js";

const state_cards = {
    cards: []
}

async function card_page_loader() {
    cards_state("loading");

    let filter_priority_element = document.getElementById('filter-priority').value;
    let filter_assignee = document.getElementById('filter-assignee').value;
    let filter_search = document.getElementById('filter-search').value;

    try {
        let data = await fetcher_api(filter_priority_element, filter_assignee, filter_search)
        state_cards.cards = data;
        card_lister(state_cards.cards);
        cards_state("success");
    } catch (error) {
        console.error(error);
        cards_state("error");
    }
}
card_page_loader();

document.getElementById("btn-retry").addEventListener("click", card_page_loader);

document.getElementById("form-add-card").addEventListener('submit', async function (event) {
    event.preventDefault();
    let new_card = validate_form();
    if (!new_card) {
        return;
    }
    try {
        if (edit_mode.id === null) {
            let saved_cards = await add_to_card_api(new_card);
            state_cards.cards.push(saved_cards);
            card_lister(state_cards.cards);
        } else {
            let edit_button = document.getElementById('btn-edit-submit');
            edit_button.disabled = true;
            edit_button.textContent = "Chargement...";
            await edit_card_api(edit_mode.id , new_card);
            await card_page_loader();
            edit_button.disabled = false;
            edit_button.textContent = "Modifier";
            edit_mode.id = null;
        }
        event.target.reset();
        document.getElementById("modal_add_card").close();
        document.getElementById('btn-edit-submit').classList.add("hidden");
    } catch (error) {
        console.error(error);
    }
})
document.getElementById("btn-reset").addEventListener("click", function () {
    document.getElementById('filter-priority').value = "";
    document.getElementById('filter-assignee').value = "";
    document.getElementById('filter-search').value = "";
    card_page_loader();
});
document.getElementById('filter-priority').addEventListener('input', card_page_loader);
document.getElementById('filter-assignee').addEventListener('input', card_page_loader);
document.getElementById('filter-search').addEventListener('input', card_page_loader);

document.getElementById('btn-open-modal').addEventListener('click', function () {
    document.getElementById("btn-add-submit").classList.remove("hidden");
    document.getElementById("btn-edit-submit").classList.add("hidden");
    document.getElementById("form-add-card").reset();
    edit_mode.id = null;
})