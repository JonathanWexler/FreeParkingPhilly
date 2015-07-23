if (Meteor.isClient) {


  Meteor.startup(function() {
    GoogleMaps.load({libraries: 'geometry,places'});
  });

  Template.body.helpers({
    exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(39.954490, -75.162848),
          zoom: 14

        };
      }
    }
  });

  // Template.body.onCreated(function() {
  //   console.log("GOT OK");

  //   // We can use the `ready` callback to interact with the map API once the map is ready.
  //   GoogleMaps.ready('phillyMap', function(map) {
  //     console.log("GOT HERE1");

  //     // Add a marker to the map once it's ready
  //     var marker = new google.maps.Marker({
  //       position: map.options.center,
  //       map: map.instance
  //     });

  //     console.log("GOT HERE2");

  //     var flightPlanCoordinates = [
  //     new google.maps.LatLng(37.772323, -122.214897),
  //     new google.maps.LatLng(21.291982, -157.821856),
  //     new google.maps.LatLng(-18.142599, 178.431),
  //     new google.maps.LatLng(-27.46758, 153.027892)
  //     ];
  //     console.log("GOT HERE");

  //     var flightPath = new google.maps.Polyline({
  //       path: flightPlanCoordinates,
  //       geodesic: true,
  //       strokeColor: '#FF0000',
  //       strokeOpacity: 1.0,
  //       strokeWeight: 2
  //     });

  //     flightPath.setMap(phillyMap.instance);
  //   });
  //   console.log("GOT HERE4");

  // });
  Template.body.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {

    var flightPlanCoordinates = [
    new google.maps.LatLng(39.940133, -75.144269),
    new google.maps.LatLng(39.960133, -75.137084),
    new google.maps.LatLng(39.964582, -75.179238),
    new google.maps.LatLng(39.945242, -75.185762),
    new google.maps.LatLng(39.940133, -75.144269)
    ];

    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map.instance
    });

    var parkingSpace = new google.maps.Polygon({
      paths: flightPlanCoordinates
    });
    var result = 'blue';

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
         position.coords.longitude);

        var infowindow = new google.maps.InfoWindow({
          map: map.instance,
          position: pos,
          content: 'You are here.'
        });
        console.log("found it");
        Session.set('result', 'PENDING');
        if (google.maps.geometry.poly.containsLocation(pos, parkingSpace)) {
          result = 'red';
          Session.set('result', 'CAN');
        } else {
          result = 'green';
          Session.set('result', 'CANNOT');
        }

      // map.instance.setCenter(pos);
    }, function() {
      // handleNoGeolocation(true);
    });
    } else {
    // Browser doesn't support Geolocation
    // handleNoGeolocation(false);
  }
console.log(result);


});
});





// MAPS End







  // counter starts at 0
  // Session.setDefault('counter', 0);

  Template.parking.helpers({
    result: function () {
      return Session.get('result');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
