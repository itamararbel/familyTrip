import { View, Text, StyleSheet, FlatList, Button} from "react-native";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import React from "react";
import { Timestamp, doc, getDoc, getFirestore, runTransaction } from "firebase/firestore";
import fireBase from "../fireBase";
import { Checkbox } from "react-native-paper";

interface props {
    isMenu : (show:boolean)=>void
}
export default function Disclaimer(props:props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const auth = getAuth()
  const db = getFirestore(fireBase);
  const [disclaimer, setDisclaimer]= useState([])
  const [approved, setApproved]= useState(false)

            
useEffect(() => {
    props.isMenu(false)
    const docRef = doc(db, "appInfo", "disclaimer");
    getDoc(docRef).then((resp)=>{
        const data = resp.data()!.english
        setDisclaimer(data.split("~"))

        // const data = resp.data();
        // if (data)
        // setDisclaimer(data.split('~'))
    });

}, [])

const approveDisclaimer = async ()=>{
    try {
        const docRef = doc(db, "users", auth.currentUser!.uid);
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(docRef);
          if (!sfDoc.exists()) {
            throw "Document does not exist!";
          }
          transaction.update(docRef, { disclaimerApproved:Date.now()});
        });
        console.log("Transaction successfully committed!");
      } catch (e) {
        console.log("Transaction failed: ", e);
      }
    
    
    navigation.navigate("home")
    props.isMenu(true)
}

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Disclaimer</Text>
        
       <FlatList
                   style={{ flex: 1 }}
                    data={disclaimer}
                    renderItem={({ item }) =><Text style={styles.text}>{item}</Text> }
                    keyExtractor={item => item}
                />
                <View style={{flexDirection:"row"}}><Checkbox status={approved? "checked": "unchecked"} onPress={()=>setApproved(!approved)}/><Text>אני מאשר שקראתי ומסכים לתנאים</Text></View>
                <Button disabled={!approved} title={approved? "המשך" : "גלול למטה לאישור"} onPress={()=>approveDisclaimer()} color='cadetblue'/>
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
    margin:10,
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
