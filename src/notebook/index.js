import { parse } from 'graphql/language';
import { printSchema } from 'graphql/utilities';

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
                    <textarea ng-model="notebookController.localSchema" id="localSchema" class="form-control" rows="12"></textarea>
                    <label for="error">Errors</label>
                    <textarea ng-model="notebookController.error" id="error" class="form-control" rows="4" readonly></textarea>
                </uib-accordion-group>
                <uib-accordion-group heading="Remote schema">
                    <div class="input-group">
                        <input
                            ng-model="notebookController.remoteSchemaUrl"
                            placeholder="endpoint URL"
                            class="form-control">
                        <span class="input-group-btn">
                            <button
                                ng-click="notebookController.fetchRemoteSchema()"
                                ng-disabled="!notebookController.remoteSchemaUrl"
                                class="btn btn-danger pull-right">
                                Fetch
                            </button>
                        </span>
                    </div>
                    <textarea ng-model="notebookController.remoteSchema" class="form-control" rows="12" readonly></textarea>
                </uib-accordion-group>
            </uib-accordion>
        </div>
        <div class="col-md-6">
            <graphql-notebook-graph graph="notebookController.graph" class="col-md-12"></graphql-notebook-graph>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <graphql-query endpoint-url="notebookController.remoteSchemaUrl" class="col-md-12"></graphql-query>
        </div>
    </div>
`;

class controller {
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
                this.graph = this.graphqlGraphService(parse(mixedSchema));
            } catch (error) {
                this.error = error;
            }
        }
    }
}

export default {
    template,
    controller,
    controllerAs: 'notebookController'
}
