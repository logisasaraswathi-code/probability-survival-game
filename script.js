let game = {
  health: 100,
  energy: 100,
  hunger: 100,
  thirst: 100,
  temperature: 100,
  morale: 100,
  day: 1,
  weather: "Sunny",
  inventory: [],
  maxInventory: 10,
  skills: {
    forage: 1,
    hunt: 1,
    survival: 1
  }
};

const weatherTypes = [
  {type:"Sunny", chance:40},
  {type:"Rain", chance:25},
  {type:"Snow", chance:20},
  {type:"Storm", chance:15}
];

function updateBars(){
  setBar("healthBar", game.health);
  setBar("energyBar", game.energy);
  setBar("hungerBar", game.hunger);
  setBar("thirstBar", game.thirst);
  setBar("tempBar", game.temperature);
  setBar("moraleBar", game.morale);

  document.getElementById("day").textContent = game.day;
  document.getElementById("weather").textContent = game.weather;
  document.getElementById("forageSkill").textContent = game.skills.forage;
  document.getElementById("huntSkill").textContent = game.skills.hunt;
  document.getElementById("survivalSkill").textContent = game.skills.survival;

  renderInventory();
  checkGameOver();
}

function setBar(id,value){
  document.getElementById(id).style.width = value + "%";
}

function log(msg){
  const logDiv = document.getElementById("log");
  logDiv.innerHTML = "<p>> " + msg + "</p>" + logDiv.innerHTML;
}

function changeWeather(){
  let rand = Math.random()*100;
  let cumulative = 0;
  for(let w of weatherTypes){
    cumulative += w.chance;
    if(rand <= cumulative){
      game.weather = w.type;
      break;
    }
  }
  log("Weather changed to " + game.weather);
}

function nextDay(){
  game.day++;
  decayStats();
  changeWeather();
  triggerRandomEvent();
  saveGame();
  updateBars();
}

function decayStats(){
  game.hunger -= 10;
  game.thirst -= 12;
  game.energy -= 8;
  game.temperature -= game.weather === "Snow" ? 15 : 5;

  if(game.hunger < 50) game.health -= 5;
  if(game.thirst < 40) game.health -= 8;
}

function triggerRandomEvent(){
  let chance = Math.random()*100;

  if(chance < 15){
    game.health -= 10;
    log("Animal attack! Lost 10 health.");
  } 
  else if(chance < 30){
    addItem("Food");
    log("Found extra food!");
  }
  else if(chance < 45){
    game.temperature -= 15;
    log("Sudden cold wave!");
  }
}

function performAction(action){
  if(action === "forage"){
    let success = 60 + game.skills.forage*5;
    if(Math.random()*100 < success){
      addItem("Food");
      game.skills.forage++;
      log("Foraging successful!");
    } else {
      log("Foraging failed.");
    }
    game.energy -= 10;
  }

  if(action === "hunt"){
    let success = 50 + game.skills.hunt*5;
    if(Math.random()*100 < success){
      addItem("Food");
      game.skills.hunt++;
      log("Hunt successful!");
    } else {
      game.health -= 5;
      log("Hunt failed. Minor injury.");
    }
    game.energy -= 20;
  }

  if(action === "rest"){
    game.energy += 20;
    game.morale += 10;
    log("You rested well.");
  }

  if(action === "makeFire"){
    game.temperature += 20;
    game.skills.survival++;
    log("You made a fire.");
  }

  updateBars();
}

function addItem(item){
  if(game.inventory.length < game.maxInventory){
    game.inventory.push(item);
  } else {
    log("Inventory full!");
  }
}

function renderInventory(){
  document.getElementById("inventory").innerHTML = game.inventory.join(", ");
}

function checkGameOver(){
  if(game.health <=0 || game.hunger <=0 || game.thirst<=0 || game.temperature<=0){
    document.getElementById("gameOver").classList.remove("hidden");
    document.getElementById("summary").textContent =
      "You survived " + game.day + " days.";
  }
}

function saveGame(){
  localStorage.setItem("survivalGame", JSON.stringify(game));
}

function loadGame(){
  let saved = localStorage.getItem("survivalGame");
  if(saved){
    game = JSON.parse(saved);
  }
  updateBars();
}

function resetGame(){
  localStorage.removeItem("survivalGame");
  location.reload();
}

loadGame();
updateBars();
