// Existing code
const commentBtn = document.querySelector("[name='comment-btn']");
const addCommentCloseModal = document.getElementById("addComment-close-modal");
const commentModal = document.getElementById("comment-modal");
const addComment = document.getElementById("add-comment");
const deleteBtn = document.querySelectorAll('.del');

// Add this line to select the form
const commentForm = document.getElementById("addCommentForm");

commentBtn.addEventListener("click", () => {
  commentModal.classList.add("show");
  commentModal.classList.remove("hidden");
});

addComment.addEventListener("click", (e) => {
  e.preventDefault(); // Add this line to prevent the default behavior
  createComment();
});

addCommentCloseModal.addEventListener("click", () => {
  commentModal.classList.add("hidden");
  commentModal.classList.remove("show");
});

// Add an event listener for the 'submit' event on the form
commentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewComment();
});

//Get choices buttons
const choices = document.querySelectorAll('.choice')
Array.from(choices).forEach((choice) => {
  //Add click event to each button
  choice.addEventListener('click', updateVotes)
})

async function updateVotes(){
  //Select p tag inside button
  const option = this.querySelector('p')
  //Get question ID from attribute
  const questionId = option.getAttribute('data-id')

  //update db with comment
  try {
    const response = await fetch('questions/vote', {
        method: 'put',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          'optionSelected': option.textContent,
          'questionId': questionId,
        })
      })
    const data = await response.json()
    console.log(data);
    if(option.textContent == data.option1){
      option.innerText = `Votes: ${data.voteCount1}`
      document.querySelector('.secondOption').innerText = `Votes: ${data.voteCount2}`
    }else if(option.textContent == data.option2){
      option.innerText = `Votes: ${data.voteCount2}`
      document.querySelector('.firstOption').innerText = `Votes: ${data.voteCount1}`
    }

  } catch (err) {
    console.log(err);
  }
}

// Deleting comments functionality
Array.from(deleteBtn).forEach( elem => {
  elem.addEventListener('click', deleteComment);
});

async function deleteComment() {
  // I had to modify the .ejs file as well so comments had a data-id attribute with the comment id, so it could be passed into the delete function.
  const commentId = this.parentNode.dataset.id;
  try {
      const response = await fetch('/comments', {
          method: 'delete',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
              'commentId': commentId
          })
      });
      const data = await response.json();
      console.log(data);
      this.parentNode.classList.add('hidden');
  } catch (err) {
      console.log(err);
  }
}

// Creating comments functionality
async function createComment() {
  // Grabbing the question id from the DOM.
  const questionId = document.querySelector('.firstOption').getAttribute('data-id');
  const commentText = document.getElementById("comment").value;
  try {
    const response = await fetch('/comments', {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            'commentText': commentText,
            'questionId': questionId
        })
    });
    const data = await response.json();
    console.log(data);
    // Everything else is just creating the new elements with the comment data and appending them to the comment section.
    const commentList = document.querySelector("ul");
    const newComment = document.createElement("li");
    const newUserName = document.createElement("p");
    const newContent = document.createElement("p");
    const newDelete = document.createElement("button");
    const newBreakLine = document.createElement("br");
    newComment.classList.add("flex","flex-row","items-start","w-[100%]","border-b","border-gray-500", "mb-2");
    newComment.setAttribute('data-id', data._id);
    newUserName.classList.add("text-gray-600", "break-words", "w-[33%]");
    newUserName.textContent = data.madeBy;
    newContent.classList.add("text-gray-600", "break-words","w-[33%]");
    newContent.textContent = commentText;
    newDelete.classList.add("del", "w-[33%]");
    newDelete.textContent = '🗑️';
    newBreakLine.classList.add("w-[100%]")
    newDelete.addEventListener('click', deleteComment);
    newComment.appendChild(newUserName);
    newComment.appendChild(newContent);
    newComment.appendChild(newDelete);
    console.log("newComment", newComment)
    commentList.appendChild(newComment);
    // Clears textarea.
    document.getElementById("comment").value = "";
  } catch (err) {
    console.log(err);
  }
}

/* ADDING AND DELETING QUESTION UI */
const addQuestionBtn = document.getElementById("add-question-button");
const questionModal = document.getElementById("add-question-modal");
const questionForm = document.getElementById("addQuestionForm");
const addQuestionCloseModal = document.getElementById(
  "addQuestion-close-modal"
);
const deleteQuestionBtn = document.getElementById("deleteQuestionBtn");

addQuestionBtn.addEventListener("click", () => {
  questionModal.classList.add("show");
  questionModal.classList.remove("hidden");
});

addQuestionCloseModal.addEventListener("click", () => {
  questionModal.classList.add("hidden");
  questionModal.classList.remove("show");
});

questionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewQuestion();
});

async function addNewQuestion() {
  const newOption1 = document.getElementById("newOption1").value;
  const newOption2 = document.getElementById("newOption2").value;

  const userId = document.getElementById("user-id").value;


  try {
    const response = await fetch('/questions', {
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        option1: newOption1,
        option2: newOption2,
        voteCount1: 0,
        voteCount2: 0,
        createdBy: userId,
      })
    });
    const data = await response.json();
    console.log(data);

    const questionList = document.getElementById("questionList");
    const newQuestion = document.createElement("li")
    const novelOption1 = document.createElement("p");
    const novelOption2 = document.createElement("p");
    const newQuestionUser = document.createElement("p");
    const deleteBtn = document.createElement("button");
    newQuestion.classList.add("flex","flex-row","items-start","w-[100%]","border-b","border-gray-500","mb-2");
    newQuestion.setAttribute("data-id", data._id);
    newQuestionUser.classList.add("text-gray-600", "break-words", "w-[24%]");
    newQuestionUser.textContent = data.createdBy;
    novelOption1.classList.add("text-gray-600", "break-words", "w-[24%]");
    novelOption1.textContent = data.option1;
    novelOption2.classList.add("text-gray-600", "break-words", "w-[24%]");
    novelOption2.textContent = data.option2;
    newQuestion.appendChild(novelOption1);
    newQuestion.appendChild(novelOption2);
    if (data.createdBy === userId) {
      deleteBtn.textContent = "🗑️";
      deleteBtn.classList.add("w-[24%]");
      deleteBtn.id = "deleteQuestionBtn";
      deleteBtn.addEventListener("click", deleteQuestion);
      newQuestion.appendChild(deleteBtn);
    }
    console.log("newQuestion", newQuestion );
    questionList.appendChild(newQuestion);
    newOption1.value = "";
    newOption2.value = "";
  } catch (err) {
    console.log(err);
  }
}


async function deleteQuestion() {
  const questionId = this.parentNode.dataset.id;
  try {
    const response = await fetch(`/questions/${questionId}`, {
      method: "delete",
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
    this.parentNode.classList.add("hidden");
  } catch (err) {
    console.log(err);
  }
}
