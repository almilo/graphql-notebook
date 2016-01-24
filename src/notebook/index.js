import './index.css';
import { parse } from 'graphql/language';
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
    template = `
    <div class="row">
        <textarea ng-model="notebookController.schema" class="graphql-notebook-schema col-md-6"></textarea>
        <graphql-notebook-graph graph="notebookController.graph" class="col-md-6"></graphql-notebook-graph>
    </div>
    <div class="row">
        <textarea ng-model="notebookController.error" class="graphql-notebook-error col-md-6"></textarea>
    </div>
`;

class controller {
    constructor($scope, graphqlGraphService) {
        this.schema = defaultSchema;
        this.graph = undefined;
        this.error = undefined;

        $scope.$watch(_ => this.schema, updateGraph.bind(this));

        function updateGraph(schema) {
            try {
                this.graph = graphqlGraphService(parse(schema));
                this.error = undefined;
            } catch (error) {
                this.graph = undefined;
                this.error = error;
            }
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
