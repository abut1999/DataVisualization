var MYLIBRARY = MYLIBRARY || (function() {
    let _args = {};

    return {
        init: function(Args) {
            _args = Args;
        },
        drawStuff: function() {
            const databaseData = _args[0];

            //Draw base graph
            let chart = new MTA.Line({
                element: 'percentages',
                xkey: 'date',
                resize: 'true',
                ykeys: ['peopleperhour', 'guru', 'arcbazar', 'upwork'],
                labels: ['PeoplePerHour', 'Guru', 'Arcbazar', 'Upwork'],
                lineColors: ['#373651', '#E65A26', '#A52A2A', '#006400'],
                behaveLikeLine: 'true',
                rangeSelect: function(range) {
                    var start = new Date(range.start).toLocaleString(),
                        end = new Date(range.end).toLocaleString();
                    $('#caption').text('Selected ' + start + ' to ' + end);
                }
            }, true);

            const freelanceProjects = databaseData.map(({
                added,
                origin
            }) => ({
                added,
                origin
            }));

            $(function() {
                function cb(start, end) {
                    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                    const usersArray = [];

                    const firstDay = new Date(start);
                    const lastDay = new Date(end);

                    for (let i = 0; i < freelanceProjects.length; i += 1) {
                        date = new Date(freelanceProjects[i].added)
                        var month = date.getUTCMonth() + 1;
                        var day = date.getUTCDate();
                        var year = date.getUTCFullYear();
                        newdate = year + "-" + month + "-" + day;
                        if (date >= firstDay && date <= lastDay) {
                            usersArray.push({
                                date: newdate,
                                type: freelanceProjects[i].origin
                            })
                        }
                    }
                    const groupedObjectByDate = _.groupBy(usersArray, function(dates) {
                        return dates.date;
                    })
                    const GraphData = [];

                    Object.values(groupedObjectByDate).forEach(function(value) {
                        let PeoplePerhour = 0;
                        let Guru = 0;
                        let Arcbazar = 0;
                        let Upwork = 0;
                        value.forEach(function(item) {
                            Object.values(item).forEach(function(value) {
                                if (value === "PeoplePerHour") {
                                    PeoplePerhour += 1;
                                } else if (value === "Guru") {
                                    Guru += 1;
                                } else if (value === "Arcbazar") {
                                    Arcbazar += 1;
                                } else if (value === "Upwork") {
                                    Upwork += 1;
                                }
                            })
                        });
                        GraphData.push({
                            date: value[0].date,
                            peopleperhour: PeoplePerhour,
                            guru: Guru,
                            arcbazar: Arcbazar,
                            upwork: Upwork
                        })
                    });
                    chart.setData(GraphData);
                }

                cb(moment().subtract(29, 'days'), moment());

                $('#reportrange').daterangepicker({
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [(moment().subtract(29, 'days'), moment())],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    }
                }, cb);
            });

            function drawBarsOfCompetitions(databaseData) {
                const originTypesArray = [];
                for (let i = 0; i < databaseData.length; i += 1) {
                    originTypesArray.push(databaseData[i].origin)
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

                originTypesAmount = countBuildTypes(originTypesArray);

                function prepareDataForChart(obj) {
                    const chartData = [];

                    Object.keys(obj).forEach(function(key) {
                        delete obj.undefined;
                    })
                    Object.entries(obj).forEach(function([key, value]) {
                        {
                            chartData.push({
                                label: key,
                                value: value
                            })
                        }
                    })
                    return chartData;
                }

                chartData = prepareDataForChart(originTypesAmount);
            }

            //Draw tables
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

            drawBarsOfCompetitions(databaseData);

            let barChart = new Morris.Bar({
                barSizeRatio: 0.25,
                element: 'barData',
                data: chartData,
                xkey: 'label',
                ykeys: ['value'],
                labels: ['Amount'],
                resize: 'true'
            }, true);

            //UniqueFreelanceprojectsOrigins
            function uniqueFreelanceProjectsOrigins() {
                const originTypes = [];
                for (let i = 0; i < databaseData.length; i += 1) {
                    originTypes.push(databaseData[i].origin);
                }
                uniqueValues = originTypes.filter(function(item, pos) {
                    return originTypes.indexOf(item) == pos;
                })
                return uniqueValues;
            }

            //Filtering function
            function filterTable(valueInput, dataToFilter) {
                if (valueInput.length === 0) {
                    $('#table').bootstrapTable("load", databaseData);
                } else if (valueInput.length > 0) {
                    let tempData = dataToFilter.slice();
                    for (var i = tempData.length - 1; i >= 0; --i) {
                        if (valueInput.includes(tempData[i].origin) === false) {
                            tempData.splice(i, 1);
                        }
                    }
                    $('#table').bootstrapTable("load", tempData);
                }
            }

            //Multiselect button for table column
            $(document).ready(function() {
                const originValues = uniqueFreelanceProjectsOrigins();
                $('.th-inner:contains("Origin")').append('<select id="OriginFilterButton" multiple="multiple"> </select>')
                for (let i = 0; i < originValues.length; i += 1) {
                    $('#OriginFilterButton').append(`<option value = "${originValues[i]}"> ${originValues[i]}</option>`)
                }
                $('#OriginFilterButton').multiselect({
                    //Filtering function options
                    onChange: function(option, checked, select) {
                        const selectedValues = ($('#OriginFilterButton').val());
                        filterTable(selectedValues, databaseData);
                    }
                });
            });

            //Multiselect filtering button for Competitions
            $(document).ready(function() {
                $('#bar-graph-container').append('<select id="FreelanceProjectsBarChartMultiselectFilterButton" multiple="multiple"> </select>')
                for (let i = 0; i < chartData.length; i += 1) {
                    $('#FreelanceProjectsBarChartMultiselectFilterButton').append(`<option value = "${chartData[i].label}"> ${chartData[i].label}</option>`)
                }
                $('#FreelanceProjectsBarChartMultiselectFilterButton').multiselect({
                    //Filtering function options
                    onChange: function(option, checked, select) {
                        const selectedValues = ($('#FreelanceProjectsBarChartMultiselectFilterButton').val());
                        if (selectedValues.length === 0) {
                            barChart.setData(chartData);
                        } else {
                            let TempChartData = chartData.slice();
                            for (var i = TempChartData.length - 1; i >= 0; --i) {
                                if (selectedValues.includes(TempChartData[i].label) === false) {
                                    TempChartData.splice(i, 1);
                                }
                            }
                            barChart.setData(TempChartData);
                        }
                    }
                });
                $('#table > thead > tr > th:nth-child(6)').attr("data-tableexport-value", "Origin");
                $('#table > tfoot').find('tr').attr("data-tableexport-display", "none");
            });
        }
    };
}());