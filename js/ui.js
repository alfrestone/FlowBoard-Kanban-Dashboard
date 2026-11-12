let already_seen_names = [];
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

		card_holder.append(title, description, priority, assignee);
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