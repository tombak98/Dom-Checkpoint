/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  let coffeeCounter = document.getElementById('coffee_counter')
  coffeeCounter.innerText = coffeeQty
}

function clickCoffee(data) {
  data.coffee += 1
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(function(element) {
    if (coffeeCount >= (element.price / 2)) {
      element.unlocked = true
    }
  })
}

function getUnlockedProducers(data) {
  return data.producers.filter(function(element) {
    return element.unlocked
  })
}

function makeDisplayNameFromId(id) {
  let words = id.split("_")
  return words.map(function(element) {
    element = element[0].toUpperCase() + element.slice(1)
    return element
  }).join(" ")
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <div class="button-box">
    <button type="button" id="buy_${producer.id}" class="buy_button">Buy</button>
    <button type="button" id="sell_${producer.id}" class="sell_button">Sell</button>
    </div>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while(parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild)
  }
}

function renderProducers(data) {
  let container = document.getElementById("producer_container")
  deleteAllChildNodes(container)
  unlockProducers(data.producers, data.coffee)
  unlockedArray = getUnlockedProducers(data)
  unlockedArray.forEach(function(element) {
    container.appendChild(makeProducerDiv(element))
  })
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === `${producerId}`) {
      return data.producers[i]
    }
  }
}

function canAffordProducer(data, producerId) {
  // your code here
  let producer = getProducerById(data, producerId)
  if (data.coffee >= producer.price) {
    return true
  } else {
    return false
  }
}

function updateCPSView(cps) {
  let newCps = document.getElementById("cps")
  newCps.innerText = cps
}

function updatePrice(oldPrice) {
  let newPrice = oldPrice * 1.25
  return Math.floor(newPrice)
}

function attemptToBuyProducer(data, producerId) {
  let producer = getProducerById(data, producerId)
  if (data.coffee >= producer.price) {
    data.producers.forEach(function(element) {
      if (producerId === element.id) {
        element.qty += 1
        data.coffee -= element.price
        element.price = updatePrice(element.price)
      }
    })
    data.totalCPS += producer.cps
    return true
  } else {
    return false
  }
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    let status = attemptToBuyProducer(data, event.target.id.slice(4))
    if (status === false) {
      window.alert("Not enough coffee!")
    } else {
      renderProducers(data)
      updateCoffeeView(data.coffee)
      updateCPSView(data.totalCPS)
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

/****************
 * EXTRA SECTION
******************/

function attemptToSellProducer(data, producerId) {
  let producer = getProducerById(data, producerId)
  if (producer.qty > 0) {
    data.producers.forEach(function(element) {
    if (producerId === element.id) {
      element.qty -= 1
      element.price = updatePriceDown(element.price)
      data.coffee += element.price
    }
    })
    data.totalCPS -= producer.cps
    return true
  } else {
    return false
  } 
}

function sellButtonClick(event, data) {
  if (event.target.className === "sell_button") {
    let status = attemptToSellProducer(data, event.target.id.slice(5))
    if (status === false) {
      window.alert("You can't sell what you don't have!")
    } else {
      renderProducers(data)
      updateCoffeeView(data.coffee)
      updateCPSView(data.totalCPS)
    }
  }
}

function updatePriceDown(oldPrice) {
  let newPrice = oldPrice/1.25
  return Math.ceil(newPrice)
}

function increaseCPC(data) {
  if (data.coffee >= 200) {
    data.extraCPC += 1;
    data.coffee -= 200
    return true
  } else {
    window.alert("Not enough!")
    return false
  }
}

function additionalClicks(data) {
  data.coffee += data.extraCPC
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

function updateCPCview(data) {
  const cpcNumber = document.querySelector('#cpc')
  cpcNumber.innerText = (parseInt(data.extraCPC) + 1).toString()
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  let data = window.data;
  localStorage.setItem('resetData', JSON.stringify(data))
  if (localStorage.getItem('oldData')) {
    data = JSON.parse(localStorage.getItem('oldData'))
    updateCPCview(data)
    updateCPSView(data.totalCPS)
    updateCoffeeView(data.coffee)
    renderProducers(data)
  }

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', function() {
    clickCoffee(data);
    additionalClicks(data);
  })

  // Increase the coffee per click
  const cpc = document.querySelector("#extra_cpc")
  cpc.addEventListener('click', function() {
    let status = increaseCPC(data)
    if (status) {
    updateCPCview(data)
    updateCPSView(data.totalCPS)
    updateCoffeeView(data.coffee)
    renderProducers(data)
    }
  })

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    if (event.target.className === "buy_button") {
      buyButtonClick(event, data);
    } else if (event.target.className === "sell_button") {
      sellButtonClick(event, data);
    }
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);

  // Also, save the game status browser periodically
  setInterval(() => localStorage.setItem('oldData', JSON.stringify(data)), 5000)

  // reset function
  function resetGame() {
    data = JSON.parse(localStorage.getItem('resetData'))
    updateCPSView(data.totalCPS)
    updateCoffeeView(data.coffee)
    renderProducers(data)
    updateCPCview(data)
  }

  // reset button
  const resetButton = document.querySelector(".reset")
  resetButton.addEventListener("click", function() {
    resetGame()
  })
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
    resetGame
  };
}
