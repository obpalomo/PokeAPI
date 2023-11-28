document.addEventListener("DOMContentLoaded", function () {
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
/* console.log(`Número total de preguntas: ${quizData.length}`); */

let currentQuestionIndex = 0;
let userAnswers = [];


  const startButton = document.querySelector("#quizButton");
  startButton.addEventListener("click", startQuiz);

  const submitButton = document.querySelector("#submitBtn");
  submitButton.addEventListener("click", submitAnswer);


function startQuiz() {
  const startButton = document.querySelector("#quizButton");
  startButton.style.display = "none"; // Oculta el botón de inicio

  const submitButton = document.querySelector("#submitBtn");
  submitButton.style.display = "block"; // Muestra el botón de enviar respuesta

  showQuestion();
}

function showQuestion() {
/*     console.log(`Mostrando pregunta ${currentQuestionIndex + 1}`);
    console.log(`Intentando mostrar pregunta ${currentQuestionIndex + 1}: `, quizData[currentQuestionIndex]); */
  const questionElement = document.querySelector("#question");
  const optionsContainer = document.querySelector("#options");
  const submitButton = document.querySelector("#submitBtn");

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
    // Preguntas normales
    questionElement.textContent = currentQuestion.question;

    optionsContainer.innerHTML = "";
    submitButton.disabled = true;

    

    currentQuestion.options.forEach((option, index) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("option");
      optionElement.textContent = option;
      if (index === userAnswers[currentQuestionIndex]) {
        optionElement.classList.add("selected");
      }
      optionElement.addEventListener("click", () => selectOption(index));
      optionsContainer.appendChild(optionElement);
    });
  }
}

function selectOption(optionIndex) {
    const submitButton = document.querySelector("#submitBtn");
    submitButton.disabled = false;

    const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.classList.remove("selected");
  });

  // Marcar la opción seleccionada
  options[optionIndex].classList.add("selected");
  
    userAnswers[currentQuestionIndex] = optionIndex;
  }

  function submitAnswer() {
    if (currentQuestionIndex >= quizData.length) {
      console.error("Se alcanzó el final del cuestionario.");
      return;
    }
  
    const currentQuestion = quizData[currentQuestionIndex];
  
    if (!currentQuestion) {
      console.error("La pregunta actual es undefined o null.");
      return;
    }
  
    if (currentQuestion.type === "adivinarNombre") {
      // Obtener la respuesta del campo de entrada de texto
      const inputElement = document.getElementById("answerInput");
  
      if (!inputElement) {
        return;
      }
      userAnswers[currentQuestionIndex] = inputElement.value.trim().toLowerCase();
    } else {
      // Verificar si se seleccionó una opción para preguntas normales
      if (userAnswers[currentQuestionIndex] === undefined) {
        console.error(`Respuesta del usuario para la pregunta ${currentQuestionIndex + 1} es undefined.`);
        return;
      }
    }
  
    const isAnswerCorrect =
      (currentQuestion.correctAnswer ?? "").toLowerCase() ===
      (currentQuestion.type === "adivinarNombre"
        ? (userAnswers[currentQuestionIndex] ?? "").toLowerCase()
        : (currentQuestion.options[userAnswers[currentQuestionIndex]] ?? "").toLowerCase());
  
    // Mostrar retroalimentación
    const feedbackElement = document.querySelector("#feedback");
    if (feedbackElement) {
      feedbackElement.textContent = isAnswerCorrect ? "¡Respuesta correcta!" : "Respuesta incorrecta";
    }
  
    currentQuestionIndex++;
  
    if (currentQuestionIndex < quizData.length) {
      showQuestion(); // Mostrar la siguiente pregunta
    } else {
      // Fin del cuestionario
      displayResults();
    }
  }
  
  function displayResults() {
    const quizContainer = document.querySelector(".quiz-container");
    quizContainer.innerHTML = "<h2>¡Cuestionario completado!</h2>";
  
    const resultElement = document.createElement("p");
  
    const correctAnswers = quizData.filter((q, index) => {
      if (userAnswers[index] === undefined) {
        console.error(`Respuesta del usuario para la pregunta ${index + 1} es undefined.`);
        return false;
      }
  
      if (q.type === "adivinarNombre") {
        // Si la pregunta es adivinar el nombre, comparar la respuesta del usuario directamente
        if (q.correctAnswer === undefined) {
          console.error(`Respuesta correcta para la pregunta ${index + 1} es undefined.`);
          return false;
        }
  
        return userAnswers[index].toLowerCase() === q.correctAnswer.toLowerCase();
      } else {
        // Si es una pregunta normal, comparar la respuesta del usuario con la opción correcta
        if (q.options[userAnswers[index]] === undefined) {
          console.error(`Opción seleccionada por el usuario para la pregunta ${index + 1} es undefined.`);
          return false;
        }
  
        return q.options[userAnswers[index]].toLowerCase() === q.correctAnswer.toLowerCase();
      }
    });
  
    resultElement.textContent = `Obtuviste ${correctAnswers.length} respuestas correctas de ${quizData.length}.`;
    quizContainer.appendChild(resultElement);
  }
});