$(document).ready(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCIcWl8IVu6cWj2NWRd1xDAwLbk_N9n3HE",
    authDomain: "trainschedule-7f986.firebaseapp.com",
    databaseURL: "https://trainschedule-7f986.firebaseio.com",
    projectId: "trainschedule-7f986",
    storageBucket: "trainschedule-7f986.appspot.com",
    messagingSenderId: "282817367008"
};

firebase.initializeApp(config);

var database = firebase.database();

// initial values
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = "";

// Adds Info to Firebase
$("#addTrain").on("click", function(event) {
    event.preventDefault();
    console.log("button working");

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();
    console.log("input added");

    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTrainConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var newNextTrain =  moment(nextTrain).format("hh:mm");
    console.log("Next train is: " + newNextTrain);

    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        newNextTrain: newNextTrain,
        tMinutesTillTrain: tMinutesTillTrain,
    });
});

database.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {
    $("#tableInput").append(
        "<tr>" +
        "<td>" + snapshot.val().trainName + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + snapshot.val().frequency + "</td>" +
        "<td>" + snapshot.val().newNextTrain + "</td>" +
        "<td>" + snapshot.val().tMinutesTillTrain + "</td>" +
        "</tr>");

    // Error Handler
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

});