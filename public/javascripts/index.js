var MYLIBRARY = MYLIBRARY || (function() {
    let _args = {};

    return {
        init: function(Args) {
            _args = Args;
        },
        drawStuff: function() {
            const databaseData = _args[0];

            function drawTotalUsersDonut(data) {
                var totalArchitects = 0;
                var totalClients = 0;

                for (let i = 0; i < data.length; i += 1) {
                    if (data[i].userType === "Client") {
                        totalClients += 1;
                    } else if (data[i].userType === "Architect") {
                        totalArchitects += 1;
                    }
                }

                new Morris.Donut({
                    element: 'totalUsers',
                    data: [{
                        label: 'Clients',
                        value: totalClients
                    }, {
                        label: 'Architects',
                        value: totalArchitects
                    }],
                    resize: 'true',
                });
                const total = totalArchitects + totalClients;
                return total;
            }

            function drawTotalCompetitionsDonut(data) {
                const allCompetitionsArray = [];
                for (let i = 0; i < data.length; i += 1) {
                    allCompetitionsArray.push(data[i].origin[0])
                }

                function countUniqueOriginAmount(array) {
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
                uniqueOriginAmount = countUniqueOriginAmount(allCompetitionsArray);

                function countTotal(obj) {
                    let total = 0;
                    Object.values(obj).forEach(function(value) {
                        total += value;
                    })
                    return total;
                }
                const total = countTotal(uniqueOriginAmount);

                function prepareDataForChart(obj) {
                    const chartData = [];

                    Object.entries(obj).forEach(function([key, value]) {
                        {
                            chartData.push({
                                label: key,
                                value: value
                            })
                        }
                    });
                    return chartData;
                }
                chartData = prepareDataForChart(uniqueOriginAmount);
                new Morris.Donut({
                    element: 'totalCompetitions',
                    data: chartData,
                    xkey: 'label',
                    ykeys: ['value'],
                    labels: ['Amount'],
                    resize: 'true'
                });
                return total;
            }

            function drawTotalClientProjects(data) {

                const allProjectsArray = [];
                for (let i = 0; i < data.length; i += 1) {
                    allProjectsArray.push(data[i].projectType)
                }

                function countUniqueOriginAmount(array) {
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

                uniqueClientProjects = countUniqueOriginAmount(allProjectsArray);

                function countTotal(obj) {
                    Object.keys(obj).forEach(function(key) {
                        delete obj.undefined
                    });
                    let total = 0;
                    Object.values(obj).forEach(function(value) {
                        total += value;
                    })
                    return total;
                }
                const total = countTotal(uniqueClientProjects);

                function prepareDataForChart(obj) {
                    const chartData = [];

                    Object.entries(obj).forEach(function([key, value]) {
                        {
                            chartData.push({
                                label: key,
                                value: value
                            })
                        }
                    });
                    return chartData;
                }

                chartData = prepareDataForChart(uniqueClientProjects);
                new Morris.Donut({
                    element: 'totalClientProjects',
                    data: chartData,
                    xkey: 'label',
                    ykeys: ['value'],
                    labels: ['Amount'],
                    resize: 'true'
                });
                return total;
            }

            function displayTotals(users, competitions, projects) {
                document.getElementById("users").innerHTML = users;
                document.getElementById("competitions").innerHTML = competitions;
                document.getElementById("projects").innerHTML = projects;
            }

            const totalClientProjects = drawTotalClientProjects(databaseData.clientProjects);
            const totalUsers = drawTotalUsersDonut(databaseData.users);
            const totalCompetitions = drawTotalCompetitionsDonut(databaseData.competitions);
            displayTotals(totalUsers, totalCompetitions, totalClientProjects);
        }
    };
}());