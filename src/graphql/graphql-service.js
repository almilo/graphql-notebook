import {
    buildClientSchema,
    introspectionQuery
} from 'graphql/utilities';
import { Injectable, Inject } from 'ng-forward';

const patchedIntrospectionQuery = introspectionQuery.replace('subscriptionType { name }', '');

@Injectable
@Inject('$http', '$q')
export default class GraphQLService {
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    getClientSchema(endpointUrl) {
        return this.executeQuery(endpointUrl, patchedIntrospectionQuery).then(schema => buildClientSchema(schema));
    }

    executeQuery(endpointUrl, query, variables) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            params: {
                query: query || '{}',
                variables: variables || '{}'
            }
        };

        return this.$http.get(endpointUrl, config).then(extractResult);

        function extractResult(response) {
            return response.data.errors && response.data.errors.length > 0 ?
                $q.reject(response.data.errors) :
                response.data.data;
        }
    }
}
