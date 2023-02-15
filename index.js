let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req = new XMLHttpRequest()

let data
let values = []



let width = 800;
let height = 600;
let margin = 45;

let svg = d3.select("body").append("svg")
    .attr("class", "axis")
    .attr("width", width)
    .attr("height", height)


const xAxisLength = width - 2 * margin;
const yAxisLength = height - 2 * margin;

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(values);

    let xMin = d3.min(values, d => d[0]);
    let xMax = d3.max(values, d => d[0]);
    let yMin = d3.min(values, d => d[1]);
    let yMax = d3.max(values, d => d[1]);

    var xScale = d3.scaleTime()
        .domain([new Date(xMin), new Date(xMax)])
        .range([0, xAxisLength])

    const yScale = d3.scaleLinear()
        .domain([yMax, 0])
        .range([0, yAxisLength]);

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr('id', 'x-axis')
        .attr("class", "x-axis")
        .attr("transform",
            "translate(" + margin + "," + (height - margin) + ")")
        .call(xAxis);

    svg.append("g")
        .attr('id', 'y-axis')
        .attr("class", "y-axis")
        .attr("transform",
            "translate(" + margin + "," + margin + ")")
        .call(yAxis);

    const widthBar = xAxisLength / values.length;

    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style("visibility", "hidden")

    var g = svg.append("g")
        .attr("class", "body")
        .attr("transform",
            "translate(" + margin + ", 0 )");

    g.selectAll("rect.bar")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr('x', d => xScale(new Date(d[0])))
        .attr('y', (d) => {
            return (yScale(d[1]) + margin)
        })
        .attr('width', widthBar)
        .attr("height", (d) => yAxisLength - yScale(d[1]))
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .on("mouseover", function (e, d) {
            tooltip.style("visibility", "visible")
                .style("left", e.pageX + 10 + "px")
                .style("top", e.pageY - 80 + "px")
                .attr("data-date", d[0])
                .html(d[0] + "</br>" + d[1] + " Billion USD");

        })
        .on("mousemove", function () {
            tooltip.style("left", event.pageX + 10 + "px")

        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden")
        })

    g.append("text")
        .attr('id', 'title')
        .attr("x", (width / 2 - 30))
        .attr("y", margin + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .text("United States GDP");

    g.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('class', 'label')
        .text('Date');

    g.append("text")
        .attr("y", margin - 5)
        .attr("x", -height / 2)
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .text("GDP [Billion USD]");











}
req.send()