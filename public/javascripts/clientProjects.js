var MYLIBRARY = MYLIBRARY || (function() {
    let _args = {};

    return {
        init: function(Args) {
            _args = Args;
        },
        drawStuff: function() {
            const databaseData = _args[0];

            function drawProjectTypesDonut(databaseData) {
                function projectTypeData(databaseNumbers) {
                    const projectTypeAmounts = {};
                    var renovation = 0;
                    var newConstruction = 0;
                    var structuralModification = 0;
                    for (let i = 0; i < databaseNumbers.length; i += 1) {
                        if (databaseNumbers[i].projectType === "Renovation") {
                            renovation += 1;
                        } else if (databaseNumbers[i].projectType === "New Construction") {
                            newConstruction += 1;
                        } else if (databaseNumbers[i].projectType === "Structural Modification") {
                            structuralModification += 1;
                        }
                    }
                    projectTypeAmounts.renovation = renovation;
                    projectTypeAmounts.newConstruction = newConstruction;
                    projectTypeAmounts.structuralModification = structuralModification;
                    return projectTypeAmounts;
                }
                projectTypeAmounts = projectTypeData(databaseData);

                function projectTypePercentage(projectTypeAmounts) {
                    const percentageData = {};
                    const total = projectTypeAmounts.renovation + projectTypeAmounts.newConstruction + projectTypeAmounts.structuralModification;
                    const renovationP = Math.floor(projectTypeAmounts.renovation / total * 100);
                    const newConstructionP = Math.floor(projectTypeAmounts.newConstruction / total * 100);
                    const structuralModificationP = Math.floor(projectTypeAmounts.structuralModification / total * 100);
                    percentageData.renovationP = renovationP;
                    percentageData.newConstructionP = newConstructionP;
                    percentageData.structuralModificationP = structuralModificationP;
                    return percentageData;
                }
                dataPercentages = projectTypePercentage(projectTypeAmounts);

                new Morris.Donut({
                    element: 'projectTypes',
                    data: [{
                        label: 'New Construction',
                        value: dataPercentages.newConstructionP
                    }, {
                        label: 'Renovation',
                        value: dataPercentages.renovationP
                    }, {
                        label: 'Structural Modification',
                        value: dataPercentages.structuralModificationP
                    }],
                    formatter: function(value, data) {
                        return value + "%";
                    },
                    resize: 'true'
                });

            }

            //Draw build type percentage donut 
            function drawBuildTypesChart(databaseData) {
                const buildTypesArray = [];
                for (let i = 0; i < databaseData.length; i += 1) {
                    buildTypesArray.push(databaseData[i].buildType)
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

                buildTypesAmount = countBuildTypes(buildTypesArray);

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

                chartData = prepareDataForChart(buildTypesAmount);

                new Morris.Bar({
                    barSizeRatio: 0.25,
                    element: 'buildTypes',
                    data: chartData,
                    xkey: 'label',
                    ykeys: ['value'],
                    labels: ['Amount'],
                    resize: 'true'
                });

                new Morris.Donut({
                    element: 'projectTypes2',
                    data: chartData,
                    formatter: function(value, data) {
                        return value + "%";
                    },
                    resize: 'true'
                });
            }

            $(function() {
                $('#table').bootstrapTable({
                    data: databaseData
                });
            });

            drawProjectTypesDonut(databaseData);
            drawBuildTypesChart(databaseData);
        }
    };
}());