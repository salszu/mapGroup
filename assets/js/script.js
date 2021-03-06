// this is a test for branches

var map;

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map-div'), {
	center: {lat: 40.277187, lng: -75.914540},
	scrollwheel: true,
	zoom: 8
  });

  var infowindow = new google.maps.InfoWindow();



function fqAnswer() {
	$('#fq-text').text('search a city, filter the resutlts, upvote or downvote your favorites');
	setTimeout(function(){
		$('#fq-text').text('');
	}, 5000);
}



var styles = [
  {
    stylers: [
      { hue: "" }
      // { saturation: -20 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [
      // { visibility: "off" }
    ]
  }
];

map.setOptions({styles: styles});



}

/* ---  --- */

$(document).ready(function(){

	var searchIcon = $('#search-icon');
	var menuIcon = $('#menu-icon');
	var refreshIcon = $('#refresh');
	var mapDiv = $('#mapdiv');
	var searchDiv = $('#search-div');
	var inputDiv = $('#fq-search');


	var wHidden = true;

	dropIcon.click(function(){

		if(wHidden == true) {
			dropIcon.toggleClass('rotate');
			wHidden = false;
		}
		else {
			dropIcon.toggleClass('rotate');
			wHidden = true;
		}

	});

	var cWidth = $(window).width();

	if(cWidth <= 992) {
		setTimeout(function(){
			mapDiv.hide();
		},500);
	}


	searchIcon.click(function(){
		mapDiv.hide('fast');
		searchDiv.show('fast');
		inputDiv.show('fast');
		refreshIcon.hide('fast');
	});

	menuIcon.click(function(){
		mapDiv.show('fast');
		searchDiv.hide('fast');
		inputDiv.hide('fast');
		refreshIcon.show('fast');
	});

	refreshIcon.click(function(){
		map.setZoom(5);
	});

	$(window).resize(function(){

	  var cWidth = $(window).width();

	  if(cWidth > 992) {
		mapDiv.show();
		searchDiv.show();
		inputDiv.show();
		refreshIcon.show();
	  }

	})

});

// Main Angular Application
var App = angular.module("myApp", []);

// Master Angular Controller
App.controller('masterCtrl', function($scope) {

  $(document).keyup(function(e){

    if( e.keyCode == 13 ) {
      if( $('#query').is(':focus') || $('#query-city').is(':focus') ){
        $scope.loadPlaces();
      }
    }
  });

	//	Loads FourSquare from user input
	$scope.loadPlaces = function() {

		console.log("Load Places Clicked");

		var query = "pizza";
		var City = $('#query-city').val();

		//Checking Inputs

		if(City == '') {
			alert('City field is/was left blank. Please input a valid location.');
			return;
		};

    $scope.q1 = query + ' in ';
    $scope.q2 = City;

		
		var apiURL = 'https://api.foursquare.com/v2/venues/search?client_id=N1IAMKZUIK1AUHKRFGFBKPQ2YKDSBAKS4NTER5SYZN5CROR1&client_secret=4MKLXVLU2FGZQVRMAEDC15P0TFJGSCY3ZUYUZ0KHQQQLQ5R3&v=20130815%20&limit=1000&near=' + City + '&query=' + query + '';
		console.log(apiURL);

		$scope.places = [];

		$.getJSON(apiURL, function(data) {
			console.log(data);

			var venues = data.response.venues.length;

			//Refreshes Map
			map = new google.maps.Map(document.getElementById('map-div'), {
				center: {lat: data.response.venues[1].location.lat, lng: data.response.venues[1].location.lng},
				scrollwheel: true,
				stylers: [ { "visibility": "simplified" } ],
				zoom: 9
			});








		  // Loops through JSON and saves data
			for ( var i = 0; i < venues; i++ ) {

				var venue = data.response.venues[i];

				if (venue.location.address == undefined) {
          continue;
        }

				//Adds places to array
				$scope.places.push({
					placeName: venue.name,
					placeID: venue.id,
					placeCity: venue.location.city,
					placeState: venue.location.state,
					placeLat: venue.location.lat,
					placeLng: venue.location.lng,
				})

			}

			$scope.addMarker($scope.places);
			console.log('done push');
			$scope.$apply(function () {
				console.log($scope.places);
			});

		});

		

		$('#dropdown-icon').show('fast');
    
    $('#query-city').val('');
	}

	$scope.mapMarkers = [];

	$scope.addMarker = function(array) {

		$.each(array, function(index, value) {

			var infowindow = new google.maps.InfoWindow();

			var infoBox = '<div class="gmData" style="padding: 10px;">' + 
			'<h4>' + value.placeName + '</h4>'  + 
			'<p>' + value.placeCity + ', ' + value.placeState 
			+ '</p>' + '<br>' + '<strong><i class="fa fa-thumbs-up" aria-hidden="true"></i><i class="fa fa-thumbs-down" aria-hidden="true"></i></strong>'
      +'</div>';

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(value.placeLat, value.placeLng),
				title: value.placeName,
				id: value.placeID,
				animation: google.maps.Animation.DROP,
				map: map
			});

			marker.addListener('click', function() {
				console.log('Marker Animation');
				if (marker.getAnimation() !== null) {
					marker.setAnimation(null);
				}
				else {
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
				setTimeout(function() {
					marker.setAnimation(null)
				}, 1500);
			});

			$scope.mapMarkers.push({
				marker: marker,
				content: infoBox
			});

			google.maps.event.addListener(marker, 'click', function() {
				console.log('click function working');
				infowindow.setContent(infoBox);
				map.setZoom(13);
				map.setCenter(marker.position);
				infowindow.open(map, marker);
				map.panBy(0, -125);
			});
		});
	}



	$scope.showMarker = function(string) {

		console.log(string);
		var infowindow = new google.maps.InfoWindow();
		var clickedItem = string.place.placeID;

		for (var key in $scope.mapMarkers) {
			if (clickedItem === $scope.mapMarkers[key].marker.id) {
				map.panTo($scope.mapMarkers[key].marker.position);
				map.setZoom(13);
				infowindow.setContent($scope.mapMarkers[key].content);
				infowindow.open(map, $scope.mapMarkers[key].marker);
				map.panBy(0, 125);
			}
		}
	}



	$scope.filterResults = function() {

		var input = $('#place-filter').val().toLowerCase();
		console.log(input);
		var list = $scope.places;
		if (input == '' || !input) {
			$.each($scope.mapMarkers, function(index, item){
				$scope.mapMarkers[index].marker.setMap(map);
			})
			return;
		}
    else {
			for (var i = 0; i < list.length; i++) {
				if (list[i].placeName.toLowerCase().indexOf(input) != -1) {
					$scope.mapMarkers[i].marker.setMap(map);
				}
				else {
					$scope.mapMarkers[i].marker.setMap(null);
			  }
			}
		}
	}

	$scope.showMessage = function() {
		console.log("MouseOver Working.");

		$('#fq-text').text('Click any list item to show its location on the map.');
		setTimeout(function(){
			$('#fq-text').text('');
		}, 3000);
	}
});



function fqAnswer() {
	$('#fq-text').text('search a city, filter the resutlts, upvote or downvote your favorites');
	setTimeout(function(){
		$('#fq-text').text('');
	}, 5000);
}




