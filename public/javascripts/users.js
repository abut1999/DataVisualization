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
                element: 'entirePeriod',
                xkey: 'date',
                resize: 'true',
                ykeys: ['architect', 'client'],
                labels: ['Registered architects', 'Registered clients'],
                lineColors: ['#373651', '#E65A26'],
                behaveLikeLine: 'true',
                rangeSelect: function(range) {
                    var start = new Date(range.start).toLocaleString(),
                        end = new Date(range.end).toLocaleString();
                    $('#caption').text('Selected ' + start + ' to ' + end);
                }
            }, true);

            const registeredUsers = databaseData.map(({
                createdAt,
                userType
            }) => ({
                createdAt,
                userType
            }));

            //Calendar function && re-draw chart
            $(function() {
                function cb(start, end) {
                    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                    const usersArray = [];

                    const firstDay = new Date(start);
                    const lastDay = new Date(end);

                    for (let i = 0; i < registeredUsers.length; i += 1) {
                        date = new Date(registeredUsers[i].createdAt)
                        var month = date.getUTCMonth() + 1;
                        var day = date.getUTCDate();
                        var year = date.getUTCFullYear();
                        newdate = year + "-" + month + "-" + day;
                        if (date >= firstDay && date <= lastDay) {
                            usersArray.push({
                                date: newdate,
                                type: registeredUsers[i].userType
                            })
                        }
                    }
                    const groupedObjectByDate = _.groupBy(usersArray, function(dates) {
                        return dates.date;
                    })
                    const GraphData = [];

                    Object.values(groupedObjectByDate).forEach(function(value) {
                        let clients = 0;
                        let architects = 0;
                        value.forEach(function(item) {
                            Object.values(item).forEach(function(value) {
                                if (value === "Client") {
                                    clients += 1;
                                } else if (value === "Architect") {
                                    architects += 1;
                                }
                            })
                        });
                        GraphData.push({
                            date: value[0].date,
                            client: clients,
                            architect: architects
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

            //Draw table
            $(function() {
                $('#table').bootstrapTable({
                    data: databaseData
                });
            });
        }
    };
}());