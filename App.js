import React,{useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,FlatList, TouchableOpacity,TextInput, ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import _ from 'lodash'

export default class SearchBarExample extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: false,
      data:[],
      temp:[],
      city:"",
      citySelected:false,
    }
    this.arrayholder = []
  }
  componentDidMount() {
    this.setState({
      isLoading:true
    })
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson)
        this.setState(
          {
            isLoading: false,
            data: responseJson
          },
          function() {
            this.arrayholder = responseJson;
            this.setState({isLoading:false})
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }
  onCity = (search)=>{
    const newData  = this.arrayholder.filter( function(item){
    const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    })
    this.setState({data:newData,city:search})
  }   
  render(){
    if (this.state.isLoading === true) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        <View style={{paddingTop:20,paddingHorizontal:10}}>
            <View style={styles.inputContainer}>
              <TextInput
                  placeholder="Search here...."
                  style={styles.input}
                  fontSize={16}
                  autoFocus={true}
                  value={this.state.city}
                  onChangeText={(value)=>{this.onCity(value)}}
                />
            </View>
           
          <View>
           {this.state.city === ""?
           <Text style={{textAlign:'center',paddingVertical:10}}>Search for all your location</Text>
           :
           <FlatList
              data={this.state.data}
              ListEmptyComponent={<Text style={{textAlign:'center',paddingVertical:10}}>Can't find location</Text>}
              keyExtractor={(item)=>item.id.toString()}
              renderItem={({item})=>(
                <TouchableOpacity onPress={()=>{
                  this.setState({
                    city:item.title
                  })
                }} style={styles.item} key={item.id}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                          <View style={styles.icon}>
                            <Entypo name="location-pin" size={18} color="grey" />
                          </View>
                          <Text>{item.title}</Text>
                        </View>
                  </TouchableOpacity>
              )}
            />}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer:{
    borderColor:"grey",
    borderWidth:0.3,
    borderRadius:4,
    padding:15,
    marginTop:5
  },
  input:{
    padding:5,
  },
  item:{
    borderBottomWidth:0.3,
    padding:5,
    marginVertical: 8,
    marginHorizontal: 16,
  }
});
