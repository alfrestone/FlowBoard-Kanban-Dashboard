import { fetcher_api, add_to_card_api, edit_card_api, get_members_api } from "/js/api.js";
import { card_lister, cards_state, validate_form, edit_mode, show_toast } from "/js/ui.js";

const state_cards = {
    cards: []
}

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

    localStorage.setItem("flowboard:filters", JSON.stringify(current_filter));

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

    let saved_filters = localStorage.getItem("flowboard:filters");

    if (saved_filters !== null) {
        let unpacked_values = JSON.parse(saved_filters);
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
            let saved_cards = await add_to_card_api(new_card);
            state_cards.cards.push(saved_cards);
            show_toast("Carte ajoutée !")
            sessionStorage.removeItem("flowboard:draft");
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
    localStorage.removeItem("flowboard:filters");
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

    let saved_draft = sessionStorage.getItem("flowboard:draft");
    if (saved_draft !== null) {
        let unpacked_draft = JSON.parse(saved_draft);
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
        sessionStorage.setItem("flowboard:draft", JSON.stringify(current_add_draft));
    }
})
let saved_theme = localStorage.getItem("flowboard:theme");
if (saved_theme == "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.getElementById("btn-theme").checked = true;
}
let theme_button = document.getElementById("btn-theme")
theme_button.addEventListener('click' , function () {
    if (theme_button.checked == true) {
         document.documentElement.setAttribute("data-theme", "dark");
         localStorage.setItem("flowboard:theme","dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("flowboard:theme","light")
    }
})

let saved_collapsed = localStorage.getItem("flowboard:collapsed");
if (saved_collapsed !== null) {
    let unpacked_collapsed = JSON.parse(saved_collapsed);
    unpacked_collapsed.forEach(col_id => {
        document.getElementById(col_id).classList.add("hidden");
    });
}

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

    localStorage.setItem("flowboard:collapsed", JSON.stringify(collapsed_list));
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