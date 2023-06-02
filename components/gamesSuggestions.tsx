import { View, Text, StyleSheet} from "react-native";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import React from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import fireBase from "../fireBase";


export default function GamesSuggestions() {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const auth = getAuth()

            
useEffect(() => {
  const uid = auth.currentUser?.uid;
}, [])

  return (
    <View style={styles.container}>
      <Text></Text>
        <Text style={styles.header}>אהלן {auth.currentUser?.displayName}</Text>
        <Text style={styles.text}>בקרוב יופיעו כאן משחקים שניתן לשחק בדרך, בעיקר בנסיעות</Text>
     </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width:'90%',
    height:'80%',
    margin:'5%',
    marginTop:'10%',
    borderColor:'cadetblue',
    borderWidth:4,
    borderRadius:10,

  },
  text:{
    textAlign:'center',
    fontSize:20,
    margin:20,
    fontFamily:'Inter-Black',
    lineHeight:25,
  },
  header:{
    fontWeight:'bold',
    color:'cadetblue',
    textAlign:'center',
    fontSize:40,
    margin:20,
    fontFamily:'Inter-Black'

  }
 });
