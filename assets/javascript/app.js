//Global Variables//
var trainName = $("#train-name").val().trim();
var trainDestination = $("#train-destination").val().trim();
var trainTime = moment($("#train-time").val(), "HH:mm A").format("X");
var trainFrequency = $("#train-frequency").val();

//Initialize Firebase//
var config = {
  apiKey: "AIzaSyDp3BE47XQTPv0RXq6xhi6TkTxsEXnuujE",
  authDomain: "isaac-project-b3009.firebaseapp.com",
  databaseURL: "https://isaac-project-b3009.firebaseio.com",
  projectId: "isaac-project-b3009",
  storageBucket: "isaac-project-b3009.appspot.com",
  messagingSenderId: "317314345924"
};
firebase.initializeApp(config);

var database = firebase.database();

//On click of submit button...//
$("#submit").on("click", function(event) {
  event.preventDefault();

  var train = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
  }

  //Push train object to the Firebase server//
  database.ref().push(train);

  // alert("Train successfully added!");

  $("#train-name").val("");
  $("#train-destination").val("");
  $("#train-time").val("");
  $("#train-frequency").val("");
})

//Add TD's when child is added in Firebase//
database.ref().on("child_added", function(childSnapshot) {
  var childObj = childSnapshot.val();

  var timeDiff = moment().diff(moment.unix(childObj.time), "minutes");
  console.log(timeDiff);

  var trainTimeFormat = moment.unix(childObj.time).format("HH:mm");
  console.log(trainTimeFormat);

  var trainFrequencyFormat = moment.unix(childObj.frequency).format("HH:mm");
  console.log(trainFrequencyFormat);

  console.log(trainFrequency);

  //============================================================================//
  //NEXT ARRIVAL & MINUTES AWAY CALCULATIONS//

  // Assumptions
  var tFrequency = 3;

  // Time is 3:30 AM
  var firstTime = "03:30";

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(trainTimeFormat, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  //============================================================================//

  var newTr = $("<tr>");

  newTr.append("<td>" + childObj.name + "</td>");
  newTr.append("<td>" + childObj.destination + "</td>");
  newTr.append("<td>" + trainFrequencyFormat + "</td>");
  newTr.append("<td>" + nextTrain.format("HH:mm A") + "</td>");
  newTr.append("<td>" + tMinutesTillTrain + "</td>");

  $("#table-body").append(newTr);
})
