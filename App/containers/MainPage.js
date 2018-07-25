import React, { Fragment } from 'react';
import { Text, View, TextInput, Button, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import R from 'ramda';
import moment from 'moment';
import styles from '../styles/MainStyles';
import { getUser } from '../services/projects/index';
import Images from '../services/images/images';

export default class MainPage extends React.Component {
    getParam = name => R.path([ 'data', name ], this.props.navigation.getParam(name));

    state = {
        projects: this.getParam('projects'),
        filteredProjects: this.getParam('projects').map(item => ({ key: item.name, ...item })),
        searchValue: '',
        user: {},
        showModal: false,
        selectedProject: {},
    };

    componentDidMount() {
        getUser().then(res => this.setUser(R.path([ 'data', 'user' ], res))).catch(err => console.log(err));
    }

    setUser = info => info && this.setState(state => ({
        ...state,
        user: info,
    }));

    handleSearch = text => this.setState({ searchValue: text });

    editIssue = currentIssue => this.props.navigation.navigate('Issue', {
        navigation: this.props.navigation,
        issue: currentIssue,
    });

    searchProjects = () => {
        const { searchValue } = this.state;
        const filteredProjects = R.pipe(
            R.filter(item => R.contains(searchValue.toLowerCase().trim(), item.name.toLowerCase().trim())),
            R.map(item => ({ key: item.name, ...item })),
        )(this.state.projects);
        this.setState(state => ({
            ...state,
            filteredProjects: filteredProjects,
        }));
    };

    renderProject = project => (
        <View style={styles.projectRow} key={project.id}>
            <TouchableOpacity
                onPress={() => this.setState(state => ({ ...state, showModal: true, selectedProject: project }))}>
                <Image style={styles.timerImage} source={Images.timer} />
            </TouchableOpacity>
            <View style={styles.infoWrapper}>
                <Text>{project.name}</Text>
                <Text>Created: {moment(project.created_on).calendar()}</Text>
            </View>
        </View>
    );

    render() {
        console.log(this.state);
        const { searchValue, filteredProjects, selectedProject } = this.state;

        return (
            <Fragment>
                <ScrollView>
                    <View style={styles.wrapper}>
                        <View style={styles.mainHeader}>
                            <Text style={styles.mainHeaderText}>Your projects</Text>
                        </View>
                        <View>
                            <View style={styles.searchSection}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search project"
                                    value={searchValue}
                                    onChangeText={this.handleSearch}
                                />
                                <Button
                                    title="Search"
                                    onPress={this.searchProjects}
                                />
                            </View>
                            <FlatList
                                data={filteredProjects}
                                renderItem={({ item }) => this.renderProject(item)}
                            />
                        </View>
                    </View>
                </ScrollView>
                <Modal style={styles.modal} isVisible={this.state.showModal}>
                    <View>
                        <Text>{selectedProject.name}</Text>
                    </View>
                </Modal>
            </Fragment>
        );
    }
}
