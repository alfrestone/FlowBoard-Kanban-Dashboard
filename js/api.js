let url_holder = axios.create(
    {
        baseURL: "https://flowboard-api-virid.vercel.app",
        timeout: 5000,
        headers: {
            "X-Workspace": "flowboard-alfred-stone"
        },
        params: {
            password: "1234"
        }
    }
)

export async function fetcher_api(priority = "", assignee = "", search = "") {

    let parama = new URLSearchParams();
    if (priority !== "") {
        parama.append("priority", priority);
    }
    if (assignee !== "") {
        parama.append("assignee", assignee);
    }
    if (search !== "") {
        parama.append("q", search);
    }

    let response = await url_holder.get("/cards?" + parama)
    return response.data;
}

export async function add_to_card_api(new_card) {
    let posted_data = await url_holder.post("/cards", new_card);
    return posted_data.data;
}

export async function edit_card_api(id, updated_card) {
    let updated_data = await url_holder.put("cards/" + id, updated_card);
    return updated_data;
}

export async function move_card_api(id, new_position) {
    let new_status = await url_holder.patch('/cards/' + id , {status: new_position});
    return new_status.data;
}

export async function delete_card_api(id) {
    let delete_card = await url_holder.delete("/cards/" + id)
    return delete_card;
}

export async function get_members_api() {
    let response = await url_holder.get("/members");
    return response.data;
}

export async function ai_card_generator(description, apiKey) {
    let response = await url_holder.post(
        "/ai/cards",
        { description: description, apiKey: apiKey },
        { timeout: 30000 }
    );
    return response.data;
}