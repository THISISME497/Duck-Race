document.getElementById('start-btn').addEventListener('click', startRace);
document.getElementById('reset-btn').addEventListener('click', resetGame);

let raceInterval;
let timerInterval;

function startRace() {
    const namesText = document.getElementById('names-input').value.trim();
    const duration = parseInt(document.getElementById('duration-input').value) || 10;
    
    if (!namesText) {
        alert('Please enter at least one name!');
        return;
    }

    const names = namesText.split('\n').filter(name => name.trim() !== '');
    const track = document.getElementById('track');
    track.innerHTML = ''; // Clear previous track

    document.getElementById('setup-container').classList.add('hidden');
    document.getElementById('race-container').classList.remove('hidden');

    // Create lanes and ducks
    const ducks = names.map((name, index) => {
        const lane = document.createElement('div');
        lane.className = 'duck-lane';
        
        const duckElement = document.createElement('div');
        duckElement.className = 'duck';
        duckElement.innerHTML = `🦆 <span class="duck-name">${name}</span>`;
        
        lane.appendChild(duckElement);
        track.appendChild(lane);

        return {
            element: duckElement,
            name: name,
            position: 0,
            finished: false
        };
    });

    let timeLeft = duration;
    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;

    const trackWidth = track.clientWidth - 50; // Account for duck width
    let winner = null;

    // Game update loop (runs 10 times a second)
    raceInterval = setInterval(() => {
        ducks.forEach(duck => {
            if (duck.finished) return;

            // Generate a random step forward
            const randomStep = Math.random() * (trackWidth / (duration * 10)) * 2;
            duck.position += randomStep;

            if (duck.position >= trackWidth) {
                duck.position = trackWidth;
                duck.finished = true;
                if (!winner) {
                    winner = duck.name;
                }
            }
            duck.element.style.left = duck.position + 'px';
        });
    }, 100);

    // Countdown clock loop
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(raceInterval);
            clearInterval(timerInterval);
            
            // Force a winner if no one crossed yet due to random chance
            if (!winner && ducks.length > 0) {
                const sorted = [...ducks].sort((a,b) => b.position - a.position);
                winner = sorted[0].name;
            }

            declareWinner(winner);
        }
    }, 1000);
}

function declareWinner(name) {
    const display = document.getElementById('winner-display');
    display.innerText = `🎉 ${name} Wins! 🎉`;
    display.classList.remove('hidden');
    document.getElementById('reset-btn').classList.remove('hidden');
}

function resetGame() {
    document.getElementById('setup-container').classList.remove('hidden');
    document.getElementById('race-container').classList.add('hidden');
    document.getElementById('winner-display').classList.add('hidden');
    document.getElementById('reset-btn').classList.add('hidden');
    clearInterval(raceInterval);
    clearInterval(timerInterval);
}
