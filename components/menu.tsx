
import { useNavigation } from "@react-navigation/native";
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet, Linking } from "react-native";
import { RootStackParams } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import * as FileSystem from 'expo-file-system';
import { Game } from "../model/gameModel";
import { Station } from "../model/stationModel";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import fireBase from "../fireBase";
import { ActivityIndicator } from "react-native-paper";


interface props {
    closeMenu: () => void
}

export default function Menu(props: props) {
    const auth = getAuth()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const [screen, setScreen] = useState("")
    const [exit, setExit] = useState("")
    const db = getFirestore(fireBase);
    const updatedState = navigation.getState();
    const [spinner,setSpinner]= useState(false)




    useEffect(() => {
        if(updatedState){
        const currentRouteName = updatedState.routes[updatedState.index].name;
        setScreen(updatedState.routes[updatedState.index].name)
        console.log(currentRouteName);
        console.log(screen)}
    }, [navigation]);

    const hundlePermenentExit = () => {
        if (exit === "temp") {
            navigation.navigate("home")
            props.closeMenu()
        } else {
            setSpinner(true)
            FileSystem.readAsStringAsync(FileSystem.documentDirectory + "/gameInPlay.txt").then((resp) => {
                const game: Game = (JSON.parse(resp));
                const stations: number[] = []
                game.stations.map((item: Station) => stations.push(item.time || NaN))
                console.log(stations)
                let currentGame = {
                    name: game!.name,
                    date: Date.now(),
                    stationSummery: stations
                }
                const uid = auth.currentUser?.uid;
                const docRef = doc(db, "users", uid!);
                getDoc(docRef).then((resp) => {
                    let data = resp.data();
                    if (data) {
                        console.log("ifData")
                        if (!data.gameQuitted) {
                            console.log("ifGameQuitted")
                            data.gameQuitted = [];
                        }
                        data.gameQuitted.push(currentGame)
                        
                        const docRef = doc(db, "users", uid!);
                        setDoc(docRef, data).then(() => {
                            FileSystem.deleteAsync(FileSystem.documentDirectory + "/gameInPlay.txt");
                            FileSystem.deleteAsync(FileSystem.documentDirectory + "/game.txt");
                            navigation.navigate("home")
                            setSpinner(false)
                            props.closeMenu()
                        }).catch(err => console.log(err))
                    }
                });
            })
        };

    }





    switch (screen) {
        case "InGame": return (
            <ScrollView style={{ minHeight: 50 }}>
                <View style={{ overflow: "hidden", backgroundColor: 'cadetblue', flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', borderRadius: 23, height: 80 }}>
                    <TouchableOpacity onPress={() => setExit("temp")} style={{ width: '50%', backgroundColor: 'green', justifyContent: 'center' }}><Text style={{ fontSize: 23, color: 'black', fontFamily: 'Inter-Black', textAlign: 'center', fontWeight: 'bold' }}>צא זמנית</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setExit("permanent")} style={{ width: '50%', backgroundColor: 'red', justifyContent: 'center' }}><Text style={{ fontSize: 23, color: 'black', fontFamily: 'Inter-Black', textAlign: 'center', fontWeight: 'bold' }}>צא סופית מהמשחק</Text></TouchableOpacity>
                </View>
                {exit &&
                    <View>
                        <Text style={{ fontSize: 23, fontWeight: 'bold' }}>{exit === "temp" ? "תוכל לחזור למשחק על ידי בחירת משחקים בתפריט\n" : "לא תוכל לחזור למשחק ולא יתקבל החזר\n"} אתה בטוח?</Text>
                        {spinner?<ActivityIndicator animating={true} color={'black'} /> :<View>
                        <TouchableOpacity onPress={async () => { hundlePermenentExit() }}><Text style={{ fontSize: 30, textDecorationLine: 'underline', color: 'red', fontFamily: 'Inter-Black', fontWeight: 'bold', textAlign: 'center' }}>בטוח</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { props.closeMenu(); setExit("") }}><Text style={{ fontSize: 30, textDecorationLine: 'underline', color: 'green', fontFamily: 'Inter-Black', fontWeight: 'bold', textAlign: 'center' }}>בעצם לא משנה</Text></TouchableOpacity>
                        </View>}
                    </View>
                }
            </ScrollView>
        )
        default:
            return (
                <ScrollView style={{ padding: 10, borderColor: 'cadetblue', borderWidth: 5, borderRadius: 23, shadowColor: 'black' }}>
                    <View style={{ backgroundColor: 'cadetblue', flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 23, borderRadius: 23 }}>
                        <Text style={{ fontSize: 23, fontFamily: 'Inter-Black' }}>{auth.currentUser?.displayName ? "קבוצת " + auth.currentUser?.displayName : ""} </Text><TouchableOpacity onPress={async () => { await auth.signOut(); navigation.navigate("SignIn"); props.closeMenu() }}><Text style={{ fontSize: 23, textDecorationLine: 'underline', color: 'brown', fontFamily: 'Inter-Black' }}>צא</Text></TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate("home"); props.closeMenu() }}><Ionicons name="home" size={40} color="black" style={{ marginHorizontal: '40%' }} /></TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                props.closeMenu()
                                navigation.navigate("PreGames")
                            }}
                        >
                            <Text style={styles.menuText}>🎯משחקי ניווט</Text></TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                props.closeMenu()
                                navigation.navigate("Riddles")
                            }}
                        ><Text style={styles.menuText}>🚗משעמם בדרך? חידות</Text></TouchableOpacity>
                        {/* <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                props.closeMenu()
                                navigation.navigate("gamesSuggestions")
                            }}
                        ><Text style={styles.menuText}>משחקים לדרך</Text></TouchableOpacity> */}
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                props.closeMenu()
                                navigation.navigate("Recommendations")
                            }}
                        ><Text style={styles.menuText}>🔥המלצות לפעילויות</Text></TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                props.closeMenu()
                                navigation.navigate("userInfo")
                            }}
                        ><Text style={styles.menuText}>👤פרטי משתמש</Text></TouchableOpacity>
                        {auth.currentUser?.displayName === 'admin' && <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                props.closeMenu();
                                navigation.navigate("addGame");
                            }
                            }
                        ><Text style={styles.menuText}>➕הוסף משחק חדש</Text></TouchableOpacity>}
                        {/* <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    props.closeMenu();
                    navigation.navigate("SignUp");
                }
                }
            >
                <Text style={{ fontSize: 30, textAlign:'center', fontFamily:'Inter-Black' }}>הרשמה</Text></TouchableOpacity> */}
                      
                        
                        <TouchableOpacity
                            // style={styles.menuItem}
                            onPress={() => {
                                Linking.openURL("https://itamararbel.github.io/familytrip-privacyPolicy/")
                            }
                            }
                        ><Text style={{ fontSize: 13, textAlign: 'center' }}>privacy policy</Text></TouchableOpacity>
                    </View>
                </ScrollView>
            )

    }
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomColor: 'cadetblue', borderBottomWidth: 3, margin: 5,
        textAlign: 'center',
        alignSelf: 'center',
        width: '100%',
        fontFamily: 'Inter-Black'



    }, menuText:{ fontSize: 23, textAlign: 'auto', fontFamily: 'Inter-Black' }
    
})
