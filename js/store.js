export const state_cards = {
    cards: []
};

export function save_filters(filters) {
    localStorage.setItem("flowboard:filters", JSON.stringify(filters));
}

export function get_filters() {
    let data = localStorage.getItem("flowboard:filters");
    if (data !== null) {
        return JSON.parse(data);
    }
    return null;
}

export function clear_filters() {
    localStorage.removeItem("flowboard:filters");
}

export function save_draft(draft) {
    sessionStorage.setItem("flowboard:draft", JSON.stringify(draft));
}

export function get_draft() {
    let data = sessionStorage.getItem("flowboard:draft");
    if (data !== null) {
        return JSON.parse(data);
    }
    return null;
}

export function clear_draft() {
    sessionStorage.removeItem("flowboard:draft");
}

export function save_theme(theme) {
    localStorage.setItem("flowboard:theme", theme);
}

export function get_theme() {
    return localStorage.getItem("flowboard:theme");
}

export function save_collapsed(collapsed_list) {
    localStorage.setItem("flowboard:collapsed", JSON.stringify(collapsed_list));
}

export function get_collapsed() {
    let data = localStorage.getItem("flowboard:collapsed");
    if (data !== null) {
        return JSON.parse(data);
    }
    return [];
}