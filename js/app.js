// require("!style-loader!css-loader!")
const $=require('jquery')
const firebase=require('firebase')
const geolocation=require('geolocation')
import GeoFire from 'geofire'
const loadGoogleMapsApi = require('load-google-maps-api')
// Initialize Firebase
const config = {
	apiKey: "AIzaSyA-RDsELZOUezaH2q6Ap6uQO-YSR3125gM",
	authDomain: "st-geo.firebaseapp.com",
	databaseURL: "https://st-geo.firebaseio.com",
	projectId: "st-geo",
	storageBucket: "st-geo.appspot.com",
	messagingSenderId: "503980816896"
};
const FBapp = firebase.initializeApp(config);
const fireBaseRefLocations = FBapp.database().ref()
const geoFireLocations = new GeoFire(fireBaseRefLocations)
let geoQuery


const user =prompt('Enter the username')
loadGoogleMapsApi({key:'AIzaSyAo46XYggwHfAJzdlpTQa4cl85ltW3WFkg'}).then((googleMaps)=>{
	"use strict";
	initializeMap(googleMaps)
})

function initializeMap(gMaps) {
	const mapDiv =document.getElementById('map')
	const map= new gMaps.Map(mapDiv,{
		center: new gMaps.LatLng(43.7437,-79.4562),
		zoom:11
	})
	const markers={}
	getCurrentPosition()

	function placeMarker(user,location) {
		var image = {
			url: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/7.png',
			// This marker is 20 pixels wide by 32 pixels high.
			size: new google.maps.Size(20, 20),
			// The origin for this image is (0, 0).
			origin: new google.maps.Point(0, 0),
			// The anchor for this image is the base of the flagpole at (0, 32).
			anchor: new google.maps.Point(0, 20),
			scaledSize: new google.maps.Size(20, 20)
		};
		markers[user]=new gMaps.Marker({
			position:location,
			map:map,
			icon:image,
			title: user,
		})
	}
	function newGeoQuery(location,distance) {
		geoQuery=geoFireLocations.query({center:location,radius:distance})
		geoQuery.on('key_entered',(key,location,distance)=>{
			"use strict";
			placeMarker(key,{lat:location[0],lng:location[1]})
		})
	}
	function getCurrentPosition() {
		geolocation.getCurrentPosition((err,position)=>{
			"use strict";
			if (err) throw err
			geoFireLocations.set(user,[position.coords.latitude,position.coords.longitude]).then(
				newGeoQuery([position.coords.latitude,position.coords.longitude],30000)
			)
		})
	}
}