import { parse } from 'graphql/language';
import { printSchema } from 'graphql/utilities';
import { Component, Inject } from 'ng-forward';
import angularUiBootstrapModuleName from 'angular-ui-bootstrap';
import angularAnimateModuleName from 'angular-animate';
import GraphQLService from '../graphql/graphql-service';
import GraphQLGraphService from './graphql-graph-service';
import GraphQLQuery from '../query/index';
import GraphQLGraph from '../graph/index';

const defaultLocalSchema =
        `enum Episode { NEWHOPE, EMPIRE, JEDI }

type Human {
  id: String!
  name: String
  friends: [Character]
  appearsIn: [Episode]
  homePlanet: String
}

type Droid {
  id: String!
  name: String
  friends: [Character]
  appearsIn: [Episode]
  primaryFunction: String
}`,
    defaultRemoteSchemaUrl = 'http://localhost:3000/api/graphql',
    template = `
        <div class="row">
            <div class="col-md-6">
                <uib-accordion close-others="true" class="col-md-12">
                    <uib-accordion-group heading="Local schema" is-open="true">
                        <textarea ng-model="ctrl.localSchema" id="localSchema" class="form-control" rows="12"></textarea>
                        <label for="error">Errors</label>
                        <textarea ng-model="ctrl.error" id="error" class="form-control" rows="4" readonly></textarea>
                    </uib-accordion-group>
                    <uib-accordion-group heading="Remote schema">
                        <div class="input-group">
                            <input
                                ng-model="ctrl.remoteSchemaUrl"
                                placeholder="endpoint URL"
                                class="form-control">
                            <span class="input-group-btn">
                                <button
                                    (click)="ctrl.fetchRemoteSchema()"
                                    ng-disabled="!ctrl.remoteSchemaUrl"
                                    class="btn btn-danger pull-right">
                                    Fetch
                                </button>
                            </span>
                        </div>
                        <textarea ng-model="ctrl.remoteSchema" class="form-control" rows="12" readonly></textarea>
                    </uib-accordion-group>
                </uib-accordion>
            </div>
            <div class="col-md-6">
                <graphql-graph [(graph)]="ctrl.graph" class="col-md-12"></graphql-graph>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <graphql-query [(endpoint-url)]="ctrl.remoteSchemaUrl" class="col-md-12"></graphql-query>
            </div>
        </div>
`;

@Component({
    selector: 'graphql-notebook',
    directives: [GraphQLGraph, GraphQLQuery],
    providers: [angularUiBootstrapModuleName, angularAnimateModuleName],
    template
})
@Inject('$scope', GraphQLService, GraphQLGraphService)
export default class GraphQLNotebook {
    constructor($scope, graphqlService, graphqlGraphService) {
        this.localSchema = defaultLocalSchema;
        this.remoteSchemaUrl = defaultRemoteSchemaUrl;
        this.remoteSchema = '';
        this.graph = undefined;
        this.error = undefined;
        this.graphqlService = graphqlService;
        this.graphqlGraphService = graphqlGraphService;

        $scope.$watch(_ => this.localSchema, this.updateGraph.bind(this));
        $scope.$watch(_ => this.remoteSchema, this.updateGraph.bind(this));
    }

    fetchRemoteSchema() {
        if (!this.remoteSchemaUrl) {
            this.remoteSchema = '';
        } else {
            this.graphqlService.getClientSchema(this.remoteSchemaUrl)
                .then(clientSchema => this.remoteSchema = printSchema(clientSchema))
                .catch(_ => this.remoteSchema = '');
        }
    }

    updateGraph() {
        const mixedSchema = `${this.localSchema} \n ${this.remoteSchema}`.trim();

        this.graph = undefined;
        this.error = undefined;

        if (mixedSchema) {
            try {
                this.graph = this.graphqlGraphService.toGraph(parse(mixedSchema));
            } catch (error) {
                this.error = error;
            }
        }
    }
}
