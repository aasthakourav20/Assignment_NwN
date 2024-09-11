const API_URL = "https://opentdb.com/api.php?amount=10";

let currentQuestionIndex = 0;
let questions = [];
let score = 0;

const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const resultContainer = document.getElementById('result-container');
const quizContainer = document.getElementById('quiz');

async function fetchQuizData() {
    const response = await fetch(API_URL);
    const data = await response.json();
    questions = data.results.map((q) => formatQuestion(q));
    totalQuestionsElement.textContent = questions.length;
    displayQuestion();
}

function formatQuestion(question) {
    const formattedQuestion = {
        question: question.question,
        choices: [...question.incorrect_answers],
        correctAnswer: question.correct_answer
    };
    formattedQuestion.choices.push(formattedQuestion.correctAnswer);
    formattedQuestion.choices = shuffleArray(formattedQuestion.choices);
    return formattedQuestion;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function displayQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;
    currentQuestion.choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(button, choice === currentQuestion.correctAnswer));
        choicesElement.appendChild(button);
    });
    currentQuestionElement.textContent = currentQuestionIndex + 1;
}

function resetState() {
    nextButton.disabled = true;
    choicesElement.innerHTML = '';
}

function selectAnswer(button, isCorrect) {
    if (isCorrect) {
        button.classList.add('correct');
        score++;
    } else {
        button.classList.add('incorrect');
    }
    Array.from(choicesElement.children).forEach(child => {
        child.disabled = true;
    });
    nextButton.disabled = false;
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showScore();
    }
});

function showScore() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    const percentageScore = Math.round((score / questions.length) * 100);
    scoreElement.textContent = percentageScore;
}

restartButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    quizContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    fetchQuizData();
});

fetchQuizData();
