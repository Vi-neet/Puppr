import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { useEffect, useState } from "react";
import data from "./data.json";

export default function App() {
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  useEffect(() => {
    // Function to get random pet and image
    const getRandomImage = () => {
      const pets = data.data;
      const randomPet = pets[Math.floor(Math.random() * pets.length)];
      const randomImage = randomPet.images[Math.floor(Math.random() * randomPet.images.length)];
      setCurrentImageUrl(randomImage.url);
    };

    // Initial image
    getRandomImage();

    // Set up interval
    const interval = setInterval(getRandomImage, 10000);

    // Cleanup interval
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {currentImageUrl ? (
        <Image
          source={{ uri: currentImageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text>Loading...</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});
