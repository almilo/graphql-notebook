import { Injectable } from 'ng-forward';

@Injectable
export default class GraphQLAnnotationExtractorService {
    parse(annotatedSchemaText) {
        const schemaAnnotations = [],
            schemaText = annotatedSchemaText.replace(
                /@one\s*\((.*)\)\s+(type\s+(.*)\s+\{)/gi,
                captureAnnotation(schemaAnnotations)
            );

        return {
            schemaText,
            schemaAnnotations
        };

        function captureAnnotation(schemaAnnotations) {
            return function (match, annotationAttributesText, nextLineText, typeName) {
                const schemaAnnotation = new SchemaAnnotation(typeName);

                annotationAttributesText.replace(/\s*([^,]*?)\s*:\s*"(.*?)"/g, captureParameters(schemaAnnotation));

                schemaAnnotations.push(schemaAnnotation);

                return nextLineText;

                function captureParameters(schemaAnnotation) {
                    return function (match, attributeName, attributeValue) {
                        schemaAnnotation.set(attributeName, attributeValue);
                    }
                }
            }
        }
    }
}

class SchemaAnnotation {
    constructor(annotatedType) {
        this.annotatedType = annotatedType;
        this.attributes = {};
    }

    set(attributeName, attributeValue) {
        this.attributes[attributeName] = attributeValue;
    }

    toString() {
        return Object.keys(this.attributes).reduce(
            (text, attributeKey) => `${text}, ${attributeKey}: '${this.attributes[attributeKey]}'`,
            `Annotated object: '${this.annotatedType}'`
        );
    }
}
