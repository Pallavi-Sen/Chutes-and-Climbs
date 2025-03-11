document.addEventListener("DOMContentLoaded", () => {
    const welcomeModal = document.getElementById("welcome-modal");
    const themeSelectionModal = document.getElementById("theme-selection-modal"); // New modal for theme selection
    const gameContainer = document.getElementById("game-container");
    const gameBoard = document.getElementById("game-board");
    const rollDiceButton = document.getElementById("roll-dice");
    const diceResult = document.getElementById("dice-result");
    const currentPlayerDisplay = document.getElementById("current-player");
    const victoryModal = document.getElementById("victory-modal");
    const winnerMessage = document.getElementById("winner-message");
    const restartGameButton = document.getElementById("restart-game");
    const goToFirstPageButton = document.getElementById("go-to-first-page");

    let currentPlayer = 1;
    let playerPositions = { 1: 1, 2: 1 }; // Player positions on the board
    let playerTokens = { 1: null, 2: null }; // Player tokens

    // Define positions for ropes (climbs) and slides (chutes)
    const slides = {
        16: 6,  // Slide from 16 to 6
        47: 26, // Slide from 47 to 26
        49: 11, // Slide from 49 to 11
        64: 60, // Slide from 56 to 53
        62: 19, // Slide from 62 to 19
        98: 78, // Slide from 64 to 60
        96: 75, // Slide from 87 to 24
        93: 73, // Slide from 93 to 73
        87: 24, // Slide from 95 to 75
        56: 53  // Slide from 98 to 78
    };

    const ropes = {
        4: 14,   // Rope from 1 to 38
        9: 31,   // Rope from 4 to 14
        1: 38,   // Rope from 9 to 31
        40: 42,  // Rope from 21 to 42
        36: 44,  // Rope from 28 to 84
        51: 67,  // Rope from 36 to 44
        28: 84,  // Rope from 51 to 67
        71: 91,  // Rope from 71 to 91
        80: 100  // Rope from 80 to 100
    };

    // Manually define a 10x10 board layout (cells 1 to 100)
    const board = [
        [100,81,80,61,60,41,40,21,20,1],
        [99,82,79,62,59,42,39,22,19,2],
        [98,83,78,63,58,43,38,23,18,3],
        [97,84,77,64,57,44,37,24,17,4],
        [96,85,76,65,56,45,36,25,16,5],
        [95,86,75,66,55,46,35,26,15,6],
        [94,87,74,67,54,47,34,27,14,7],
        [93,88,73,68,53,48,33,28,13,8],
        [92,89,72,69,52,49,32,29,12,9],
        [91,90,71,70,51,50,31,30,11,10]
    ];

    // Function to create the game board using the manually defined layout
    function createGameBoard() {
        gameBoard.innerHTML = ""; // Clear the board

        // Iterate over the board layout and create cells
        board.forEach((row, rowIndex) => {
            const rowDiv = document.createElement("div");
            rowDiv.className = "row";

            row.forEach((cell, cellIndex) => {
                const cellDiv = document.createElement("div");
                cellDiv.className = "cell";
                cellDiv.dataset.position = cell;
                cellDiv.innerText = cell;

                rowDiv.appendChild(cellDiv);
            });

            gameBoard.appendChild(rowDiv);
        });

        // Draw slides and ropes on the board
        Object.keys(slides).forEach((startPos) => {
            const startCell = document.querySelector(`.cell[data-position="${startPos}"]`);
            startCell.classList.add('slide');
            startCell.innerHTML += "<span>↓</span>";  // Slide symbol
        });

        Object.keys(ropes).forEach((startPos) => {
            const startCell = document.querySelector(`.cell[data-position="${startPos}"]`);
            startCell.classList.add('rope');
            startCell.innerHTML += "<span>↑</span>";  // Rope symbol
        });
    }

    // Function to move a player token
    function movePlayer(player, steps) {
        let newPosition = playerPositions[player] + steps;
        if (newPosition > 100) newPosition = 100; // Limit to the last cell

        // Check for ropes (climbs)
        if (ropes[newPosition]) {
            newPosition = ropes[newPosition];
        }

        // Check for slides (chutes)
        if (slides[newPosition]) {
            newPosition = slides[newPosition];
        }

        // Remove token from the previous position
        const oldCell = document.querySelector(`.cell[data-position="${playerPositions[player]}"]`);
        if (oldCell) {
            const token = oldCell.querySelector(`.token${player}`);
            if (token) oldCell.removeChild(token);
        }

        // Add token to the new position
        const newCell = document.querySelector(`.cell[data-position="${newPosition}"]`);
        const token = document.createElement("div");
        token.className = `token token${player}`;
        newCell.appendChild(token);

        playerPositions[player] = newPosition;

        // Check for victory
        if (newPosition === 100) {
            winnerMessage.innerText = `Congratulations Player ${player}, you Won!🎉`;
            victoryModal.classList.remove("hidden");
        }
    }

    // Function to update UI
    function updateUI() {
        currentPlayerDisplay.innerText = `Current Player: Player ${currentPlayer}`;
    }

    // Start Game - Trigger the theme selection
    document.getElementById("start-game").addEventListener("click", () => {
        welcomeModal.style.display = "none";
        themeSelectionModal.classList.remove("hidden"); // Show the theme selection modal
    });

    // Theme selection
    document.querySelectorAll(".theme-options button").forEach((button) => {
        button.addEventListener("click", () => {
            const theme = button.dataset.theme;
            document.body.className = `theme-${theme}`;  // Apply the selected theme
            themeSelectionModal.classList.add("hidden"); // Hide the theme selection modal
            gameContainer.classList.remove("hidden"); // Show the game container
            createGameBoard(); // Create the game board
            updateUI(); // Update UI with the first player
        });
    });

    // Roll Dice
    rollDiceButton.addEventListener("click", () => {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        diceResult.innerText = `Dice Result: ${diceRoll}`;
        movePlayer(currentPlayer, diceRoll);

        // Switch to the next player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateUI();
    });

    // Restart Game
    restartGameButton.addEventListener("click", () => {
        // Hide the victory modal
        victoryModal.classList.add("hidden");

        // Reset game state (player positions, token, etc.)
        currentPlayer = 1;  // Reset to Player 1
        playerPositions = { 1: 1, 2: 1 }; // Player positions reset to start
        playerTokens = { 1: null, 2: null }; // Reset token data

        // Clear game board and recreate it
        gameBoard.innerHTML = ''; // Clear the current game board
        createGameBoard(); // Recreate the board layout

        // Ensure all tokens are placed back on their starting positions (cell 1)
        const allCells = document.querySelectorAll('.cell');
        allCells.forEach(cell => {
            const token1 = cell.querySelector('.token1');
            const token2 = cell.querySelector('.token2');
            if (token1) cell.removeChild(token1); // Remove Player 1 token
            if (token2) cell.removeChild(token2); // Remove Player 2 token
        });

        // Add tokens back to their starting positions (cell 1)
        const startCell1 = document.querySelector(`.cell[data-position="1"]`);
        const startCell2 = document.querySelector(`.cell[data-position="1"]`);
        const token1 = document.createElement("div");
        token1.className = 'token token1';
        startCell1.appendChild(token1);

        const token2 = document.createElement("div");
        token2.className = 'token token2';
        startCell2.appendChild(token2);

        // Reset the dice result
        diceResult.innerText = "Dice Result: -";

        alert("Game Restarted!");
        // Update UI for the new game state
        updateUI();
    });

    // Go to First Page (Welcome)
    goToFirstPageButton.addEventListener("click", () => {
        // Hide the game container and show the welcome modal again
        gameContainer.classList.add("hidden");
        welcomeModal.style.display = "block";

        // Reset the game state as needed
        victoryModal.classList.add("hidden");
        diceResult.innerText = "Dice Result: -";
        currentPlayer = 1;
        playerPositions = { 1: 1, 2: 1 }; // Reset player positions
        playerTokens = { 1: null, 2: null }; // Reset token data
    });
});
