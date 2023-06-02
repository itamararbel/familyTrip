import { View, Text, TextInput, Image, StyleSheet, Button, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import { ProgressBar } from "react-native-paper";
const image1 = require('../assets/successImages/image1.png')
const image2 = require('../assets/successImages/image2.png')
const image3 = require('../assets/successImages/image3.png')
const image4 = require('../assets/successImages/image4.png')
const image5 = require('../assets/successImages/image5.png')
const image6 = require('../assets/successImages/image6.png')
const image7 = require('../assets/successImages/image7.png')
const image8 = require('../assets/successImages/image8.png')
const image9 = require('../assets/successImages/image9.png')
const image10 = require('../assets/successImages/image10.png')
const image11 = require('../assets/successImages/image11.png')
const image12 = require('../assets/successImages/image12.png')
const image13 = require('../assets/successImages/image13.png')
const image14 = require('../assets/successImages/image14.png')
const image15 = require('../assets/successImages/image15.png')
const lastImage = require('../assets/giphy.gif')

interface successScreen {
  text: string | undefined;
  closeDialog: Function;
  isGameFinished: Boolean;
  answer: string | string[]
  link: string;
  percent?: number;
}


export default function success(props: successScreen) {
  const [randomPic, setRandom] = useState(0)
  useEffect(() => { setRandom(Math.floor(Math.random() * 15)) }, [])
  console.log(randomPic)
  const pic = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14, image15]
  return (
    <ScrollView style={{ borderRadius: 20 }}>
      <View style={styles.card}>
        {props.answer !== "" && props.answer!.indexOf("http") === -1 ?
          <View>
            <Image
              source={props.isGameFinished ? lastImage : pic[randomPic]}
              style={{ width: '100%', height: props.isGameFinished ? 200 : 300, borderRadius: 15, marginTop: '-5%' }}
            /><Text style={{ fontSize: 25, textAlign: 'center', borderBottomColor: 'cadetBlue', borderBottomWidth: 2, marginBottom: 5 }}>{!props.isGameFinished ? 'כל הכבוד, תשובה נכונה' : 'כל הכבוד'}</Text>
          </View> : <View></View>}
        <Text style={styles.text}>{props.text?.replace(/\;/g, "\n")}</Text>
        <View>
          {props.isGameFinished && props.link ? <View><Text></Text><Button color={'cadetblue'} onPress={() => { props.closeDialog; Linking.openURL(props.link) }} title='נשמח לשמוע איך היה לכם-לחצו כאן לסיכום' /><Text></Text></View> : <View></View>}
        </View>
      </View>
      {/* {props.percent && <ProgressBar style={{ height: 20, backgroundColor: 'cadetblue' }} progress={props.percent >= 1 ? props.percent : 1} color="grey" />} */}
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
    justifyContent: "center",
    width: '100%',
    borderColor: 'black solid 1px',
    textAlign: 'center',
    borderRadius: 20,
    marginVertical: 15
    // overflow:'hidden'
  },
  text: {
    // textAlign: 'right',
    color: 'black',
    fontSize: 20,
    margin: 10,
    letterSpacing: 2

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
