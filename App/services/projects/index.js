const axios = require('axios');
const baseURL = 'https://redmine.aimprosoft.com';
const key = 'YS5pdmFub3Y6ZGFya2xvcmRlcjIwMTg';
const authorizationKey = { 'Authorization': 'Basic ' + key };


const getProjects = () => axios.get(`${baseURL}/projects.json`, {
    'method': 'GET',
    'headers': authorizationKey,
    'muteHttpExceptions': true
});

const getIssues = () => axios.get(`${baseURL}/issues.json`, {
    'method': 'GET',
    'headers': authorizationKey,
    'muteHttpExceptions': true
});

const getUser = () => axios.get(`${baseURL}/users/current.json`, {
    'method': 'GET',
    'headers': authorizationKey,
    'muteHttpExceptions': true
});

export { getProjects, getIssues, getUser };
