import { View, Text, TextInput, Image, StyleSheet, Button, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Fontisto } from '@expo/vector-icons';

interface props {
    answerType: string
    answer: string | string[];
    returnAnswer: Function;
}

export default function InGameAnswer(props: props) {
    const [isDatePickerVisible, setDatePicker] = useState(false)
    const [answer, setAnswer] = useState("");
    const [stationAnswer, setStationAnswer] = useState<string[]>([]);


    useEffect(() => {
        console.log(typeof (props.answer))
        typeof (props.answer) === 'object' && setStationAnswer(props.answer)
        if (props.answerType === 'american' && typeof (props.answer) === 'string') {
            const stations = props.answer.split(',')
            const temp = stations.shift()
            stations.splice(Math.floor((Math.random() * 4)), 0, temp!)
            if (stations.indexOf("כל התשובות נכונות")!==-1){
                stations.splice((stations.indexOf("כל התשובות נכונות")),1)
                stations.push("כל התשובות נכונות")
            }
            setStationAnswer(stations)

        }
    }, [props.answer])
    const handleChange = (event: Date) => {
        let regularDate = (event.toISOString().split("T")[0]);
        regularDate = regularDate.split("-")[2] + "/" + regularDate.split("-")[1] + "/" + regularDate.split("-")[0]
        // setAnswer(regularDate)
        props.returnAnswer(regularDate);
        setAnswer("")
        setDatePicker(false)
    }

    switch (props.answerType) {
        case 'Date': {
            return (<View>
                <TouchableOpacity onPress={() => setDatePicker(true)} style={styles.calender}>
                    <Fontisto name="date" size={60} color="black" style={{ justifyContent: 'center' }} />
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(event: any) => handleChange(event)}
                    onCancel={() => setDatePicker(false)}
                />
                {/* <TouchableOpacity style={styles.button} onPress={() => { props.returnAnswer(answer); setAnswer("") }}><Text>השב</Text></TouchableOpacity> */}
            </View>)
        }
        case 'string':
        case 'text':
        case 'number': {
            return (<View>
                {props.answer? props.answer.indexOf('http') === -1?
                    <View><TextInput
                        keyboardType={props.answerType === "number" ? "numeric" : "default"}
                        style={styles.input}
                        value={answer}
                        onChangeText={(text) => { setAnswer(text) }}
                        placeholder="תשובה" />
                        <TouchableOpacity style={styles.button} onPress={() => { props.returnAnswer(answer); setAnswer("") }}><Text>{props.answer === "" ? "המשך" : "השב"}</Text></TouchableOpacity>
                    </View>
                    :<TouchableOpacity style={styles.button} onPress={() =>{Linking.openURL(props.answer as string);props.returnAnswer(props.answer); setAnswer("") }}><Text>עבור לקישור</Text></TouchableOpacity>
                :                        <TouchableOpacity style={[styles.button,{marginTop:20}]} onPress={() => { props.returnAnswer(answer); setAnswer("") }}><Text>המשך</Text></TouchableOpacity>
            }
            </View>
            )
        }
        case 'american': {
            // if (typeof(props.answer==='string[]'))
            {
                return (
                    <View style={{marginTop:15}}>
                        {
                            (stationAnswer).map((item, i) =>
                                <TouchableOpacity key={i + item} onPress={() => setAnswer(item)}><Text style={item === answer ? { color: 'blue', textAlign: 'center', fontSize: 25, marginBottom:10, borderBottomColor:'lightgray', borderBottomWidth:1 } : { color: "black", textAlign: 'center', fontSize: 20, marginBottom:10, borderBottomColor:'lightgray', borderBottomWidth:1}}>{item}</Text></TouchableOpacity>)
                        }
                        <TouchableOpacity style={[styles.button]} onPress={() => {props.returnAnswer(answer); setAnswer("") }}><Text>השב</Text></TouchableOpacity>
                    </View>
                )
            }
        }
        default: return (<Text>{props.answerType}</Text>)

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
        fontSize: 25,
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
        top: 10,
        right: 7,
        backgroundColor: "cadetblue",
        borderRadius: 15

    }
});
