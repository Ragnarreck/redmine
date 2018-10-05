const moment = require('moment');
const baseURL = 'https://redmine.aimprosoft.com';
const config = null;
//config is object with your apiKey and userKey

//https://redmine.aimprosoft.com/private_time_entries

const getProjects = () => fetch(`${baseURL}/projects.json`, {
    method: 'GET',
    headers: { 'X-Redmine-API-Key': config.apiKey },
}).then(res => res.json());

const getIssuesByProjectId = projectId => fetch(`${baseURL}/issues.json?project_id=${projectId}`, {
    method: 'GET',
    headers: { 'X-Redmine-API-Key': config.apiKey },
}).then(res => res.json());

const getUser = () => fetch(`${baseURL}/users/current.json`, {
    method: 'GET',
    headers: { 'X-Redmine-API-Key': config.apiKey },
}).then(res => res.json());

const createTimeSheet = timeSheet =>
    fetch(`${baseURL}/time_entries.json`, {
        method: 'POST',
        headers: {
            'X-Redmine-API-Key': config.apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            time_entry: {
                issue_id: timeSheet.issueId,
                activity_id: timeSheet.activity.index,
                spent_on: moment(timeSheet.spentOn).format('YYYY-MM-DD'),
                hours: timeSheet.hours,
            },
        })
    }).then(res => res.json());

export { getProjects, getIssuesByProjectId, getUser, createTimeSheet };
