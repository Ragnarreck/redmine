import React from 'react';
import R from 'ramda';
import moment from 'moment';
import { View, Text } from 'react-native';
import styles from '../styles/IssueStyles';

export default class CreateOrEditIssue extends React.Component {
    getParam = path => R.defaultTo('', R.path(path, this.props.navigation.getParam('issue')));
    state = {
        id: this.getParam('id'),
        subject: this.getParam(['subject']),
        author: this.getParam(['author', 'name']),
        assigned_to: this.getParam(['assigned_to', 'name']),
        created: this.getParam(['created_on']),
        priority: this.getParam(['priority', 'name']),
        type: this.getParam(['tracker', 'name']),
    };

    render() {
        const { subject, author, assigned_to, created, priority, type } = this.state;
        console.log(this.state);
        return (
            <View style={styles.wrapper}>
                <Text>Title: {subject}</Text>
                <Text>Author: {author}</Text>
                <Text>Assigned to: {assigned_to}</Text>
                <Text>Created: {created ? moment(created).calendar() : "this task hasn't creation date"}</Text>
                <Text>Type: {type}</Text>
            </View>
        );
    }
}
