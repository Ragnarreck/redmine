import React, { Fragment } from 'react';
import { Text, View, Picker, TextInput, Button, ScrollView } from 'react-native';
import R from 'ramda';
import moment from 'moment';
import styles from '../styles/MainStyles';
import { getIssues, getUser } from '../services/projects/index';


export default class IssuesList extends React.Component {
    state = {
        issues: []
    };

    componentDidMount() {
        getIssues().then(res => this.setIssues(R.path([ 'data', 'issues' ], res))).catch(err => console.log(err));
    }

    setIssues = issues => issues && this.setState(state => ({
        ...state,
        issues: issues.map(item => ({ value: item.subject, ...item }))
    }));

    renderIssue = issue => (
        <View style={styles.issueRow} key={issue.id}>
            <View style={styles.issueRowTitle}><Text>{issue.value}</Text></View>
            <View style={styles.issueRowBody}>
                <View>
                    <Text>Author: {issue.author.name}</Text>
                    <Text>Type: {issue.tracker.name.toLowerCase()}</Text>
                    {issue.description ? <Text>Description: {issue.description}</Text> : null}
                </View>
                {this.state.user.id === issue.author.id &&
                <Button title="Edit" style={styles.issueEdit} onPress={() => this.editIssue(issue)} />}
            </View>
        </View>
    );

    render() {
        const { issues } = this.props;
        return (
            <ScrollView>
                {issues.map(this.renderIssue)}
            </ScrollView>
        );
    }
}
