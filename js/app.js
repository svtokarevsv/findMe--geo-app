// require("!style-loader!css-loader!")
const firebase = require('firebase')
const geolocation = require('geolocation')
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
const fireBaseRef= FBapp.database().ref()
const geoFireLocations = new GeoFire(fireBaseRef.child('locations'))
const mapDiv = document.getElementById('map')
let userFriendsLocations
let positionArray
let geoQuery
let localUser
const markers = {}
let map
let gMaps
init()

function showLoginForm() {
	document.getElementById('login-form').classList.remove('hidden')
}

function saveUser(callback) {
	const userName = document.getElementById('userName').value
	if (!userName)return
	localStorage.setItem("user", userName)
	localUser = userName
	document.getElementById('login-form').classList.add('hidden')
	callback()
}

function loadGmapsApi() {
	document.getElementById('find-form').classList.remove('hidden')
	loadGoogleMapsApi({key: 'AIzaSyAo46XYggwHfAJzdlpTQa4cl85ltW3WFkg'}).then((googleMaps) => {
		"use strict";
		initializeMap(googleMaps)
	})
}

function initializeMap(googleMaps) {
	gMaps = googleMaps
	getCurrentPosition()
}
function placeMarker(user, location) {
	markers[user] ? removeMarker(user) : null
	const image = {
		url: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/7.png',
		// This marker is 20 pixels wide by 32 pixels high.
		size: new google.maps.Size(20, 20),
		// The origin for this image is (0, 0).
		origin: new google.maps.Point(0, 0),
		// The anchor for this image is the base of the flagpole at (0, 32).
		anchor: new google.maps.Point(0, 20),
		scaledSize: new google.maps.Size(20, 20)
	};
	markers[user] = new gMaps.Marker({
		position: location,
		map: map,
		icon: image,
		title: user,
	})
}

function removeMarker(user) {
	markers[user].setMap(null)
}

function newGeoQuery(location, distance) {
	geoQuery = userFriendsLocations.query({center: location, radius: distance})
	geoQuery.on('key_entered', (key, location, distance) => {
		"use strict";
		placeMarker(key, {lat: location[0], lng: location[1]})
	})
	geoQuery.on('key_moved', (key, location, distance) => {
		"use strict";
		placeMarker(key, {lat: location[0], lng: location[1]})
	})
	geoQuery.on('key_exited', (key, location, distance) => {
		"use strict";
		removeMarker(key)
	})
}

function getCurrentPosition(isMapInitialized) {
	geolocation.getCurrentPosition((err, position) => {
		"use strict";
		if (err) throw err
		positionArray=[position.coords.latitude, position.coords.longitude]
		geoFireLocations.set(localUser, positionArray).then(() => {
				if (!isMapInitialized) {
					map = new gMaps.Map(mapDiv, {
						center: new gMaps.LatLng(...positionArray),
						zoom: 11
					})
					new GeoFire(geoFireLocations.ref().child(localUser)).set('friends',positionArray).then(()=>{
						userFriendsLocations=new GeoFire(geoFireLocations.ref().child(localUser).child('friends'))
						userFriendsLocations.set(localUser, positionArray).then(function () {
							newGeoQuery(positionArray, 30000)
						})
					})
				}
			}
		)
	})
}
function bindUsers() {
	const friendName = document.getElementById('friendName').value
	if (!friendName)return
	geoFireLocations.get(friendName).then(function (value) {
		if(value){
			userFriendsLocations.set(friendName, value).then(function () {
				new GeoFire(geoFireLocations.ref().child(friendName).child('friends')).set(localUser,positionArray)
			})
			console.log(arguments)
		}

	})
		.catch((err) => alert(err.message))
}
function deleteRecords() {
	geoFireLocations.remove(localUser)
}
function init() {
	initListeners()
	localUser = localStorage.getItem('user')
	if (!localUser) {
		showLoginForm()
	} else {
		loadGmapsApi()
	}
}
function initListeners() {
	for (let form of document.forms) {
		form.addEventListener('submit', function (ev) {
			ev.preventDefault()
			return false
		})
	}
	document.getElementById('login-form').addEventListener('submit', function (ev) {
		saveUser(() => loadGmapsApi())
	})
	document.getElementById('login_submit').addEventListener('click', function (ev) {
		saveUser(() => loadGmapsApi())
	})
	document.getElementById('find_submit').addEventListener('click', bindUsers)
	window.onunload=deleteRecords
}
