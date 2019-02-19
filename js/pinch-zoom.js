//General variables for touch activity
/*A touchable overlay element is used on top of individual DOM elements for primary content that can be
  magnified so that any target touches register to a single target element instead of separate elements*/
let touchElem = document.getElementById("touchOverlay");
let zoomElem = document.getElementById("zoomContent");
let container = zoomElem.parentElement;
let processNewTargetTouches = false;
let processTouchMove;
let pTargetTouches = []; //array of up-to-date, full/partial Touch objects for target touches active during last touchstart event

//Variables for two-touch pinch-zoom
let oldDistX, oldDistY, oldDist, newDistX, newDistY, newDist; //Distances between two touches
let startMidX, startMidY, currentMidX, currentMidY;           //Midpoint locations between two touches
let startScrollX, startScrollY;                               //Start-of-gesture scroll positions of container element
let offsetX, offsetY;                                         //Zoomable element's page location
let startMag = 1;                                             //Initial magnification
let oldMag = startMag, newMag;                                //Previous and current magnifications
let lowerMagLimit = 1;                                        //Lower magnification limit
let upperMagLimit = 6;                                        //Upper magnification limit
let magMultiplier = 1.02;                                     //Magnification multiplier
let zoomFactor;                                               //Ratio between current and start-of-gesture magnifications

//Add touch event handlers
touchElem.addEventListener("touchstart", startTouch);
touchElem.addEventListener("touchend", endTouch);
touchElem.addEventListener("touchmove", moveTouch);

//Touchstart event handler
function startTouch(e) {
  /*New target touches are processed for a touch interaction session only if the first overall touch
  is a target touch and up until an all active target touches are removed.*/
  e.preventDefault(); //Prevents "zero-length, hold-touch" touchmove event in Firefox
  if (e.touches.length == 1) processNewTargetTouches = true; //first overall touch?   
  
  if (processNewTargetTouches) {
    //Non-shallow copy of target TouchList - nested deep copy for Touch objects not required
    pTargetTouches = [...(e.targetTouches)];
    
    //Prepare for new two-touch pinch-zoom gesture
    if (e.targetTouches.length == 2) {  
      //Set starting magnification, find container scrollbar positions, and calculate midpoint between two touches
      startMag = oldMag;
      startScrollX = container.scrollLeft;
      startScrollY = container.scrollTop;
      startMidX = (e.targetTouches[0].pageX + e.targetTouches[1].pageX) / 2;
      startMidY = (e.targetTouches[0].pageY + e.targetTouches[1].pageY) / 2;
    }
  }
}

//Touchend event handler
function endTouch(e) {
  //Stop processing new target touches for interaction session when all existing target touches are removed
  if (e.targetTouches.length == 0) processNewTargetTouches = false;
}

//Touchmove event handler
function moveTouch(e) {
  //Only touchmove events associated with processed target touches are themselves processed
  for (let i = 0; i < e.changedTouches.length; i++) {
    processTouchMove = false;
    for (let j = 0; j < pTargetTouches.length; j++) {
      if (e.changedTouches[i].identifier == pTargetTouches[j].identifier) {
        processTouchMove = true;
        break;
      }
    }
    if (!processTouchMove) return;
  }
  
  /*Execute pinch-zoom with these criteria:
      - Two active target touches only
      - No active non-target touches
      - Can execute if reducing from three or more active target touches down to two if remaining
        two started before the released touches (i.e., first two entries in pTargetTouches array)*/          
  if (e.targetTouches.length == 2 && e.touches.length == 2 && 
    e.targetTouches[0].identifier == pTargetTouches[0].identifier
    && e.targetTouches[1].identifier == pTargetTouches[1].identifier)
  {
    pinchZoom(e);
  }

  updatePTargetTouches(e);
}

//Function magnifies zoomable content from a two-touch pinch-zoom gesture
function pinchZoom(e) {
  //Calculate distances between two touches before and after gesture
  oldDistX = Math.abs(pTargetTouches[0].pageX - pTargetTouches[1].pageX);
  oldDistY = Math.abs(pTargetTouches[0].pageY - pTargetTouches[1].pageY);
  oldDist = Math.sqrt(Math.pow(oldDistX, 2) + Math.pow(oldDistY, 2));
  newDistX = Math.abs(e.targetTouches[0].pageX - e.targetTouches[1].pageX);
  newDistY = Math.abs(e.targetTouches[0].pageY - e.targetTouches[1].pageY);
  newDist = Math.sqrt(Math.pow(newDistX, 2) + Math.pow(newDistY, 2));

  //Calcuate midpoint between touches after gesture
  currentMidX = (e.targetTouches[0].pageX + e.targetTouches[1].pageX) / 2;
  currentMidY = (e.targetTouches[0].pageY + e.targetTouches[1].pageY) / 2;

  //Calculate zoomable element's page location
  offsetX = zoomElem.offsetLeft;
  offsetY = zoomElem.offsetTop;
  
  /*Perform bounded and centered magnification with container scrollbar repositioning
    - pinch out (touch separation increased) = zoom in
    - pinch in (touch separation decreased) = zoom out*/
  if (newDist/oldDist >= 1.005 || newDist/oldDist <= 0.995) { //Tolerance of +/- 0.005
    newMag = oldMag * (newDist/oldDist - 1 > 0 ? magMultiplier : 1 / magMultiplier);
    if (newMag < lowerMagLimit) newMag = lowerMagLimit;
    if (newMag > upperMagLimit) newMag = upperMagLimit;
    zoomElem.style.setProperty("transform", `scale(${newMag})`);
    zoomFactor = newMag / startMag;
    container.scrollLeft = zoomFactor * (startMidX - offsetX + startScrollX) - currentMidX + offsetX;
    container.scrollTop = zoomFactor * (startMidY - offsetY + startScrollY) - currentMidY + offsetY;
    oldMag = newMag;
  }
}

//Function updates any processed target touches that moved*/
function updatePTargetTouches(e) {
  for (let i = 0; i < e.changedTouches.length; i++) {
    for (let j = 0; j < pTargetTouches.length; j++) {
      if (e.changedTouches[i].identifier == pTargetTouches[j].identifier) {
        //Partial content of Touch object is saved
        pTargetTouches[j] = {
          identifier: e.changedTouches[i].identifier,
          pageX: e.changedTouches[i].pageX,
          pageY: e.changedTouches[i].pageY
        };
        break;
      }
    }
  }
}