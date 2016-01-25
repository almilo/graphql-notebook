import './css/index.css';
import angular from 'angular';
import graphqlQueryComponent from './index';

export default angular.module('graphql-query', ['ui.codemirror'])
    .component('graphqlQuery', graphqlQueryComponent);
