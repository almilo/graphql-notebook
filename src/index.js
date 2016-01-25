import './index.css';
import 'expose?jQuery!jquery';
import angular from 'angular';
import graphql from './graphql/module'
import graphqlNotebookModule from './notebook/module'

angular.module('graphql-notebook-app',
    [
        graphql.name,
        graphqlNotebookModule.name
    ]);
