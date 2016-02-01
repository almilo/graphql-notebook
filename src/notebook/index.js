import { parse } from 'graphql/language';
import { Component, Inject } from 'ng-forward';
import angularUiBootstrapModuleName from 'angular-ui-bootstrap';
import angularAnimateModuleName from 'angular-animate';
import GraphQLService from '../graphql/graphql-service';
import GraphQLSchemaManagerService from '../schema/schema-manager-service';
import GraphQLGraphService from './graphql-graph-service';
import GraphQLAnnotationExtractorService from '../annotation/graphql-annotation-extractor-service';
import GraphQLQuery from '../query/index';
import GraphQLGraph from '../graph/index';

const remoteSchemaName = 'remote',
    localSchemaName = 'local',
    defaultLocalSchema =
        `@one(entity: "FrontendObject", mappedFields: "id,firstName,lastName")
type Person {
  id: Int!
  firstName: String
  secondName: String
}

type OfficeQuery {
  people(id: Int): [Person]
}
`,
    defaultRemoteSchemaUrl = 'http://localhost:3000/api/graphql',
    template = `
        <div class="row">
            <div class="col-md-6">
                <uib-accordion close-others="true" class="col-md-12">
                    <uib-accordion-group heading="Local schema" is-open="true">
                        <textarea
                            ng-model="ctrl.localSchema"
                            ng-change="ctrl.updateLocalSchema(ctrl.localSchema)"
                            class="form-control" rows="12">
                        </textarea>
                        <label for="annotations">Annotations</label>
                        <textarea
                            ng-model="ctrl.localSchemaAnnotations"
                            id="annotations"
                            class="form-control"
                            rows="4"
                            readonly>
                        </textarea>
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
                                    (click)="ctrl.updateRemoteSchema(ctrl.remoteSchemaUrl)"
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
@Inject('$scope', GraphQLService, GraphQLGraphService, GraphQLSchemaManagerService, GraphQLAnnotationExtractorService)
export default class GraphQLNotebook {
    constructor($scope, graphqlService, graphqlGraphService, graphqlSchemaManagerService, graphqlAnnotationExtractorService) {
        this.localSchema = defaultLocalSchema;
        this.localSchemaAnnotations = '';
        this.remoteSchemaUrl = defaultRemoteSchemaUrl;
        this.remoteSchema = '';
        this.graph = undefined;
        this.error = undefined;
        this.graphqlService = graphqlService;
        this.graphqlGraphService = graphqlGraphService;
        this.graphqlSchemaManagerService = graphqlSchemaManagerService;
        this.graphqlAnnotationExtractorService = graphqlAnnotationExtractorService;

        this.updateLocalSchema(this.localSchema);

        $scope.$watch(_ => this.graphqlSchemaManagerService.getMixedSchema(), this.updateGraph.bind(this));
    }

    updateLocalSchema(localSchema) {
        this.graphqlSchemaManagerService.removeSchema(localSchemaName);
        if (localSchema) {
            this.graphqlSchemaManagerService.addLocalSchema(localSchemaName, localSchema);
        }
    }

    updateRemoteSchema(remoteSchemaUrl) {
        this.remoteSchema = '';
        this.graphqlSchemaManagerService.removeSchema(remoteSchemaName);
        if (remoteSchemaUrl) {
            this.graphqlSchemaManagerService.addRemoteSchema(remoteSchemaName, remoteSchemaUrl)
                .then(remoteSchema => this.remoteSchema = remoteSchema)
                .catch(error => this.remoteSchema = `Error while retrieving remote schema:\n${JSON.stringify(error)}`);
        }
    }

    updateGraph(mixedSchemaText) {
        this.graph = undefined;
        this.error = undefined;

        if (mixedSchemaText) {
            try {
                const {schemaText, schemaAnnotations} = this.graphqlAnnotationExtractorService.parse(mixedSchemaText),
                    schemaAst = parse(schemaText);

                this.graph = this.graphqlGraphService.toGraph(schemaAst);
                this.localSchemaAnnotations = schemaAnnotations.reduce(
                    (text, schemaAnnotation) => `${text}${schemaAnnotation.toString()}\n`,
                    ''
                );
            } catch (error) {
                this.error = error;
            }
        }
    }
}
