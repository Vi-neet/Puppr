import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import axios from "axios";

export default function App() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    axios
      .get("https://thepetnest.com/api/v1/pets?q[category_id_eq]=1")
      .then((response) => {
        const imageUrls = response.data.data.map((pet) => pet.images[0].url);
        const shuffledImageUrls = shuffleArray(imageUrls);
        setImages(shuffledImageUrls);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <Image source={{ uri: images[currentIndex] }} style={styles.image} />
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
    resizeMode: "contain",
  },
});