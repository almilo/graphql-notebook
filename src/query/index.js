import './css/index.css';
import 'expose?CodeMirror!codemirror';
import 'expose?jsonlint!jsonlint/web/jsonlint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';
import 'angular-ui-codemirror';
import GraphQLService from '../graphql/graphql-service';
import { Component, Inject, Input } from 'ng-forward';

const template = `
    <div class="row">
        <div class="form-group col-md-6">
            <label>Query</label>
            <div
                ui-codemirror="{onLoad: ctrl.queryEditorLoaded}"
                ui-codemirror-opts="ctrl.queryEditorOptions"
                ng-model="ctrl.query">
            </div>
        </div>
        <div class="form-group col-md-6">
            <label >Variables</label>
            <div
                ui-codemirror="{onLoad: ctrl.variablesEditorLoaded}"
                ui-codemirror-opts="ctrl.variablesEditorOptions"
                ng-model="ctrl.variables">
            </div>
        </div>
    </div>
    <div class="row">
        <div class="form-group">
            <button (click)="ctrl.sendQuery()" ng-disabled="!ctrl.endpointUrl" class="btn btn-primary pull-right">Send</button>
        </div>
    </div>
    <div class="row">
        <div class="form-group">
            <label for="result">Result</label>
            <textarea id="result" ng-model="ctrl.result" class="form-control" rows="10" readonly></textarea>
        </div>
    </div>
`,
    defaultQuery = `
query person($personId: Int!) {
  people(id: $personId) {
    firstName
    lastName
  }
}`,
    defaultVariables = `
{
  "personId": 3
}
    `;

@Component({
    selector: 'graphql-query',
    providers: ['ui.codemirror'],
    template
})
@Inject('$filter', GraphQLService)
export default class GraphQLQuery {
    // initialize because of https://github.com/ngUpgraders/ng-forward/issues/132
    @Input() endpointUrl = undefined;

    constructor($filter, graphqlService) {
        this.jsonFilter = $filter('json');
        this.graphqlService = graphqlService;
        this.query = defaultQuery;
        this.variables = defaultVariables;
        this.result = undefined;
        this.queryEditorOptions = this.initializeEditorOptions('graphql', this, true);
        this.variablesEditorOptions = this.initializeEditorOptions('application/json', this, false);

        if (this.endpointUrl) {
            this.graphqlService.getClientSchema(this.endpointUrl).then(clientSchema => {
                this.queryEditorOptions.lint = {schema: clientSchema};
                this.queryEditorOptions.hintOptions.schema = clientSchema;
            });
        }
    }

    queryEditorLoaded(editor) {
        this.queryEditor = editor;
    }

    variablesEditorLoaded(editor) {
        this.variablesEditor = editor;
    }

    sendQuery() {
        this.graphqlService.executeQuery(this.endpointUrl, this.query, this.variables && JSON.parse(this.variables))
            .then(data => this.result = this.jsonFilter(data))
            .catch(errors => this.result = this.jsonFilter(errors));
    }

    initializeEditorOptions(mode, controller, isQueryEditor) {
        return {
            mode,
            lint: true,
            hintOptions: {
                closeOnUnfocus: false,
                completeSingle: false
            },
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
                'Cmd-Space': showHint,
                'Ctrl-Space': showHint,
                'Cmd-Enter': sendQuery,
                'Ctrl-Enter': sendQuery,
                'Ctrl-Left': 'goSubwordLeft',
                'Ctrl-Right': 'goSubwordRight',
                'Alt-Left': 'goGroupLeft',
                'Alt-Right': 'goGroupRight'
            }
        };

        function showHint() {
            const editor = isQueryEditor ? controller.queryEditor : controller.variablesEditor;

            editor.showHint({completeSingle: true});
        }

        function sendQuery() {
            controller.sendQuery();
        }
    }
}
