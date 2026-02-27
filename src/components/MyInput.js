import { TextInput, StyleSheet, View, Text } from 'react-native';

export default function (props) {
    return (<View>
        <Text style={{marginTop: 5, color: "#ca4e18", fontSize: 14, fontFamily: "RobotoCondensed_600SemiBold"}}>{props.labelName}</Text>
        <TextInput
            autoCorrect={false}
            {...props}
            style={[css.inputField, props.style]} />
    </View>
    )
}

const css = StyleSheet.create({
    inputField: {
        padding: 5,
        borderColor: "#999999",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        placeholderTextColor: "#515050",
    },

});