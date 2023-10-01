import { collection, getDocs, getFirestore } from "firebase/firestore";
import { View, Text, Image, TouchableOpacity, RefreshControl, FlatList, I18nManager, ScrollView, StyleSheet } from "react-native";
import fireBase from "../fireBase";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import * as firebase from 'firebase/storage'
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { getAuth } from "firebase/auth";
import riddlesModal, * as r from "../model/riddles"
import { Dialog, Portal, ProgressBar } from "react-native-paper";
import React from "react";
import Loading from "./Loading";


export default function Riddles() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const [riddles, setRiddles] = useState<riddlesModal[]>([]);
    const [riddleGame, setGame] = useState<riddlesModal>();
    const [counter, setCounter] = useState(NaN)
    const [showAnswer, setShowAnswer] = useState(false)
    const [loading, setLoading] = useState(false)
    const db = getFirestore(fireBase);
    const [rtl, setRtl] = useState(true)
    const [dialog, setDialog] = useState(false)

    const storage = firebase.getStorage(fireBase)
    // const auth = getAuth();

    useEffect(() => {
        setRtl(I18nManager.isRTL)

        getAllRiddles();
    }, []);


    const getAllRiddles = async () => {
        setLoading(true)
        setRiddles([])
        const colRef = collection(db, "riddles");
        const docsSnap = await getDocs(colRef);
        let tempRiddleArr: riddlesModal[] = [];
        console.log("docsSnap")
        let i = docsSnap.docs.length
        docsSnap.forEach(doc => {
            tempRiddleArr.push((doc.data() as riddlesModal));
            i--
            console.log(tempRiddleArr)
            i === 0 && setRiddles(tempRiddleArr);
        })
        setLoading(false)
    }
    const chooseRiddle = (index: number) => {
        setGame(riddles[index])
        riddles[index].instructions && setDialog(true);
        setCounter(0);
        setShowAnswer(false)
    }

    const backToRiddles = () => {
        setGame(undefined);
        setCounter(0);
    }

    const nextRiddle = () => {
        if (counter < riddleGame!.riddles.length - 1) {
            setShowAnswer(false)
            setCounter(counter + 1)
        } else {
            alert("congratz, you have finished")
            setGame(undefined)
        }

    }

    return (
        <View style={{ flex: 1, margin: 10 }}>
            <Portal>
                <Dialog visible={dialog} style={{ borderRadius: 20, overflow: 'hidden' }}>
                    <ScrollView>
                        <Text style={styles.header}>הוראות לחידון</Text>
                        <Text style={styles.text}>{riddleGame?.instructions?.replace(/\;/g, "\n")}</Text>
                    </ScrollView>
                    <Dialog.Actions style={{ width: '100%', backgroundColor: 'cadetblue', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                        <TouchableOpacity onPress={() => { setDialog(false) }} style={{ width: '100%', backgroundColor: 'cadetblue', flex: 1, alignItems: 'center', marginTop: 20 }}><Text style={{ width: '100%', backgroundColor: 'cadetblue', textAlign: 'center', fontSize: 30, alignItems: 'center' }}>התחל</Text></TouchableOpacity>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            {!riddleGame && <Text style={{ textAlign: 'center', fontSize: 30, textDecorationLine: 'underline' }}>חידות </Text>}
            {riddleGame ? <View style={{ flex: 1 }}><View style={{ flex: 1, margin: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {/* <TouchableOpacity onPress={getAllRiddles} style={{ width: 50 }}><Feather name="refresh-ccw" size={50} color="cadetBlue" /></TouchableOpacity> */}
                <TouchableOpacity onPress={backToRiddles} style={{ width: 50 }}><Entypo name="back" size={50} color="cadetblue" /></TouchableOpacity>
            </View>
                <View style={{ position: 'absolute', alignSelf: 'center', top: '40%' }}><Text style={{ fontSize: 40, textAlign: 'center' }}>{riddleGame.riddles[counter].riddle}</Text>
                    {showAnswer && <Text style={{ alignSelf: 'center', fontSize: 30, }}>{'\n' + riddleGame.riddles[counter].answer}</Text>}

                </View>
                <View style={{ position: 'absolute', bottom: 100, flex: 1, flexDirection: !rtl ? 'row' : 'row-reverse', backgroundColor: 'cadetblue', width: '76%', left: '12%', justifyContent: 'space-between', borderRadius: 20 }}>
                    <TouchableOpacity onPress={nextRiddle} style={{ width: 50, marginHorizontal: 10 }}><Entypo name="arrow-left" size={50} color="black" /></TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowAnswer(!showAnswer)} style={{ width: 140, borderColor: 'white', borderLeftWidth: 5, borderRightWidth: 5, alignItems: 'center' }}><Text style={{ width: 100, fontSize: 30 }}>תשובה</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setCounter(counter - 1)} style={{ width: 50, marginHorizontal: 10 }} disabled={counter === 0 ? true : false}><Entypo name="arrow-right" size={50} color={counter === 0 ? "grey" : "black"} /></TouchableOpacity>
                </View>
                <ProgressBar style={{ position: 'absolute', bottom: 60, height: 20, borderRadius: 20, backgroundColor: 'cadetblue' }} progress={1 - counter / (riddleGame.riddles.length - 1)} color="grey" />
            </View>
                :
                <FlatList
                    style={{ flex: 1 }}
                    data={riddles}
                    renderItem={({ item, index }) => <View key={item.name + index}><TouchableOpacity style={{ margin: 5, marginHorizontal: 30, borderWidth: 3, borderColor: "cadetblue", borderRadius: 10 }} onPress={() => chooseRiddle(index)}><Text style={{ textAlign: 'center', fontSize: 25 }}>{item.name}</Text>
                        <Image
                            source={{ uri: item.picture }}
                            style={{ width: '100%', height: 300 }}
                        /></TouchableOpacity></View>}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={() => getAllRiddles()}
                        />
                    }
                    keyExtractor={item => item.name}
                />

            }
        </View>
    );



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
        color: 'black',
        marginHorizontal: 15,
        fontSize: 20,
        fontFamily: 'Inter-Black',
        lineHeight: 35
    },
    header: {
        color: 'cadetblue',
        marginHorizontal: 15,
        fontSize: 35,
        fontFamily: 'Inter-Black',
        lineHeight: 35,
        marginBottom:20,
        borderBottomWidth:2,
        borderBottomColor:'cadetblue'
    }
})