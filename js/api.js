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
    console.log(response)
    return response.data;
}

export async function add_to_card_api(new_card) {
    let posted_data = await url_holder.post("/cards", new_card);
    return posted_data.data;
}