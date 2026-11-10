export function fetcher_api() {
    return fetch("https://flowboard-api-virid.vercel.app/cards")
        .then(response => {
            if (!response.ok) {
                throw new Error("Boss, either you got an issue or the server is down!");
            }
            return response.json()
        })
}