export default class {
    constructor($filter, graphqlService) {
        this.jsonFilter = $filter('json');
        this.graphqlService = graphqlService;
        this.query = `
query person($personId: Int!) {
  people(id: $personId) {
    firstName
    lastName
  }
}`;
        this.variables = `
{
  "personId": 3
}
    `;
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
