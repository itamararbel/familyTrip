import React from 'react'
import {SafeAreaView, StyleSheet, View,Text, Button } from 'react-native'
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import MyLocation from './MyLocation';

// interface props {
//     submitLocation:(longitude:number,latitude:number)=>void
// }
const latitudeDelta = 0.025
const longitudeDelta = 0.025

export default class LocationPicker extends React.Component  {    
  
  state = {
    region: {
      latitudeDelta,
      longitudeDelta,
      latitude: 32.1948475,
      longitude: 34.890000
    }
  }

  onRegionChange = (region:any) => {
    this.setState({
      region
    })
  }
 handleChoose = ()=>{
    console.log(this.state.region.latitude)
    console.log(this.state.region.longitude)
 }
  
  render() {
    const { region } = this.state
    MyLocation.getLocation().then((location)=>{
        const newState = {...region}
        newState.latitude= location.coords.latitude;
        newState.longitude = location.coords.longitude
        this.setState({
            newState
        })
    })

    return (
      <View style={styles.map}>
        <MapView
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={this.onRegionChange}
        />
        <View style={styles.markerFixed}>
          <Ionicons name="location-sharp" size={24} color="black" />
        </View>
        <SafeAreaView style={styles.footer}>
          <Text>רוחב:{region.latitude} אורך:{region.longitude}</Text>
        </SafeAreaView>
        <Button title="בחר" onPress={this.handleChoose}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    height:'100%',
    // flex: 1
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%'
  },
//   marker: {
//     height: 48,
//     width: 48
//   },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    position: 'absolute',
    width: '100%'
  },
  region: {
    color: '#fff',
    lineHeight: 20,
    margin: 20
  }
})