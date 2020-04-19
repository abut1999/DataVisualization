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

                new Morris.Donut({
                    element: 'projectTypes2',
                    data: chartData,
                    formatter: function(value, data) {
                        return value + "%";
                    },
                    resize: 'true'
                });
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

            drawProjectTypesDonut(databaseData);
            drawBuildTypesChart(databaseData);

            let barChart = new Morris.Bar({
                barSizeRatio: 0.25,
                element: 'buildTypes',
                data: chartData,
                xkey: 'label',
                ykeys: ['value'],
                labels: ['Amount'],
                xLabelAngle: 60,
                xLabelMargin: 20,
                resize: 'true'
            }, true);

            //UniqueKindOptions
            function uniqueKindOptions() {
                const kindTypes = [];
                for (let i = 0; i < databaseData.length; i += 1) {
                    kindTypes.push(databaseData[i].kind);
                }
                uniqueValues = kindTypes.filter(function(item, pos) {
                    return kindTypes.indexOf(item) == pos;
                })
                return uniqueValues;
            }

            //UniqueProjectTypeOptions
            function uniqueProjectOptions() {
                const projectTypes = [];
                for (let i = 0; i < databaseData.length; i += 1) {
                    projectTypes.push(databaseData[i].projectType);
                }
                uniqueValues = projectTypes.filter(function(item, pos) {
                    return projectTypes.indexOf(item) == pos;
                })
                return uniqueValues;
            }

            //UniqueBuildTypesOptions
            function uniqueBuildOptions() {
                const buildTypes = [];
                for (let i = 0; i < databaseData.length; i += 1) {
                    buildTypes.push(databaseData[i].buildType);
                }
                uniqueValues = buildTypes.filter(function(item, pos) {
                    return buildTypes.indexOf(item) == pos;
                })
                return uniqueValues;
            }

            //Multiselect button & filtering
            $(document).ready(function() {
                const kindValues = uniqueKindOptions();
                const projectTypeValues = uniqueProjectOptions();
                const buildTypes = uniqueBuildOptions();
                $('.th-inner:contains("Kind")').append('<select id="KindFilterButton" multiple="multiple"> </select>')
                for (let i = 0; i < kindValues.length; i += 1) {
                    $('#KindFilterButton').append(`<option value = "${kindValues[i]}"> ${kindValues[i]}</option>`)
                }
                $('.th-inner:contains("Project type")').append('<select id="ProjectTypeFilterButton" multiple="multiple"> </select>')
                for (let i = 0; i < projectTypeValues.length; i += 1) {
                    $('#ProjectTypeFilterButton').append(`<option value = "${projectTypeValues[i]}"> ${projectTypeValues[i]}</option>`)
                }
                $('.th-inner:contains("Build type")').append('<select id="BuildTypeFilterButton" multiple="multiple"> </select>')
                for (let i = 0; i < buildTypes.length; i += 1) {
                    $('#BuildTypeFilterButton').append(`<option value = "${buildTypes[i]}"> ${buildTypes[i]}</option>`)
                }
                $('#KindFilterButton').multiselect({
                    //Filtering function options
                    onChange: function(option, checked, select) {
                        const selectedKindType = ($('#KindFilterButton').val());
                        const selectedProjectType = ($('#ProjectTypeFilterButton').val());
                        const selectedBuildType = ($('#BuildTypeFilterButton').val());
                        let tempData = databaseData.slice();
                        if (selectedKindType.length !== 0) {
                            for (var i = tempData.length - 1; i >= 0; --i) {
                                if (selectedKindType.includes(tempData[i].kind) === false) {
                                    tempData.splice(i, 1);
                                }
                            }
                        }
                        if (selectedProjectType.length !== 0) {
                            for (var i = tempData.length - 1; i >= 0; --i) {
                                if (selectedProjectType.includes(tempData[i].projectType) === false) {
                                    tempData.splice(i, 1);
                                }
                            }
                        }
                        if (selectedBuildType.length !== 0) {
                            for (var i = tempData.length - 1; i >= 0; --i) {
                                if (selectedBuildType.includes(tempData[i].buildType) === false) {
                                    tempData.splice(i, 1);
                                }
                            }
                        }
                        $('#table').bootstrapTable("load", tempData);
                    }
                });
                $('#ProjectTypeFilterButton').multiselect({
                    //Filtering function options
                    onChange: function(option, checked, select) {
                        const selectedKindType = ($('#KindFilterButton').val());
                        const selectedProjectType = ($('#ProjectTypeFilterButton').val());
                        const selectedBuildType = ($('#BuildTypeFilterButton').val());
                        let tempData = databaseData.slice();
                        if (selectedKindType.length !== 0) {
                            for (var i = tempData.length - 1; i >= 0; --i) {
                                if (selectedKindType.includes(tempData[i].kind) === false) {
                                    tempData.splice(i, 1);
                                }
                            }
                        }
                        if (selectedProjectType.length !== 0) {
                            for (var i = tempData.length - 1; i >= 0; --i) {
                                if (selectedProjectType.includes(tempData[i].projectType) === false) {
                                    tempData.splice(i, 1);
                                }
                            }
                        }
                        if (selectedBuildType.length !== 0) {
                            for (var i = tempData.length - 1; i >= 0; --i) {
                                if (selectedBuildType.includes(tempData[i].buildType) === false) {
                                    tempData.splice(i, 1);
                                }
                            }
                        }
                        $('#table').bootstrapTable("load", tempData);
                    }
                });
                $('#BuildTypeFilterButton').multiselect({
                    //Filtering function options
                    onChange: function(option, checked, select) {
                        const selectedKindType = ($('#KindFilterButton').val());
                        const selectedProjectType = ($('#ProjectTypeFilterButton').val());
                        const selectedBuildType = ($('#BuildTypeFilterButton').val());
                        let tempData = databaseData.slice();
                        if (selectedKindType.length !== 0) {
                            for (var i = tempData.length - 1; i >= 0; --i) {
                                if (selectedKindType.includes(tempData[i].kind) === false) {
                                    tempData.splice(i, 1);
                                }
                            }
                        }
                        if (selectedProjectType.length !== 0) {
                            for (var i = tempData.length - 1; i >= 0; --i) {
                                if (selectedProjectType.includes(tempData[i].projectType) === false) {
                                    tempData.splice(i, 1);
                                }
                            }
                        }
                        if (selectedBuildType.length !== 0) {
                            for (var i = tempData.length - 1; i >= 0; --i) {
                                if (selectedBuildType.includes(tempData[i].buildType) === false) {
                                    tempData.splice(i, 1);
                                }
                            }
                        }
                        $('#table').bootstrapTable("load", tempData);
                    }
                });
            });
            //Multiselect filtering button for project types bar chart
            $(document).ready(function() {
                $('#bar-graph-container').append('<select id="ClientProjectsProjectTypeBarChartMultiselectFilter" multiple="multiple"> </select>')
                console.log(chartData);
                for (let i = 0; i < chartData.length; i += 1) {
                    $('#ClientProjectsProjectTypeBarChartMultiselectFilter').append(`<option value = "${chartData[i].label}"> ${chartData[i].label}</option>`)
                }
                $('#ClientProjectsProjectTypeBarChartMultiselectFilter').multiselect({
                    //Filtering function options
                    onChange: function(option, checked, select) {
                        const selectedValues = ($('#ClientProjectsProjectTypeBarChartMultiselectFilter').val());
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
                $('#table > thead > tr > th:nth-child(2)').attr("data-tableexport-value", "Kind");
                $('#table > thead > tr > th:nth-child(3)').attr("data-tableexport-value", "Project Type");
                $('#table > thead > tr > th:nth-child(6)').attr("data-tableexport-value", "Build Type");
                $('#table > tfoot').find('tr').attr("data-tableexport-display", "none");
            });
        }
    };
}());