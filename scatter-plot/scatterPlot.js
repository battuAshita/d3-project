import * as d3 from "d3";

async function drawScatterPlot() {
  let dataset = await d3.csv("../data/penguins.csv");
  dataset = dataset.filter(
    (obj) => obj.bill_length_mm != "NA" && obj.bill_depth_mm != "NA"
  );
  console.log(dataset);

  // Create accessor functions
  const yAccessor = (d) => Number(d.bill_length_mm);
  const xAccessor = (d) => Number(d.bill_depth_mm);
  const colorAccessor = (d) => d.species;

  // Set dimensions
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

  const dimensions = {
    width: width,
    height: width,
    margins: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margins.left - dimensions.margins.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

  // Draw canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`
    );

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  const colorScale = { Adelie: "orange", Chinstrap: "purple", Gentoo: "green" };

  // Draw data
  const dots = bounds
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 3)
    .style("fill", (d) => colorScale[colorAccessor(d)]);

  // Draw peripherals

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);

  const yAxis = bounds.append("g").call(yAxisGenerator);

  // Add labels

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margins.bottom - 10)
    .style("fill", "grey")
    .style("font-size", "1.4em")
    .html("Bill depth (in mm)");

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margins.left / 2)
    .attr("fill", "grey")
    .style("font-size", "1.4em")
    .text("Bill length (in mm)")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle");

  bounds
    .selectAll("circle")
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave);

  // Create tooltip
  const tooltip = d3.select("#tooltip");

  function onMouseEnter(event, d) {
    const dayDot = bounds
      .append("circle")
      .attr("class", "tooltipDot")
      .attr("cx", xScale(xAccessor(d)))
      .attr("cy", yScale(yAccessor(d)))
      .attr("r", 5)
      .style("fill", colorScale[colorAccessor(d)])
      .style("pointer-events", "none");

    const formatBillValue = d3.format(".2f");

    const x = dimensions.margins.left + xScale(xAccessor(d));
    const y = dimensions.margins.top + yScale(yAccessor(d));

    tooltip.style(
      "transform",
      `translate(
            calc(-50% + ${x}px),
            calc(-100% + ${y}px)
            )`
    );

    tooltip.select("#bill-length").text(formatBillValue(yAccessor(d)));

    tooltip.select("#bill-depth").text(formatBillValue(xAccessor(d)));

    tooltip.style("opacity", 1);
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0);
    d3.selectAll(".tooltipDot").remove();
  }

  // Create legend
  const legend = d3
    .select("#legend")
    .attr("x", dimensions.boundedWidth)
    .attr("y", 0);

  const box = bounds
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.boundedWidth - 95}px , ${0}px)`
    );

  let y = 5;
  for (const key in colorScale) {
    console.log(colorScale[key]);
    box
      .append("circle")
      .attr("cx", 10)
      .attr("cy", y)
      .attr("r", 5)
      .style("fill", colorScale[key]);

    box
      .append("text")
      .html(key)
      .attr("x", 20)
      .attr("y", y + 5).a;

    y = y + 30;
  }
}

drawScatterPlot();
