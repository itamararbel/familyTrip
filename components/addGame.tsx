import React, { useState,  useEffect } from 'react';
import { ScrollView, TextInput, StyleSheet,  TouchableOpacity, PermissionsAndroid } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { doc, getFirestore,  setDoc } from "firebase/firestore";
import { View } from 'react-native';
import { Button as ButtonPaper, Dialog, Portal, Text } from 'react-native-paper';
import AddStation from './addStation';
import fireBase from '../fireBase';
import * as firebase from 'firebase/storage'
import { ref, uploadBytes } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { Feather } from "@expo/vector-icons"
import { Station } from '../model/stationModel';
import { Game } from '../model/gameModel';
import { getAuth } from 'firebase/auth';
import { RootStackParams } from '../App';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export default function AddGame() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [r, setR] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => {setVisible(false); setText("")}
  const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<Game>({ mode: 'onBlur' });
  const [stations, setStations] = useState<Station[]>([]);
  const db = getFirestore(fireBase)
  const storage = firebase.getStorage(fireBase);
  const [gameInEdit, setGameInEdit] = useState<Game>();
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()

  const auth = getAuth()

  const requestPermissions = () => {
    PermissionsAndroid.requestMultiple(
      [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]
    ).then((granted => {
      console.log(granted)
      if (granted['android.permission.CAMERA'] === "granted" && granted['android.permission.READ_EXTERNAL_STORAGE'] === "granted" && granted['android.permission.WRITE_EXTERNAL_STORAGE'] === "granted" && granted['android.permission.ACCESS_FINE_LOCATION'] === "granted") {
        console.log('all granted')
        setCameraPermission(true)
        return;
      }
      if (granted['android.permission.CAMERA'] !== "granted") openAlert("כדי ליצור משחק יש לתת הרשאה למצלמה")
      if (granted['android.permission.READ_EXTERNAL_STORAGE'] !== "granted") openAlert("כדי ליצור משחק יש לתת הרשאה לקריאת קבצים- על מנת שנוכל לגשת לתמונות שצילמת מתוך האפליקציה")
      if (granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== "granted") openAlert("כדי ליצור משחק יש לתת הרשאה לכתיבת קבצים- על מנת שנוכל לשמור סתמונות שצילמת מתוך האפליקציה")
      if (granted['android.permission.ACCESS_FINE_LOCATION'] !== "granted") openAlert("כדי ליצור משחק יש לתת הרשאה ל למיקום כדי שנוכל לדעת איפה התחנה ")
    })

    ).catch(err => console.log(err))
  }


  useEffect(() => {
    cameraPermission === false && requestPermissions();
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/").then((resp) => {
      if (resp.indexOf("gameInEdit.txt") > 0) {
        FileSystem.readAsStringAsync(FileSystem.documentDirectory + "/gameInEdit.txt").then((resp) => {
          const savedGame = JSON.parse(resp)
          setGameInEdit(savedGame)
          setValue('name', savedGame.name);
          setValue('area', savedGame.area);
          setValue('difficulty', savedGame.difficulty);
          setValue('estimatedTime', savedGame.estimatedTime);
          setValue('stations', savedGame.stations);
          setStations(savedGame.stations)
        })
      }
    })
  }, []);

  const openAlert = (text:string)=>{
    setVisible(true)
    setText(text)
  }

  const saveGame = (dataSubmit: any) => {
    console.log(dataSubmit);
    FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/gameInEdit.txt", JSON.stringify(dataSubmit))
  }
  const sendGame = (dataSubmit: Game) => {
    if (stations.length === 0) {
      openAlert("you must add at least 1 station");
      return
    }
    openAlert("שולח משחק...")
    dataSubmit.madeByName = auth.currentUser?.displayName || "unknown"
    dataSubmit.madeByMail = auth.currentUser?.email || "unknown"
    dataSubmit.stations.map(async (item: Station) => {
      let config: RequestInit = {};
      const pic = await fetch(item.image!, config);
      const picBlob = await pic.blob();
      const uuid = "image" + Math.round(Math.random() * 10000000);
      const picRef = await ref(storage, `images/${dataSubmit.name}/${uuid}`);
      item.image = picRef.fullPath;
      uploadBytes(picRef, picBlob).then((snapshot) => {
        console.log(snapshot.ref);
      }).then(()=> setDoc(doc(db, "games", dataSubmit.name + "(" + dataSubmit.difficulty + ")"), dataSubmit).then(()=>{
        hideDialog()
        navigation.navigate("Games")

      })
      )
    })
  }

  const saveStation = (station: Station) => {
    let tempStations = stations;
    tempStations.push(station);
    setStations(tempStations);
    setValue("stations", tempStations);
  }

  const changeOrder = (index: number, changedValue: number) => {
    const tempArray = stations;
    [tempArray[index], tempArray[index + changedValue]] = [tempArray[index + changedValue], tempArray[index]]

    setStations(tempArray)
    setR(!r)
  }

  const resetGame = () => {
    FileSystem.deleteAsync(FileSystem.documentDirectory + "/gameInEdit.txt").then(() => {
      setValue('name', "");
      setValue('area', "");
      setValue('difficulty', "");
      setValue('estimatedTime', "");
      setValue('stations', []);
      setStations([])
      setR(!r)
    });

  }

  return (
    <ScrollView>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="איך תרצה לקרוא למשחק"
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'יש למלא את השדה הזה'
          }
        }}
      />
      {errors.name && <Text>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="area"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="איפה המשחק מתקיים"
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'יש למלא את השדה הזה'
          }
        }}
      />
      {errors.area && <Text>{errors.area.message}</Text>}
      <Controller
        control={control}
        name="difficulty"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="מה רמת הקושי של המשחק"
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'יש למלא את השדה הזה'
          }
        }}
      />
      {errors.difficulty && <Text>{errors.difficulty.message}</Text>}
      <Controller
        control={control}
        name="estimatedTime"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="משך זמן מוערך"
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
          />
        )}
        rules={{
          required: {
            value: true,
            message: 'יש למלא את השדה הזה'
          }
        }}
      />
      {errors.estimatedTime && <Text>{errors.estimatedTime.message}</Text>}
      <View>
        {stations && stations.map((item, index) => <View style={{ flexDirection: 'row', margin: 3 }} key={'station' + index}><TouchableOpacity onPress={() => changeOrder(index, 1)}><Feather name="chevron-down" size={30} color="black" /></TouchableOpacity><Text style={styles.list} ><TouchableOpacity style={{ width: 25 }} onPress={() => changeOrder(index, -1)} ><Feather name="chevron-up" size={30} color="black" /></TouchableOpacity>תחנה מספר {index} : {item.header} הפיתרון: {item.answer} </Text></View>)}
        <ButtonPaper onPress={showDialog} mode='elevated' buttonColor='cadetblue'><Text style={{ color: 'white', backgroundColor: 'cadetblue' }}> {stations && stations.length === 0 ? "הכנס תחנה ראשונה" : "הכנס תחנה נוספת"}</Text></ButtonPaper>
        <Text>{'\n'}</Text>
        <ButtonPaper onPress={handleSubmit(saveGame)} mode='elevated' buttonColor='cadetblue'><Text style={{ color: 'white', backgroundColor: 'cadetblue' }}>שמור משחק</Text></ButtonPaper>
        <ButtonPaper onPress={handleSubmit(sendGame)} mode='elevated' buttonColor='cadetblue'><Text style={{ color: 'white', backgroundColor: 'cadetblue' }}>שלח משחק</Text></ButtonPaper>
        <ButtonPaper onPress={resetGame} mode='elevated' buttonColor='cadetblue'><Text style={{ color: 'white', backgroundColor: 'cadetblue' }}>אפס </Text></ButtonPaper>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            {text?<Text style={styles.text}>{text}</Text>:<AddStation saveStation={saveStation} closeDialog={hideDialog}></AddStation>}
            <Dialog.Actions>
             {!text && <ButtonPaper onPress={hideDialog}>Cancel</ButtonPaper>}
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    margin: 10,
    fontSize: 30,
  },
  list: {
    flex: 1,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: 'lightgrey',

  },
  text:{
    fontSize:30,
    margin:40,
    marginTop:50,
    textAlign:'center'
  }
})