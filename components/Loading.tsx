import { View, Text, TextInput, Image, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
const image1 = require('../assets/waiting.png')


interface successScreen {
  text: string | undefined;
  closeDialog: Function;
  isGameFinished: Boolean;
}


export default function Loading() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const auth = getAuth()
  const checkLog = async()=>{

    auth.onAuthStateChanged(function(user) {
        if (user) {
            navigation.navigate("Games")
        }
        if (!user){
          navigation.navigate("SignIn")
        }
      })
    }

            
useEffect(() => {
    checkLog()
}, [])

  return (
    <View style={styles.container}>
      {/* <View style={styles.container}> */}
        {/* <Text style={{ fontSize: 40, textAlign: 'center', borderBottomColor: 'cadetBlue', borderBottomWidth: 2, marginBottom: 15 }}>{!props.isGameFinished ? 'כל הכבוד, תשובה נכונה' : 'כל הכבוד'}</Text> */}
        <Image
          source={image1}
           style={{ width: '100%' ,  borderRadius: 15,height:'100%' }} 
         /> 
        <Text style={styles.text}>טוען...</Text>
        {/* <View> */}
        {/* </View> */}
      {/* </View> */}
     </View>
  )

}

const styles = StyleSheet.create({
  container: {
    margin:10,  
    width:'90%',
    height:'50%',
    marginTop:40,
    backgroundColor:'cadetblue'

  },
  text:{
    textAlign:'center',
    fontSize:40,
    margin:20,
  }
 });
