export function saveUserData(item, data) {
    localStorage.setItem(item, JSON.stringify(data));
}

export function getUserData(item) {
    const data = localStorage.getItem(item);

    if (data) return JSON.parse(data);
}
