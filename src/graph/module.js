import angular from 'angular';
import graphqlGraphComponent from './index';

export default angular.module('graphql-graph', [])
    .component('graphqlGraph', graphqlGraphComponent);
