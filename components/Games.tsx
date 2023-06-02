import { collection, doc, getDoc, getDocs, getFirestore, runTransaction } from "firebase/firestore";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, RefreshControl, Linking } from "react-native";
import fireBase from "../fireBase";
import { useEffect, useState } from "react";
import { Game } from "../model/gameModel";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import * as firebase from 'firebase/storage'
import { listAll, ref } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import { getAuth } from "firebase/auth";
import { Button, Checkbox, Dialog, Portal } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';

import MyLocation from "./MyLocation";
import React from "react";


export default function Games() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const [loadingState, setLoading] = useState("")
    const [games, setGames] = useState<Game[]>([]);
    const [text, setText] = useState("")
    const [gameDetails, setGameDetails] = useState<number>(NaN)
    const [approveStart, setApprovedStart] = useState(false);
    const [whatsapp, setwhatsApp] = useState(false);
    const [credit, setCredit] = useState(NaN)

    const db = getFirestore(fireBase);
    const storage = firebase.getStorage(fireBase)
    const auth = getAuth();





    useEffect(() => {

        // FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/").then((resp) => {
        //     if (resp.indexOf("gameInPlay.txt") > 0) {
        //         setText("יש משחק פתוח  חוזרים אליו...");
        //         navigation.navigate('InGame');
        //     } else {
        getAllGames();
        checkCredit()
        // }
        // })
    }, []);


    const getAllGames = async () => {
        setLoading("מחפש את כל המשחקים")
        const colRef = collection(db, "games");
        let location = await MyLocation.getLocation();
        !location && console.log("no location")
        const docsSnap = await getDocs(colRef);
        let tempGameArr: Game[] = [];
        console.log("111")
        console.log(docsSnap)
        docsSnap.forEach((doc) => {
            tempGameArr.push(doc.data() as Game);
            if (!tempGameArr[tempGameArr.length - 1].image) {
                tempGameArr[tempGameArr.length - 1].image = tempGameArr[tempGameArr.length - 1].stations[0].image
            }
            const imageRef = ref(storage, tempGameArr[tempGameArr.length - 1].image);
            firebase.getDownloadURL(imageRef)
                .then((url) => {
                    tempGameArr[tempGameArr.map((item) =>
                        item.image).indexOf(imageRef.fullPath)].image = url;
                })
                .catch((error) => {
                    // setLoading("לא הצלחנו ליצור קשר עם השרת")
                    console.log(error)
                })
        })
        setLoading("ממיין את המשחקים לפי מרחק")
        let counter = 1
        console.log(tempGameArr.length)
        const timer = setInterval(() => {
            console.log(counter)
            if (counter >= tempGameArr.length-1) {
                tempGameArr.sort((a, b) => a.distance! > b.distance! ? 1 : a.distance! < b.distance! ? -1 : 0)
                setGames(tempGameArr)
                console.log("no-choice")
                clearInterval(timer)
                setTimeout(() => setLoading(""), 500)
            }
        }, 1000);
        for (let i = 0; i < tempGameArr.length; i++) {
            MyLocation.getDistanceFromLatLonInKm(tempGameArr[i].stations[0].location!.latitude, tempGameArr[i].stations[0].location!.longitude, location).then((resp) => {
                tempGameArr[i].distance = Math.round(resp)
                counter += 1
            }).catch((err) => console.log("catch"))
        }
    }
    const checkCredit = () => {
        // setLoading("בודק קרדיט")
        const docRef = doc(db, "users", auth.currentUser!.uid)
        getDoc(docRef).then(r => {
            const user = r.data();
            if (user && user.credit && user.credit > 0) {
                setCredit(user.credit)
            } else {
                setCredit(0)
                // setLoading("")
                // setText("אין לך קרדיט\n צור קשר - ")
                // setwhatsApp(true)
            }
        }
        ).catch((e) => {
            console.log("e")
        })
    }

    const chooseGame = async (index: number) => {
        setText("")
        setGameDetails(NaN)
        setLoading("המשחק יורד, הפעולה עשויה להימשך כדקה")
        const game = games[index];
        const listRef = ref(storage, 'images/' + game.name);
        await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/").then(async (resp) => {
            if (resp.indexOf("gameInPlay.txt") > 0) {
                await FileSystem.deleteAsync(FileSystem.documentDirectory + "/gameInPlay.txt")
            }
        })
        let counter = 0;
        const isGameDirectory = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/")
        if (isGameDirectory.indexOf("game") === -1) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "game");
        }
        const isImage = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "game/")
        console.log(isImage)
        if (isImage.indexOf("image") > -1) {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "game/image")
        }
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "game/image");
        setLoading("0%" + " - טוען תמונות")
        game.stations.map((item, i) => {
            if (item.image && item.image.indexOf("http") === -1) {
                game.stations[i].image = FileSystem.documentDirectory + "game/image/" + item.image.split("/")[2];
            }
        })
        listAll(listRef)
            .then((res: any) => {
                res.items.forEach((itemRef: any) => {
                    const imageRef = ref(storage, itemRef._location.path);
                    firebase.getDownloadURL(imageRef)
                        .then(async (url) => {
                            console.log(url)
                            await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "game/image").then((r) => console.log(r))
                            const fileName = itemRef._location.path.split("/")[2];
                            await FileSystem.downloadAsync(url, FileSystem.documentDirectory + "game/image/" + fileName)
                            counter++
                            setLoading(Math.ceil(counter / res.items.length * 100) + "%" + " - טוען תמונות")
                            if (counter === res.items.length) {
                                if (res.items.length > game.stations.length) {
                                    const picturesDownloaded = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "game/image")
                                }
                                await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/game.txt", JSON.stringify(game))
                                navigation.navigate('beforeGame', { place: game.description })
                                setGameDetails(NaN)
                                setLoading("")

                            }
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                });
            }).catch((error) => {
                // Uh-oh, an error occurred!
            });
        // })s
        


    }
    
    return (
        <View style={{ flex: 1, margin: 10 }}>
            <Portal>
                <Dialog visible={text ? true : false} onDismiss={() => { setText(""); /*navigation.navigate("InGame")*/ }}><Text style={{ fontSize: 30, margin: 40, textAlign: 'center' }}>{text}</Text>
                </Dialog>
                {gameDetails >= 0 ? <Dialog visible={gameDetails >= 0 ? true : false} onDismiss={() => { setGameDetails(NaN) }}>
                    <ScrollView>
                        <Text style={{ fontSize: 40, margin: 20, }}>{games[gameDetails].name}</Text>
                        <Text style={{ fontSize: 20, margin: 10,  }}>אזור המשחק : {games[gameDetails].area}</Text>
                        <Text style={{ fontSize: 20, margin: 10,  }}>משך הזמן הממוצע : {games[gameDetails].estimatedTime}</Text>
                        {/* <Text style={{ fontSize: 20, margin: 10, textAlign: 'center' }}>נוצר על ידי : {games[gameDetails].madeByName}</Text> */}
                        <Text style={{ fontSize: 20, margin: 10,  }}>רמת קושי : {games[gameDetails].difficulty}</Text>
                        <Text style={{ fontSize: 20, margin: 10,  }}>מחיר : {games[gameDetails].price ? games[gameDetails].price : "30"}</Text>
                        <TouchableOpacity onPress={() => Linking.openURL(games[gameDetails].description!)}><Text style={{ fontSize: 20, margin: 10, textAlign: 'center', color: 'blue' }}>קישור לנקודת ההתחלה</Text></TouchableOpacity>
                        <View style={{ flexDirection: 'row-reverse', justifyContent:'center' }}>
                            <Text style={{ fontSize: 20, margin: 10 }}>זה המשחק שאני רוצה{"\n"}(ניצול קרדיט 1 מתוך {credit})</Text>
                            <Checkbox
                                status={approveStart ? "checked" : "unchecked"}
                                onPress={() => {
                                    setApprovedStart(!approveStart);
                                }}
                            /></View>
                        <Button mode="contained" onPress={() => { chooseGame(gameDetails); }} disabled={!approveStart || credit<=0}><Text>נצל קרדיט והתחל משחק</Text></Button>
                        <Button mode="contained" style={{ backgroundColor: 'gray', marginBottom: 40 }} onPress={() => setGameDetails(NaN)}><Text>בטל</Text></Button>
                    </ScrollView></Dialog> : <Text></Text>}
            </Portal>
            <Text style={{ textAlign: 'center', fontSize: 40, marginBottom:15 }}>המשחקים שלנו</Text>
             {/* <View>{credit ?<Text>יש לך {credit} משחקים שעוד לא ניצלת</Text> : <View style={{backgroundColor:'red', width:'90%', marginHorizontal:'5%', borderRadius:20,justifyContent:'space-between', flexDirection:'row'}}><TouchableOpacity style={{backgroundColor:'white', width:40,borderRadius:20,}} onPress ={()=>{Linking.openURL('whatsapp://send?phone=+972528139818')}}><Ionicons name="md-logo-whatsapp" size={40} color="green" /></TouchableOpacity><Text style={{fontSize:18, margin:5}}>אין לך זכאות למשחקים, צור קשר </Text></View>}</View> */}
            {loadingState ? <View>
                <Text style={{ fontSize: 30, marginTop: '30%', textAlign: 'center' }}>{loadingState}</Text>
                {loadingState === "מחפש את כל המשחקים" && <TouchableOpacity onPress={getAllGames} style={{}}>
                    <Text style={{ fontSize: 30, marginTop: '10%', textAlign: 'center', textDecorationLine: 'underline' }}>טען מחדש</Text>
                </TouchableOpacity>}
            </View>
                :
                games ?
                    <FlatList
                        style={{ flex: 1 }}
                        data={games}
                        renderItem={({ item, index }) => <TouchableOpacity onPress={() => setGameDetails(index)} style={{ marginBottom: 40, marginHorizontal: 20, backgroundColor: 'cadetblue', borderRadius: 20 }}>
                            <Text style={{ textAlign: 'center', fontSize: 25, fontFamily: 'Inter-Black' }}>{item.name}</Text>
                            <View style={{ justifyContent: 'space-evenly' }}><Text style={{ direction: 'rtl', fontSize: 15, fontFamily: 'Inter-Black' }}> רמת קושי : {item.difficulty}</Text><Text style={{ direction: 'rtl', fontSize: 15, fontFamily: 'Inter-Black' }} > מרחק: {item.distance} קילומטר</Text></View>
                            <Image
                                source={{ uri: item.image }}
                                style={{ width: '100%', height: 300, zIndex: 100 }}
                            />
                        </TouchableOpacity>}
                        refreshControl={
                            <RefreshControl
                                refreshing={loadingState ? true : false}
                                onRefresh={() => getAllGames()}
                            />
                        }
                        keyExtractor={item => item.name + item.difficulty}
                    /> : <TouchableOpacity onPress={getAllGames} style={{}}>
                        <Text style={{ fontSize: 30, marginTop: '10%', textAlign: 'center', textDecorationLine: 'underline' }}>טען משחקים</Text>
                    </TouchableOpacity>}
        </View>
    );

}
