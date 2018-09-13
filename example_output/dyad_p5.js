// Change these to whatever midi and json files you want to load
var jsonPath = "kiev.json";
var midiPath = "kiev.mid";

// Set up variables
var radius = 100;
var dy = 6;
var bottom = -200;

var song;
var notesPlaying;
var songLength;

var midiTime = 0;
var midiPlaying = false;

var noteIndex;
var pOffset = -24;
var numPitches = 88;
var timeOffset = 0;

var drawCircles = true;

// Load files, start playing MIDI (usually takes a second or so)
function preload(){
  song = loadJSON(jsonPath);
  MIDIjs.play(midiPath);
}

// p5.js setup function
function setup(){
  createCanvas(720, 540, WEBGL);
  background(0);
  setAttributes('antialias',true);

  colorMode(HSB, 100);
  noFill();

  songLength = Object.keys(song).length;
  noteIndex=0;
}

// Functions for rendering notes and chords

MIDIjs.player_callback=(e)=>{midiTime = e.time}

function circle(center, rad=5, steps=4){
  beginShape();
  for (var k = -1; k <= steps+1; k++){
    curveVertex(center.x + rad*cos(k*2*PI/steps), center.y + rad*sin(k*2*PI/steps), center.z);
  }
  endShape();
}

function pos(i){
  return new p5.Vector(radius*cos(i*5/6*PI), radius*sin(i*5/6*PI), i*dy+bottom);
}

function noteColor(diff){
  let interval = abs(diff)%12;
  let intClass = 6-abs(6-interval);
  let hue;

  switch(intClass){
    case 1 :
      hue = 17; break; //m2, M7
    case 2 :
      hue = 83; break; //M2, m7
    case 3:
      hue = 33; break; //m3, M6
    case 4:
      hue = 50; break;//M3, m6
    case 5:
      hue = 67; break;//P4, P5
    case 6:
      hue = 0; break;//T
    default:
      hue = 10;
  }
  
  if (intClass == 0){
    return createVector(0, 0, 80);
  } else {
    return createVector(hue, 100, 100);
  }
}

function noteLine(n1, n2){
  let vc = noteColor(n1-n2);
  stroke(vc.x,vc.y,vc.z);
  let p1 = pos(n1);
  let p2 = pos(n2);
  line(p1.x,p1.y,p1.z, p2.x,p2.y,p2.z);
}

// p5.js draw function - renders animation
function draw() {
  let timeS = millis()/1000;

  // Wait for midi file to load, then sync once it starts playing
  if (!midiPlaying){
    if (midiTime>0){
      timeOffset = timeS - midiTime;
      midiPlaying = true;
    } else {
      timeOffset = timeS;
    }
  }

  background(0);
  
  // Handles rotation of the geometry based on time and mouse position
  translate(10*sin(timeS*2), 0, -100);
  rotateX(-mouseY/80);
  rotateZ(mouseX/90);

  // Draw note circles (press 'J' to toggle)
  fill(0,0,100,30);
  noStroke();

  for(var i = 0; i < numPitches; i++){
    if(!drawCircles) break;
    circle(pos(i),2,5);
  }
  
  // Determine which chord should be playing
  if (noteIndex < songLength-1){
    while (song[noteIndex+1] && song[noteIndex+1]["Time (s)"] <= timeS - timeOffset){
      noteIndex++;
    }
  }

  notesPlaying = song[noteIndex]["Playing"];

  // Render interval lines
  for(var j in notesPlaying){
    // Don't draw notes if playback hasn't started
    if (timeS<=timeOffset+.01) break;

    strokeWeight(2);
    for(var k=0; k<=j; k++){
      noteLine(notesPlaying[j]+pOffset, notesPlaying[k]+pOffset);
    }
    // Draw highlight circles
    fill(0,0,100,40);
    noStroke();
    circle(pos(notesPlaying[j]+pOffset),5,5);
  }
}

// Keyboard controls
const keyRef = {
  a: 65,
  s: 83,
  d: 68,
  f: 70,
  q: 81,
  w: 87,
  e: 69,
  r: 82,
  j: 74,
  k: 75,
  l: 76,
  c: 67,
  v: 86,
  u: 85,
  z: 90,
  x: 88,
  semi: [59,186],
}

d3.select("body").on("keydown",()=>{
  let key=d3.event.keyCode;

  // If 'J' is pressed, toggle note circles.
  if (key==keyRef.j) drawCircles=!drawCircles;
});