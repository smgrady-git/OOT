var metas = document.getElementsByTagName('meta');
var i;
if (navigator.userAgent.match(/iPhone/i)) {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
    }
  }
  document.addEventListener("gesturestart", gestureStart, false);
}
function gestureStart() {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
    }
  }
}
// Get slider input elements and value displays
const sliderInputs = document.querySelectorAll('.slider-input');
const sliderValues = document.querySelectorAll('.slider-value');

// Update value displays when sliders are moved
sliderInputs.forEach((slider, index) => {
  slider.addEventListener('input', () => {
    sliderValues[index].textContent = slider.value;
  });
});

// Get create button, popup, and selected values list elements
const createBtn = document.getElementById('create-btn');
const popup = document.getElementById('popup');
const closeBtn = document.querySelector('.close-btn');
const selectedValuesList = document.getElementById('selected-values');

const createConditionBtn = document.getElementById('create-btn2');
const popup2 = document.getElementById('popup2');
const closeBtn2 = document.querySelector('.close-btn2');
var customOptions = [];
var selectedValues = [];
document.getElementById("create-btn2").addEventListener("click", function() {
  var textInputValue = document.getElementById("textInput2").value;
  var textInputValue2 = document.getElementById("textInput3").value;
  console.log(textInputValue);
  console.log(textInputValue2);

  // Create a new option based on the input values
  var newOption = {
    label: `${textInputValue} likes - ${textInputValue2} dislikes`,
    value: `${textInputValue},${textInputValue2}`
  };
  customOptions.push(newOption);

  // Update the popup with the new options
  updatePopupOptions();

  document.getElementById("textInput2").value = "";
  document.getElementById("textInput3").value = "";
});
document.getElementById("submit-button").addEventListener("click", function() {
  selectedValues = [];
  // Get the selected options
  var selectedOptions = document.querySelectorAll('input[name="options"]:checked');
  selectedOptions.forEach(function(option) {
    selectedValues.push(option.value);
  });
  if (selectedValues.length > 0) {
     console.log(selectedValues);
  } else {
    alert("Please select at least one option.");
  }
  document.getElementById("popup2").style.display = "none";
});

document.getElementById("create-btn").addEventListener("click", function() {
  var slider1Value = document.getElementById("slider1").value;
  var slider2Value = document.getElementById("slider2").value;
  var textInputValue = document.getElementById("textInput").value;

 
  // Creating the function set_settings() dynamically
  var codestring = '$(function() {\n';
  codestring += '  //GLOBAL VARIABLES\n';
  codestring += '  var totalLink = \'' + textInputValue + '\';\n';
  codestring += '  var globalUsername = "";\n';
  codestring += '  var globalAvatar = "";\n';
  codestring += '  var globalDescription = "";\n';
  codestring += '  var countlike = 0;\n';
  codestring += '  var countDislike = 0;\n';
  codestring += '  var conditions = {\n';
  selectedValues.forEach(function(option, index) {
    var [likes, dislikes] = option.split(',').map(Number);
    codestring += ` // Condition ${index + 1} settings\n`;
    codestring += ` ${index + 1}: { likes: [${generateLikesArray(likes,slider2Value * 60000)}], dislikes: [${generateLikesArray(dislikes,slider2Value * 60000)}] },\n`;
  });
  codestring += '};\n';
  codestring += ' var assignedConditionNumber = getRandomInt(1,' + selectedValues.length + ');\n';
  codestring += ' function set_settings() {\n';
  codestring += '  window.settings = [];\n';
  codestring += '  settings.numberofavatars = ' + slider1Value + '; \n';
  codestring += '  settings.tasklength = ' + slider2Value * 60000 + ';\n';
  codestring += '  window.others.posts[1].likes = [12000,14000,15000,35000,80000];\n';
  codestring += '  window.others.posts[1].Dislikes = [12000,14000,15000,35000,80000];\n';
  codestring += '  settings.likes_by = [\'Ky\', \'Arjen\', \'AncaD\', \'Nick\', \'Heather\', \'Jane\', \'Georgeee\', \'John\',  \'Mary\', \'Lauren\', \'Sarah\'];\n';
  codestring += '  settings.Dislikes_by = [\'Lauren\', \'Arjen\', \'Jane\',  \'Ky\', \'AncaD\', \'Nick\', \'Heather\', \'Georgeee\', \'John\', \'Mary\', \'Sarah\'];\n';
  codestring += '  window.query_string = null;\n';
  codestring += '}';


  var codestringElement = document.createElement("codestring");
  codestringElement.textContent = codestring;
  document.getElementById("selected-values").innerHTML = ''; // Clear previous content
  document.getElementById("selected-values").appendChild(codestringElement);

  // Displaying the popup
  document.getElementById("popup").style.display = "block";


  // Add event listener for the copy button (only once)
  var copyBtn = document.getElementById("copy-btn");
  var copyBtnEventAdded = false;

  if (!copyBtnEventAdded) {
    copyBtn.addEventListener("click", function() {
      navigator.clipboard.writeText(codestring)
        .then(() => {
          showTopAlert("Code copied to clipboard!");
        })
        .catch((err) => {
          showTopAlert("Failed to copy code: " + err);
        });
    });
    copyBtnEventAdded = true;
  }
});

function updatePopupOptions() {
  var customOptionsDiv = document.querySelector(".custom-options");
  customOptionsDiv.innerHTML = "";

  customOptions.forEach(function(option, index) {
    var optionDiv = document.createElement("div");
    optionDiv.classList.add("options");
    optionDiv.innerHTML = `
      <input type="checkbox" id="custom-option-${index}" name="options" value="${option.value}">
      <label for="custom-option-${index}">${option.label}</label>
    `;
    customOptionsDiv.appendChild(optionDiv);
  });
}

document.getElementById("create-btn3").addEventListener("click", function() {
  document.getElementById("popup2").style.display = "block";
});

document.getElementsByClassName("close-button")[0].addEventListener("click", function() {
  document.getElementById("popup2").style.display = "none";
});



function generateLikesArray(numLikes, maxValue) {
  const likesArray = [];

  if (numLikes > 0 && maxValue > 0) {
    let remainingLikes = numLikes;
    let remainingTime = maxValue;

    while (remainingLikes > 0) {
      const portionTime = Math.floor(remainingTime / remainingLikes); // Divide remaining time into equal portions
      const randomTime = Math.floor(Math.random() * portionTime) + 1; // Random time within the portion
      
      // Adjust remaining time and likes for next portion
      remainingTime -= randomTime;
      remainingLikes--;

      likesArray.push(maxValue - remainingTime); // Push current time to array
    }
  }

  return likesArray;
}
// Show popup and display selected values when create button is clicked


// Function to show an alert at the top of the screen
function showTopAlert(message) {
  // Create a new div element for the alert
  var alertDiv = document.createElement("div");
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "0";
  alertDiv.style.left = "50%";
  alertDiv.style.transform = "translateX(-50%)";
  alertDiv.style.padding = "10px";
  alertDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  alertDiv.style.color = "white";
  alertDiv.style.zIndex = "9999";
  alertDiv.textContent = message;

  // Append the alert div to the document body
  document.body.appendChild(alertDiv);

  // Remove the alert after 3 seconds
  setTimeout(function() {
    alertDiv.remove();
  }, 3000);
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



// Hide popup when close button is clicked
closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

// Hide popup when user clicks outside of the popup content
window.addEventListener('click', (event) => {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
});