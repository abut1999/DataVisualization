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
                    originArray.push(databaseData[i].origin[0])
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

                function RoundMaxValue() {
                    const highestValue = chartData[chartData.length - 1].value;
                    const roundedValue = Math.ceil(highestValue / 10) * 10;
                    return roundedValue;
                }

                //Draw competition chart
                new Morris.Bar({
                    barSizeRatio: 0.25,
                    element: 'myfirstchart',
                    data: chartData,
                    xkey: 'name',
                    ykeys: ['value'],
                    labels: ['Value'],
                    ymax: RoundMaxValue(),
                    resize: true
                });
            }

            //Draw table
            $(function() {
                $('#table').bootstrapTable({
                    data: databaseData
                });
            });

            drawBarTable(databaseData);
        }
    };
}());