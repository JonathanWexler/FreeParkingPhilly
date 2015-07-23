
if (Meteor.isClient) {

  var wednesday = false
  var firstFriday = false;
  Session.set('wednesday', false);
  Session.set('friday', false);
  var inWSpace = false;
  var inFSpace = false;
  var today = new Date();

  console.log("time is: " + today.getHours() + ":" + today.getMinutes());

    // Check if its wednesday
    if(today.getDay() == 3) {
      wednesday = true;
      Session.set('wednesday', true);
    }

    // Check if its the first friday of the month
    if(today.getDay() == 5 && today.getDate() <= 7) {
      Session.set('friday', 'true');
      firstFriday = true;
    } 


    Meteor.startup(function() {

    // Load Google maps with shapes and places libraries
    GoogleMaps.load({
      libraries: 'geometry,places'
    }); 
  });

    Template.body.helpers({
      mapOptions: function() {

    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          // Center the map around Philly (philly parking)
          center: new google.maps.LatLng(39.954490, -75.162848),
          zoom: 14

        };
      }
    }
  });

    Template.body.onCreated(function() {


    });

    Template.parking.onRendered(function(){
          // We can use the `ready` callback to interact with the map API once the map is ready.
          GoogleMaps.ready('phillyParkingMap', function(map) {

    // Coordinates for the space in which parking is free in Philly on wednesdays
    var centerCityCoord = [
    new google.maps.LatLng(39.940033, -75.144251),
    new google.maps.LatLng(39.960249, -75.137034),
    new google.maps.LatLng(39.961590, -75.148968),
    new google.maps.LatLng(39.964582, -75.179238),
    new google.maps.LatLng(39.957074, -75.178507),
    new google.maps.LatLng(39.945181, -75.185884),
    new google.maps.LatLng(39.940033, -75.144251)
    ];

    var cityPath = new google.maps.Polyline({
      path: centerCityCoord,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map.instance
    });

    var oldCityCoord = [
    new google.maps.LatLng(39.957043, -75.139800),
    new google.maps.LatLng(39.946537, -75.142683),
    new google.maps.LatLng(39.947576, -75.149588),
    new google.maps.LatLng(39.958083, -75.147423),
    new google.maps.LatLng(39.957043, -75.139800)
    ];

    var cityPath = new google.maps.Polyline({
      path: oldCityCoord,
      geodesic: true,
      strokeColor: '#0099FF',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map.instance
    });

    var cityParkingSpace = new google.maps.Polygon({
      paths: centerCityCoord
    });
    var oldCityParkingSpace = new google.maps.Polygon({
      paths: oldCityCoord
    });

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
         position.coords.longitude);

        var infowindow = new google.maps.InfoWindow({
          map: map.instance,
          position: pos,
          content: 'You are here.'
        });

        Session.set('result', 'may or may not');

        if (google.maps.geometry.poly.containsLocation(pos, cityParkingSpace)) {
          console.log('IN AREA wednesday');
          inWSpace = true;
        } else {
          console.log('NOT IN AREA WED ' + wednesday);
          inWSpace = false;
        }

        if (google.maps.geometry.poly.containsLocation(pos, oldCityParkingSpace)) {
          console.log('IN AREA FRI ' + firstFriday);
          inFSpace = true;
        } else {
          console.log('NOT IN AREA FRI ' + firstFriday);
          inFSpace = false;
        }

        if ((firstFriday && inFSpace) || (wednesday && inWSpace)) {
          Session.set('result', 'CAN');
        } else {
          Session.set('result', 'CANNOT');
        }

      }, function() {
      // handleNoGeolocation(true);
    });
} else {
    // Browser doesn't support Geolocation
    // handleNoGeolocation(false);
  }

});
});


Template.parking.helpers({
  result: function () {
    // return ((firstFriday && inFSpace) || (wednesday && inWSpace)) ? "CAN" : "CANNOT";
    return Session.get('result');
  }
});

Template.info.helpers({
  info: function () {
    console.log(Session.get('wednesday'));
    return Session.get('wednesday') || Session.get('friday');
  },
  today: function () {
    return today.getMonth() + " " + today.getDate();
  },
  oneDay: function () {
    if (((3 - today.getDay()) == 1) || ((5 - today.getDay()) == 1) && today.getDate()+1 <= 7) {
      return true;
    } else {
      return false;
    }
    
  }
});

Template.registerHelper('nextTime', function() {

  var wendesDate = new Date(today.getTime());
  var friDate = new Date(today.getTime());

  wendesDate.setDate(today.getDate() + (7 + 3 - today.getDay()) % 7);
  friDate.setDate(today.getDate() + (7 + 5 - today.getDay()) % 7);

  var d = friDate < wendesDate ? (friDate <= 7 ? friDate : wendesDate) : wendesDate;

  dateString=new Date(d).toUTCString();
  return dateString.split(' ').slice(0, 4).join(' ');

});
Template.registerHelper('color', function() {
  // return ((firstFriday && inFSpace) || (wednesday && inWSpace)) ? 'green' : 'blue';
  return ((Session.get('friday') || (Session.get('wednesday')) ? 'green' : 'blue';

});
Template.registerHelper('beforeFive', function() {
  return today.getHours() < 17 ? true : false;
});

Template.registerHelper('timer', function() {
  var hour = today.getHours()+1;
  var min = today.getMinutes();
  var time = "";
  if (17-hour > 0) {
    if (17-hour == 1) {
      time = "1 hour and ";
    } else {   
      time =  17-hour + " hours and ";
    }
    if (min+1 == 60) {
      time += "1 minute";
    } else {
      time += 60-min + " minutes";
    } 
  }
  return time;

});

Template.info.events({
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
