import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

function MyLocation() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");
  

  useEffect(() => {
    setInterval(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      console.log(Location)
      })();

    }, 2000)

  }, []);


  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location.coords.longitude);
    text += " " + JSON.stringify(location.coords.latitude);
    console.log(text)
  }
  return text
}

async function getLocation(): Promise<Location.LocationObject> {
  // const [location, setLocation] = useState<Location.LocationObject>();
  let myLocation:Location.LocationObject;
   myLocation = await Location.getCurrentPositionAsync({});
  return myLocation
}

async function getDistanceFromLatLonInKm(lat2: number, lon2: number,location?: Location.LocationObject) {
  // console.log("first")
  location? location :location = await Location.getCurrentPositionAsync({});
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - location!.coords.latitude);  // deg2rad below
  var dLon = deg2rad(lon2 - location!.coords.longitude);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(location!.coords.latitude)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  // console.log("after")
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}


export default {
  getDistanceFromLatLonInKm,
  MyLocation,
  getLocation
}