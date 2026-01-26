import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const JilOne = (props) => {
  return (
    <TouchableOpacity style={styles.oneJil} onPress={props.onPress}>
          <Image
            style={styles.stretch}
            source={props.imageName}
          />
          <Text>{props.ner}</Text>
        </TouchableOpacity>
  );
};

export default JilOne;

const styles = StyleSheet.create({
    oneJil: {
        width: 80,
        alignItems: 'center',
        paddingHorizontal: 5
      },
      stretch: {
        width: 60,
        height: 60,
        resizeMode: 'stretch',
      },
});
