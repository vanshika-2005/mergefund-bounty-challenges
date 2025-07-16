class MergeFundMemoryGame {
  constructor() {
    this.cards = []
    this.flippedCards = []
    this.matchedPairs = 0
    this.moves = 0
    this.startTime = null
    this.gameTimer = null
    this.isGameActive = false

    this.targetMessage = "Hello MergeFund"
    this.targetLetters = this.targetMessage.split("") 
    this.revealedLetters = 0

    
    this.symbols = ["🚀", "💎", "🎯", "⭐", "🔥", "💡", "🎨", "🎪"]

    
    this.gameBoard = document.getElementById("gameBoard")
    this.revealedMessageEl = document.getElementById("revealed-message")
    this.progressEl = document.getElementById("progress")
    this.matchesEl = document.getElementById("matches")
    this.movesEl = document.getElementById("moves")
    this.timeEl = document.getElementById("time")
    this.resetBtn = document.getElementById("resetBtn")
    this.victoryModal = document.getElementById("victoryModal")
    this.finalMessageEl = document.getElementById("finalMessage")
    this.victoryStatsEl = document.getElementById("victoryStats")
    this.playAgainBtn = document.getElementById("playAgainBtn")
    this.confettiContainer = document.getElementById("confetti")
    this.initializeGame()
    this.bindEvents()
  }

 
  initializeGame() {
    this.createCards()
    this.renderCards()
    this.updateDisplay()
    this.isGameActive = true
  }

 
  createCards() {
    this.cards = [] 
    for (let i = 0; i < 8; i++) {
      const symbol = this.symbols[i]
      this.cards.push(
        { id: i * 2, symbol, isFlipped: false, isMatched: false },
        { id: i * 2 + 1, symbol, isFlipped: false, isMatched: false },
      )
    }
    this.shuffleArray(this.cards)
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }


  renderCards() {
    this.gameBoard.innerHTML = ""

    this.cards.forEach((card) => {
      const cardElement = this.createCardElement(card)
      this.gameBoard.appendChild(cardElement)
    })
  }

  createCardElement(card) {
    const cardDiv = document.createElement("div")
    cardDiv.className = "card"
    cardDiv.dataset.cardId = card.id

    cardDiv.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${card.symbol}</div>
                <div class="card-back">?</div>
            </div>
        `

    cardDiv.addEventListener("click", () => this.handleCardClick(card.id))

    return cardDiv
  }

  
  handleCardClick(cardId) {
    if (!this.isGameActive) return

    const card = this.cards.find((c) => c.id === cardId)
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)


    if (card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
      return
    }

    if (!this.startTime) {
      this.startTimer()
    }


    this.flipCard(card, cardElement)

    if (this.flippedCards.length === 2) {
      this.moves++
      this.updateDisplay()
      setTimeout(() => this.checkForMatch(), 1000)
    }
  }

 
  flipCard(card, cardElement) {
    card.isFlipped = true
    cardElement.classList.add("flipped")
    this.flippedCards.push({ card, element: cardElement })
  }

  checkForMatch() {
    const [first, second] = this.flippedCards

    if (first.card.symbol === second.card.symbol) {
      this.handleMatch(first, second)
    } else {
      this.flipCardsBack(first, second)
    }

    this.flippedCards = []
  }


  handleMatch(first, second) {
    first.card.isMatched = true
    second.card.isMatched = true

    first.element.classList.add("matched")
    second.element.classList.add("matched")

    this.matchedPairs++
    this.revealNextLetter()
    this.updateDisplay()

    if (this.matchedPairs === 8) {
      setTimeout(() => this.handleGameComplete(), 500)
    }
  }


  flipCardsBack(first, second) {
    first.card.isFlipped = false
    second.card.isFlipped = false
    first.element.classList.remove("flipped")
    second.element.classList.remove("flipped")
  }


  revealNextLetter() {
    const lettersToReveal = Math.min(2, this.targetLetters.length - this.revealedLetters)

    for (let i = 0; i < lettersToReveal; i++) {
      if (this.revealedLetters < this.targetLetters.length) {
        this.revealedLetters++
      }
    }

    let revealedText = ""
    for (let i = 0; i < this.targetLetters.length; i++) {
      if (i < this.revealedLetters) {
        revealedText += this.targetLetters[i]
      } else {
        revealedText += "_"
      }
    }

    this.revealedMessageEl.textContent = revealedText
    this.revealedMessageEl.classList.add("letter-reveal")

    setTimeout(() => {
      this.revealedMessageEl.classList.remove("letter-reveal")
    }, 800)

    const progress = (this.revealedLetters / this.targetLetters.length) * 100
    this.progressEl.style.width = `${progress}%`
  }

  handleGameComplete() {
    this.isGameActive = false
    this.stopTimer()
    this.revealedMessageEl.textContent = this.targetMessage
    this.revealedMessageEl.classList.add("final-message-animation")
    this.progressEl.style.width = "100%"
    this.createConfetti()

    setTimeout(() => {
      this.showVictoryModal()
    }, 1500)
  }

  createConfetti() {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#a55eea", "#26de81"]

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti-piece"
      confetti.style.left = Math.random() * 30 + "%"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 2 + "s"
      confetti.style.animationDuration = Math.random() * 3 + 2 + "s"
      confetti.style.width = Math.random() * 8 + 6 + "px"
      confetti.style.height = confetti.style.width

      this.confettiContainer.appendChild(confetti)
    }

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti-piece confetti-right"
      confetti.style.left = Math.random() * 30 + 70 + "%"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 2 + "s"
      confetti.style.animationDuration = Math.random() * 3 + 2 + "s"
      confetti.style.width = Math.random() * 8 + 6 + "px"
      confetti.style.height = confetti.style.width

      this.confettiContainer.appendChild(confetti)
    }

    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti-piece confetti-burst"
      confetti.style.left = Math.random() * 40 + 30 + "%"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 1 + "s"
      confetti.style.animationDuration = Math.random() * 2 + 3 + "s"
      confetti.style.width = Math.random() * 12 + 8 + "px"
      confetti.style.height = confetti.style.width

      this.confettiContainer.appendChild(confetti)
    }


    setTimeout(() => {
      this.confettiContainer.innerHTML = ""
    }, 6000)
  }


  showVictoryModal() {
    const finalTime = this.formatTime(this.getElapsedTime())

    this.finalMessageEl.textContent = this.targetMessage
    this.victoryStatsEl.innerHTML = `
            <div><strong>Time:</strong> ${finalTime}</div>
            <div><strong>Moves:</strong> ${this.moves}</div>
        `

    this.victoryModal.classList.remove("hidden")
  }

  startTimer() {
    this.startTime = Date.now()
    this.gameTimer = setInterval(() => {
      this.updateTimer()
    }, 1000)
  }


  stopTimer() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer)
      this.gameTimer = null
    }
  }


  updateTimer() {
    const elapsed = this.getElapsedTime()
    this.timeEl.textContent = this.formatTime(elapsed)
  }


  getElapsedTime() {
    return this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0
  }


  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }


  updateDisplay() {
    this.movesEl.textContent = this.moves
  }


  resetGame() {
    this.flippedCards = []
    this.matchedPairs = 0
    this.moves = 0
    this.revealedLetters = 0
    this.startTime = null
    this.isGameActive = true
    this.stopTimer()
    this.revealedMessageEl.textContent = "_".repeat(this.targetLetters.length)
    this.revealedMessageEl.classList.remove("final-message-animation")
    this.progressEl.style.width = "0%"
    this.timeEl.textContent = "00:00"
    this.victoryModal.classList.add("hidden")
    this.confettiContainer.innerHTML = ""
    this.createCards()
    this.renderCards()
    this.updateDisplay()
  }

  bindEvents() {
    this.resetBtn.addEventListener("click", () => this.resetGame())
    this.playAgainBtn.addEventListener("click", () => this.resetGame())


    this.victoryModal.addEventListener("click", (e) => {
      if (e.target === this.victoryModal) {
        this.resetGame()
      }
    })
  }
}


document.addEventListener("DOMContentLoaded", () => {
  new MergeFundMemoryGame()
})
