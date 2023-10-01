import { View, Text, TextInput, Image, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import React from "react";
import appTexts from "../model/appTexts";
const image1 = require('../assets/waiting.png')



export default function Loading() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const auth = getAuth()

  const checkLog =  () => {
    // auth.currentUser?.displayName ? navigation.navigate("home") : navigation.navigate("SignIn")
    onAuthStateChanged(auth, (user) => {
      let counter = 0
     const interval =  setInterval(()=>{
        if (appTexts.home){
          clearInterval(interval);
      if (user?.displayName && user.displayName!="") {
        navigation.navigate("home")
        // console.log("uid" + auth.currentUser?.uid);
        // auth.currentUser?.getIdToken().then((resp)=>console.log("token"+ resp))
      } 
      else if (!user) {
        navigation.navigate("SignIn")
      }
  }else{
    counter >= 20 && alert("יש בעיה עם החיבור לאינטרנט. סגור את האפליקציה ופתח מחדש")
    counter++
  }},500)})}
    // auth.onAuthStateChanged(function (user) {
    //   if (user) {
    //     navigation.navigate("home")
    //   }
    //   if (!user) {
    //     navigation.navigate("SignIn")
    //   }
    // })


  useEffect(() => {
    // navigation.addListener('state', () => {
    //   console.log(navigation.getId())
    // });
    console.log(auth.currentUser?.displayName)
    checkLog()
    // auth.currentUser ? navigation.navigate("home") : navigation.navigate("SignIn")
  }, [])

  return (
    <View style={styles.container}>
      <Image
        source={image1}
        style={{ width: '100%', borderRadius: 15, height: '100%' }}
      />
      <Text style={styles.text}>טוען...</Text>  
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    margin: '5%',
    width: '90%',
    height: '50%',
    marginTop: '10%',
    backgroundColor: 'cadetblue',
    borderRadius:20,

  },
  text: {
    textAlign: 'center',
    fontSize: 40,
    margin: 20,
  }
});
