const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerBoard = [];
let computerBoard = [];
let drawnCard = null;
let isFinalTwoCardsPhase = false;
let finalSwitchTurnCompleted = false;

// Initialize the game
function initializeGame() {
  deck = createDeck();
  shuffleDeck(deck);

  // Initialize boards with empty columns (5 columns each)
  playerBoard = Array(5).fill(null).map(() => []);
  computerBoard = Array(5).fill(null).map(() => []);

  // Draw 5 cards for both the player and the computer
  for (let i = 0; i < 5; i++) {
    playerBoard[i].push(deck.pop());
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
  const drawCardButton = document.getElementById('draw-card');

  // Render player board
  playerCards.innerHTML = renderBoard(playerBoard, true);

  // Render computer board
  computerCards.innerHTML = renderBoard(computerBoard, false);

  // Display the drawn card
  drawnCardDiv.innerHTML = drawnCard ? cardToHTML(drawnCard) : '';

  // Update status
  status.textContent = `Deck: ${deck.length} cards remaining`;

  // Update the button text for final two cards
  if (deck.length === 2) {
    isFinalTwoCardsPhase = true;
    drawCardButton.textContent = 'Switch or Discard';
  } else if (deck.length === 0) {
    drawCardButton.textContent = 'Match';
  }
}

// Render a board
function renderBoard(board, isPlayer) {
  return board
    .map(
      (column, columnIndex) =>
        `<div class="column" data-column="${columnIndex}">
          ${column
            .map((card, rowIndex) =>
              isPlayer || rowIndex < column.length - 1 ? cardToHTML(card) : hiddenCardToHTML()
            )
            .join('')}
          ${
            isPlayer && column.length < 5 && canPlaceInColumn(columnIndex)
              ? '<div class="card placeholder">+</div>'
              : ''
          }
        </div>`
    )
    .join('');
}

// Determine if a card can be placed in a column (row completion rule)
function canPlaceInColumn(columnIndex) {
  const currentRow = Math.floor(columnIndex / 5);
  if (currentRow === 0) return true;

  const startOfPreviousRow = (currentRow - 1) * 5;
  const previousRowColumns = playerBoard.slice(startOfPreviousRow, startOfPreviousRow + 5);

  return previousRowColumns.every(column => column.length === 5);
}

// Convert a card to HTML
function cardToHTML(card) {
  if (!card) return '';
  const color = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
  return `<div class="card" style="color: ${color}">${card.value}${card.suit}</div>`;
}

// Render a hidden card (for the computer's last row)
function hiddenCardToHTML() {
  return `<div class="card">/.\\</div>`;
}

// Handle drawing a card or final two card phase
document.getElementById('draw-card').addEventListener('click', () => {
  if (isFinalTwoCardsPhase) {
    handleFinalTwoCards();
    return;
  }

  if (deck.length === 0) {
    matchColumns(); // Match columns when deck is empty
    return;
  }

  drawnCard = deck.pop();
  updateUI();
});

// Handle the "Switch or Discard" phase
function handleFinalTwoCards() {
  if (!drawnCard) return;

  const switchCard = confirm('Do you want to switch this card with one from your board?');
  if (switchCard) {
    const cardPosition = prompt(
      'Enter the position as "row,column" (e.g., 3,2 for row 3 and column 2):'
    );

    if (cardPosition) {
      const [row, column] = cardPosition.split(',').map(Number);
      if (
        row > 0 &&
        row <= playerBoard.length &&
        column > 0 &&
        column <= playerBoard[row - 1].length
      ) {
        const selectedCard = playerBoard[row - 1][column - 1];
        playerBoard[row - 1][column - 1] = drawnCard;
        drawnCard = selectedCard;
      }
    }
  }

  // Proceed with the computer's turn during final two cards phase
  computerFinalTwoCards();

  // If both player and computer have taken their final turns, proceed to match
  if (finalSwitchTurnCompleted) {
    matchColumns();
  } else {
    finalSwitchTurnCompleted = true;
    updateUI();
  }
}

// Computer's final turn during "Switch or Discard"
function computerFinalTwoCards() {
  const lastRow = computerBoard[computerBoard.length - 1];
  const randomIndex = Math.floor(Math.random() * lastRow.length);

  // Randomly decide to switch or discard
  if (Math.random() < 0.5) {
    lastRow[randomIndex] = drawnCard;
  }

  drawnCard = null;
}

// Match columns and determine the winner
function matchColumns() {
  const results = [];
  for (let i = 0; i < 5; i++) {
    const playerCards = playerBoard[i];
    const computerCards = computerBoard[i];
    const result = compareColumns(playerCards, computerCards);
    results.push(result);
  }

  const playerWins = results.filter(result => result === 'Player').length;
  const computerWins = results.filter(result => result === 'Computer').length;

  alert(`Game Over! Player: ${playerWins}, Computer: ${computerWins}`);
}

// Compare two columns (simplified Poker scoring logic)
function compareColumns(playerCards, computerCards) {
  const playerScore = calculateScore(playerCards);
  const computerScore = calculateScore(computerCards);

  if (playerScore > computerScore) return 'Player';
  if (computerScore > playerScore) return 'Computer';
  return 'Tie';
}

// Calculate a column's score (simplified logic)
function calculateScore(cards) {
  const valueMap = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
    '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };
  return cards.reduce((sum, card) => sum + valueMap[card.value], 0);
}

// Start the game
initializeGame();
