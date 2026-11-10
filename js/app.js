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