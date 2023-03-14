import React from 'react';
import { Text, View, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera, CameraType } from 'expo-camera';
import { Button } from 'react-native-paper';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: true,
    type: CameraType.back,
    picTaken:""
  };
 camera:Camera|null|undefined


_snapPic(){
    if (!this.camera){
        return}

         this.camera.takePictureAsync().then((resp)=>{
            this.setState({picTaken:resp})
            alert(resp.uri)
         })
        
    
    
}

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
            {this.state.picTaken ===""?
          <Camera style={{ flex: 1 }} type={this.state.type} ref={(r)=>this.camera = r}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
            </View>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === CameraType.back
                        ? CameraType.front
                        : CameraType.back,
                  });
                }}
                // onPress={()=>{console.log(this.state.picTaken)}}
                >
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex:1,
                  position:'absolute',
                  top:'90%',
                  left:'50%',
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={()=>this._snapPic()}>
                <Text style={{ fontSize: 30, marginBottom: 10, color: 'white' }}>pic</Text>
              </TouchableOpacity>
          </Camera>:<View>
          <TouchableOpacity  style={{

                  flex:1,
                  position:'absolute',
                 
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }} onPress={()=>{(this.setState({picTaken:""}))}}><Image source={this.state.picTaken as ImageSourcePropType}></Image></TouchableOpacity></View>}
        </View>
      );
    }
  }
}