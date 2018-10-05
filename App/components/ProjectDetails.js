import React from 'react';
import moment from 'moment';
import Modal from 'react-native-modal';
import { View, Text, Button, TouchableOpacity, Image, ScrollView } from 'react-native';
import styles from '../styles/ProjectStyles';
import FastTrackTime from '../containers/FastTrackTime';
import Images from "../services/images/images";
import Toast from "react-native-simple-toast";
import R from "ramda";
import { getIssuesByProjectId } from "../services/projects";

export default class ProjectDetails extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('project').name,
    });

    state = {
        project: this.props.navigation.getParam('project'),
        showModal: false,
        showModalIssue: false,
        isLoading: true,
        issues: [],
        currentIssue: {}
    };

    componentWillMount() {
        getIssuesByProjectId(this.state.project.id)
            .then(res => this.setState(state => ({
                ...state,
                issues: R.path([ 'issues' ], res)
                    ? R.pipe(
                        R.path([ 'issues' ]),
                        R.map(item => ({ ...item, value: item.subject }))
                    )(res)
                    : [],
                isLoading: false,
            })))
            .catch(err => {
                console.log(err);
                Toast.show('Sorry, problems with services. Please, try again.', Toast.SHORT);
                this.setState({ isLoading: false, });
            });
    }

    hideModal = () => this.setState(state => ({ ...state, showModal: false, currentIssue: {} }));
    showModalIssue = () => this.setState(state => ({ ...state, showModalIssue: true }));
    hideModalIssue = () => this.setState(state => ({ ...state, showModalIssue: false }));

    renderIssue = issue => (
        <View style={styles.projectRow} key={issue.id}>
            <TouchableOpacity
                onPress={() => this.setState(state => ({ ...state, showModal: true, currentIssue: issue }))}>
                <Image style={styles.timerImage} source={Images.timer} />
            </TouchableOpacity>
            <View style={styles.infoWrapper}>
                <Text>{issue.subject}</Text>
                <Text>Author: {issue.author && issue.author.name}</Text>
            </View>
        </View>
    );

    renderTimeTrackingModal = project => (
        <Modal
            style={styles.modal}
            isVisible={this.state.showModal}
            onSwipe={this.hideModal}
            swipeDirection="up"
        >
            <FastTrackTime
                projectId={project.id}
                issues={this.state.issues}
                currentIssue={this.state.currentIssue}
                projectName={project.name}
                close={this.hideModal}
            />
        </Modal>
    );

    renderNewIssueModal = () => (
        <Modal
            style={styles.modal}
            isVisible={this.state.showModalIssue}
            onSwipe={this.hideModalIssue}
            swipeDirection="up"
        >
            <Text>Text</Text>
        </Modal>
    );

    render() {
        const { project } = this.state;
        console.log(this.state);
        return (
            <ScrollView>
                <View style={styles.wrapper}>
                    {project && (
                        <View style={styles.content}>
                            <Text style={styles.infoRow}>
                                Created: {moment(project.created_on).calendar()}
                            </Text>
                            <Text style={styles.infoRow}>
                                Last update: {moment(project.updated_on).calendar()}
                            </Text>
                            <Text style={styles.infoRow}>
                                {project.description
                                    ? `Description: ${project.description}`
                                    : "This project haven't description"}
                            </Text>
                            <View style={styles.issuesHeader}>
                                <Text style={styles.issuesTitle}>Issues</Text>
                                <TouchableOpacity style={styles.addButton} onPress={this.showModalIssue}>
                                    <Text style={styles.addButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.issuesContainer}>
                                {this.state.issues.map(this.renderIssue)}
                            </View>
                            <View>
                                {this.renderTimeTrackingModal(project)}
                            </View>
                            <View>
                                {this.renderNewIssueModal()}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    }
}
