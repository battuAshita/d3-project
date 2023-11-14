import * as d3 from "d3";

async function drawHistogram()
{
   const dataSet = await d3.csv("../data/penguins.csv");


   const xAccessor = d => Number(d.body_mass_g);
   const yAccessor = d => d.length;
   const colorAccessor = d => d.species;
   
   //Create Dimensions

   const width = 600; 

   const dimensions = {
    width : width,
    height : width * 0.6,
    margins : {
        top : 30,
        right : 10,
        bottom : 50 ,
        left : 50
    }
   }

   dimensions.boundedWidth = dimensions.width - dimensions.margins.left - dimensions.margins.right ;
   dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom ;

   // Draw Canvas

   const wrapper = d3.select("#wrapper")
     .append("svg")
       .attr("width" ,  dimensions.width)
       .attr("height" , dimensions.height);


    const bounds = wrapper.append("g")
      .style("transform" , `translate(${dimensions.margins.left}px , ${dimensions.margins.top}px)`);


    // Create Scale

    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataSet , xAccessor))
        .range([0 , dimensions.boundedWidth]);

    
    const colorScale = {
            Adelie: "orange", Chinstrap: "purple", Gentoo: "green"
           }


    // Create bins
    const binsGenerator = d3.bin()
        .domain(xScale.domain())
        .value(xAccessor)
        .thresholds(10);


    const bins = binsGenerator(dataSet);
    const barPadding = 1;

    const yScale = d3.scaleLinear()
        .domain([0 , d3.max(bins , yAccessor)])
        .range([dimensions.boundedHeight , 0])
        .nice();

    console.log(bins);

    function createBarRect(group, e, count, w, color) {
        
        group.append("rect")
            .attr("x" , xScale(e.x0) + w + barPadding/2)
            .attr("y" , yScale(count))
            .attr("width" , d3.max([0 , (xScale(e.x1) - xScale(e.x0) - barPadding)/3]))
            .attr("height" ,  dimensions.boundedHeight - yScale(count))
            .style("fill" , color);

        group.filter(c => count)
        .append("text")
        .attr("x" , xScale(e.x0) + w + 5)
        .attr("y" , yScale(count) - 5)
        .text(count)
        .attr("fill", "darkgrey")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")

    }

    bins.forEach(element => {

        const binsGroup = bounds.append("g");
        let w = d3.max([0 , (xScale(element.x1) - xScale(element.x0) - barPadding)/3]);

        // For Adelie
        let count_a = element.filter(obj => obj.species === 'Adelie');
        count_a = count_a.length;

        createBarRect(binsGroup, element, count_a, 0, "orange");
        
        // For Chinstrap
        let count_c = element.filter(obj => obj.species === 'Chinstrap');
        count_c = count_c.length;

        createBarRect(binsGroup, element, count_c, w, "purple");

        // For Gentoo
        let count_g = element.filter(obj => obj.species === 'Gentoo');
        count_g = count_g.length;

        createBarRect(binsGroup, element, count_g, 2*w, "green");

    })

    //Draw Peripherals
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale);

        const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform" , `translateY(${dimensions.boundedHeight}px)`);


    const xaxisLabel = xAxis.append("text")
        .attr("x" , dimensions.boundedWidth/2)
        .attr("y" , dimensions.margins.bottom - 10)
        .attr("fill" , "black")
        .style("font-size" , "1.4em")
        .text("Body Mass (in gm)")

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

    
};
}

drawHistogram();
