import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as FileSystem from 'expo-file-system';
import { Game } from "../model/gameModel";
import { Station } from "../model/stationModel";
import { Portal, Dialog, Button, ProgressBar } from "react-native-paper";
import Success from "./success";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import { FontAwesome } from '@expo/vector-icons';
import InGameAnswer from "./inGameAnswer";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, runTransaction, setDoc } from "firebase/firestore";
import fireBase from "../fireBase";
import InGameHelp from "./inGameHelp";
import WebView from "react-native-webview";
const nopic = require("../assets/nopic.png")

export default function InGame() {
  const [text, setText] = useState("")
  const [i, setI] = useState(0);
  const [game, setGame] = useState<Game>();
  const [data, setData] = useState<Station[]>([]);
  const [visible, setVisible] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [openHelp, setHelp] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const auth = getAuth()
  const db = getFirestore(fireBase);
  const scrollViewRef = useRef<ScrollView>(null);


  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    if (text || openHelp) {
      setHelp(false);
      setVisible(false);
      setText("");
      return;
    }
    setVisible(false);
    if (gameFinished) {
      navigation.navigate('home')
      FileSystem.deleteAsync(FileSystem.documentDirectory + "/gameInPlay.txt");
      FileSystem.deleteAsync(FileSystem.documentDirectory + "/game.txt");
      saveToProfile()
    }
    if (i === data.length - 1) {
      setGameFinished(true);
      data[i].afterCorrectAnswer =auth.currentUser?.displayName +"\n, סיימתם את המשחק בהצלחה👑; מקווים שנהנתם ומקווים לראות אתכם במשחקים הבאים" 
      showDialog();
      // FileSystem.readDirectoryAsync(FileSystem.documentDirectory+"/").then((r)=>console.log(r))
    } else {
      setI(i + 1)
      scrollViewRef.current && scrollViewRef.current.scrollTo({ y: 0, animated: true })
      console.log(data[i])
    }
  }

  const saveToProfile = () => {
    let currentGame = {
      name: game!.name,
      date: Date.now(),
    }
    const uid = auth.currentUser?.uid;
    const docRef = doc(db, "users", uid!);
    getDoc(docRef).then((resp) => {
      let data = resp.data();
      if (data) {
        console.log("ifData")
        if (!data.gamesPlayed) {
          console.log("ifGamePlayed")
          data.gamesPlayed = [];
        }
        console.log(data);
        data.gamesPlayed.push(currentGame)
        setDoc(docRef, data).then(() => console.log("saved")).catch(err => console.log(err))
      }
    });

  }
  console.log(data[i])
  useEffect(() => {
    
    if (data.length === 0) {
      setI(0)
      setGameFinished(false);
      FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/").then((resp) => {
        if (resp.indexOf("gameInPlay.txt") > 0) {
          FileSystem.readAsStringAsync(FileSystem.documentDirectory + "/gameInPlay.txt").then((resp) => {
            console.log(resp)
            setGame(JSON.parse(resp));
            setData(JSON.parse(resp).stations);
            setI(JSON.parse(resp).stations.map((item: Station) => item.time).indexOf(undefined))
            if (game?.opening) {
              setText(game.opening)
              setVisible(true)
            }
          })
        }
        else {
          FileSystem.readAsStringAsync(FileSystem.documentDirectory + "/game.txt").then((resp) => {
            FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/gameInPlay.txt", resp).then(()=>
            consumeCredit())
            let tempGame: Game = JSON.parse(resp);
            FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "game/image").then((resp) => {
              tempGame.stations.map((item, i) => {
                if (item.image && item.image.indexOf("http") === -1 && resp.indexOf(item.image.split("/")[item.image.split("/").length - 1]) == -1) {
                  item.image = "";
                  console.log("there is no pic")
                }
              })
              setGame(tempGame);
              setData(tempGame.stations)
              if (tempGame.opening != undefined) {
                setText(tempGame.opening.replace(/\;/g, "\n"))
                setVisible(true)
              }
            })
          })
        }
      })
    }
  }, [])

  const consumeCredit = async () => {
    try {
        const docRef = doc(db, "users", auth.currentUser!.uid);
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(docRef);
            if (!sfDoc.exists()) {
                throw "Document does not exist!";
            }
            console.log()
            transaction.update(docRef, { credit: sfDoc.data().credit - 1 });
        });
        console.log("Transaction successfully committed!");        
    } catch (e) {
        console.log("Transaction failed: ", e);
    }
}


  const hundleAnswer = (answer: any) => {
    console.log("here?")
    if (!data[i].answer) {
      console.log("in")
      data[i].answer = "";
    }
    if (data[i].answer!.indexOf(",") > 0) {
      if (answer === (data[i].answer as string).split(",")[0]) {
        answer = data[i].answer
      }
    }
    if (answer === data[i].answer) {
      let temp: Game = game!;
      temp.stations[i].time = Date.now();
      setGame(temp as any)
      FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/gameInPlay.txt", JSON.stringify(temp)).then((resp) => console.log("stamp saved"));
      showDialog();
    } else {
      setText('אופס!!\n התשובה לא נכונה או לא מדוייקת\n')
      showDialog();
    }

  }


  if (data.length > 1) {
    data[i].image ? data[i].image : "./assets/3play.png"

    return (
      <View style={{ height: "100%" }}>
        <ScrollView ref={scrollViewRef}>
          <View >
          </View>
          <View style={styles.card}>
            <View style={{borderBottomColor: 'cadetBlue', borderBottomWidth: 2, marginBottom: 15}}><Text style={{ fontSize: 30,marginStart:20 }}>{data[i].header}</Text></View>
            {data[i].image && data[i].image!.indexOf("http") === -1 ? <Image
              source={data[i].image ? { uri: data[i].image } : nopic}
              style={{ width: '80%', height: 300, marginLeft: '10%', borderRadius: 15 }}
            /> :
              <View>
                <WebView
                  source={{ uri: data[i].image || "www.walla.co.il" }}
                  style={styles.video}
                />
                <Button onPress={() => {
                  Linking.openURL(data[i].image!)
                }}> לא רואים טוב? לחץ על הקישור הבא</Button>
              </View>
            }
            <Text style={[styles.text]}>{data[i].description}</Text>
            <View>
              <InGameAnswer answerType={data[i].answerType} answer={data[i].answer||""} returnAnswer={hundleAnswer}></InGameAnswer>
              <Text>{'\n'}</Text>
            </View>
          </View>
          <Portal>
            <Dialog visible={visible} style={{borderRadius:20, overflow:'hidden'}}>
              {openHelp ? <InGameHelp station={data[i]} goBack={() => { i > 0 && setI(i - 1); setHelp(false); setVisible(false); }} nextRiddle={(answer) => { hundleAnswer(answer); setHelp(false); }} /> :
                text ?
                  <ScrollView>
                    <Text style={styles.text}>{data[i].answerType === "american"? text.split(",")[0] : text}</Text>
                  </ScrollView>
                  : <Success text={data[i].afterCorrectAnswer ? data[i].afterCorrectAnswer : ""} closeDialog={hideDialog} isGameFinished={gameFinished} answer={data[i].answer||""} link={game?.endLink||""} percent={1 - (i+1) / (game && game.stations.length-1||i)}></Success>
              }
              <Dialog.Actions style={{ width: '100%', backgroundColor: 'cadetblue', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                <TouchableOpacity onPress={hideDialog} style={{ width: '100%', backgroundColor: 'cadetblue', flex: 1, alignItems: 'center', marginTop: 20 }}><Text style={{ width: '100%', backgroundColor: 'cadetblue', textAlign: 'center', fontSize: 30, alignItems: 'center' }}>המשך</Text></TouchableOpacity>
              </Dialog.Actions>
            </Dialog>
          </Portal>

        </ScrollView>
        <TouchableOpacity onPress={() => { setVisible(true); setHelp(true) }} style={styles.distanceButton}><FontAwesome name="life-bouy" size={50} color="black" /></TouchableOpacity>

      </View>
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
  card: {
    justifyContent: "center",
    width: '100%',
    borderColor: 'black solid 1px',
    textAlign: 'center'
  },
  text: {
    // textAlign: 'center',
    color: 'black',
    marginStart:25,
    fontSize: 25,
    fontWeight:'bold'
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
  calender: {
    marginLeft: '25%',
    marginBottom: 15,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 60,
  },
  distanceButton: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    backgroundColor: "cadetblue",
    borderRadius: 15

  },
  video: {
    marginTop: 20,
    minHeight: 200,
    width: '100%',
    flex: 1
  }
});
