    // ------------------------------------ VARIABLES: ----------------------------------------

    var crimeOptions = ["ARSON","ASSAULT","BATTERY","BURGLARY","CONCEALED CARRY LICENSE VIOLATION","CRIMINAL SEXUAL ASSAULT","CRIMINAL DAMAGE","CRIMINAL TRESPASS","DECEPTIVE PRACTICE","HOMICIDE","INTERFERENCE WITH PUBLIC OFFICER","KIDNAPPING","MOTOR VEHICLE THEFT","NARCOTICS","OFFENSE INVOLVING CHILDREN","OTHER OFFENSE","PROSTITUTION","PUBLIC PEACE VIOLATION","ROBBERY","SEX OFFENSE","THEFT","WEAPONS VIOLATION"];
    var radiusOptions = [.5,1,2,3];
    var currentDate = new Date();

    // Radius in meters:
    var radius = 100;
    var latitude;
    var longitude;
    var selectedYear = "Any"
    var selectedType = "Any"
    var gmarkers = [];
    var selectedAddress; 
    var queryURL;


    // ------------------------------------ FUNCTIONS: ----------------------------------------

    //Builds drop down options:
    function buildDropDownOptions() {

        // Build dropdown options for Type of Crime
        for(var j = 0; j < crimeOptions.length; j++) {

            var newOption = $('<option>')
            newOption.html(crimeOptions[j])
            newOption.attr("value", crimeOptions[j])
            $("#type-dropdown").append(newOption)
        }

        // Build dropdown options for Year
        for(var j = 2001; j <= currentDate.getFullYear(); j++) {

            var newOption = $('<option>')
            newOption.html(j)
            newOption.attr("value", j)
            $("#year-dropdown").append(newOption)
        }

        // Build dropdown options for Radius
        for(var j=0; j < radiusOptions.length; j++) {

            var newOption = $('<option>')
            newOption.html(radiusOptions[j] + " miles")
            newOption.attr("value", radiusOptions[j]*1609.34)
            $("#radius-dropdown").append(newOption)
        }
    };

    // Creates map:

        //Places Map with wither proper center, zoom, and style (NV)
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: new google.maps.LatLng(41.8781, -87.6298),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles:
            [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [

                {
                    "color": "#ffffff"
                }

                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 13
                },
                {
                    "visibility": "off"

                }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                {
                    "color": "#000000"
                }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                {
                    "color": "#144b53"
                },
                {
                    "lightness": 14
                },
                {
                    "weight": 1.4
                }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                {
                    "color": "#08304b"
                }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [

                {
                    "color": "#0c4152"
                },
                {
                    "lightness": 5
                },

                {
                    "color": "#0c4152"
                },
                {
                    "lightness": 5

                },
                {
                    "visibility": "off"

                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                {
                    "color": "#000000"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                {
                    "color": "#0b434f"
                },
                {
                    "lightness": 25
                }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                {
                    "color": "#000000"
                }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [
                {
                    "color": "#0b3d51"
                },
                {
                    "lightness": 16
                }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#000000"
                }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [

                {
                    "color": "#146474"
                },

                {
                    "color": "#51c9e1"
                }

                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                {
                    "color": "#021019"
                }
                ]
            }
            ]
        });

        var infowindow = new google.maps.InfoWindow();

        var marker, i;

    // This function removes markers on the map:
    function removeMarkers() {
        for( i = 0; i < gmarkers.length; i++){
            gmarkers[i].setMap(null);
        }
    };

    // Returns lat / long based on user input and subsequently calls createQueryURL and Ajax:
    function returnLatLong() {

        removeMarkers();

        selectedAddress = $("#user-locate").val().trim()

        console.log("You are searching for: " + selectedAddress)

        var latLongQuery = "https://maps.googleapis.com/maps/api/geocode/json?address=" + selectedAddress + "&key=AIzaSyAeLu14HV0oKo1YYiceQ30EIFOGuBJtvXk"

        $.ajax({
            url: latLongQuery,
            method: "GET"
        }).done(function(response) {  

            longitude = response.results[0].geometry.location.lng;
            latitude = response.results[0].geometry.location.lat;

            console.log("Longitude of search: " + longitude);
            console.log("Latitude of search: " + latitude);

        createQueryURL()
        ajax()

    });

      

    };

    //Set the queryURL for the upcoming Ajax request depending on the selections

    function createQueryURL(){
        if(selectedYear === 'Any' & selectedType === 'Any'){
            console.log("both Null")
            queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")"
        }
        else if(selectedYear!= 'Any' & selectedType === 'Any'){
                    console.log("year not Null")

            queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")&year=" + selectedYear; 
        }
        else if (selectedYear ==='Any' & selectedType != 'Any'){

            console.log("crime not Null")
            queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")&primary_type="+selectedType
        }
        else if (selectedYear !='Any' & selectedType != 'Any'){
            console.log("niether are null")
            queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")&year=" + selectedYear + "&primary_type="+ selectedType
        }
        else{
            console.log('errors')
            
        }
    }


    //produce a list of crimes with the indicated values from the queryURL
    function ajax() {

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {


            console.log(response);

            for (var i = 0; i < response.length; i++) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(response[i].latitude, response[i].longitude),
                    map: map
                });
                gmarkers.push(marker);

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent(
                            "<div class = 'infoBox'>"
                            + "<h4>"
                            + response[i].primary_type
                            + "</h4><br>"
                            + moment(response[i].date).format("MMMM D YYYY")
                            + "<br><br> <a href= 'https://new.tipsubmit.com/#/submit-tip/ChicagoPD' target='_blank' class='btn'> Submit a tip </a> </p>"  );
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            };
        });
    }




    
    // ------------------------------------ MAIN CODE: ----------------------------------------
$( document ).ready(function() {

    buildDropDownOptions();

    // When the user presses the submit button:
    $("#submit").on("click", function() {
        returnLatLong()
    });


    $("#year-dropdown").on("change", function(){
        returnLatLong()
    })

    $("#type-dropdown").on("change", function(){
        selectedType = $("#type-dropdown :selected").attr("value");
        returnLatLong()
    })

    $("#radius-dropdown").on("change", function(){
        radius = $("#radius-dropdown :selected").attr("value");
        returnLatLong()
    })

});

    // // When the user selects a year from the drop down:
    // $("#year-dropdown").on("change", function() {

    //     selectedYear = $("#year-dropdown :selected").attr("value");
    //     selectedType = $("#type-dropdown :selected").attr("value");
    //     console.log(selectedType, selectedYear);

    //     if (selectedYear !== "Any") {

    //         if (selectedType === "Any") {
    //             console.log("Showing ALL crimes in this area from " + selectedYear);
    //             queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")&year=" + selectedYear;
    //             removeMarkers();
    //             ajax();
    //         } else {
    //             console.log("Showing crimes in this area from " + selectedYear + " of the type: " + selectedType);
    //             queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")&year=" + selectedYear + "&primary_type=" + selectedType;
    //             removeMarkers();
    //             ajax();
    //         }

    //     } else {

    //         if (selectedType === "Any") {
    //             console.log("Showing ALL crimes in this area since 2001");
    //             queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")";
    //             removeMarkers();
    //             ajax();
    //         } else {
    //             console.log("Showing crimes of the type: " + selectedType + " since 2001");
    //             queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")&primary_type=" + selectedType;
    //             removeMarkers();
    //             ajax();
    //         }}
    //     });

    // // When the user selects a type from the drop down:
    // $("#type-dropdown").on("change", function() {

    //     selectedYear = $("#year-dropdown :selected").attr("value");
    //     selectedType = $("#type-dropdown :selected").attr("value");
    //     console.log(selectedType, selectedYear);

    //     if (selectedType !== "Any") {

    //         if (selectedYear === "Any") {
    //             console.log("Showing ALL crimes in this area with the type: " + selectedType);
    //             queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")&primary_type=" + selectedType;
    //             removeMarkers();
    //             ajax();
    //         } else {
    //             console.log("Showing crimes in this area from " + selectedYear + " of the type: " + selectedType);
    //             queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")&year=" + selectedYear + "&primary_type=" + selectedType;
    //             removeMarkers();
    //             ajax();
    //         }

    //     } else {

    //      if (selectedYear === "Any") {
    //         console.log("Showing ALL crimes in this area since 2001");
    //         queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")";
    //         removeMarkers();
    //         ajax();
    //     } else {
    //         console.log("Showing crimes in this area from " + selectedYear + " of any type");
    //         queryURL = "https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=within_circle(location,%20" + latitude + ",%20" + longitude + ",%20" + radius + ")&year=" + selectedYear;
    //         removeMarkers();
    //         ajax();
    //     }

    // }
    // });

    //Custom styling for info window
        google.maps.event.addListener(infowindow, 'domready', function() {

           // Reference to the DIV which receives the contents of the infowindow using jQuery
           var iwOuter = $('.gm-style-iw');

           var divMapstyle = $('.gm-style')
           /* The DIV we want to change is above the .gm-style-iw DIV.
            * So, we use jQuery and create a iwBackground variable,
            * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
            */
           var iwBackground = iwOuter.prev();
           divMapstyle.children(':nth-child(1)').style({'background-color' : 'grey !important'});
           // Remove the background shadow DIV
           iwBackground.children(':nth-child(2)').css({'display' : 'none'});

           // Remove the white background DIV
           iwBackground.children(':nth-child(4)').css({'display' : 'none'});


        });