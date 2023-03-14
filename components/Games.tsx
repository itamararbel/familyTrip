import { collection, getDocs, getFirestore } from "firebase/firestore";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
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
import Loading from "./Loading";
import { Dialog, Portal } from "react-native-paper";


export default function Games() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const [loading,setLoading] = useState(false)
    const [games, setGames] = useState<Game[]>([]);
    const [text, setText] = useState("")
    const db = getFirestore(fireBase);
    const storage = firebase.getStorage(fireBase)
    const auth = getAuth();

    

    const checkLog = async()=>{
    return ((auth.currentUser?.uid))
    }


    useEffect( () => {
        checkLog().then((resp:any)=>{
            resp === undefined? navigation.navigate('SignIn'):navigation.navigate('Games') 

        })
        // auth.onAuthStateChanged((user)=>{
        //    })

        FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/").then((resp) => {
            if (resp.indexOf("gameInPlay.txt") > 0) {
                setText("יש משחק פתוח  חוזרים אליו...");
                // navigation.navigate('InGame');
            } else {
                getAllGames();
            }
        })
    }, []);


    const getAllGames = async () => {
        setLoading(true)
        const colRef = collection(db, "games");
        const docsSnap = await getDocs(colRef);
        let tempGameArr: Game[] = [];
        console.log(docsSnap)
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
        console.log(games)
        setTimeout(() => setLoading(false), 2000)

    }
    const chooseGame = async (index: number) => {
        setLoading(true)
        const game = games[index];
        let counter = 0;
        const isGameDirectory = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/")
        if (isGameDirectory.indexOf("game") === -1) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "game");
        }
        const isImage = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/game")
        if (isImage.indexOf("image") > 1) {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "game/image")
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "game/image");
        }
        const fileName = (game.image!.split("=")[game.image!.split("=").length - 1]);
        game.image = FileSystem.documentDirectory + "game/image/" + fileName;
        game.stations.map((item, i) => {
            const imageRef = ref(storage, item.image);
            firebase.getDownloadURL(imageRef)
                .then(async (url) => {
                    const fileName = (url.split("=")[url.split("=").length - 1])
                    await FileSystem.downloadAsync(url, FileSystem.documentDirectory + "/" + fileName)
                    counter++
                    game.stations[i].image = FileSystem.documentDirectory + "/" + fileName;
                    if (counter === game.stations.length) {
                        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/game.txt", JSON.stringify(game))
                        setLoading(false)
                        navigation.navigate('InGame')
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
            <Dialog visible={text? true:false} onDismiss={()=>{setText(""); navigation.navigate("InGame")}}><Text style={{fontSize:30, margin:40,textAlign:'center'}}>{text}</Text></Dialog>
            </Portal>
            <TouchableOpacity onPress={getAllGames} style={{ width: 25 }}><Feather name="refresh-ccw" size={25} color="cadetBlue" /></TouchableOpacity><Text style={{ textAlign: 'center', fontSize: 30, textDecorationLine: 'underline' }}>רשימת משחקים במערכת </Text>
            <Text>{`\n`}</Text>
            {loading? <Loading/>:<FlatList
                style={{ flex: 1 }}
                data={games}
                renderItem={({ item, index }) => <TouchableOpacity onPress={() => chooseGame(index)}><Text style={{ textAlign: 'center', fontSize: 25 }}>{item.name} ({item.difficulty})</Text>
                    <Image
                        source={{ uri: item.image }}
                        style={{ width: '100%', height: 300 }}
                    /></TouchableOpacity>}
                keyExtractor={item => item.name}
            />}
        </View>
    );

}
