import angular from 'angular';
import graphqlService from './graphql-service';
import graphqlGraphService from './graphql-graph-service';
import graphqlNotebookComponent from './index';
import graphqlNotebookGraphComponent from './graph/index';

export default angular.module('graphql-notebook', ['ui.codemirror'])
    .factory('graphqlService', graphqlService)
    .factory('graphqlGraphService', graphqlGraphService)
    .component('graphqlNotebook', graphqlNotebookComponent)
    .component('graphqlNotebookGraph', graphqlNotebookGraphComponent);
