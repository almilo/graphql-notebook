import CodeMirror from 'expose?CodeMirror!codemirror';
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
import controller from './controller';

const template = `
    <div class="row">
        <div class="form-group col-md-6">
            <label>Query</label>
            <div
                ui-codemirror="{onLoad: editorController.queryEditorLoaded}"
                ui-codemirror-opts="editorController.queryEditorOptions"
                ng-model="editorController.query">
            </div>
        </div>
        <div class="form-group col-md-6">
            <label >Variables</label>
            <div
                ui-codemirror="{onLoad: editorController.variablesEditorLoaded}"
                ui-codemirror-opts="editorController.variablesEditorOptions"
                ng-model="editorController.variables">
            </div>
        </div>
    </div>
    <div class="row">
        <div class="form-group">
            <button ng-click="editorController.sendQuery()" ng-disabled="!editorController.endpointUrl" class="btn btn-primary pull-right">Send</button>
        </div>
    </div>
    <div class="row">
        <div class="form-group">
            <label for="result">Result</label>
            <textarea id="result" ng-model="editorController.result" class="form-control" rows="10" readonly></textarea>
        </div>
    </div>
`;

export default {
    template,
    bindings: {
      endpointUrl: '='
    },
    controller,
    controllerAs: 'editorController'
}
