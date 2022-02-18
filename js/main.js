document.addEventListener("DOMContentLoaded", () => {

    createSquares();
    getNewWord();

    // globally defined variables
    let guessedWords = [[]];
    let availableSpace = 1;
    let word;
    let guessedWordCount = 0;

    // get new words
    function getNewWord() {
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=4&lettersMax=4`,
            {
              method: "GET",
              headers: {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": "78a55235d3msh4e1efc75bb43953p10c1c4jsna769327e614d",
              },
            }
          )
            .then((response) => {
              return response.json();
            })
            .then((res) => {
              word = res.word;
            })
            .catch((err) => {
              console.error(err);
            });
    }

    // create new squares
    function createSquares() {
        const board = document.getElementById("board");

        for (i = 0; i < 16; i++) {
            let box = document.createElement("div");
            box.classList.add("square");
            box.setAttribute("id", i + 1);
            board.appendChild(box);
        }
    }

    // handles when the user submits the word
    function handleSubmitWord() {
        const currentWordArray = getCurrentWordArray();

        if (currentWordArray.length != 4) {
            window.alert("Word should be 4 letter")
        }

        const currentWord = currentWordArray.join("");
        
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
            {
              method: "GET",
              headers: {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": "78a55235d3msh4e1efc75bb43953p10c1c4jsna769327e614d",
              },
            }
          ).then((res) => {
              if (!res.ok) {
                  throw Error()
              }

              const firstLetterId = guessedWordCount * 4 + 1;

              const interval = 200;
      
              currentWordArray.forEach((letter, index) => {
                  setTimeout(() => {
                      const tileColor = getTileColor(letter, index);
      
                      const letterId = firstLetterId + index;
                      const letterEl = document.getElementById(letterId);
      
                      letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                      
                  }, interval * index);
              });
      
              guessedWordCount += 1;
      
              if (currentWord === word) {
                  window.alert("Congratulations!");
              }
      
              if (guessedWords.length === 4) {
                  window.alert(`You lost! The word is ${word}`);
              }
      
              guessedWords.push([])

          }).catch(() => {
              window.alert("Word is not recognized!");
          });

    }

    // handles deleting a letter
    function handleDeleteLetter() {
        const currentWordArray = getCurrentWordArray();
        const removedLetter = currentWordArray.pop();

        guessedWords[guessedWords.length - 1] = currentWordArray
        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ''
        availableSpace = availableSpace - 1;
    }

    /* HELPER FUNCTIONS */

    // gets current word array count
    function getCurrentWordArray() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    // update guessed words
    function updateGuessedWords(letter) {
        const currentWordArray = getCurrentWordArray();

        if (currentWordArray && currentWordArray.length < 4) {
            currentWordArray.push(letter)

            const availableSpaceElement = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1;

            availableSpaceElement.textContent = letter;
        }
    }

    // gets Tile Colour
    function getTileColor(letter, index) {
        const isCorrect = word.includes(letter);

        if (!isCorrect) {
            return "rgb(211, 211, 211)"; // grey
        }

        const letterInPosition = word.charAt(index);
        const isCorrectPosition = (letter === letterInPosition);

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)"; // green color
        }

        return "rgb(181, 159, 59)" // yellow color
    }

    // pressing the keys on the screen
    const keys = document.querySelectorAll(".keyboard-row button");

    for (let i = 0; i < keys.length; i++) {
        // pressing the key on the screen
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === 'enter') {
                handleSubmitWord()
                return;
            }

            if (letter === 'del') {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter)
        };

    }

    // using keyboard keys on the screen
    document.addEventListener('keydown', (e) =>{
        const letter = e.key;

        if (letter === 'Backspace') {
            handleDeleteLetter();
            return;
        }

        if (letter === 'Enter') {
            handleSubmitWord();
            return;
        }

        updateGuessedWords(letter);
    })

});