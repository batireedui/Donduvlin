import { TextInput, StyleSheet, View, Text } from 'react-native';

export default function (props) {
    return (<View>
        <Text style={{marginTop: 5, color: "#0081FF", fontSize: 11, fontWeight: 'bold'}}>{props.labelName}</Text>
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
        borderBottomColor: "grey",
        borderBottomWidth: 1
    },

});