import { collection, getDocs, getFirestore, query, terminate, where } from "firebase/firestore";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from "react-native";
import fireBase from "../fireBase";
import { useEffect, useState } from "react";
import { Game } from "../model/gameModel";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import * as firebase from 'firebase/storage'
import { ref } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import { getAuth } from "firebase/auth";
import { Button, Dialog, Portal } from "react-native-paper";
import React from "react";


export default function GamesToEdit() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const [loading, setLoading] = useState(false)
    const [gamesOfUser, setGames] = useState<Game[]>([]);
    const [text, setText] = useState("")
    const [gameDetails, setGameDetails] = useState<number>(NaN)
    const db = getFirestore(fireBase);
    const storage = firebase.getStorage(fireBase)
    const auth = getAuth();

    useEffect(() => {
        FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/").then((resp) => {
            if (resp.indexOf("gameInEdit.txt") > 0) {
                setText("יש משחק בעריכה,  חוזרים אליו...");
                navigation.navigate('addGame');
            } else {
                getAllGames();
            }
        })
    }, []);


    const getAllGames = async () => {
        const userMail = await auth.currentUser?.email
        setLoading(true)
        const colRef = collection(db, "games");
        const q = query(colRef, where("madeByMail", "==", userMail))
        const docsSnap = await getDocs(q);
        let tempGameArr: Game[] = [];
        docsSnap.forEach(doc => {
            tempGameArr.push(doc.data() as Game);
            const imageRef = ref(storage, doc.data().stations[0].image);
            firebase.getDownloadURL(imageRef)
                .then((url) => {
                    tempGameArr[tempGameArr.map((item) => item.stations[0].image).indexOf(imageRef.fullPath)].image = url;
                })
                .catch((error) => {
                    console.log(error)
                })
        })
        setGames(tempGameArr)
        setTimeout(() => setLoading(false), 2000)
    }
    const chooseGame = async (index: number) => {
        setLoading(true)
        const game = gamesOfUser[index];
        let counter = 0;
        const isGameDirectory = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/")
        if (isGameDirectory.indexOf("edit") !== -1) {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "/edit")
        }
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "/edit");
        const isImage = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/edit")
        if (isImage.indexOf("image") > 0) {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "edit/image")
        }
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "edit/image");
        game.stations.map((item, i) => {
            const imageRef = ref(storage, item.image);
            firebase.getDownloadURL(imageRef)
                .then(async (url) => {
                    const fileName = (url.split("=")[url.split("=").length - 1])
                    await FileSystem.downloadAsync(url, FileSystem.documentDirectory + "/edit/image/" + fileName)
                    counter++
                    game.stations[i].image = FileSystem.documentDirectory + "/" + fileName;
                    if (counter === game.stations.length) {
                        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/gameInEdit.txt", JSON.stringify(game))
                        setLoading(false)
                        navigation.navigate('addGame')
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        })
    }

    return (
        <View style={{ flex: 1, margin: 10 }}>
            <Portal>
                <Dialog visible={text ? true : false} onDismiss={() => { setText(""); navigation.navigate("addGame") }}><Text style={{ fontSize: 30, margin: 40, textAlign: 'center' }}>{text}</Text></Dialog>
                {gameDetails >= 0 ? <Dialog visible={gameDetails >= 0 ? true : false} onDismiss={() => { setGameDetails(NaN) }}>
                    <ScrollView>
                        <Text style={{ fontSize: 30, margin: 20, textAlign: 'center' }}>שם המשחק: {gamesOfUser[gameDetails].name}</Text>
                        <Text style={{ fontSize: 20, margin: 10, textAlign: 'center' }}>אזור המשחק : {gamesOfUser[gameDetails].area}</Text>
                        <Text style={{ fontSize: 20, margin: 10, textAlign: 'center' }}>משך הזמן הממוצע : {gamesOfUser[gameDetails].estimatedTime}</Text>
                        <Text style={{ fontSize: 20, margin: 10, textAlign: 'center' }}>נוצר על ידי : {gamesOfUser[gameDetails].madeByName}</Text>
                        <Text style={{ fontSize: 20, margin: 10, textAlign: 'center' }}>רמת קושי : {gamesOfUser[gameDetails].difficulty}</Text>
                        <Text style={{ fontSize: 20, margin: 10, textAlign: 'center' }}>מחיר : {gamesOfUser[gameDetails].price}</Text>
                        <Button mode="contained" onPress={() => { chooseGame(gameDetails); setGameDetails(NaN) }}><Text>בחר ועבור לתשלום</Text></Button>
                        <Button mode="contained" style={{ backgroundColor: 'gray', marginBottom: 40 }} onPress={() => setGameDetails(NaN)}><Text>בטל</Text></Button>
                    </ScrollView></Dialog> : <Text></Text>}
            </Portal>
            <TouchableOpacity onPress={getAllGames} style={{ width: 25 }}><Feather name="refresh-ccw" size={25} color="cadetBlue" /></TouchableOpacity>
            <Text style={{ textAlign: 'center', fontSize: 30, textDecorationLine: 'underline' }}>בחר משחק לעריכה</Text>
            {loading ? <Text>בטעינה</Text> :
                <FlatList
                    style={{ flex: 1 }}
                    data={gamesOfUser}
                    renderItem={({ item, index }) => <TouchableOpacity onPress={() => chooseGame(index)} style={{ marginBottom: 40, marginHorizontal: 20, backgroundColor: 'cadetblue', borderRadius: 20 }}>
                        <Text style={{ textAlign: 'center', fontSize: 25 }}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}><Text style={{ direction: 'rtl', fontSize: 15 }}> רמת קושי : {item.difficulty}</Text><Text style={{ direction: 'rtl', fontSize: 15 }} >מרחק: {item.distance} קילומטר</Text></View>
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: '100%', height: 300, zIndex: 100 }}
                        />
                    </TouchableOpacity>}
                    keyExtractor={item => item.name}
                />}
        </View>
    );
}
