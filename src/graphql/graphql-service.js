import {
    buildClientSchema,
    introspectionQuery
} from 'graphql/utilities';

const patchedIntrospectionQuery = introspectionQuery.replace('subscriptionType { name }', '');

export default function ($http, $q) {
    return {
        getClientSchema,
        executeQuery
    };

    function getClientSchema(endpointUrl) {
        return executeQuery(endpointUrl, patchedIntrospectionQuery).then(schema => buildClientSchema(schema));
    }

    function executeQuery(endpointUrl, query, variables) {
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

        return $http.get(endpointUrl, config).then(extractResult);

        function extractResult(response) {
            return response.data.errors && response.data.errors.length > 0 ? $q.reject(response.data.errors) : response.data.data;
        }
    }
}
