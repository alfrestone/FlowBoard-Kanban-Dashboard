let already_seen_names = [];

export const edit_mode = { id: null };

export function card_lister(cards) {
    let count_todo = 0;
    let count_progress = 0;
    let count_done = 0;

    let col_todo_element = document.getElementById('col-todo');
    let col_in_progress = document.getElementById('col-in-progress');
    let col_done_element = document.getElementById('col-done');
    let select_assignee = document.getElementById('filter-assignee');


    col_todo_element.textContent = "";
    col_in_progress.textContent = "";
    col_done_element.textContent = "";

    let empty_msg = document.getElementById("state-empty");

    if (cards.length === 0) {
        empty_msg.classList.remove("hidden");
    } else {
        empty_msg.classList.add("hidden");
    }


    cards.forEach(card => {
        console.log(card.status);
        let card_holder = document.createElement('div');
        card_holder.className = "card bg-base-100 p-4 shadow gap-2";

        let title = document.createElement('h3');
        title.className = "font-bold";
        title.textContent = card.title;

        let description = document.createElement('p');
        description.className = "text-sm opacity-70";
        description.textContent = card.description;

        let priority = document.createElement('span');
        priority.className = "badge badge-outline";
        priority.textContent = card.priority;

        let assignee = document.createElement('span');
        assignee.className = "text-xs font-semibold";
        assignee.textContent = card.assignee;

        let edit_button = document.createElement('button');
        edit_button.textContent = "Modifier";
        edit_button.dataset.id = card.id;
        edit_button.className = "btn btn-xs btn-outline"
        edit_button.addEventListener('click', function () {
            edit_mode.id = card.id;
            document.getElementById("btn-add-submit").classList.add("hidden");
            document.getElementById("btn-edit-submit").classList.remove("hidden");
            document.getElementById('input-title').value = card.title
            document.getElementById('input-description').value = card.description
            document.getElementById('input-status').value = card.status
            document.getElementById('input-priority').value = card.priority
            document.getElementById('input-assignee').value = card.assignee
            document.getElementById('input-duedate').value = card.dueDate
            document.getElementById('input-tags').value = card.tags.join(",");
            document.getElementById("modal_add_card").showModal();
            console.log(edit_mode);

        })
        card_holder.append(title, description, priority, assignee, edit_button);
        if (card.status === "todo") {
            col_todo_element.appendChild(card_holder);
            count_todo++;
        }
        else if (card.status === "in-progress") {
            col_in_progress.appendChild(card_holder);
            count_progress++;
        }
        else if (card.status === "done") {
            col_done_element.appendChild(card_holder);
            count_done++;
        }

        if (already_seen_names.includes(card.assignee) === false) {
            already_seen_names.push(card.assignee);

            let options_element = document.createElement("option");
            options_element.textContent = card.assignee;
            select_assignee.appendChild(options_element);
        }
    });

    document.getElementById('count-todo').textContent = count_todo;
    document.getElementById('count-in-progress').textContent = count_progress;
    document.getElementById('count-done').textContent = count_done;
}

export function cards_state(status) {
    let loading = document.getElementById('state-loading');
    let error = document.getElementById('state-error');
    let board = document.getElementById('board');

    loading.classList.add('hidden');
    error.classList.add('hidden');
    board.classList.add('hidden');

    if (status === "loading") {
        loading.classList.remove('hidden');
    }
    if (status === "error") {
        error.classList.remove('hidden');
    }
    if (status === "success") {
        board.classList.remove('hidden');
    }
}

export function validate_form() {
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

    let today_date = new Date();
    today_date.setHours(0, 0, 0, 0);

    let actual_duedate = new Date(duedate.value);

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

    if (!regex_duedate.test(duedate.value) || today_date > actual_duedate) {
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
    return new_card;
}