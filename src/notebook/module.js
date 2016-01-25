import angularUiBootstrapModuleName from 'angular-ui-bootstrap';
import angularAnimateModuleName from 'angular-animate';
import angular from 'angular';
import graphqlGraphService from './graphql-graph-service';
import graphqlNotebookComponent from './index';
import graphqlNotebookGraphComponent from './graph/index';

export default angular.module('graphql-notebook',
    [
        angularAnimateModuleName,
        angularUiBootstrapModuleName
    ])
    .factory('graphqlGraphService', graphqlGraphService)
    .component('graphqlNotebook', graphqlNotebookComponent)
    .component('graphqlNotebookGraph', graphqlNotebookGraphComponent);
