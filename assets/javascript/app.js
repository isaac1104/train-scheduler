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

    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#train-destination").val().trim();
    var trainTime = moment($("#train-time").val()).format("HH:mm");
    var trainFrequency = $("#train-frequency").val().trim();

    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(trainFrequency);

    var train = {
      name: trainName,
      destination: trainDestination,
      time: trainTime,
      frequency: trainFrequency
    }

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
    var nextArrival = childObj.time + childObj.frequency;

    var newTr = $("<tr>");

    newTr.append("<td>" + childObj.name + "</td>");
    newTr.append("<td>" + childObj.destination + "</td>");
    newTr.append("<td>" + childObj.frequency + "</td>");
    newTr.append("<td>" + nextArrival + "</td>");
    newTr.append("<td>");

    $("#table-body").append(newTr);
  })
