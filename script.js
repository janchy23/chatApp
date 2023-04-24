const CHANNEL_ID = "jJQe2XKjSWua4i1x";
const musicians = [
  "Bob Dylan",
  "Elton John",
  "David Bowie",
  "John Lennon",
  "Dusty Springfield",
  "Johnny Cash",
  "Bob Marley",
  "Tina Turner",
  "Janis Joplin",
  "Madonna",
  "Tom Waits",
  "Whitney Houston",
  "Louis Armstrong",
  "Chuck Berry",
  "Blondie",
  "Bon Jovi",
  "Aretha Franklin",
];

const username = generateRandomName();
const color = generateRandomColor();

function generateRandomName() {
  const musician = musicians[Math.floor(Math.random() * musicians.length)];
  return musician;
}

function generateRandomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

const drone = new Scaledrone(CHANNEL_ID);
drone.on("open", (error) => {
  if (error) {
    alert("Error occurred. Please try again later.");
    return console.error("Error occurred.");
  } else {
    console.log("Successfully connected to Scaledrone");
  }
});

const room = drone.subscribe("observable-room");
room.on("open", function (error) {
  if (error) {
    alert("Error occurred. Please try again later.");
    return console.error("Error occurred.");
  }
});

room.on("data", (data, member) => {
  const isMe = member.id === drone.clientId;
  addMessage(data, member, isMe);
});

const form = document.querySelector("form");
const input = document.querySelector("#message-input");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (value !== "") {
    drone.publish({
      room: "observable-room",
      message: {
        username: username,
        color: color,
        text: value,
      },
    });
    input.value = "";
  } else {
    alert("Please enter a message.");
  }
});

function addMessage(data, member) {
  const div = document.createElement("div");
  if (member.id === drone.clientId) {
    div.classList.add("me");
    isMe = true;
  } else {
    div.classList.add("others");
    isMe = false;
  }
  div.innerHTML =
    '<b style="color:' +
    data.color +
    '">' +
    data.username +
    "</b>: " +
    data.text;
  document.querySelector("#messages").appendChild(div);
}
