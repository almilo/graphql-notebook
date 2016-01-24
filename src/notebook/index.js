import { parse } from 'graphql/language';
import { printSchema } from 'graphql/utilities';
import CodeMirror from 'expose?CodeMirror!codemirror';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'angular-ui-codemirror';

const defaultSchema =
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
    defaultEndpointUrl = 'http://localhost:3000/api/graphql',
    template = `
        <div class="form-group">
            <label for="endpointUrl">Remote endpoint</label>
            <input ng-model="notebookController.endpointUrl" class="form-control" id="endpointUrl">
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label for="schema">Schema</label>
                <textarea ng-model="notebookController.schema" id="schema" class="form-control" rows="12"></textarea>
            </div>
            <graphql-notebook-graph graph="notebookController.graph" class="col-md-6"></graphql-notebook-graph>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label for="error">Error</label>
                <textarea ng-model="notebookController.error" id="error" class="form-control" rows="4"></textarea>
            </div>
        </div>
`;

class controller {
    constructor($scope, graphqlService, graphqlGraphService) {
        this.endpointUrl = defaultEndpointUrl;
        this.remoteSchema = '';
        this.schema = defaultSchema;
        this.graph = undefined;
        this.error = undefined;
        this.graphqlService = graphqlService;
        this.graphqlGraphService = graphqlGraphService;

        $scope.$watch(_ => this.endpointUrl, this.updateRemoteSchema.bind(this));
        $scope.$watch(_ => this.remoteSchema, this.updateGraph.bind(this));
        $scope.$watch(_ => this.schema, this.updateGraph.bind(this));
    }

    updateRemoteSchema(endpointUrl) {
        if (!endpointUrl) {
            this.remoteSchema = '';
        } else {
            this.graphqlService.getClientSchema(endpointUrl)
                .then(clientSchema => this.remoteSchema = printSchema(clientSchema))
                .catch(_ => this.remoteSchema = '');
        }
    }

    updateGraph() {
        const bothSchemas = this.remoteSchema + '\n' + this.schema;

        try {
            this.graph = this.graphqlGraphService(parse(bothSchemas));
            this.error = undefined;
        } catch (error) {
            this.graph = undefined;
            this.error = error;
        }
    }

    initializeEditorOptions() {
        return {
            mode: 'javascript',
            lineNumbers: true,
            lineWrapping: true,
            tabSize: 2,
            autoCloseBrackets: true,
            matchBrackets: true,
            showCursorWhenSelecting: true,
            foldGutter: {
                minFoldSize: 4
            },
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            extraKeys: {
                'Ctrl-Left': 'goSubwordLeft',
                'Ctrl-Right': 'goSubwordRight',
                'Alt-Left': 'goGroupLeft',
                'Alt-Right': 'goGroupRight'
            }
        };
    }
}

export default {
    template,
    controller,
    controllerAs: 'notebookController'
}
