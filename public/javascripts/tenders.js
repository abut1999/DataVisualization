var MYLIBRARY = MYLIBRARY || (function() {
    let _args = {};

    return {
        init: function(Args) {
            _args = Args;
        },
        drawStuff: function() {
            const databaseData = _args[0];

            function drawBarTable(databaseData) {
                const originArray = [];
                for (let i = 0; i < databaseData.length; i += 1) {
                    originArray.push(databaseData[i].country)
                }

                function countBuildTypes(array) {
                    let obj = Object.create(null);
                    array.forEach(function(item) {
                        if (obj[item]) {
                            obj[item] += 1;
                        } else {
                            obj[item] = 1;
                        }
                    });
                    return obj;
                }

                originTypesAmount = countBuildTypes(originArray);

                function sortBySize(obj) {
                    const sortable = [];
                    for (var origin in obj) {
                        sortable.push([origin, obj[origin]]);
                    }
                    sortable.sort(function(a, b) {
                        return a[1] - b[1];
                    });
                    var objSorted = {}
                    sortable.forEach(function(item) {
                        objSorted[item[0]] = item[1]
                    })
                    return objSorted;
                }

                const sortedObj = sortBySize(originTypesAmount);

                function prepareDataForChart(obj) {
                    const chartData = [];
                    Object.entries(obj).forEach(function([key, value]) {
                        {
                            chartData.push({
                                name: key,
                                value: value
                            })
                        }
                    })
                    return chartData;
                }
                chartData = prepareDataForChart(sortedObj);
            }

            //Draw table
            $(function() {
                $('#table').bootstrapTable({
                    data: databaseData,
                    exportDataType: $(this).val(),
                    exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
                    exportOptions: {
                        ignoreColumn: [0],
                    }
                });
            });

            drawBarTable(databaseData);

            function RoundMaxValue() {
                const highestValue = chartData[chartData.length - 1].value;
                const roundedValue = Math.ceil(highestValue / 10) * 10;
                return roundedValue;
            }

            //Draw tenders chart
            let chart = new Morris.Bar({
                barSizeRatio: 0.25,
                element: 'myfirstchart',
                data: chartData,
                xkey: 'name',
                ykeys: ['value'],
                labels: ['Value'],
                ymax: RoundMaxValue(),
                resize: true,
                xLabelAngle: 60
            }, true);

            //Multiselect filtering button for Competitions
            $(document).ready(function() {
                $('#graph-container').append('<select id="CompetitionGraphFilterButton" multiple="multiple"> </select>')
                for (let i = 0; i < chartData.length; i += 1) {
                    $('#CompetitionGraphFilterButton').append(`<option value = "${chartData[i].name}"> ${chartData[i].name}</option>`)
                }
                $('#CompetitionGraphFilterButton').multiselect({
                    //Filtering function options
                    onChange: function(option, checked, select) {
                        const selectedValues = ($('#CompetitionGraphFilterButton').val());
                        if (selectedValues.length === 0) {
                            chart.setData(chartData);
                        } else {
                            let TempChartData = chartData.slice();
                            for (var i = TempChartData.length - 1; i >= 0; --i) {
                                if (selectedValues.includes(TempChartData[i].name) === false) {
                                    TempChartData.splice(i, 1);
                                }
                            }
                            chart.setData(TempChartData);
                        }
                    }
                });
            });
            $('#table > tfoot').find('tr').attr("data-tableexport-display", "none");
        }
    };
}());