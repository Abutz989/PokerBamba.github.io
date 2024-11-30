const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerBoard = [];
let computerBoard = [];
let drawnCard = null;

// Initialize the game
function initializeGame() {
  deck = createDeck();
  shuffleDeck(deck);

  // Initialize boards with empty columns (5 columns each)
  playerBoard = Array(5).fill(null).map(() => []);
  computerBoard = Array(5).fill(null).map(() => []);

  // Draw 5 cards for the computer
  for (let i = 0; i < 5; i++) {
    computerBoard[i].push(deck.pop());
  }

  updateUI();
}

// Create a deck of 52 cards
function createDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Update the UI
function updateUI() {
  const playerCards = document.getElementById('player-cards');
  const computerCards = document.getElementById('computer-cards');
  const drawnCardDiv = document.getElementById('drawn-card');
  const status = document.getElementById('status');

  // Render player board
  playerCards.innerHTML = renderBoard(playerBoard, true);

  // Render computer board
  computerCards.innerHTML = renderBoard(computerBoard, false);

  // Display the drawn card
  drawnCardDiv.innerHTML = drawnCard ? cardToHTML(drawnCard) : '';

  // Update status
  status.textContent = `Deck: ${deck.length} cards remaining`;
}

// Render a board
function renderBoard(board, isPlayer) {
  return board
    .map(
      (column, columnIndex) =>
        `<div class="column" data-column="${columnIndex}">
          ${column.map(cardToHTML).join('')}
          ${isPlayer && column.length < 5 ? '<div class="card placeholder">+</div>' : ''}
        </div>`
    )
    .join('');
}

// Convert a card to HTML
function cardToHTML(card) {
  if (!card) return '';
  const color = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
  return `<div class="card" style="color: ${color}">${card.value}${card.suit}</div>`;
}

// Handle drawing a card
document.getElementById('draw-card').addEventListener('click', () => {
  if (deck.length === 0) {
    alert('No cards left in the deck!');
    return;
  }

  drawnCard = deck.pop();
  updateUI();
});

// Handle placing a card
document.getElementById('player-cards').addEventListener('click', (event) => {
  if (!drawnCard) return;

  const columnDiv = event.target.closest('.column');
  if (!columnDiv) return;

  const columnIndex = columnDiv.getAttribute('data-column');
  if (playerBoard[columnIndex].length >= 5) {
    alert('This column is full!');
    return;
  }

  // Place the card in the selected column
  playerBoard[columnIndex].push(drawnCard);
  drawnCard = null;

  // After the player places their card, let the computer take its turn
  computerTurn();
  updateUI();
});

// Computer's turn: randomly place a card
function computerTurn() {
  if (deck.length === 0) return;

  const card = deck.pop();
  const availableColumns = computerBoard
    .map((column, index) => (column.length < 5 ? index : null))
    .filter(index => index !== null);

  if (availableColumns.length > 0) {
    const randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];
    computerBoard[randomColumn].push(card);
  }
}

// Start the game
initializeGame();
