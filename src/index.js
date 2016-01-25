import './index.css';
import 'expose?jQuery!jquery';
import angular from 'angular';
import graphqlModule from './graphql/module'
import graphqlNotebookModule from './notebook/module'
import graphqlQueryModule from './query/module'

angular.module('graphql-notebook-app',
    [
        graphqlModule.name,
        graphqlNotebookModule.name,
        graphqlQueryModule.name
    ]);
