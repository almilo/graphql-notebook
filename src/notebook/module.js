import angular from 'angular';
import angularUiBootstrapModuleName from 'angular-ui-bootstrap';
import angularAnimateModuleName from 'angular-animate';
import graphqlGraphModule from '../graph/module';
import graphqlGraphService from './graphql-graph-service';
import graphqlNotebookComponent from './index';

export default angular.module('graphql-notebook',
    [
        angularAnimateModuleName,
        angularUiBootstrapModuleName,
        graphqlGraphModule.name
    ])
    .factory('graphqlGraphService', graphqlGraphService)
    .component('graphqlNotebook', graphqlNotebookComponent);
