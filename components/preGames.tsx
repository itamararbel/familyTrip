import { View, Text, StyleSheet, FlatList, ScrollView, SafeAreaView, Button, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import {Dimensions} from 'react-native';
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../App";
import { getAuth } from "firebase/auth";
import * as FileSystem from 'expo-file-system';
import appTexts from "../model/appTexts";


export default function PreGames() {
    const [text, setText] = useState("")

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const auth = getAuth();

    const checkLog = async () => {
        return ((auth.currentUser?.uid))
    }
const windowWidth = Dimensions.get('window').width;

    useEffect(() => {
        
        checkLog().then((resp: any) => {
            resp === undefined ? navigation.navigate('SignIn') : navigation.navigate('PreGames')
        })
        FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "/").then((resp) => {
            if (resp.indexOf("gameInPlay.txt") > 0) {
                setText("יש משחק פתוח  חוזרים אליו...");
                // navigation.navigate('InGame');
            }
        })
    }
        , [])
    return (

        <ScrollView style={styles.container}>
            {text ? <View style={{ flex: 1, justifyContent: 'center', height: '100%' }}><Text style={{ flex: 1, justifyContent: 'center', textAlign: 'center', paddingTop: '50%', fontSize: 40 }}>יש משחק פתוח</Text>
                <TouchableOpacity style={{ marginHorizontal: '10%', backgroundColor: "cadetblue", borderRadius: 10, width: '80%', marginTop: 15 }} onPress={() => navigation.navigate("InGame")}><Text style={[styles.text, { marginBottom: 20 }]}>המשך משחק</Text></TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: '10%', backgroundColor: "red", borderRadius: 10, width: '80%', marginTop: 15 }} onPress={() => navigation.navigate("Games")}><Text style={[styles.text, { marginBottom: 20 }]}>בחר משחק אחר(המשחק ילך לאיבוד ללא זיכוי)</Text></TouchableOpacity>

            </View> :
                <View>
                    <Text style={styles.header}>משחקי ניווט</Text>
                    <Text style={styles.text}>{appTexts.preGames?.beforeLink && appTexts.preGames?.beforeLink.replace(/\;/g, "\n")}</Text>
                    <TouchableOpacity style={{ marginHorizontal: '42.5%',width:'15%', backgroundColor:'aliceblue',borderRadius:30 }} onPress={() => Linking.openURL('whatsapp://send?phone=+972528139818')}><Ionicons name="md-logo-whatsapp" color="green" size={windowWidth*0.13} /></TouchableOpacity>
                    <Text style={styles.text}>{appTexts.preGames?.afterLink && appTexts.preGames?.afterLink.replace(/\;/g, "\n")}</Text>
                    <TouchableOpacity style={{ marginHorizontal: '30%', backgroundColor: "cadetblue", borderRadius: 10, width: '40%' }} onPress={() => navigation.navigate("Games")}><Text style={[styles.text, { marginBottom: 20 }]}>המשך</Text></TouchableOpacity>
                    <Text></Text>
                </View>}
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: '80%',
        margin: '5%',
        borderColor: 'cadetblue',
        borderWidth: 4,
        borderRadius: 10

    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        margin: 20,
        lineHeight:25,
        fontFamily: 'Inter-Black',

    },
    listText: {
        textAlign: 'center',
        fontSize: 20,
        margin: 20,

    },
    header: {
        fontWeight: 'bold',
        color: 'cadetblue',
        textAlign: 'center',
        fontSize: 30,
        margin: 20,
    }
});
