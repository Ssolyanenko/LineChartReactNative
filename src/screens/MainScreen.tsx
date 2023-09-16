import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Button,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { LineChart } from 'react-native-chart-kit';
import { chartConfig } from "../helpers/chartConfig";
import {
  fetchData,
  setLocations,
  setPopulations,
  setYears
} from "../store/slices/populationSlice";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "native-base";

const MainScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);//hook select state
  const [modalVisible, setModalVisible] = useState(false); // hook which open or close modal
  const [showChart, setShowChart] = useState(false); // showing chart

  const [chartOpacity] = useState(new Animated.Value(0)); //initial state for animation
  const [chartScale] = useState(new Animated.Value(0.9));
  const [chartTranslateY] = useState(new Animated.Value(20));

  const dispatch = useDispatch(); // deliver changes to redux

  const { data, isLoading, years, populations,locations } = useSelector((state) => state.population);
//selector of our values from redux
  useEffect(() => { // get data
    dispatch(fetchData());
  }, [dispatch]);//arr of depensesies

  useEffect(() => {
    if (data.data) { // if we have data making selection

      const uniqueYears = Array.from(new Set(data.data.map((item) => item['ID Year'])));
      const uniquePopulation = Array.from(new Set(data.data.map((item) => item['Population'])));
      const uniqueLocation = Array.from(new Set(data.data.map((item) => item['Slug State'])));

      dispatch(setYears(uniqueYears)); //deliver to redux
      dispatch(setPopulations(uniquePopulation))
      dispatch(setLocations(uniqueLocation))

    }
  }, [data, dispatch]);
  const animateChart = () => { // function of animation
    Animated.parallel([
      Animated.timing(chartOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.spring(chartScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: false,
      }),
      Animated.timing(chartTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const handleLocationSelection = (location) => {
    setSelectedLocation(location);// provide data for select
    setModalVisible(false);

    const filteredYears = data.data
      .filter((item) => item['Slug State'] === location)
      .map((item) => item['ID Year']);
    const filteredPopulations = data.data
      .filter((item) => item['Slug State'] === location)
      .map((item) => item.Population)
    // filter and get new arr

    dispatch(setYears(filteredYears)) //deliver
    dispatch(setPopulations(filteredPopulations))

    setShowChart(true); // open chart

    animateChart() // animation start
  };

  return ( // rendering
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <ScrollView>
          <TouchableOpacity // if click open modal for select states
            style={styles.modal}
            onPress={() => data.data.length > 0 ? setModalVisible(true) :
              Toast.show({ //if no data user will see error
                description: 'No Data , check connection',
                placement: 'bottom',
                style: styles.toast,
              })}>
            <Text style={{ color: '#fff', fontWeight: '500' }}>{selectedLocation || 'Select a Location'}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal // render states one by one
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10,width:'80%',margin:50 }}>
            <Text>Select a Location:</Text>
            <FlatList
              data={locations}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
                  onPress={() => handleLocationSelection(item)}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {data.data && data.data.length > 0 && showChart && (
        <View style={{ alignSelf: 'center' }}>
          <Text style={styles.textChart}>
            Line Chart
          </Text>
          <LineChart //using lib for chart
            data={{
              labels: years, //years
              datasets: [
                {
                  data: populations, //population
                  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={Dimensions.get('window').width - 20}
            height={300}
            yAxisLabel="Population"
            chartConfig={chartConfig} // config which is need for this lib
            bezier
          />
          <Button  title="Close Chart" onPress={()=>setShowChart(false)} />
        </View>)}

    </SafeAreaView>
  )
}
  const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
  },
  selectedButton: {
    backgroundColor: 'blue',
  },
  buttonText: {
    fontSize: 16,
  },
    modal:{
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginTop: 50,
      width: '80%',
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: '#00a8e8',
      alignSelf: 'center',
    },
    toast:{
      backgroundColor: '#c30010',
      width: '100%',
      borderRadius: 10,
      padding: 40,
    },
    textChart:{
    alignSelf: 'center',
      marginBottom: 16,
      fontSize: 18
  },
});

export default MainScreen;
