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
                ykeys: ['peoplePerHour', 'guru', 'arcbazar'],
                labels: ['PeoplePerHour', 'Guru', 'Arcbazar '],
                lineColors: ['#373651', '#E65A26', '#A52A2A'],
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
                        value.forEach(function(item) {
                            Object.values(item).forEach(function(value) {
                                if (value === "peoplePerHour") {
                                    PeoplePerhour += 1;
                                } else if (value === "guru") {
                                    Guru += 1;
                                } else if (value === "arcbazar") {
                                    Arcbazar += 1;
                                }
                            })
                        });
                        GraphData.push({
                            date: value[0].date,
                            peopleperhour: PeoplePerhour,
                            guru: Guru,
                            arcbazar: Arcbazar
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

                new Morris.Bar({
                    barSizeRatio: 0.25,
                    element: 'barData',
                    data: chartData,
                    xkey: 'label',
                    ykeys: ['value'],
                    labels: ['Amount'],
                    resize: 'true'
                });
            }

            //Draw table
            $(function() {
                $('#table').bootstrapTable({
                    data: databaseData
                });
            });

            drawBarsOfCompetitions(databaseData);
        }
    };
}());