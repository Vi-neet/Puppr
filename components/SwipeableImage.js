// Import necessary React and React Native modules
import { useState } from "react";
import { StyleSheet, useWindowDimensions, Image, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS
} from "react-native-reanimated";
import { Ionicons } from '@expo/vector-icons';

// Define a SwipeableImage component that accepts an array of image URLs through props
const SwipeableImage = ({ images, onEnd }) => {
  // State to track the current index of the image being displayed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);

  // Shared value to animate the swipe gesture (movement of images)
  const position = useSharedValue(0);

  // Dimensions of the device window to handle responsive styling
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Add shared values for button animations
  const checkOpacity = useSharedValue(0);
  const crossOpacity = useSharedValue(0);

  // Simplified to always go to next image
  const onSwipeComplete = () => {
    const nextIndex = currentIndex + 1;
    
    // If we've reached the end of the images
    if (nextIndex >= images.length) {
      onEnd && onEnd();  // Notify parent to show end message
      return;
    }
    
    // Otherwise, move to next image
    setCurrentIndex(nextIndex);
    position.value = withTiming(0, { duration: 0 });
  };

  // Gesture handler for swipe actions
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      position.value = e.translationX; // Update the position based on the gesture movement
      // Update button opacities based on swipe direction
      if (e.translationX > 0) {
        checkOpacity.value = Math.min(1, e.translationX / (windowWidth * 0.4));
        crossOpacity.value = 0;
      } else {
        crossOpacity.value = Math.min(1, Math.abs(e.translationX) / (windowWidth * 0.4));
        checkOpacity.value = 0;
      }
    })
    .onEnd((e) => {
      // Determine if the swipe distance is enough to consider it a swipe (40% of window width threshold)
      if (Math.abs(e.translationX) > windowWidth * 0.4) {
        // Always animate in the direction of the swipe but move to next image
        position.value = withTiming(
          e.translationX > 0 ? windowWidth : -windowWidth,
          { duration: 300 },
          () => runOnJS(onSwipeComplete)()
        );
      } else {
        // If the swipe wasn't far enough, return the image to the center
        position.value = withTiming(0);
      }
      checkOpacity.value = withTiming(0);
      crossOpacity.value = withTiming(0);
    });

  // Animated styles for moving the image based on the current position
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value },
      { rotate: `${(position.value / windowWidth) * 20}deg` }
    ],
  }));

  
  // Animated styles for buttons
  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: 1 + checkOpacity.value * 0.2 }],
  }));

  const crossStyle = useAnimatedStyle(() => ({
    opacity: crossOpacity.value,
    transform: [{ scale: 1 + crossOpacity.value * 0.2 }],
  }));

  // Component render
  return (
    <View style={styles.mainContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, { width: windowWidth }]}>
          <Animated.View style={[styles.imageContainer, animatedStyle]}>
            <Image
              source={{ uri: images[currentIndex] }}
              style={[styles.image]}
              resizeMode="cover"
              onError={() => setLoadError(true)}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.button, styles.crossButton, crossStyle]}>
          <Ionicons name="close" size={40} color="#fff" />
        </Animated.View>
        <Animated.View style={[styles.button, styles.checkButton, checkStyle]}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </Animated.View>
      </View>
    </View>
  );
};

// Export the SwipeableImage component for use in other parts of the app
export default SwipeableImage;

// Styling for the component
const styles = StyleSheet.create({
  // ...existing styles...
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    position: 'absolute',
    bottom: 50,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkButton: {
    backgroundColor: '#4CAF50',
  },
  crossButton: {
    backgroundColor: '#FF5252',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '80vh', // Limit height on web
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    maxWidth: 400, // Maximum width of the card
    aspectRatio: 1, // Square aspect ratio
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    margin: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});