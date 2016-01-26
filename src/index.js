import './index.css';
import 'expose?jQuery!jquery';
import 'angular';
import 'reflect-metadata';
import { bootstrap } from 'ng-forward';
import GraphQLNotebook from './notebook/index';

bootstrap(GraphQLNotebook);
