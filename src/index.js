import './index.css';
import 'expose?jQuery!jquery';
import angular from 'angular';
import graphqlNotebookModule from './notebook/module'

angular.module('graphql-notebook-app', [graphqlNotebookModule.name]);
