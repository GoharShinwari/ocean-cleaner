import { loadData } from './index.js'; 

function startGame() {
    const usernameInput = document.querySelector('.name-submission input[type="text"]');
    const username = usernameInput.value.trim();

    if (username) {
        let userId = localStorage.getItem(username);
        if (!userId) {
            userId = generateUUID();
            localStorage.setItem(username, userId);
            initializeUserData(username);
        }

        loadData(username);
        window.location.href = 'game.html';
    } else {
        alert('Please enter a username.');
    }
}


function initializeUserData(username) {
    localStorage.setItem(`${username}-cleanPoints`, '0');
    localStorage.setItem(`${username}-perSecond`, '0');
    localStorage.setItem(`${username}-cleanPointsPerClick`, '1');
}


function generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
