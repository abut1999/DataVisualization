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

            let tableData = [];

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

                    function filterUserTable(selectedStartDate, selectedEndDate) {
                        let tempTableData = [];
                        for (let i = 0; i < databaseData.length; i += 1) {
                            if (new Date(databaseData[i].createdAt) >= selectedStartDate && new Date(databaseData[i].createdAt) <= selectedEndDate) {
                                tempTableData.push(databaseData[i]);
                            }
                        }
                        tableData = tempTableData;
                    }

                    chart.setData(GraphData);
                    filterUserTable(start, end);

                    $('#table').bootstrapTable("load", tableData);
                    console.log(tableData);
                }

                cb(moment().subtract(29, 'days'), moment());

                $('#reportrange').daterangepicker({
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    }
                }, cb);

                //Draw table
                $(function() {
                    $('#table').bootstrapTable({
                        data: tableData,
                        exportDataType: $(this).val(),
                        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
                        exportOptions: {
                            ignoreColumn: [0],
                        }
                    });
                });

                //UniqueUserValues
                function uniqueUserValues() {
                    const userTypes = [];
                    for (let i = 0; i < databaseData.length; i += 1) {
                        userTypes.push(databaseData[i].userType);
                    }
                    uniqueValues = userTypes.filter(function(item, pos) {
                        return userTypes.indexOf(item) == pos;
                    })
                    return uniqueValues;
                }

                //Filtering function
                function filterTable(valueInput, dataToFilter) {
                    if (valueInput.length === 0) {
                        $('#table').bootstrapTable("load", tableData);
                    } else if (valueInput.length > 0) {
                        let tempData = dataToFilter.slice();
                        for (var i = tempData.length - 1; i >= 0; --i) {
                            if (valueInput.includes(tempData[i].userType) === false) {
                                tempData.splice(i, 1);
                            }
                        }
                        $('#table').bootstrapTable("load", tempData);
                    }
                }

                //Multiselect button
                $(document).ready(function() {
                    const userValues = uniqueUserValues();
                    $('.th-inner:contains("User type")').append('<select id="UserFilterButton" multiple="multiple" data-tableexport-display="none"> </select>')
                    for (let i = 0; i < userValues.length; i += 1) {
                        $('#UserFilterButton').append(`<option data-tableexport-display="none" value = "${userValues[i]}" data-tableexport-display="none"> ${userValues[i]}</option>`)
                    }
                    $('#UserFilterButton').multiselect({
                        //Filtering function options
                        onChange: function(option, checked, select) {
                            const selectedValues = ($('#UserFilterButton').val());
                            filterTable(selectedValues, tableData);
                        }
                    });
                    $('#table > thead > tr > th:nth-child(7)').attr("data-tableexport-value", "User Type");
                    $('#table > tfoot').find('tr').attr("data-tableexport-display", "none");
                });
            });
        }
    };
}());