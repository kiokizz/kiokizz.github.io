console.log("Javascript loaded");

let gameOngoing = false;
let gameFinished = false;
let rolledOut = false;
var rounds;
let score = [];
let total = 0;
cC("startButton", "lightgreen");

document.getElementById("startButton").onclick = function () {
    if (!gameOngoing || gameFinished) {
        resetDiceImages();
        gameOngoing = true;
        gameFinished = false;
        console.log("Game starting");
        rounds = newGame();
        rounds[0] = 1; //Round counter
        console.log(rounds);
        cC("dice-button", 'lightgreen');
        cC("startButton", 'lightgrey');
        cText("dice-rolls-label", "Round " + rounds[0] + " Rolls:");
        cText("current-score", "Current Score: " + 0);
        cText("total-score", "Total Score: " + 0);
    } else {
        console.log("Restart function not yet implemented.")
    }
};

function newGame() {
    arr = [0];
    score = [];
    for (let i = 0; i < 10; i++) {
        arr.push([]);
        score.push([0]);
    }
    return arr;

    //Reset dice rolls images function.
}

//Dice button Clicked
document.getElementById("dice-button").onclick = function () {
    if (gameOngoing && !rolledOut) {
        let round = rounds[0];
        if (!gameFinished && round <= 10 && rounds[round].length < 10) {
            let roll = (Math.floor(Math.random() * Math.floor(6))) + 1;
            console.log("Roll: " + roll)
            rounds[round].push(roll);
            let id = 'roll' + (rounds[round].length - 1);
            let image = ".\\resources\\dice" + roll + ".png"
            document.getElementById(id).src = image;
        } else if (rounds[round].length === 10) {
            console.log("Round finished. Please start a new round.")
            cC("end-turn-button", 'yellow');
        } else {
            console.log("Unknown error")
        }
        console.log(rounds);
        //If "1" has been rolled:
        //Disable click to roll - highlight end turn button
        if (rounds[round].includes(1)) {
            console.log("Rolled Out!");
            rolledOut = true;
            cC("end-turn-button", 'yellow');
            cC("dice-button", 'lightgrey');
        }
        if (rounds[round].length === 10) {
            cC("dice-button", 'lightgrey');
        }

        //Update Current Score:
        let current = 0;
        if (!rolledOut) {
            for (let i = 0; i < rounds[rounds[0]].length; i++) {
                const e = rounds[rounds[0]][i];
                current += e;
            }
        }
        score[round - 1] = current;
        cText("current-score", "Current Score: " + current);

        //Update Total Score:
        total = 0;
        for (let i = 1; i < score.length; i++) {
            total += parseInt(score[i]);
        }
        console.log("Scores: " + score);
        cText("total-score", "Total Score: " + total);

    } else if (rolledOut) {
        console.log("Rolled Out!. Please start a new round.");
    }
};

//Clear dice image function - to be used in End Turn and Start functions
function resetDiceImages() {
    for (let i = 0; i < 10; i++) {
        let id = 'roll' + i;
        document.getElementById(id).src = ".\\resources\\dice0.png";
    }
}


//End Turn Button
document.getElementById("end-turn-button").onclick = function () {
    if (!gameFinished && gameOngoing) {
        cC("end-turn-button", "lightgrey");
        rolledOut = false;
        resetDiceImages();
        if (rounds[0] < 10) {
            cC("dice-button", 'lightgreen');
            rounds[0]++;
            cText("dice-rolls-label", "Round " + rounds[0] + " Rolls:");
        } else {
            previousHigh = localStorage.greedyDiceHighScore;
            highScore(total)
            if (total > previousHigh) {
                alert("Congratulations, you have set a new High Score of " + total + "!");
                localStorage.greedyDiceHighScore = total;
            } else {
                alert("Game finished! You scored: " + total + ". Current High Score is " + previousHigh + ".");
            }
            gameOngoing = false;
            gameFinished = true;
            cC("startButton", "lightgreen");
            cC("dice-button", 'lightgrey');
        }
    }
}


//TODO
//Customise UI - background and text color
//Use external library / script? Requirements - could use ajax to change all element colours? https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_css_name_value

function highScore(score) {
    let highScore = localStorage.greedyDiceHighScore;
    if (highScore == undefined) {
        localStorage.greedyDiceHighScore = 0;
    }
    if (highScore < score) {
        localStorage.greedyDiceHighScore = score;
    }
}

function gameRules() {
    alert("Rules:\nThe player has 10 rounds." +
        "\nEach round the player may roll the dice 10 times, each roll added onto his total." +
        "\nThe player may choose to end the round at any point, risking rolling the deadly \"1\"" +
        "\nUpon rolling a \"1\" the round will end, the rounds score set to 0");
}

function cC(element, color) {
    document.getElementById(element).style.backgroundColor = color;
}

function cText(element, content) {
    document.getElementById(element).innerHTML = content;
}