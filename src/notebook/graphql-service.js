import {
    buildClientSchema,
    introspectionQuery
} from 'graphql/utilities';

export default function ($http, $q) {
    return {
        getClientSchema,
        executeQuery
    };

    function getClientSchema(endpointUrl) {
        return executeQuery(endpointUrl, introspectionQuery).then(schema => buildClientSchema(schema));
    }

    function executeQuery(endpointUrl, query, variables) {
        const data = {
                query: query || '{}',
                variables: variables || '{}'
            },
            config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

        return $http.post(endpointUrl, data, config).then(extractResult);

        function extractResult(response) {
            return response.data.errors ? $q.reject(response.data.errors) : response.data.data;
        }
    }
}
