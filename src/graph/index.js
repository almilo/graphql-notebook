import './index.css';
import { element } from 'angular';
import { Component, Inject, Input } from 'ng-forward';
import { render } from 'dagre-d3';
import d3 from 'd3';

const svgElementId = 'graphql-notebook-graph-svg',
    template = `
            <div class="graphql-graph">
                <svg id="${svgElementId}" width="800" height="600"></svg>
            </div>
            `;

@Component({
    selector: 'graphql-graph',
    template
})
@Inject('$scope')
export default class GraphQLGraph {
    // initialize because of https://github.com/ngUpgraders/ng-forward/issues/132
    @Input() graph = undefined;

    constructor($scope) {
        $scope.$watch(_ => this.graph, renderGraph);

        function renderGraph(graph) {
            element(`#${svgElementId}`).empty();

            if (graph) {
                const renderer = render(), svg = d3.select(`#${svgElementId}`), svgGroup = svg.append('g');

                renderer(d3.select(`#${svgElementId} g`), graph);

                svg.attr('width', graph.graph().width + 40);
                svg.attr('height', graph.graph().height + 40);
                svgGroup.attr('transform', `translate(20, 20)`);
            }
        }
    }
}
