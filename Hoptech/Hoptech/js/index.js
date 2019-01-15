var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;} ///////////////////////////////////////////////////////////
/////// Functions and variables
///////////////////////////////////////////////////////////

var FORCE = function (nsp) {

  var
  width = 1080,
  height = 250,
  color = d3.scaleOrdinal(d3.schemeCategory10),

  initForce = function initForce(nodes, links) {
    nsp.force = d3.forceSimulation(nodes).
    force("charge", d3.forceManyBody().strength(-200)).
    force("link", d3.forceLink(links).distance(70)).
    force("center", d3.forceCenter().x(nsp.width / 2).y(nsp.height / 2)).
    force("collide", d3.forceCollide([5]).iterations([5]));
  },

  enterNode = function enterNode(selection) {
    var circle = selection.select('circle').
    attr("r", 25).
    style("fill", 'tomato').
    style("stroke", "bisque").
    style("stroke-width", "3px");

    selection.select('text').
    style("fill", "honeydew").
    style("font-weight", "600").
    style("text-transform", "uppercase").
    style("text-anchor", "middle").
    style("alignment-baseline", "middle").
    style("font-size", "10px").
    style("font-family", "cursive");
  },

  updateNode = function updateNode(selection) {
    selection.
    attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")";}).
    attr("cx", function (d) {return d.x = Math.max(30, Math.min(width - 30, d.x));}).
    attr("cy", function (d) {return d.y = Math.max(30, Math.min(height - 30, d.y));});
  },

  enterLink = function enterLink(selection) {
    selection.
    attr("stroke-width", 3).
    attr("stroke", "bisque");
  },

  updateLink = function updateLink(selection) {
    selection.
    attr("x1", function (d) {return d.source.x;}).
    attr("y1", function (d) {return d.source.y;}).
    attr("x2", function (d) {return d.target.x;}).
    attr("y2", function (d) {return d.target.y;});
  },

  updateGraph = function updateGraph(selection) {
    selection.selectAll('.node').
    call(updateNode);
    selection.selectAll('.link').
    call(updateLink);
  },

  dragStarted = function dragStarted(d) {
    if (!d3.event.active) nsp.force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  },

  dragging = function dragging(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  },

  dragEnded = function dragEnded(d) {
    if (!d3.event.active) nsp.force.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  },

  drag = function drag() {return d3.selectAll('g.node').
    call(d3.drag().
    on("start", dragStarted).
    on("drag", dragging).
    on("end", dragEnded));},


  tick = function tick(that) {
    that.d3Graph = d3.select(ReactDOM.findDOMNode(that));
    nsp.force.on('tick', function () {
      that.d3Graph.call(updateGraph);
    });
  };

  nsp.width = width;
  nsp.height = height;
  nsp.enterNode = enterNode;
  nsp.updateNode = updateNode;
  nsp.enterLink = enterLink;
  nsp.updateLink = updateLink;
  nsp.updateGraph = updateGraph;
  nsp.initForce = initForce;
  nsp.dragStarted = dragStarted;
  nsp.dragging = dragging;
  nsp.dragEnded = dragEnded;
  nsp.drag = drag;
  nsp.tick = tick;

  return nsp;

}(FORCE || {});

////////////////////////////////////////////////////////////////////////////
/////// class App is the parent component of Link and Node
////////////////////////////////////////////////////////////////////////////
var
App = function (_React$Component) {_inherits(App, _React$Component);
  function App(props) {_classCallCheck(this, App);var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this,
    props));
    _this.state = {
      addLinkArray: [],
      name: "",
      nodes:
      [
      {
        "id": 1,
        "name": "a",
        "x": -24.04,
        "y": 33.27 },

      {
        "id": 2,
        "name": "b",
        "x": -22.08,
        "y": 33.27 },

      {
        "id": 3,
        "name": "c",
        "x": -20.13,
        "y": 33.27 }],


      links:
      [
      { "source": 0, "target": 1, "id": 1 },
      { "source": 1, "target": 0, "id": 1 },
      { "source": 1, "target": 2, "id": 2 },
      { "source": 2, "target": 1, "id": 2 }] };


    _this.handleAddNode = _this.handleAddNode.bind(_this);
    _this.addNode = _this.addNode.bind(_this);return _this;
  }_createClass(App, [{ key: "componentDidMount", value: function componentDidMount()

    {
      var data = this.state;
      FORCE.initForce(data.nodes, data.links);
      FORCE.tick(this);
      FORCE.drag();
    } }, { key: "componentDidUpdate", value: function componentDidUpdate(

    prevProps, prevState) {
      if (prevState.nodes !== this.state.nodes || prevState.links !== this.state.links) {
        var data = this.state;
        FORCE.initForce(data.nodes, data.links);
        FORCE.tick(this);
        FORCE.drag();
      }
    } }, { key: "handleAddNode", value: function handleAddNode(

    e) {
      this.setState(_defineProperty({}, e.target.name, e.target.value));
    } }, { key: "addNode", value: function addNode(

    e) {var _this2 = this;
      e.preventDefault();
      this.setState(function (prevState) {return {
          nodes: [].concat(_toConsumableArray(prevState.nodes), [{ name: _this2.state.name, id: prevState.nodes.length + 1 }]), name: '' };});

    } }, { key: "render", value: function render()

    {
      var links = this.state.links.map(function (link) {
        return (
          React.createElement(Link, {
            key: link.id,
            data: link }));

      });
      var nodes = this.state.nodes.map(function (node) {
        return (
          React.createElement(Node, {
            data: node,
            name: node.name,
            key: node.id }));

      });
      return (
        React.createElement("div", { className: "graph__container" },
          React.createElement("form", { className: "form-addSystem", onSubmit: this.addNode.bind(this) },
            React.createElement("h4", { className: "form-addSystem__header" }, "New Node"),
            React.createElement("div", { className: "form-addSystem__group" },
              React.createElement("input", { value: this.state.name, onChange: this.handleAddNode.bind(this),
                name: "name",
                className: "form-addSystem__input",
                id: "name",
                placeholder: "Name" }),
              React.createElement("label", { className: "form-addSystem__label", htmlFor: "title" }, "Name")),

            React.createElement("div", { className: "form-addSystem__group" },
              React.createElement("input", { className: "btnn", type: "submit", value: "add node" }))),


          React.createElement("svg", { className: "graph", width: FORCE.width, height: FORCE.height },
            React.createElement("g", null,
              links),

            React.createElement("g", null,
              nodes))));




    } }]);return App;}(React.Component);


///////////////////////////////////////////////////////////
/////// Link component
///////////////////////////////////////////////////////////
var
Link = function (_React$Component2) {_inherits(Link, _React$Component2);function Link() {_classCallCheck(this, Link);return _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));}_createClass(Link, [{ key: "componentDidMount", value: function componentDidMount()

    {
      this.d3Link = d3.select(ReactDOM.findDOMNode(this)).
      datum(this.props.data).
      call(FORCE.enterLink);
    } }, { key: "componentDidUpdate", value: function componentDidUpdate()

    {
      this.d3Link.datum(this.props.data).
      call(FORCE.updateLink);
    } }, { key: "render", value: function render()

    {
      return (
        React.createElement("line", { className: "link" }));

    } }]);return Link;}(React.Component);


///////////////////////////////////////////////////////////
/////// Node component
///////////////////////////////////////////////////////////
var
Node = function (_React$Component3) {_inherits(Node, _React$Component3);function Node() {_classCallCheck(this, Node);return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).apply(this, arguments));}_createClass(Node, [{ key: "componentDidMount", value: function componentDidMount()

    {
      this.d3Node = d3.select(ReactDOM.findDOMNode(this)).
      datum(this.props.data).
      call(FORCE.enterNode);
    } }, { key: "componentDidUpdate", value: function componentDidUpdate()

    {
      this.d3Node.datum(this.props.data).
      call(FORCE.updateNode);
    } }, { key: "render", value: function render()

    {
      return (
        React.createElement("g", { className: "node" },
          React.createElement("circle", { onClick: this.props.addLink }),
          React.createElement("text", null, this.props.data.name)));


    } }]);return Node;}(React.Component);


ReactDOM.render(React.createElement(App, null), document.querySelector('#root'));