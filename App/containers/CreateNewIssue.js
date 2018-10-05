import R from 'ramda';
import moment from 'moment';
import Modal from 'react-native-modal';
import React, { Fragment } from 'react';
import Toast from 'react-native-simple-toast';
import { Dropdown } from 'react-native-material-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, Button } from 'react-native';

import styles from '../styles/MainStyles';
import { getIssuesByProjectId, createTimeSheet } from '../services/projects/index';

export default class CreateNewIssue extends React.Component {
    state = {};

    componentWillUnmount() {
        this.setState(state => ({ ...state, showDatePicker: false }));
    }

    handleIssueChange = value => {
        const issue = R.pipe(R.filter(item => item.value === value), R.head)(this.state.issues);
        this.setState(state => ({ ...state, currentIssue: R.defaultTo({}, issue) }));
    };

    onDateChange = date => this.setState(state => ({
        ...state,
        showDatePicker: false,
        timeSheetInfo: { ...state.timeSheetInfo, spentOn: date }
    }));

    hideModal = () => this.setState(state => ({ ...state, showDatePicker: false, }));

    handleActivityChange = text => this.setState(state => ({
        ...state,
        timeSheetInfo: { ...state.timeSheetInfo, activity: text }
    }));

    validate = result => ({
        activity: result.activity && R.pipe(
            R.reduce((acc, it) => ([ ...acc, it.value ]), []),
            R.lastIndexOf(result.activity),
            lastIndex => lastIndex !== -1
        )(this.state.activityOptions),
        hours: result.hours && !isNaN(result.hours),
    });

    submitTimeSheet = () => {
        const isValid = Object
            .values(this.validate(this.state.timeSheetInfo))
            .every(item => !!item);
        if (isValid) {
            const result = {
                ...this.state.timeSheetInfo,
                issueId: this.state.currentIssue.id,
                activity: R.pipe(
                    R.filter(item => item.value === this.state.timeSheetInfo.activity),
                    R.head
                )(this.state.activityOptions)
            };

            createTimeSheet(result)
                .then(() => Toast.show('Timesheet successfully submitted', Toast.SHORT))
                .catch(err => console.log(err));
        } else Toast.show('You have empty fields', Toast.SHORT);
    };

    render() {
        const { issues, currentIssue, isLoading, timeSheetInfo, showDatePicker, activityOptions } = this.state;
        return (
            <View>
                {isLoading
                    ? (
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                            </View>
                            <TouchableOpacity style={styles.closeIcon} onPress={this.props.close}>
                                <Text style={styles.closeIconText}>X</Text>
                            </TouchableOpacity>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    )
                    : (
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={{ fontSize: 20, }}>
                                    {this.props.projectName}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.closeIcon} onPress={this.props.close}>
                                <Text style={styles.closeIconText}>X</Text>
                            </TouchableOpacity>
                            <View style={styles.modalInfo}>
                                <Dropdown
                                    data={issues}
                                    value={currentIssue.value}
                                    onChangeText={this.handleIssueChange}
                                    label="Select issue"
                                />
                            </View>
                            {!R.isEmpty(currentIssue) &&
                            <Fragment>
                                <Text style={styles.itemText}>Issue: {currentIssue.value}</Text>
                                < TouchableOpacity
                                    onPress={() => this.setState(state => ({ ...state, showDatePicker: true }))}>
                                    <Text style={styles.itemText}>
                                        Date: {moment(timeSheetInfo.spentOn).format('MM-DD-YYYY')}
                                    </Text>
                                </TouchableOpacity>
                                <Modal
                                    style={[ styles.calendarModel, styles.itemText ]}
                                    isVisible={showDatePicker}
                                    onSwipe={this.hideModal}
                                    swipeDirection="up"
                                >
                                    <CalendarPicker onDateChange={this.onDateChange} width={400} height={300} />
                                </Modal>
                                <TextInput
                                    style={[ styles.searchInput, styles.itemText ]}
                                    placeholder="Hours *"
                                    keyboardType="numeric"
                                    value={timeSheetInfo.hours}
                                    onChangeText={text => this.setState(state => ({
                                        ...state,
                                        timeSheetInfo: { ...state.timeSheetInfo, hours: text }
                                    }))}
                                />
                                <Dropdown
                                    data={activityOptions}
                                    value={timeSheetInfo.activity}
                                    onChangeText={this.handleActivityChange}
                                    label="Select activity"
                                />
                                <Button title="Submit" onPress={this.submitTimeSheet} />
                            </Fragment>
                            }
                        </View>
                    )}
            </View>
        );
    }
}
