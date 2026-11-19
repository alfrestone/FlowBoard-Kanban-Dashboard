import { fetcher_api, add_to_card_api, edit_card_api, get_members_api, ai_card_generator } from "./api.js";
import { card_lister, cards_state, validate_form, edit_mode, show_toast } from "./ui.js";
import {
    state_cards,
    save_filters, get_filters, clear_filters,
    save_draft, get_draft, clear_draft,
    save_theme, get_theme,
    save_collapsed, get_collapsed
} from "./store.js";

async function card_page_loader() {

    cards_state("loading");

    let filter_priority_element = document.getElementById('filter-priority').value;
    let filter_assignee = document.getElementById('filter-assignee').value;
    let filter_search = document.getElementById('filter-search').value;

    let current_filter = {
        priority: filter_priority_element,
        assignee: filter_assignee,
        q: filter_search
    }

    save_filters(current_filter);

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
async function start_app() {
    let members = await get_members_api();
    let select_assignee = document.getElementById('filter-assignee');

    members.forEach(member => {
        let the_option = document.createElement('option');
        the_option.textContent = member.name;
        select_assignee.appendChild(the_option);
    });

    let unpacked_values = get_filters();

    if (unpacked_values !== null) {
        let { priority, assignee, q } = unpacked_values;
        document.getElementById('filter-priority').value = priority;
        document.getElementById('filter-assignee').value = assignee;
        document.getElementById('filter-search').value = q;
    }

    card_page_loader();
}
start_app();

document.getElementById("btn-retry").addEventListener("click", card_page_loader);

document.getElementById("form-add-card").addEventListener('submit', async function (event) {
    event.preventDefault();
    let new_card = validate_form();
    if (!new_card) {
        return;
    }
    try {
        if (edit_mode.id === null) {
            let add_button = document.getElementById('btn-add-submit')
            add_button.disabled = true;
            add_button.textContent = "Ajout en cours..."
            let saved_cards = await add_to_card_api(new_card);
            state_cards.cards.push(saved_cards);
            add_button.disabled = false;
            add_button.textContent = "Ajouter";
            show_toast("Carte ajoutée !")
            clear_draft();
            card_lister(state_cards.cards);
        } else {
            let edit_button = document.getElementById('btn-edit-submit');
            edit_button.disabled = true;
            edit_button.textContent = "Chargement...";
            await edit_card_api(edit_mode.id, new_card);
            await card_page_loader();
            edit_button.disabled = false;
            edit_button.textContent = "Modifier";
            edit_mode.id = null;
            show_toast("Carte ajoutée !")
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
    clear_filters();
    card_page_loader();
});
document.getElementById('filter-priority').addEventListener('input', card_page_loader);
document.getElementById('filter-assignee').addEventListener('input', card_page_loader);

let timer_holder = null;
document.getElementById('filter-search').addEventListener('input', function () {
    clearTimeout(timer_holder);
    cards_state("loading");
    timer_holder = setTimeout(function () {
        card_page_loader();
    }, 500)
});

document.getElementById('btn-open-modal').addEventListener('click', function () {
    document.getElementById("btn-add-submit").classList.remove("hidden");
    document.getElementById("btn-edit-submit").classList.add("hidden");
    document.getElementById("form-add-card").reset();
    edit_mode.id = null;

    let unpacked_draft = get_draft();
    if ((unpacked_draft !== null)) {
        document.getElementById("input-title").value = unpacked_draft.title;
        document.getElementById("input-description").value = unpacked_draft.description;
        document.getElementById("input-status").value = unpacked_draft.status;
        document.getElementById("input-priority").value = unpacked_draft.priority;
        document.getElementById("input-assignee").value = unpacked_draft.assignee;
        document.getElementById("input-duedate").value = unpacked_draft.dueDate;
        document.getElementById("input-tags").value = unpacked_draft.tags;
    }
})

document.getElementById("form-add-card").addEventListener('input', function () {
    if (edit_mode.id == null) {
        let current_add_draft = {
            title: document.getElementById("input-title").value,
            description: document.getElementById("input-description").value,
            status: document.getElementById("input-status").value,
            priority: document.getElementById("input-priority").value,
            assignee: document.getElementById("input-assignee").value,
            dueDate: document.getElementById("input-duedate").value,
            tags: document.getElementById("input-tags").value
        }
        save_draft(current_add_draft);
    }
})
let saved_theme = get_theme();
if (saved_theme == "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.getElementById("btn-theme").checked = true;
}
let theme_button = document.getElementById("btn-theme")
theme_button.addEventListener('click', function () {
    if (theme_button.checked == true) {
        document.documentElement.setAttribute("data-theme", "dark");
        save_theme("dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        save_theme("light");
    }
})

let unpacked_collapsed = get_collapsed();
unpacked_collapsed.forEach(col_id => {
    document.getElementById(col_id).classList.add("hidden");
});

function save_collapsed_columns() {
    let collapsed_list = [];

    if (document.getElementById("col-todo").classList.contains("hidden")) {
        collapsed_list.push("col-todo");
    }
    if (document.getElementById("col-in-progress").classList.contains("hidden")) {
        collapsed_list.push("col-in-progress");
    }
    if (document.getElementById("col-done").classList.contains("hidden")) {
        collapsed_list.push("col-done");
    }

    save_collapsed(collapsed_list);
}

document.getElementById("btn-collapse-todo").addEventListener("click", function () {
    document.getElementById("col-todo").classList.toggle("hidden");
    save_collapsed_columns();
});

document.getElementById("btn-collapse-progress").addEventListener("click", function () {
    document.getElementById("col-in-progress").classList.toggle("hidden");
    save_collapsed_columns();
});

document.getElementById("btn-collapse-done").addEventListener("click", function () {
    document.getElementById("col-done").classList.toggle("hidden");
    save_collapsed_columns();
});

document.getElementById("form-ai").addEventListener("submit", async function (event) {
    event.preventDefault();

    let desc_input = document.getElementById("input-ai-description");
    let key_input = document.getElementById("input-ai-key");
    let error_msg = document.getElementById("ai-form-error");
    let submit_btn = document.getElementById("btn-ai-submit");

    let description = desc_input.value.trim();
    let api_key = key_input.value.trim();

    if (description.length < 20 || description.length > 1000) {
        error_msg.textContent = "La description doit contenir entre 20 et 1000 caractères.";
        error_msg.classList.remove("hidden");
        return;
    }
    if (api_key === "") {
        error_msg.textContent = "La clé API Gemini est obligatoire.";
        error_msg.classList.remove("hidden");
        return;
    }
    error_msg.classList.add("hidden");

    desc_input.disabled = true;
    key_input.disabled = true;
    submit_btn.disabled = true;
    submit_btn.textContent = "Génération en cours…";

    try {
        let ai_cards = await ai_card_generator(description, api_key);

        ai_cards.forEach(card => {
            state_cards.cards.push(card);
        });

        card_lister(state_cards.cards);
        show_toast(ai_cards.length + " cartes créées !");
        event.target.reset();
        document.getElementById("modal_ai").close();
    }
    catch (error) {
        console.error(error);
        show_toast("Erreur lors de la génération IA", "error");
    }

    key_input.value = "";
    desc_input.disabled = false;
    key_input.disabled = false;
    submit_btn.disabled = false;
    submit_btn.textContent = "Générer";
})