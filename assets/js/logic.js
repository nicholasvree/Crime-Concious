    // ------------------------------------ VARIABLES: ----------------------------------------

    var crimeOptions = ["ARSON","ASSAULT","BATTERY","BURGLARY","CONCEALED CARRY LICENSE VIOLATION","CRIMINAL SEXUAL ASSAULT","CRIMINAL DAMAGE","CRIMINAL TRESPASS","DECEPTIVE PRACTICE","HOMICIDE","INTERFERENCE WITH PUBLIC OFFICER","KIDNAPPING","MOTOR VEHICLE THEFT","NARCOTICS","OFFENSE INVOLVING CHILDREN","OTHER OFFENSE","PROSTITUTION","PUBLIC PEACE VIOLATION","ROBBERY","SEX OFFENSE","THEFT","WEAPONS VIOLATION"];
    var radiusOptions = [1,2,3];
    var currentDate = new Date();

    // Radius in meters:
    var radius = 804.672;
    var latitude;
    var longitude;
    var selectedYear = "Any"
    var selectedType = "Any"
    var gmarkers = [];
    var selectedAddress; 
    var queryURL;

    $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('#modal1').modal();
    $('#modal2').modal();
    $('#modal3').modal();
});

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

            console.log(response.results[0]);

            if (response.results[0] === undefined) {
                console.log("map found nothing");
                $('#modal1').modal('open');
            }

            longitude = response.results[0].geometry.location.lng;
            latitude = response.results[0].geometry.location.lat;

            console.log("Longitude of search: " + longitude);
            console.log("Latitude of search: " + latitude);

            // Longitude west border: -87.774458697 (smaller number)
            var westlng = -87.774458697
            // Longitude east border: -87.524543633 (bigger number)
            var eastlng = -87.524543633
            // Latitude north border: 42.018900266
            var northlat = 42.018900266
            // Latitude sourth border: 41.645075822
            var southlat = 41.645075822

            if ((longitude >= westlng) && (longitude <= eastlng) && (latitude >= southlat) && (latitude <= northlat)) {
               createQueryURL();
               ajaxCrimePull();
           } else {
            console.log("Not in range!");
            $('#modal2').modal('open');
        }
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
    function ajaxCrimePull() {

       var zoomLevel =12; 

       if (radius < 1600){
        zoomLevel = 15
    }
    else if (radius < 3200){
        zoomLevel = 14
    }
    else if (radius < 4800){
        zoomLevel = 13
    }
    else{
        zoomLevel = 12
    }

    console.log(zoomLevel)

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoomLevel,
        center: new google.maps.LatLng(latitude, longitude),
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

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {


            //Map the inputted location with a blue marker
            var homeMarkerImage = 'assets/images/star.png'
            var maker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: map,
                icon: homeMarkerImage
            });

            // If the search returns no results:
            console.log(response);

            if (response[0] === undefined) {
                console.log("No results");
                console.log(selectedAddress);
                console.log(selectedYear);
                if (selectedYear === "Any") {
                $('#modal3p').html("It looks like there have been no crimes of the type: " + selectedType + " around " + selectedAddress + " since 2001.");
                } else {
                $('#modal3p').html("It looks like there were no crimes of the type: " + selectedType + " around " + selectedAddress + " in " + selectedYear + ".");                    
                }
                $('#modal3').modal('open');
            }

            //Map the crime locations results (using default marker icon)
            for (var i = 0; i < response.length; i++) {

                marker = new google.maps.Marker({
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
                            + "</h4><br> Date: "
                            + moment(response[i].date).format("MMMM D YYYY")
                            + "</h4><br> Block: "
                            + response[i].block
                            + "</h4><br>"
                          );
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

        // If user hits enter in the input field:
        $("#user-locate").keypress(function(e) {
            if (e.keyCode === 13) {
                returnLatLong()
            }
        });

        $("#year-dropdown").on("change", function(){
            selectedYear = $("#year-dropdown :selected").attr("value");
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
           // Remove the background shadow DIV

        //divMapstyle.children(':nth-child(1)').style({'background-color' : 'grey !important'});

        iwBackground.children(':nth-child(2)').css({'display' : 'none'});

           // Remove the white background DIV
           iwBackground.children(':nth-child(4)').css({'display' : 'none'});

       });

});