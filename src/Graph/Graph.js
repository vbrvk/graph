import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


const force = d3.layout.force();

const mergeData = (prev, next) => {
  next.forEach((node) => {
    const prevNode = prev.find(prevNodesEl => prevNodesEl.id === node.id);
    if (prevNode) {
      node.x = prevNode.x; // eslint-disable-line
      node.y = prevNode.y; // eslint-disable-line
      node.px = prevNode.px; // eslint-disable-line
      node.py = prevNode.py; // eslint-disable-line
      node.fixed = prevNode.fixed; // eslint-disable-line
    }
  });
  return next;
};

export default class Graph extends Component {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    settings: PropTypes.shape({
      charge: PropTypes.number,
      linkDistance: PropTypes.number,
      friction: PropTypes.number,
      rectPadding: PropTypes.number,
    }),
    graphData: PropTypes.shape({
      links: PropTypes.array,
      nodes: PropTypes.array,
    }).isRequired,
    className: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    width: '100%',
    height: '100%',
    settings: {
      charge: -1500,
      linkDistance: 50,
      friction: 0.8,
      rectPadding: 15,
    },
    className: 'Graph',
    colors: ['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF'],
  }

  componentDidMount() {
    const {
      width,
      height,
      settings: { charge, linkDistance, friction, rectPadding },
      graphData: {
        links,
        nodes,
      },
      colors,
    } = this.props;

    this.drag = force.drag().on('dragstart', this.dragstart);

    this.svg = d3.select(this.graph)
      .attr('width', width)
      .attr('height', height);

    this.links = this.svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link');

    this.nodes = this.svg.selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .on('dblclick', this.dblclick)
      .call(this.drag);

    this.texts = this.nodes.append('text')
       .attr('class', 'text')
       .text(d => d.value);

    this.nodes.append('rect')
      .attr('class', 'rect')
      .attr('fill', d => colors[d.deep % colors.length])
      .attr('width', function () {
        return this.parentNode.getBBox().width + rectPadding;
      })
      .attr('height', function () {
        return this.parentNode.getBBox().height + rectPadding;
      });

    this.texts
      .attr('x', function () {
        return d3.select(this.parentNode).select('rect').attr('width') / 2;
      })
      .attr('y', function () {
        return d3.select(this.parentNode).select('rect').attr('height') / 2;
      });

    this.nodes.select('text').each(function () {
      this.parentNode.appendChild(this);
    });

    this.svgSize = {
      width: this.svg[0][0].clientWidth,
      height: this.svg[0][0].clientHeight,
    };
    this.force = force
        .nodes(nodes)
        .links(links)
        .size([this.svgSize.width, this.svgSize.height])
        .charge(charge)
        .linkDistance(linkDistance)
        .friction(friction)
        .gravity(0.1)
        .on('tick', this.createTick(this.links, this.nodes))
        .start();
  }

  componentWillUpdate(nextProps) {
    const {
      graphData: {
        links,
        nodes,
      },
    } = nextProps;

    const nextNodes = mergeData(this.props.graphData.nodes, nodes);
    const { settings: { rectPadding }, colors } = this.props;


    this.links = this.svg.selectAll('.link').data(links);
    this.links
      .enter().insert('line', ':first-child')
      .attr('class', 'link');
    this.links.exit().remove();

    this.nodes = this.svg.selectAll('.node').data(nextNodes);

    const enterNodes = this.nodes.enter()
      .append('g')
      .attr('class', 'node')
      .on('dblclick', this.dblclick)
      .call(this.drag);

    enterNodes.append('text');
    enterNodes.append('rect');

    this.nodes.exit().remove();
    this.nodes.selectAll('*').remove();


    this.texts = this.nodes.append('text')
      .data(nextNodes)
      .attr('class', 'text')
      .text(d => d.value);

    this.nodes.append('rect')
      .data(nextNodes)
      .attr('class', 'rect')
      .attr('fill', d => colors[d.deep % colors.length])
      .attr('width', function () {
        return this.parentNode.getBBox().width + rectPadding;
      })
      .attr('height', function () {
        return this.parentNode.getBBox().height + rectPadding;
      })
      .classed('fixed', d => d.fixed);

    this.texts
      .attr('x', function () {
        return d3.select(this.parentNode).select('rect').attr('width') / 2;
      })
      .attr('y', function () {
        return d3.select(this.parentNode).select('rect').attr('height') / 2;
      });

    this.nodes.select('text').each(function () {
      this.parentNode.appendChild(this);
    });

    this.force = this.force
      .links(links)
      .nodes(nextNodes)
      .size([this.svgSize.width, this.svgSize.height])
      .on('tick', this.createTick(this.links, this.nodes))
      .start();
  }

  createTick(links, nodes) { //eslint-disable-line
    return function (e) {
      const k = 16 * e.alpha;
      links.each((d) => { d.source.y -= k, d.target.y += k; }) //eslint-disable-line
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
      nodes.attr('transform',
        function (d) {
          const rect = d3.select(this).select('rect');
          const rectX = d.x - (rect.attr('width') / 2);
          const rectY = d.y - (rect.attr('height') / 2);

          return `translate(${rectX}, ${rectY})`;
        });
    };
  }

  dblclick(d) {
    d3.select(this).select('rect').classed('fixed', d.fixed = false); //eslint-disable-line
  }

  dragstart(d) {
    d3.select(this).select('rect').classed('fixed', d.fixed = true); //eslint-disable-line
  }

  render() {
    return (
      <svg className={this.props.className} ref={((svg) => { this.graph = svg; })} />
    );
  }
}
