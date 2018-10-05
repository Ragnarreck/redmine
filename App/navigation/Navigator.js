import { createStackNavigator, TabNavigator } from 'react-navigation';
import Login from '../containers/Login';
import MainPage from '../containers/MainPage';
import Issue from '../containers/CreateOrEditIssue';
import IssuesList from '../containers/IssuesList';
import ProjectDetails from '../components/ProjectDetails';

const RootNavigation = createStackNavigator(
    {
        Login: {
            screen: Login,
            navigationOptions: {
                header: null
            },
        },
        MainPage: {
            screen: MainPage,
            navigationOptions: {
                header: null
            },
        },
        IssuesList: {
            screen: IssuesList,
            navigationOptions: {
                header: null
            },
        },
        Issue: {
            screen: Issue,
            navigationOptions: {
                header: null
            },
        },
        ProjectDetails: {
            screen: ProjectDetails,
        },
    },
    { initialRouteName: 'Login' },
);

export default RootNavigation;
