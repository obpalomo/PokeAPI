const quizData = [
  {
    type: "tipo",
    question: "¿Cuál es el tipo principal de Pikachu?",
    options: ["Fuego", "Agua", "Eléctrico", "Planta"],
    correctAnswer: "Eléctrico",
  },
  {
    type: "tipo",
    question: "¿Cuál es el tipo principal de Charizard?",
    options: ["Fuego", "Agua", "Eléctrico", "Planta"],
    correctAnswer: "Fuego",
  },
  {
    type: "lider",
    question: "¿Quién es el líder del Gimnasio de Ciudad Plateada?",
    options: ["Brock", "Misty", "Erika", "Lt. Surge"],
    correctAnswer: "Lt. Surge",
  },
  {
    type: "evolucion",
    question: "¿Qué Pokémon evoluciona a Gyarados?",
    options: ["Magikarp", "Psyduck", "Horsea", "Dratini"],
    correctAnswer: "Magikarp",
  },
  {
    type: "rival",
    question: "¿Quién es el rival de Ash en la región de Johto?",
    options: ["Gary Oak", "May", "Dawn", "Tracey Sketchit"],
    correctAnswer: "Gary Oak",
  },
  {
    type: "profesor",
    question: "¿Cuál es el profesor Pokémon que te da tu primer Pokémon?",
    options: [
      "Profesor Oak",
      "Profesor Elm",
      "Profesor Birch",
      "Profesor Rowan",
    ],
    correctAnswer: "Profesor Oak",
  },
  {
    type: "rival",
    question: "¿Quién es el rival de Ash en la región de Hoenn?",
    options: ["Gary Oak", "May", "Dawn", "Paul"],
    correctAnswer: "May",
  },
  {
    type: "adivinarNombre",
    imageUrl: "https://i.blogs.es/8746d2/pikachu/1366_2000.png",
    correctAnswer: "Pikachu",
  },
  {
    type: "adivinarNombre",
    imageUrl:
      "https://staticg.sportskeeda.com/editor/2022/02/9f5d0-16437390245233.png?w=840",
    correctAnswer: "Charizard",
  },
];

let currentQuestionIndex = 0;
let userAnswers = [];

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.querySelector("quizButton");
  startButton.addEventListener("click", startQuiz);

  const submitButton = document.getElementById("submitBtn");
  submitButton.addEventListener("click", submitAnswer);

});

function startQuiz() {
  //nuevo
  const startButton = document.getElementById("startQuizButton");
  startButton.style.display = "none"; // Oculta el botón de inicio

  const submitButton = document.getElementById("submitBtn");
  submitButton.style.display = "block";// Muestra el botón de enviar respuesta
  //nuevo

  showQuestion();
}

function showQuestion() {
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options");
  const submitButton = document.getElementById("submitBtn");
  //nuevo
  const feedbackElement = document.getElementById("feedback");

  feedbackElement.textContent = "";
  //nuevo


  const currentQuestion = quizData[currentQuestionIndex];

  if (currentQuestion.type === "adivinarNombre") {
    // Pregunta de adivinar el nombre del Pokémon según la imagen
    questionElement.textContent = "¿Cuál es el nombre de este Pokémon?";
    const imageElement = document.createElement("img");
    imageElement.src = currentQuestion.imageUrl;
    imageElement.alt = "Pokemon a adivinar";

    // Campo de entrada de texto para responder al nombre del Pokémon
    const inputElement = document.createElement("input");
    inputElement.classList.add("answerInput");
    inputElement.type = "text";
    inputElement.id = "answerInput";
    inputElement.placeholder = "Ingresa el nombre del Pokémon";

    optionsContainer.innerHTML = "";
    optionsContainer.appendChild(imageElement);
    optionsContainer.appendChild(inputElement);
  } else {

    questionElement.textContent = currentQuestion.question;

    optionsContainer.innerHTML = "";
    submitButton.disabled = true;

    currentQuestion.options.forEach((option, index) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("option");
      optionElement.textContent = option;
      optionElement.addEventListener("click", () => selectOption(index));
      optionsContainer.appendChild(optionElement);
    });
  }
}

function selectOption(optionIndex) {
  const submitButton = document.getElementById("submitBtn");
  submitButton.disabled = false;

  userAnswers[currentQuestionIndex] = optionIndex;

  //nuevo
  const optionsContainer = document.getElementById("options");
  //nuevo
  const options = document.querySelectorAll('.option');
/*   options.forEach(option => option.classList.remove('option-selected'));

  options[optionIndex].classList.add('option-selected'); */
  //nuevo
  options.forEach((option, index) => {
    if (index === optionIndex) {
      option.classList.add("selected-option");
    } else {
      option.classList.remove("selected-option");
      //nuevo
    }
  });
}



function submitAnswer() {
  const currentQuestion = quizData[currentQuestionIndex];
  

  if (currentQuestion.type === "adivinarNombre") {
    // Obtener la respuesta del campo de entrada de texto
    const inputElement = document.getElementById("answerInput");
    userAnswers[currentQuestionIndex] = inputElement.value.trim().toLowerCase();
  }
  //nuevo
  // Verificar si la respuesta es correcta
  const isAnswerCorrect =
    currentQuestion.correctAnswer ===
    (currentQuestion.type === "adivinarNombre"
      ? userAnswers[currentQuestionIndex].toLowerCase()
      : currentQuestion.options[userAnswers[currentQuestionIndex]]);

  // Mostrar retroalimentación
  const feedbackElement = document.getElementById("feedback");
  feedbackElement.textContent = isAnswerCorrect ? "¡Respuesta correcta!" : "Respuesta incorrecta";
  //nuevo

  currentQuestionIndex++;

  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    // Fin del cuestionario
    displayResults();
  }
}

function displayResults() {

  //nuevo
  const feedbackContainer = document.getElementById("feedback");
  feedbackContainer.innerHTML = ""; // Limpiar contenido anterior

  for (let i = 0; i < quizData.length; i++) {
    const resultElement = document.createElement("p");
    const isCorrect =
      quizData[i].correctAnswer ===
      (quizData[i].type === "adivinarNombre"
        ? userAnswers[i].toLowerCase()
        : quizData[i].options[userAnswers[i]]);

    if (isCorrect) {
      resultElement.textContent = `Pregunta ${i + 1}: ¡Correcto!`;
      resultElement.classList.add("correct-answer");
    } else {
      resultElement.textContent = `Pregunta ${i + 1}: Incorrecto. La respuesta correcta es: ${
        quizData[i].type === "adivinarNombre"
          ? quizData[i].correctAnswer
          : quizData[i].options[quizData[i].correctAnswer]
      }`;
      resultElement.classList.add("incorrect-answer");
    }

    feedbackContainer.appendChild(resultElement);
  }
}

  /* const quizContainer = document.querySelector(".quiz-container");
  quizContainer.innerHTML = "<h2>¡Cuestionario completado!</h2>";


  const resultElement = document.createElement("p");
  const correctAnswers = quizData.filter(
    (q, index) => {
      const userAnswer = userAnswers[index];

      // Comparación insensible a mayúsculas y minúsculas
      const isCorrect =
        q.correctAnswer.toLowerCase() ===
        (q.type === "adivinarNombre"
          ? userAnswer.toLowerCase()
          : q.options[userAnswer].toLowerCase());

      return isCorrect;
    }
  );

  resultElement.textContent = `Obtuviste ${correctAnswers.length} respuestas correctas de ${quizData.length}.`;
  quizContainer.appendChild(resultElement);


}; */
