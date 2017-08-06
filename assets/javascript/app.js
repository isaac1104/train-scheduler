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

  //Set values from each input field to varibles//
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#train-destination").val().trim();
  var trainTime = moment($("#train-time").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#train-frequency").val().trim();

  //Object called train//
  var train = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
  }

  //Push train object to the Firebase server//
  database.ref().push(train);

  $("#train-name").val("");
  $("#train-destination").val("");
  $("#train-time").val("");
  $("#train-frequency").val("");
})

//Add TD's when child is added in Firebase//
database.ref().on("child_added", function(childSnapshot) {
  var childObj = childSnapshot.val();

  //NEXT ARRIVAL & MINUTES AWAY CALCULATIONS======================================//
  var trainTime = moment($("#train-time").val(), "HH:mm A").format("X");
  var timeDiff = moment().diff(moment.unix(childObj.time), "minutes");
  var timeRemainder = moment().diff(moment.unix(childObj.time), "minutes") % childObj.frequency;
  var trainMinute = childObj.frequency - timeRemainder;
  var nextTrain = moment().add(trainMinute, "m").format("hh:mm A");
  //==============================================================================//

  //Create new table row element//
  var newTr = $("<tr>");

  //Append table details into dynamically created table row//
  newTr.append("<td>" + childObj.name + "</td>");
  newTr.append("<td>" + childObj.destination + "</td>");
  newTr.append("<td>" + childObj.frequency + "</td>");
  newTr.append("<td>" + nextTrain + "</td>");
  newTr.append("<td>" + trainMinute + "</td>");

  //Append dynamically created table row into tbody//
  $("#table-body").append(newTr);
})
