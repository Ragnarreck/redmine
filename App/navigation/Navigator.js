import { createStackNavigator } from 'react-navigation';
import Login from '../containers/Login';
import MainPage from '../containers/MainPage';
import Issue from '../containers/CreateOrEditIssue';
import IssuesList from '../containers/IssuesList';

const RootNavigation = createStackNavigator(
    {
        Login: {
            screen: Login,
        },
        MainPage: {
            screen: MainPage,
        },
        IssuesList: {
            screen: IssuesList,
        },
        Issue: {
            screen: Issue,
        },
    },
    { initialRouteName: 'Login', headerMode: 'none' },
);

export default RootNavigation;
