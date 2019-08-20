console.log("Javascript loaded");

//Setup global variable
let gameOngoing = false;
let gameFinished = false;
let rolledOut = false;
var rounds;
let score = [];
let total = 0;

cC("startButton", "lightgreen");

document.getElementById("startButton").onclick = function () {
    if (!gameOngoing || (!gameOngoing && gameFinished)) {
        resetDiceImages();
        gameOngoing = true;
        gameFinished = false;
        console.log("Game starting");
        rounds = newGame();
        rounds[0] = 1; //Round counter
        total = 0;
        console.log(rounds);
        cC("dice-button", 'lightgreen');
        cC("startButton", 'lightgrey');
        cText("dice-rolls-label", "Round " + rounds[0] + "/10 Rolls:");
        cText("current-score", "Round Score: " + 0);
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
}

//Dice button Clicked
document.getElementById("dice-button").onclick = function () {
    //Check Game Ongoing --> Roll Dice --> Adjust Display Elements as required
    if (gameOngoing && !rolledOut) {
        let round = rounds[0];
        if (!gameFinished && round <= 10 && rounds[round].length < 10) {
            let roll = (Math.floor(Math.random() * Math.floor(6))) + 1;
            console.log("Roll: " + roll)
            rounds[round].push(roll);
            let id = 'roll' + (rounds[round].length - 1);
            let image = ".\\resources\\dice" + roll + ".png"
            document.getElementById(id).src = image;
        } else {
            console.log("Unknown error")
        }
        if (rounds[round].length === 10) {
            console.log("Round finished. Please start a new round.")
            cC("end-turn-button", 'yellow');
        }
        //console.log(rounds);
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

        //Update Round Score:
        let current = 0;
        if (!rolledOut) {
            for (let i = 0; i < rounds[rounds[0]].length; i++) {
                const e = rounds[rounds[0]][i];
                current += e;
            }
        }
        score[round - 1] = current;
        cText("current-score", "Round Score: " + current);

        //Update Total Score:
        total = 0;
        for (let i = 0; i < score.length; i++) {
            total += parseInt(score[i]);
        }
        //console.log("Scores: " + score);
        cText("total-score", "Total Score: " + total);

    } else if (rolledOut) {
        console.log("Rolled Out!. Please start a new round.");
    }
};

//Clear dice image function - used in both End Turn and Start functions
function resetDiceImages() {
    for (let i = 0; i < 10; i++) {
        let id = 'roll' + i;
        document.getElementById(id).src = ".\\resources\\dice0.png";
    }
}


//End Turn Button
document.getElementById("end-turn-button").onclick = function () {
    //Next round if !gameFinished --> Display results if game finished
    if (!gameFinished && gameOngoing) {
        cC("end-turn-button", "lightgrey");
        rolledOut = false;
        resetDiceImages();
        if (rounds[0] < 10) {
            cC("dice-button", 'lightgreen');
            rounds[0]++;
            cText("dice-rolls-label", "Round " + rounds[0] + "/10 Rolls:");
        } else {
            previousHigh = highScore;            
            //Edit HighScore


            if (total > previousHigh) {
                editSettings("highScore", total);
                alert("Congratulations, you have set a new High Score of " + total + "! The previous High Score was " + previousHigh);
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

//Change Colour of Element
function cC(element, color) {
    document.getElementById(element).style.backgroundColor = color;
}

//Change Text of Element
function cText(element, content) {
    document.getElementById(element).innerHTML = content;
}
