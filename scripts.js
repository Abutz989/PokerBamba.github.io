const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let computerHand = [];
let playerBoard = [];
let computerBoard = [];

// Initialize the game
function initializeGame() {
  deck = createDeck();
  shuffleDeck(deck);

  // Draw 5 cards for each player
  playerHand = drawCards(5);
  computerHand = drawCards(5);

  // Set up the board
  playerBoard = Array(5).fill(null).map(() => []);
  computerBoard = Array(5).fill(null).map(() => []);
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

// Draw cards from the deck
function drawCards(count) {
  return deck.splice(0, count);
}

// Update the UI
function updateUI() {
  const playerCards = document.getElementById('player-cards');
  const computerCards = document.getElementById('computer-cards');
  const status = document.getElementById('status');

  playerCards.innerHTML = playerHand.map(cardToHTML).join('');
  computerCards.innerHTML = computerHand.map(() => '<div class="card">?</div>').join('');
  status.textContent = `Deck: ${deck.length} cards remaining`;
}

// Convert a card to HTML
function cardToHTML(card) {
  return `<div class="card">${card.value}${card.suit}</div>`;
}

// Handle drawing a card
document.getElementById('draw-card').addEventListener('click', () => {
  if (deck.length === 0) {
    alert('No cards left in the deck!');
    return;
  }

  const drawnCard = drawCards(1)[0];
  playerHand.push(drawnCard);
  updateUI();
});

// Start the game
initializeGame();
