import { Injectable, Inject } from 'ng-forward';
import { printSchema } from 'graphql/utilities';
import GraphQLService from '../graphql/graphql-service';

@Injectable
@Inject('$http', GraphQLService)
export default class SchemaManagerService {
    schemas = {};

    constructor($http, graphqlService) {
        this.$http = $http;
        this.graphqlService = graphqlService;
    }

    addLocalSchema(name, text) {
        this.schemas[name] = new LocalSchema(name, text);
    }

    addRemoteSchema(name, endpointUrl) {
        return this.graphqlService.getClientSchema(endpointUrl)
            .then(clientSchema => printSchema(clientSchema))
            .then(schemaText => {
                this.schemas[name] = new RemoteSchema(name, schemaText, endpointUrl);

                return schemaText;
            });
    }

    getSchema = name => this.schemas[name];

    removeSchema = name => delete this.schemas[name];

    getMixedSchema() {
        const schemaNames = Object.keys(this.schemas);

        if (schemaNames.length === 0) {
            return '';
        }

        return schemaNames
            .map(schemaName => this.schemas[schemaName].text)
            .reduce((mixedSchemaText, schemaText) => `${mixedSchemaText} \n ${schemaText}`)
            .trim();
    }
}

class LocalSchema {
    constructor(name, text) {
        this.name = name;
        this.text = text;
    }
}

class RemoteSchema extends LocalSchema {
    constructor(name, text, endpointUrl) {
        super(name, text);
        this.endpointUrl = endpointUrl;
    }
}
