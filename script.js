function startGame() {
    const usernameInput = document.querySelector('.name-submission input[type="text"]');
    const username = usernameInput.value.trim(); 

    if (username) {
        localStorage.setItem('username', username); 
        window.location.href = './game/game.html'; 
    } else {
        alert('Please enter a username.'); 
    }
}
