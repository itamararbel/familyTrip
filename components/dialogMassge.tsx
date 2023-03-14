import { SafeAreaView, Button, ScrollView, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { View,Text} from 'react-native';
import { Feather } from "@expo/vector-icons"
import { Button as ButtonPaper,Dialog, Portal } from 'react-native-paper';
import React, { useState } from 'react';
import AddStation from './addStation';



export default function DialogMassage() {
    const [visible, setVisible] = useState(true);
    const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

 
  return (
    <View>
     <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Text>fdsafdsafadsf</Text>
            <Dialog.Actions>
              <ButtonPaper onPress={hideDialog}>Cancel</ButtonPaper>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    margin: 10,
    fontSize: 30,
  },
  container:{
    flex:1,
    margin:30,
    backgroundColor:'green',
    zIndex:3000000
  }

})