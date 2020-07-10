
// create bar chart, bubble chart, gauge chart and populate demo table base on id passed
function makePlotsTable(masterId) {
    d3.json("static/data/sample.json").then((loadedData) => {
        //console.log("allData", loadedData);
        let navelData = loadedData
        let sampleData = navelData.samples
        let meta = navelData.metadata
        console.log("masterId", masterId)

        // get meta data
        let metaTable = []
        meta.forEach(subjectMeta => {
            if (masterId === String(subjectMeta.id)) {
                metaTable.push(subjectMeta);
            }
        });
        console.log("subjectMetaData", metaTable); 
        
        // populate demographic table
        d3.selectAll("p").remove();
        let demoTable = d3.select("#demo-info")
        Object.entries(metaTable[0]).forEach((pair) => {
            demoTable.append("p").text(pair[0] + ": " + pair[1])
        });

        // get sample data
        let dataPlot = []
        sampleData.forEach(navelSample => {
            if (masterId === navelSample.id) {
                dataPlot.push(navelSample.sample_values);
                dataPlot.push(navelSample.otu_ids);
                dataPlot.push(navelSample.otu_labels);
            }
        });
        console.log("sampleDataPloted", dataPlot)

        // bar yAxis formatting
        let yFor = dataPlot[1].map(function(el){
            return  "OTU " + String(el)
        });

        // bar chart building
        let barTrace = [{
            x: dataPlot[0].slice(0,10).reverse(),
            y: yFor.slice(0,10).reverse(),
            text: dataPlot[2].slice(0,10).reverse(),
            type: "bar",
            orientation: "h",
            marker:{
            color: ["rgba(3, 7, 30,1)", "rgba(55, 6, 23,1)", "rgba(106, 4, 15,1)","rgba(157, 2, 8,1)",
                    "rgba(208, 0, 0,1)", "rgba(220, 47, 2,1)", "rgba(232, 93, 4,1)", "rgba(244, 140, 6,1)",
                    "rgba(250, 163, 7,1)", "rgba(255, 186, 8,1)"]}
        }];
        let barLayout = {
            title: "Top10 OTUs found",
            xaxis: {title: "OTU VALUE"}
        };
        let barConfig = {responsive: true};
        Plotly.newPlot("bar", barTrace, barLayout, barConfig);

        // bubble chart building
        let bubbleTrace = [{
            x: dataPlot[1],
            y: dataPlot[0],
            mode: "markers",
            marker :{size: dataPlot[0], color : dataPlot[1],
                    colorscale:[
                        ["0.0", "rgb(3, 7, 30)"],
                        ["0.111111111111", "rgb(55, 6, 23)"],
                        ["0.222222222222", "rgb(106, 4, 15)"],
                        ["0.333333333333", "rgb(157, 2, 8)"],
                        ["0.444444444444", "rgb(208, 0, 0)"],
                        ["0.555555555556", "rgb(220, 47, 2)"],
                        ["0.666666666667", "rgb(232, 93, 4)"],
                        ["0.777777777778", "rgb(244, 140, 6)"],
                        ["0.888888888889", "rgb(250, 163, 7)"],
                        ["1.0", "rgb(255, 186, 8)"]
                      ]
                    },
            text: dataPlot[2]
        }];
        let bubbleLayout = {
            title: "Subject's OTU population",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "OTU VALUE"}
        };
        let bubbleConfig = {responsive: true};
        Plotly.newPlot("bubble", bubbleTrace, bubbleLayout, bubbleConfig);

        // gauge chart building
        let gaugeTrace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: metaTable[0].wfreq,
            title: { text: "Washing frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                bar: {color: "#370617"},
                steps: [
                    { range: [0, 1], color: "#03071e" },
                    { range: [1, 2], color: "#dbdbdb" },
                    { range: [2, 3], color: "#6a040f" },
                    { range: [3, 4], color: "#dbdbdb" },
                    { range: [4, 5], color: "#d00000" },
                    { range: [5, 6], color: "#dbdbdb" },
                    { range: [6, 7], color: "#e85d04" },
                    { range: [7, 8], color: "#dbdbdb" },
                    { range: [8, 9], color: "#faa307" }
                ],
                threshold: {
                    line: { color: "#03071e", width: 4 },
                    thickness: 0.75,
                    value: 7
                }
            }
        }];
        let gaugeLayout = {
            autosize : {width: true, height: true},
            margin: {l: 10, r:10}
        };
        let gaugeConfig = {responsive: true};
        Plotly.newPlot("gauge", gaugeTrace, gaugeLayout, gaugeConfig);

        console.log("---------------------");
    });
};

// populate dropdown button
function getSubjectId(){
    d3.json("static/data/sample.json").then((loadedData) => {
        let subjectsId = loadedData.names
        let dropButton = d3.select("#inputGroupSelect01")
        Object.values(subjectsId).forEach((el) => {
            dropButton.append("option").attr("value", el).text(el)
        });
    });
};

// default data visualization
function init(){
    let initId = "940"
    makePlotsTable(initId);
    getSubjectId();
};

init();

// data visualization based on user's input
function getUserInput(){
    let userID = document.getElementById("inputGroupSelect01").value;
    makePlotsTable(userID);
};