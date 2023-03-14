import { View, Text, TextInput, Image, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
const image1= require('../assets/successImages/image1.png')
const image2= require('../assets/successImages/image2.png')
const image3= require('../assets/successImages/image3.png')
const image4= require('../assets/successImages/image4.png')
const image5= require('../assets/successImages/image5.png')
const image6= require('../assets/successImages/image6.png')
const image7= require('../assets/successImages/image7.png')
const image8= require('../assets/successImages/image8.png')
const image9= require('../assets/successImages/image9.png')
const image10= require('../assets/successImages/image10.png')
const image11= require('../assets/successImages/image11.png')
const image12= require('../assets/successImages/image12.png')
const image13= require('../assets/successImages/image13.png')
const image14= require('../assets/successImages/image14.png')
const image15= require('../assets/successImages/image15.png')

interface successScreen {
    text: string|undefined;
    closeDialog: Function;
    isGameFinished:Boolean;
}


export default function success(props:successScreen) {
    const [randomPic,setRandom] = useState(0)
    useEffect(()=>setRandom(Math.floor(Math.random()*15)),[])
  console.log(randomPic)
    const pic= [image1,image2,image3,image4,image5,image6,image7,image8,image9,image10,image11,image12,image13,image14,image15]
  return (
    <ScrollView >
        <Text>{'\N'}</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 40, textAlign: 'center', borderBottomColor: 'cadetBlue', borderBottomWidth: 2, marginBottom: 15 }}>{!props.isGameFinished? 'כל הכבוד, תשובה נכונה': 'כל הכבוד'}</Text>
        <Image
          source={pic[randomPic]}
          style={{width: '80%', height: props.isGameFinished? 200:300, marginLeft: '10%', borderRadius: 15}}
        />
        <Text style={styles.text}>{props.text}</Text>
        <View>
         
          {/* <Button color={'cadetblue'} onPress={() => props.closeDialog} title='המשך' /> */}
        </View>
      </View>
    </ScrollView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'cadetblue',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,

  },
  input: {
    fontSize: 30,
    textAlign: 'center',
    margin: 30,

  },
  header: {
    top: 20,
    height: 50,
    backgroundColor: "cadetblue",
    elevation: 24,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between"

  },
  card: {
    flex: 1,
    justifyContent: "center",
    width: '100%',
    borderColor: 'black solid 1px',
    textAlign: 'center'
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontSize:25
    
  },
  button: {
    marginLeft: '25%',
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 50,
    backgroundColor: "cadetblue",

  }
});
