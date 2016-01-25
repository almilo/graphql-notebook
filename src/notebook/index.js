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
        <uib-accordion close-others="true" class="col-md-6">
            <uib-accordion-group heading="Local schema" is-open="true">
                <textarea ng-model="notebookController.localSchema" id="localSchema" class="form-control" rows="12"></textarea>
                <label for="error">Errors</label>
                <textarea ng-model="notebookController.error" id="error" class="form-control" rows="4"></textarea>
            </uib-accordion-group>
            <uib-accordion-group heading="Remote schema">
                <div class="input-group">
                    <input ng-model="notebookController.remoteSchemaUrl" class="form-control">
                    <span class="input-group-btn">
                        <button ng-click="notebookController.fetchRemoteSchema()" class="btn btn-danger pull-right">Fetch</button>
                    </span>
                </div>
                <textarea ng-model="notebookController.remoteSchema" class="form-control" rows="12" readonly></textarea>
            </uib-accordion-group>
        </uib-accordion>
        <graphql-notebook-graph graph="notebookController.graph" class="col-md-6"></graphql-notebook-graph>
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
