export function fetcher_api(priority = "" , assignee = "" , search = "") {

    let parama = new URLSearchParams();
    if (priority !== "") {
        parama.append("priority",priority);
    }
    if (assignee !== "") {
        parama.append("assignee",assignee);
    }
    if (search !== "") {
        parama.append("q",search);
    }

    return fetch("https://flowboard-api-virid.vercel.app/cards?" + parama)
        .then(response => {
            if (!response.ok) {
                throw new Error("Either you got an issue in your code , Or the server is down!");
            }
            return response.json()
        })
}