import { Camera, CameraType, } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import { useEffect, useRef, useState } from 'react';
import { Button, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Feather } from "@expo/vector-icons"
import React from 'react';

interface props {
  getPicUri: (args: string) => void
}
export default function TakePic(props: props) {
  const [type, setType] = useState(CameraType.back);
  const [previewVisible, setPreviewVisible] = useState(false)
  let camera: Camera | null
  
  useEffect(() => {
    console.log("useEffect" + camera)
    console.log(camera)

  }, [])

  // const requestPermissions = () => {
  //   PermissionsAndroid.requestMultiple(
  //     [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
  //   ).then((granted => {
  //     console.log(granted)
  //     if (granted['android.permission.CAMERA'] === "granted" && granted['android.permission.READ_EXTERNAL_STORAGE'] === "granted" && granted['android.permission.WRITE_EXTERNAL_STORAGE'] === "granted") {
  //       console.log('all granted')
  //       setCameraPermission(true)
  //       return;
  //     }
  //     if (granted['android.permission.CAMERA'] !== "granted") alert("כדי ליצור משחק יש לתת הרשאה למצלמה")
  //     if (granted['android.permission.READ_EXTERNAL_STORAGE'] !== "granted") alert("כדי ליצור משחק יש לתת הרשאה לקריאת קבצים- על מנת שנוכל לגשת לתמונות שצילמת מתוך האפליקציה")
  //     if (granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== "granted") alert("כדי ליצור משחק יש לתת הרשאה לכתיבת קבצים- על מנת שנוכל לשמור סתמונות שצילמת מתוך האפליקציה")
  //   })

  //   ).catch(err => console.log(err))
  // }

  // function toggleCameraType() {
  //   setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  // }


  const __takePicture = () => {
    console.log(camera)
    if (!camera) { return }
    (camera as unknown as Camera).takePictureAsync().then(async (resp) => {
      console.log('here')
      console.log(resp.uri)
      let config: RequestInit = {}
      const pic = await fetch(resp.uri, config);
      console.log((await pic.blob()).size);
      manipulateAsync(
        resp.uri,
        [{ resize: { width: 400 } }],
        { compress: 0.4, format: SaveFormat.PNG }).then((file) => {
          props.getPicUri(file.uri)
          setPreviewVisible(true)
        });
    }).catch((err) => {
      alert(JSON.stringify(err))
    });
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(r) => camera = r}>
      </Camera>
      <TouchableOpacity style={styles.buttonTakePic} onPress={__takePicture}>
        {previewVisible ? <Text style={{ fontSize: 30 }}>retake?</Text> : <Feather name='camera' size={50} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: { height: 300 },
  buttonTakePic: { backgroundColor: "cadetblue", height: 50, width: '100%', flex: 1, alignItems: 'center', position: 'absolute', bottom: 0 },
  button: { backgroundColor: "cadetblue", height: 50, width: 50, borderRadius: 20, justifyContent: 'flex-end' },
  text: {},
  container: {}
})
