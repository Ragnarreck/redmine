import React from 'react';
import { View, Text, TextInput, Button, ImageBackground } from 'react-native';

import { getProjects } from '../services/projects/index';

import styles from '../styles/FormStyles';
import images from '../services/images/images';

export default class Form extends React.Component {
    state = {
        login: '',
        password: '',
        count: 0,
    };

    handleChange = ({ type, text }) => this.setState(state => ({ ...state, [ type ]: text }));
    onClick = () => getProjects()
        .then(resp => this.props.navigation.navigate('MainPage', { projects: resp, navigation: this.props.navigation }))
        .catch(err => console.log(err));

    render() {
        console.log(this.props);
        return (
            <View>
                <ImageBackground
                    imageStyle={{ resizeMode: 'cover' }}
                    style={styles.backgroundImage}
                    source={images.loginBackground}>
                    <View style={styles.wrapper}>
                        <TextInput
                            style={styles.input}
                            value={this.state.login}
                            placeholder="Enter your login"
                            onChangeText={text => this.handleChange({ type: 'login', text })} />
                        <TextInput
                            style={styles.input}
                            value={this.state.password}
                            placeholder="Enter your password"
                            onChangeText={text => this.handleChange({ type: 'password', text })} />
                        <Button title="Submit" onPress={this.onClick} />
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
