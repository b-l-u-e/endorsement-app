import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://javascript-projects-97a40-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const db = getDatabase(app);
const endorsementsInDB = ref(db, "endorsements");

const button = document.querySelector("button");
const fromInput = document.querySelector('input[name="from"]');
const toInput = document.querySelector('input[name="to"]');
const messageInput = document.querySelector('textarea[name="endorsements"]');

const endorsementsContainer = document.querySelector(".endorse-container");

button.addEventListener("click", () => {
  push(endorsementsInDB, {
    from: fromInput.value,
    to: toInput.value,
    message: messageInput.value,
    timestamp: new Date().toISOString(),
  });

  clearFieldInputs();
});

function clearFieldInputs() {
  fromInput.value = "";
  toInput.value = "";
  messageInput.value = "";
}


document.addEventListener("contextmenu", e => e.preventDefault(), false);

document.addEventListener("keydown", e => {
  if (e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();
  }
});



function renderEndorsements(endorsement) {
  const endorsementElement = document.createElement("li");

  endorsementElement.classList.add("endorsement");

  endorsementElement.innerHTML = `
          <div class="header">To: ${endorsement.to}</div>
          <div class="message">${endorsement.message}</div>
          <div class="signatureLikeArea">
              <div class="signature">From: ${endorsement.from}</div>
              <div class="likeCount"><i class="fa-regular fa-heart"></i>0</div>
          </div>
      `;

  endorsementsContainer.appendChild(endorsementElement);

  // Add event listener to the heart icon
  const heartIcon = endorsementElement.querySelector(".fa-heart");
  const likeCountElement = endorsementElement.querySelector(".likeCount");

  //  initial like count
  // likeCountElement.dataset.likeCount = 0;

  heartIcon.addEventListener("click", function () {
    let likeCount = parseInt(likeCountElement.textContent);

    // Check if the heart icon is already solid
    if (heartIcon.classList.contains('fa-solid')) {
      // If it's solid, make it regular and decrease the like count
      heartIcon.classList.remove('fa-solid');
      heartIcon.classList.add('fa-regular');
      likeCount -= 1;
    } else {
      // If it's not solid, make it solid and increase the like count
      heartIcon.classList.remove('fa-regular');
      heartIcon.classList.add('fa-solid');
      likeCount += 1;
    }
  
    // Update the text content to include the heart icon
    likeCountElement.innerHTML = `<i class="${heartIcon.classList}" aria-hidden="true"></i> ${likeCount}`;
  });
}

onValue(endorsementsInDB, (snapshot) => {
  const data = snapshot.val();
  let endorsements = Object.values(data);

  // sort endorsements based on time period
  endorsements.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  document.querySelector(".endorse-container").innerHTML = "";

  endorsements.forEach((endorsement) => {
    renderEndorsements(endorsement);
  });
});
