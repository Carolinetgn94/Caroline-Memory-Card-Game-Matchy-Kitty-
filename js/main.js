// let cards = Array.from(document.getElementsByClassName('card')); 
const cards = document.querySelectorAll('.card');
const statusText = document.getElementById('statusText');
const startButton = document.getElementById('startGame');
const restartButton = document.getElementById('resetGame');

class SoundList {
    constructor() {
        this.bgMusic = new Audio('Assets/background.mp3');
        this.flipSound = new Audio('Assets/flipcard.mp3');
        this.matchSound = new Audio('Assets/matched.mp3');
        this.misMatchSound = new Audio('Assets/mismatched.mp3');
        this.winSound = new Audio('Assets/win.mp3');
        this.gameOverSound = new Audio('Assets/gameover.mp3');
    }
    startMusic() {
        this.bgMusic.play();
        this.bgMusic.volume = 0.1;
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    misMatch() {
        this.misMatchSound.play();
    }
    win() {
        this.winSound.play();
        this.bgMusic.pause();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.flipCount = document.getElementById('smacks');
        this.statusText = document.getElementById('statusText');
        this.soundList = new SoundList();
    }
    startGame() {
        this.cardToCheck = '';
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.statusText.innerText = '';
        this.busy = true; //user can't click on anything else when animation is running
        
        setTimeout(() => {
            this.soundList.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.flipCount.innerText = this.totalClicks;
    }
    hideCards(card) {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.soundList.flip();
            this.totalClicks ++;
            this.flipCount.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck)
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);
    
        this.cardToCheck = '';
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        this.soundList.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.win();
    }
    cardMisMatch(card1, card2) {
        this.busy = true;
        this.soundList.misMatch();
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    getCardType(card) {
        return card.getElementsByClassName('card-front')[0].src;
    }
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining --;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countDown);
        this.soundList.gameOver();
        this.statusText.innerText = `Boo Hoo, please try again!`;
    }
    win() {
        clearInterval(this.countDown);
        this.soundList.win();
        this.statusText.innerText = `Meow, you win!`;
    }
    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }
    canFlipCard(card) {
        return (!this.busy && 
        //return true if no animation running
            !this.matchedCards.includes(card) && 
        // can flip card if is not matched cards
            (card !== this.cardToCheck)); 
        // can flip if card is not the picked card
    }
}


cards.forEach(card => {
    card.addEventListener('click', () => {
        game.flipCard(card);
        
    });
});

let game = new MixOrMatch(60, cards);
startButton.addEventListener('click', () => {
    game.startGame();
})
restartButton.addEventListener('click', () => {
    game.startGame();
})

