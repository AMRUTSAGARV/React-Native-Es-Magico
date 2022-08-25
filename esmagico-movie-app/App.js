import { StatusBar } from "expo-status-bar";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Modal,
} from "react-native";
import axios from "axios";
import { useState } from "react";

export default function App() {
  const apiurl = "http://www.omdbapi.com/?i=tt3896198&apikey=91ca02dc";
  const [state, setState] = useState({
    s: "Enter a movie...",
    results: [],
    selected: {},
  });

  const search = () => {
    //axios is making a call to our apiurl and on the end we re adding a new query parameter which is going to be s which stands for search in the database or the api we are using
    //and was then equal to the search crew we have set up here so currently it will be set to enter movie but when we actually type like on screen next it says "Batman(movie name you want)" we can actually change the batman to be what hit enter and how we'll search for that word so it'd be Batman which pass through
    //data.data
    axios(apiurl + "&s=" + state.s).then(({ data }) => {
      let results = data.Search;

      setState((prevState) => {
        //we then going to return it and set the previous state to setState like how the state works we re then going to get the results and set the rsults to the rresults.
        return { ...prevState, results: results };
      });
    });
  };

  const openPopup = (id) => {
    axios(apiurl + "&t=" + id).then(({ data }) => {
      let result = data;
      // console.log(result);

      setState((prevState) => {
        return { ...prevState, selected: result };
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Es Magico Movies</Text>
      <TextInput
        style={styles.searchbox}
        onChangeText={(text) =>
          setState((prevState) => {
            return { ...prevState, s: text };
          })
        }
        //means once you submitted it will allow us to do a search.
        onSubmitEditing={search}
        value={state.s}
      />

      <ScrollView style={styles.results}>
        {state.results.map((result) => (
          <TouchableHighlight
            key={result.imdbID}
            onPress={() => openPopup(result.Title)}
          >
            <View style={styles.result}>
              <Image
                source={{ uri: result.Poster }}
                style={{
                  width: "100%",
                  height: 300,
                }}
                resizeMode="cover"
              />
              <Text style={styles.heading}>{result.Title}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={false}
        visible={typeof state.selected.Title != "undefined"}
      >
        <View style={styles.popup}>
          <Text style={styles.poptitle}>{state.selected.Title}</Text>
          <Text style={{ marginBottom: 20 }}>
            Rating: {state.selected.imdbRating}
          </Text>
          <Text>{state.selected.Plot}</Text>
        </View>
        <TouchableHighlight
          onPress={() =>
            setState((prevState) => {
              return { ...prevState, selected: {} };
            })
          }
        >
          <Text style={styles.closeBtn}>Close</Text>
        </TouchableHighlight>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#564C55",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  title: {
    color: "#FDBF6E",

    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  searchbox: {
    fontSize: 20,
    fontWeight: "300",
    padding: 20,
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 40,
  },
  results: {
    flex: 1,
  },
  result: {
    flex: 1,
    width: "100%",
    marginBottom: 20,
  },
  heading: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    padding: 20,
    backgroundColor: "#BC2041",
  },
  popup: {
    padding: 40,
  },
  poptitle: {
    fontSize: 24,

    fontWeight: "700",
    marginBottom: 5,
  },
  closeBtn: {
    padding: 20,
    fontSize: 20,
    color: "#FDBF6E",
    fontWeight: "700",
    backgroundColor: "#564C55",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
});
