import { View, Text, TextInput, Image, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MyLocation from "./MyLocation";
import * as FileSystem from 'expo-file-system';
import { Game } from "../model/gameModel";
import { Station } from "../model/stationModel";
import { Portal, Dialog } from "react-native-paper";
import Success from "./success";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';



export default function InGame() {
  const [distanceToStation, setDistance] = useState(NaN)
  const [i, setI] = useState(0);
  const [game, setGame] = useState();
  const [text, setText] = useState("");
  const [data, setData] = useState<Station[]>([]);
  const [visible, setVisible] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [isDatePickerVisible, setDatePicker] = useState(false)

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    if (gameFinished){
      navigation.navigate('Games')
    }
    if (i === data.length-1) {
      setGameFinished(true);
      data[i].afterCorrectAnswer = ` סיימתם את המשחק בהצלחה, מקווים שנהנתם
      מוזמנים ללחוץ על הקישור למטה לחידון קצר על מה שעשינו היום,
      נשמח לראות אותכם שוב במשחק הבא.`
      showDialog();
      FileSystem.deleteAsync(FileSystem.documentDirectory + "/gameInPlay.txt");
    } else { setI(i + 1); }
  }


  useEffect(() => {
    if (data.length === 0) {
        setI(0)
        setGameFinished(false);

        FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/").then((resp) => {
        console.log(i)
        if (resp.indexOf("gameInPlay.txt") > 0) {
          console.log(i)

          FileSystem.readAsStringAsync(FileSystem.documentDirectory + "/gameInPlay.txt").then((resp) => {

            setGame(JSON.parse(resp));

            setData(JSON.parse(resp).stations);
            console.log(i)

            setI(JSON.parse(resp).stations.map((item: Station) => item.time).indexOf(undefined))

          })
        }
        else {
          FileSystem.readAsStringAsync(FileSystem.documentDirectory + "/game.txt").then((resp) => {
            setGame(JSON.parse(resp));
            setData(JSON.parse(resp).stations)
          })


        }

      })
    }
  }, [])

  const getDistance = () => {
    if (data.length > 0) {
      MyLocation.getDistanceFromLatLonInKm(data[i].location!.latitude, (data[i].location!.longitude)).then((resp: number) => {
        setDistance(Math.floor(resp * 1000))
        alert("אתה במרחק של" + Math.floor(resp * 1000) + "מ מהתחנה"+'\n'+ data[i].answer)
      }).catch(err => {
        alert("לא הצלחנו לאתר את המיקום שלך")
        setDistance(NaN)
      })
    }
  }


  const hundleAnswer = () => {
    if (text === data[i].answer) {
      let temp: Game = game!;
      temp.stations[i].time = Date.now();
      setGame(temp as any)
      FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/gameInPlay.txt", JSON.stringify(temp)).then((resp) => console.log(game));
      // if (i === data.length - 1) {
      //   data[i].afterCorrectAnswer = `כל הכבוד, סיימת את כל המשחק בהצלחה, מקווים שנהנת
      // מוזמן ללחוץ על הקישור למטה לחידון קצר על מה שעשינו היום,
      // נשמח לראות אותכם שוב במשחק הבא.`
      //   showDialog();
      // } else {
        setText("");
        console.log(i)
      // }
      showDialog();

    } else {
      alert("answer is wrong");
    }

  }

  const handleChange = (event: Date) => {
    let regularDate = (event.toISOString().split("T")[0]);
    regularDate = regularDate.split("-")[2] + "/" + regularDate.split("-")[1] + "/" + regularDate.split("-")[0]
    setText(regularDate)
    setDatePicker(false)
    console.log(text)
  }

  if (data.length > 1) {
    data[i].image ? data[i].image : "./assets/3play.png"

    return (
      <ScrollView >
        <View >
        </View>
        { }
        <View style={styles.card}>
          <Text style={{ fontSize: 40, textAlign: 'center', borderBottomColor: 'cadetBlue', borderBottomWidth: 2, marginBottom: 15 }}>{data[i].header}</Text>
          <Image
            source={{ uri: data[i].image }}
            style={{ width: '80%', height: 300, marginLeft: '10%', borderRadius: 15 }}
          />
          <Text style={styles.text}>{data[i].description}</Text>
          {/* <Text style={styles.text}></Text> */}
          <View>
            {data[i].answerType === "Date" ?
              <View>
                <TouchableOpacity onPress={() => setDatePicker(true)} style={styles.calender}>
                  <Fontisto name="date" size={60} color="black" style={{justifyContent:'center'}}/>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={(event: any) => handleChange(event)}
                  onCancel={() => setDatePicker(false)}
                />
              </View>
              :
              <TextInput
                keyboardType={data[i].answerType === "number" ? "numeric" : "default"}
                style={styles.input}
                value={text}
                onChangeText={(text) => { setText(text) }}
                placeholder="תשובה" />
            }
            <TouchableOpacity style={styles.button} onPress={() => { hundleAnswer() }}><Text>השב</Text></TouchableOpacity>
            <Text>{'\n'}</Text>
            <TouchableOpacity onPress={getDistance} style={styles.distanceButton}><MaterialCommunityIcons name="map-marker-distance" size={50} color="black" /></TouchableOpacity>
          </View>
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Success text={data[i].afterCorrectAnswer ? data[i].afterCorrectAnswer : ""} closeDialog={hideDialog} isGameFinished={gameFinished}></Success>
            <Dialog.Actions>
              <Button onPress={hideDialog} title="המשך" />
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    )
  }
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
    fontSize:25,
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

  },
  calender:{
    marginLeft: '25%',
    marginBottom:15,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 60,
  }, 
  distanceButton:{
    position:'absolute',
    top:10,
    right:7,
    backgroundColor:"cadetblue",
    borderRadius:15

  }
});
