<script>
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAWb99I0m7qjNXunNUFItACevLwHdSnoOo",
    authDomain: "crawwwldb.firebaseapp.com",
    databaseURL: "https://crawwwldb.firebaseio.com",
    projectId: "crawwwldb",
    storageBucket: "crawwwldb.appspot.com",
    messagingSenderId: "509904224045"
  };

  firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    // // Initial Values
    // var location = "";
    // var crime = "";
    // var year = "";
    // var radius = "";

    // Capture Button Click
    $("#submit").on("click", function(event) {
      event.preventDefault();
      
      // Grabbed values from text-boxes
      location = $("#user-locate").val().trim();
      crime = $("#crime-type-dropdown").val().trim();
      year = $("#year-dropdown").val().trim();
      radius = $("#radius-dropdown").val().trim();

      // Code for "Setting values in the database"
      database.ref().set({
        location: location,
        crime: crime,
        year: year,
        radius: radius
      });

      // // Firebase watcher + initial loader HINT: .on("value")
    database.ref().on("value", function(snapshot) {

      // Log everything that's coming out of snapshot
      console.log(snapshot.val());
      console.log(snapshot.val().location);
      console.log(snapshot.val().crime);
      console.log(snapshot.val().year);
      console.log(snapshot.val().radius);

      // // Change the HTML to reflect
      // $("#user-locate").text(snapshot.val().name);
      // $("#crime-type-dropdown").text(snapshot.val().email);
      // $("#year-dropdown").text(snapshot.val().age);
      // $("#radius-dropdown").text(snapshot.val().comment);

    });
      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

  </script>