// let cards = Array.from(document.getElementsByClassName('card')); 
const cards = document.querySelectorAll('.card');
const statusText = document.getElementById('statusText');
const startButton = document.getElementById('startGame');
const restartButton = document.getElementById('resetGame');


window.addEventListener('click', function () {
    
    let bgMusic = document.getElementById('bgMusic');
    bgMusic.loop = true;
    bgMusic.volume = 0.2;
    bgMusic.play();
})
class SoundList {
    constructor() {
        this.bgMusic = new Audio('Assets/background.mp3');
        this.flipSound = new Audio('Assets/flipcard.mp3');
        this.matchSound = new Audio('Assets/matched.mp3');
        this.winSound = new Audio('Assets/win.mp3');
        this.gameOverSound = new Audio('Assets/gameover.mp3');
    }
    // startMusic() {
    //     this.bgMusic.play();
    // }
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
    win() {
        this.winSound.play();
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
        this.busy = true; //user can't click on anything else when animation is running
        
        setTimeout(() => {
            // this.SoundList.startMusic();
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
        }
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
        this.statusText.innerText = `Boo Hoo, please try again!`
    }
    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    canFlipCard(card) {
        return true;
        // return (!this.busy && 
        //return true if no animation running
        //     !this.matchedCards.includes(card) && 
        // can flip card if is not matched cards
        //     (card !== this.cardToCheck)); 
        // can flip if card is not the picked card
    }
}



cards.forEach(card => {
    card.addEventListener('click', () => {
        game.flipCard(card);
        
    });
});


let game = new MixOrMatch(5, cards);
game.startGame();

