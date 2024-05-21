var n = 50,
    random = d3.random.normal(0, .2),
    data1 = d3.range(n).map(random);
    data2 = data1.map(function(d){return d + random()*0.6 ;});

function getSize() {
  var myWidth = 0, myHeight = 0;
  if (typeof( window.innerWidth ) == 'number') {
    // Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight )) {
    // IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) {
    // IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return {w: myWidth, h: myHeight};
}

var margin = {top: 20, right: -100, bottom: 20, left: -100},
    width = getSize().w - margin.left - margin.right,
    height = getSize().h - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, n - 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-1, 1])
    .range([height, 0]);

var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d); })
    .interpolate("basis");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var path1 = svg.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(data1)
    .attr("class", "line")
    .attr("d", line);

var whiterect = svg.append("rect")
  .attr("x", width - width/4)
  .attr("y", 0)
  .attr("width", width/4)
  .attr("height", height)
  .style("fill", "white");

var path2 = svg.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(data2)
    .attr("class", "line")
    .attr("d", line)
    .style("stroke-opacity", 0.3);

function tick() {
  var rval1 = random()*2;
  var rval2 = rval1 + random()*0.6;

  data1.push(rval1);
  data2.push(rval2);

  path1
      .attr("d", line)
      .attr("transform", null)
    .transition()
      .duration(500)
      .ease("linear")
      .attr("transform", "translate(" + x(-1) + ",0)");

  path2
      .attr("d", line)
      .attr("transform", null)
    .transition()
      .duration(500)
      .ease("linear")
      .attr("transform", "translate(" + x(-1) + ",0)")
      .each("end", tick);

  data1.shift();
  data2.shift();
}

tick();

function getSvgDataUrl() {
  var svgElement = document.querySelector("svg");
  var svgString = new XMLSerializer().serializeToString(svgElement);
  var svgDataUrl = "data:image/svg+xml;base64," + btoa(svgString);
  return svgDataUrl;
}

document.addEventListener("DOMContentLoaded", function() {
  var svgDataUrl = getSvgDataUrl();
  var styleElement = document.createElement("style");
  styleElement.innerHTML = `.title-slide { background-image: url('${svgDataUrl}'); background-position: 52% 15%; background-size: 60%; background-color: #e6f3fc; }`;
  document.head.appendChild(styleElement);
});
