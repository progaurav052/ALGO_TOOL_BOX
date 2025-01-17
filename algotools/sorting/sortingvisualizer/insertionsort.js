    
const array = [];//this will hold our numbers  to be sorted 
let animationDelay = 150; //to control the speed
let audioCtx = null;
let isSorting = false;//flag to indicate whether sorting is happpening or not 
init();
function init() {
    const nInput = document.getElementById("input-n");
    const n = parseInt(nInput.value);
    if (isNaN(n) || n <= 0) {
        document.getElementById("error-message").textContent = "Invalid input. Please enter a positive number.";
                document.getElementById("error-message").style.display = "block";
                return;
            }
            document.getElementById("error-message").style.display = "none";  // Clear the error message
    initializeArray(n);
    nInput.value = ''; // Clear the input field
}

function initializeArray(n) {
    array.length = 0; // Clear the existing array
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}


function play() {
  const playButton = document.querySelector('.playing');
  
  playButton.disabled = true; // Disable the button
  if (isSorting) {
    return;
  }
  isSorting = true; // Set flag to indicate sorting animation is starting
  playButton.disabled = true;
  const swaps = insertionSort([...array]);//necessary we are creating the shallow copy here //because we want to show animation on original array
  
  animate(swaps).then(() => {
    isSorting = false;
    playButton.disabled = false; // Enable the button after sorting is done
  });
}

function animate(swaps) {

  if (swaps.length == 0) {
    showBars();
    return;
  }
  const [i, j] = swaps.shift(0);
  [array[i], array[j]] = [array[j], array[i]];
  showBars([i, j]);
  playNote(200 + array[i] * 500); //we are setting the frequency of sound here based on bar height here 
  playNote(200 + array[j] * 500);

  setTimeout(function () {
    animate(swaps);
  },animationDelay);
}

function insertionSort(array) {
  const swaps = [];
  for (let i = 1; i < array.length; i++) {
    let j = i;
    while (j > 0 && array[j - 1] > array[j]) {
      swaps.push([j - 1, j]);
      [array[j], array[j - 1]] = [array[j - 1], array[j]];
      j--;
    }
  }
  return swaps;
}
//our swaps will contain all the indices in order to be swapped
//we will pass this to animate function 
//and there we will use this swaps on the orginal array 


function showBars(indices) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");//to this bar we are adding additional styles using bar class
    if (indices && indices.includes(i)) {
      bar.style.backgroundColor = "red";
    }
    container.appendChild(bar);
  }
}

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx =
      new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
  }
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}

function updateSpeed() {
  const speedSlider = document.getElementById('speed-slider');
  animationDelay = 150 - speedSlider.value * 10; // Update the animation delay based on the slider value
}