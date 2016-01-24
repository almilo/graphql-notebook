import './index.css';
import { render } from 'dagre-d3';
import d3 from 'd3';

const svgElementId = 'graphql-notebook-graph-svg';

export default {
    template: () => (`
            <div class="graphql-notebook-graph">
                <svg id="${svgElementId}" width="800" height="600"></svg>
            </div>`),
    bindings: {
        graph: '='
    },
    controller
}

function controller($scope) {
    $scope.$watch(_ => this.graph, renderGraph);

    function renderGraph(graph) {
        if (!graph) {
            return;
        }

        const renderer = render(), svg = d3.select(`#${svgElementId}`), svgGroup = svg.append('g');

        renderer(d3.select(`#${svgElementId} g`), graph);

        svg.attr('width', graph.graph().width + 40);
        svg.attr('height', graph.graph().height + 40);
        svgGroup.attr('transform', `translate(20, 20)`);
    }
}
