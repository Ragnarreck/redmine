import React from 'react';
import {  View } from 'react-native';
import Form from './Form';
import styles from '../styles/LoginStyles';

export default class Login extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Form navigation={this.props.navigation} />
            </View>
        );
    }
}
