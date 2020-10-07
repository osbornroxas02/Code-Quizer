
//store questions in array
const myQuestions = [
    {
        question: 'What does HTML stand for?',
        answers: {
            0: 'Hyper Text Markup Language',
            1: 'Hyper Text Makeup Language',
            2: 'Home Tool Markup Language',
            3: 'Hungry Tummies Mark Lunch'
        },
        correctAnswer: 0
    },
    {
        question: 'Who is making the Web standards',
        answers: {
            0: 'Google',
            1: 'W3C',
            2: 'Steve Jobs',
            3: 'The universal council of Wed Standards'
        },
        correctAnswer: 1
    },
    {
        question: 'What doe CSS stand for?',
        answers: {
            0: 'Custom style Sheets',
            1: 'Correct Standards for Scripting',
            2: 'Computer Science Scripting',
            3: 'Cascading Style Sheets'
        },
        correctAnswer: 3
    },
    {
        question: 'Inside which HTML element do we put the JavaScript?',
        answers: {
            0: '<scripting>',
            1: '<js>',
            2: '<script>',
            3: '<jsScript>'
        },
        correctAnswer: 2
    },
    {
        question: 'In HTML which is the most important heading?',
        answers: {
            0: '<h1>This is the most important</h1>',
            1: '<h2>This is the most important</h2>',
            2: '<h3>This is the most important</h3>',
            3: '<h4>This is the most important</h4>'
        },
        correctAnswer: 0
    },

    {
        question: 'What is Nan?',
        answers: {
            0: 'The NaN property represents a value that is “not a number”',
            1: 'The NaN property represents an error message',
            2: 'Nan means "None of these apply"',
            3: 'All of thee above'
        },
        correctAnswer: 0
    }
]

const intro = document.querySelector('.intro');
const questionBlock = document.querySelector('#question-block');
const startBtn = document.querySelector('#startBtn');
const questionTitle = document.querySelector('.questions');
const answerOptions = document.querySelector('.answer-options');
const resultContainer = document.querySelector('.results');
const main = document.querySelector('main');
const highScoresBtn = document.querySelector('.high-score');
const timeLeft = document.querySelector('#time-left');
const questionContainer = document.querySelector('.question-container');

// global variables
let currentQuestion = 0;
let currentScore = 0;
let highScores = [];
let time = 60;
let clock;

const loadScores = () => {
    highScores = localStorage.getItem('scores');
    if (!highScores) {
        highScores = [];
    } else {
        highScores = JSON.parse(highScores);
    }
}

//start the quiz
const startQuiz = () => {
    intro.style.display = 'none';
    questionBlock.style.display = 'block'
    //start timer
    clock = setInterval(timer, 1000);
    //get questions
    getQuestion();
}

//runs through array of questions
const getQuestion = () => {
    if (currentQuestion >= myQuestions.length) {
        endGame();
        return false;
    }
    index = currentQuestion;
    //add question
    questionTitle.textContent = myQuestions[index].question;

    //add answers
    for (i = 0; i < 4; i++) {
        let answerItem = document.createElement('li');
        answerItem.className = 'answer';
        answerItem.textContent = myQuestions[index].answers[i];
        answerItem.setAttribute('data-answer-index', i,);
        answerItem.setAttribute('data-question-index', index);
        answerOptions.appendChild(answerItem);
    }
    currentQuestion++;
    //listen for answer click
    answerOptions.addEventListener('click', checkAnswer);
}

//check if selected answer is correct
const checkAnswer = (event) => {
    let userAnswer = event.target.getAttribute('data-answer-index');
    let questionIndex = event.target.getAttribute('data-question-index');
    let correctAnswer = myQuestions[questionIndex].correctAnswer;

    userAnswer = parseInt(userAnswer);
    if (userAnswer === correctAnswer) {
        currentScore++;
        showResult(true);
    } else {
        showResult(false);
        if (time >= 5) {
            time -= 5;
        }
        else {
            time = 0;
        }
    }
}

// show result of previous answer
const showResult = (answer) => {
    resultContainer.style.display = 'block';
    if (answer) {
        resultContainer.textContent = 'Correct';
    } else {
        resultContainer.textContent = 'Wrong';

    }
    clearListItems();
    getQuestion();
}

//remove previous answers
const clearListItems = () => {
    answerOptions.innerHTML = ''
}

//when all questions have been answered or timer reaches 0. end the game and stop the clock
const endGame = () => {
    clearInterval(clock);

    questionContainer.style.display = 'none';
    let endGameContainer = document.createElement('div');

    let gameOver = document.createElement('h2');
    gameOver.textContent = 'Game Over';
    endGameContainer.appendChild(gameOver);

    let yourScore = document.createElement('h3');
    yourScore.textContent = `Your Score: ${currentScore}`;
    endGameContainer.appendChild(yourScore);

    const initialsForm = document.createElement('form');

    let initialsLabel = document.createElement('label');
    initialsLabel.className = 'form-label';
    initialsLabel.setAttribute('for', 'initials');
    initialsLabel.textContent = 'Enter Initials: ';
    initialsForm.appendChild(initialsLabel);

    let initialsInput = document.createElement('input');
    initialsInput.setAttribute('type', 'text');
    initialsInput.setAttribute('id', 'initials');
    initialsInput.setAttribute('name', 'initials');
    initialsForm.appendChild(initialsInput);

    let initialsSubmit = document.createElement('button');
    initialsSubmit.className = 'btn';
    initialsSubmit.setAttribute('id', 'submit');
    initialsSubmit.setAttribute('type', 'submit');
    initialsSubmit.textContent = 'Submit';
    initialsForm.appendChild(initialsSubmit);

    endGameContainer.appendChild(initialsForm);


    questionBlock.appendChild(endGameContainer);

    //listen for submit of initials and save to highScores array
    initialsSubmit.addEventListener('click', function () {
        event.preventDefault();
        initialsValue = initialsInput.value;
        initialsValue = initialsValue.toUpperCase();
        if (!validateInitials(initialsValue)) {
            alert('Enter two letter initials');
            initialsForm.reset();
            return false;
        }
        highScores.push({ name: initialsValue, score: currentScore });
        saveScores();
        viewHighScores();
    });
}

//validate initials input to 2 characters
const validateInitials = (string) => {
    let stringArr = string.split('');
    if (stringArr.length !== 2) {
        return false
    } else {
        return true;
    }
}

//save scores to local
const saveScores = () => {
    localStorage.setItem('scores', JSON.stringify(highScores));
}

//generate high scores list
const viewHighScores = () => {
    main.innerHTML = '';
    clearInterval(clock);
    timeLeft.textContent = '';

    let scoresTitle = document.createElement('h2');
    scoresTitle.textContent = 'High Scores';
    main.appendChild(scoresTitle);

    highScores.sort(compare);

    //list scores
    for (i = highScores.length - 1; i >= 0; i--) {
        let score = document.createElement('h4');
        score.innerText = `${highScores[i].name}: ${highScores[i].score}`;
        main.appendChild(score);
    }

    //start quiz button
    let startOver = document.createElement('button');
    startOver.className = 'btn';
    startOver.textContent = 'Take Quiz';
    startOver.setAttribute('id', 'start-over');
    main.appendChild(startOver);

    //reload page to start quiz
    startOver.addEventListener('click', function () {
        location.reload();
    });
}

//sort high scores by score value
const compare = (a, b) => {
    return a.score - b.score;
}

//set quiz timer
const timer = () => {
    if (time <= 10) {
        timeLeft.style.color = 'red';
    }
    if (time <= 0) {
        clearInterval(clock);
        endGame();
    } else {
        time--;
    }
    timeLeft.textContent = time;
}

//load previous scores if any
loadScores();
//start the quiz listener
startBtn.addEventListener('click', startQuiz);
//see high scores listener
highScoresBtn.addEventListener('click', viewHighScores);