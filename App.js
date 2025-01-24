import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SwipeableImage from "./components/SwipeableImage";
import data from "./data.json";

export default function App() {
  const [validImageUrls, setValidImageUrls] = useState([]);
  const [showEndMessage, setShowEndMessage] = useState(false);

  useEffect(() => {
    // Extract first image URL from each pet
    const urls = data.data.map(pet => pet.images[0]?.url).filter(Boolean);
    setValidImageUrls(urls);
    
    console.log('First image URL:', urls[0]);
    console.log('Number of valid images:', urls.length);
  }, []);

  const handleEndOfImages = () => {
    setShowEndMessage(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {!showEndMessage && validImageUrls.length > 0 ? (
          <SwipeableImage 
            images={validImageUrls} 
            onEnd={handleEndOfImages}
          />
        ) : (
          <Text style={styles.endMessage}>More pets coming soon...</Text>
        )}
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  endMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
});
