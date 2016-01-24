import { visit } from 'graphql/language';
import { graphlib } from 'dagre';
import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
    GraphQLID
} from 'graphql/type';

const ignoreTypesNames = [
    GraphQLBoolean.name,
    GraphQLFloat.name,
    GraphQLInt.name,
    GraphQLString.name,
    GraphQLID.name
];

export default function () {
    return function (schemaAst) {
        const graph = new graphlib.Graph()
            .setGraph({})
            .setDefaultEdgeLabel(_ => ({}))
            .setDefaultNodeLabel(_ => ({}));

        visit(schemaAst, graphBuilderVisitorFactory(graph));

        return graph;
    };

    function graphBuilderVisitorFactory(graph) {
        let currentParentTypeName;

        return {
            ObjectTypeDefinition(node) {
                currentParentTypeName = node.name.value;
                graph.setNode(currentParentTypeName, {label: currentParentTypeName});
            },
            FieldDefinition(node) {
                switch (node.type.kind) {
                    case 'NamedType':
                        maybeAddRelation(node);
                        break;
                    case 'ListType':
                        maybeAddRelation(node, 's');
                        break;
                }
            }
        };

        function maybeAddRelation(node, cardinality = '') {
            const fieldName = node.name.value, relatedTypeName = unwrapType(node).name.value;

            if (ignoreTypesNames.indexOf(relatedTypeName) === -1) {
                const label = `${currentParentTypeName} ${humanize(fieldName)} ${relatedTypeName}${cardinality}`;

                graph.setEdge(currentParentTypeName, relatedTypeName, {label});
            }
        }
    }
}

function unwrapType(typeNode) {
    if (!typeNode) {
        throw new Error('Cannot unwrap type!!');
    }

    return typeNode.kind === 'NamedType' ? typeNode : unwrapType(typeNode.type);
}

function humanize(camelCasedString) {
    return camelCasedString.replace(/([A-Z])/g, match => ` ${match.toLowerCase()}`);
}
