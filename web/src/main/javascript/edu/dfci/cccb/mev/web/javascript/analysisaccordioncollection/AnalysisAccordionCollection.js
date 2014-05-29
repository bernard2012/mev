define(['angular', 'jquery', 'd3', 'alertservice/AlertService'], function(angular, jq, d3){
	
	return angular.module('Mev.AnalysisAccordionCollection', ['Mev.AlertService'])
	.service('d3DomService', [function(){
		return function(id,s){
			
			s.$apply(function(){
				
				d3.select(id)
				.append('svg')
					.attr({
						'width':500,
						'height':400,
						'id':id+'-svg'
					});

			});
			
			d3.select(id)
			.append('svg')
				.attr({
					'width':500,
					'height':400,
					'id':id+'-svg'
				});
			
			
			return d3.select('svg#'+id+'-svg');
		};
	}])
	.service('drawBoxPlots', function(){
		return function(svg, groups){
			
			//svg.
			return
		}
	})
	.directive('analysisContentItem', ['$compile', function ($compile) {
        var heirarchicalTemplate = '<hierarchical-Accordion analysis="analysis" project="project"></hierarchical-Accordion>';
        var kMeansTemplate = '<k-Means-Accordion analysis="analysis" project="project"></k-Means-Accordion>';
        var anovaTemplate = '<anova-Accordion analysis="analysis" project="project"></anova-Accordion>';
        var tTestTemplate = '<t-Test-Accordion analysis="analysis" project="project"></t-Test-Accordion>';
        var limmaTemplate  = '<limma-Accordion analysis="analysis" project="project"></limma-Accordion>';
        
        var getTemplate = function(analysisType) {
            var template = '';
    
            switch(analysisType) {
                case 'Hierarchical Clustering':
                    template = heirarchicalTemplate;
                    break;
                case 'K-means Clustering':
                    template = kMeansTemplate;
                    break;
                case 'LIMMA Differential Expression Analysis':
                    template = limmaTemplate;
                    break;
                case 'Anova Analysis':
                    template = anovaTemplate;
                    break;
                case 't-Test Analysis':
                    template = tTestTemplate;
                    break;
            }
    
            return template;
        }
    
        return {
            restrict: "E",
            rep1ace: true,
            scope: {
                analysis : '=analysis',
                project : '=project',
            },
            link: function(scope, element, attrs) {

                element.append(getTemplate(scope.analysis.type));
        
                $compile(element.contents())(scope);
            }
        };
    }])
	.directive('kMeansAccordion', [function() {
        return {
            restrict : 'E',
            scope : {
            	analysis : "=analysis",
            	project : "=project"
            },
            templateUrl : '/container/view/elements/kmeansAccordion',
            link : function(scope) {
                
                function traverse(clusters){
                    
                    var labels = []
                    
                    for (var i = 0; i < clusters.length; i++) {
                        labels = labels.concat(clusters[i]);
                    };
                    
                    return labels
                }
                
                scope.applyToHeatmap=function(){
                    
                    var labels = traverse(scope.analysis.clusters);
                    
                    if (scope.analysis.dimension == "column"){

                        scope.project.generateView({
                            viewType:'heatmapView', 
                            labels:{
                                row:{keys:scope.project.dataset.row.keys}, 
                                column:{keys:labels}
                            },
                            expression:{
                                min: scope.project.dataset.expression.min,
                                max: scope.project.dataset.expression.max,
                                avg: scope.project.dataset.expression.avg,
                            },
                            panel : {top: scope.analysis}
                        });
                        
                    } else {
                        scope.project.generateView({
                            viewType:'heatmapView', 
                            labels:{
                                column:{keys:scope.project.dataset.column.keys}, 
                                row:{keys:labels}
                            },
                            expression:{
                                min: scope.project.dataset.expression.min,
                                max: scope.project.dataset.expression.max,
                                avg: scope.project.dataset.expression.avg,
                            },
                            panel: {side: scope.analysis}
                        });
                    }
                    scope.$emit('ViewVisualizeTabEvent');
                };
                
            }
        };
    }])
    .directive('anovaAccordion',
    ['$filter', 'alertService', function($filter, alertService) {
        return {
            restrict : 'E',
            templateUrl : '/container/view/elements/anovaAccordion',
            scope : {
            	analysis : "=analysis",
            	project : '=project',
            },
            link: function(scope){

                scope.headers = [
                    {'name':'ID', 'value':"id"},
                    {'name':'P-Value', 'value':"pValue"},
                    {'name':'Pairwise LFC', 'value':'pairwise_log_fold_change'}
                ]
                
                scope.filterParams = {
                        'id' : '',
                        'pValue' : undefined
                };
                    
                scope.selectionParams = {
                    name: undefined,
                    color: '#'+Math.floor(Math.random()*0xFFFFFF<<0).toString(16),
                    dimension:'row'
                };
                    
                var ctr = -1;
                scope.tableOrdering = undefined;
                scope.reorderTable = function(header) {

                    ctr = ctr * (-1);
                    if (ctr == 1) {
                        scope.tableOrdering = header.value;
                    } else {
                        scope.tableOrdering = "-"
                                + header.value;
                    }
                };
                    
                scope.addSelections = function(){
            
                    var userselections = scope.analysis.results;

                    var step1 = $filter('filter')(scope.analysis.results, {
                        id: scope.filterParams.id
                    });

                    var step2 = $filter('filterThreshold')(step1, scope.filterParams.pValue, 'pValue')
                    
                    var step3 = step2.map(function(d){
                        return d.id
                    })

                    var selectionsData = {
                        name: scope.selectionParams.name,
                        properties: {
                            selectionDescription: '',
                            selectionColor:scope.selectionParams.color,                     
                        },
                        keys:step3
                    };
                    
                    scope.project.dataset.selection.post({
                        datasetName : scope.project.dataset.datasetName,
                        dimension : scope.selectionParams.dimension

                    }, selectionsData,
                    function(response){
                            
                            scope.project.dataset.resetSelections('row')
                            var message = "Added " + scope.selectionParams.name + " as new Selection!";
                            var header = "Heatmap Selection Addition";
                    
                            scope.selectionParams.color = '#'+Math
                                .floor(Math.random()*0xFFFFFF<<0)
                                .toString(16)

                            alertService.success(message,header);
                    },
                    function(data, status, headers, config) {
                        var message = "Couldn't add new selection. If "
                            + "problem persists, please contact us.";

                         var header = "Selection Addition Problem (Error Code: "
                            + status
                            + ")";

                         alertService.error(message,header);
                    });

                }
                
                function traverse (results) {
                    var step1 = $filter('filter')(results, {
                        id: scope.filterParams.id
                    });

                    var step2 = $filter('filterThreshold')(step1, scope.filterParams.pValue, 'pValue')
                    
                    var step3 = step2.map(function(d){
                        return d.id
                    })
                    
                    return step3;
                }
                
                scope.applyToHeatmap=function(){
                    
                    var labels = traverse(scope.analysis.results);

                    scope.project.generateView({
                        viewType:'heatmapView', 
                        labels:{
                            column:{keys:scope.project.dataset.column.keys}, 
                            row:{keys:labels}
                        },
                        expression:{
                            min: scope.project.dataset.expression.min,
                            max: scope.project.dataset.expression.max,
                            avg: scope.project.dataset.expression.avg,
                        }
                    });
                    scope.$emit('ViewVisualizeTabEvent');
                    
                };
            }
        };
    }])
    .directive('tTestAccordion',
    ['$filter', 'alertService', function($filter, alertService) {
        return {
            restrict : 'E',
            templateUrl : '/container/view/elements/tTestAccordion',
            scope : {
            	project : "=project",
            	analysis : "=analysis"
            },
            link : function(scope) {
            	
                scope.$watch('analysis', function(newval){
                    if (newval){
                        scope.tTest = scope.analysis;
                        scope.filteredResults=scope.tTest.results;
                    }
                });
                
                scope.headers = {
                    'ID' : {name: "id", sort: -1},
                    'P-Value' : {name: "pValue", sort: -1},
                    'Log Fold Change': {name: "logFoldChange", sort: -1}
                };
                
                scope.filterParams = {
    	                'id' : {
    	                	field: 'id',
    	                	value: undefined,
    	                	op: "="
    	                },
    	                'logFoldChange' : {
    	                	field: 'logFoldChange',
    	                	value: undefined,
    	                	op: '>='
    	                },
    	                'pValueThreshold' : {
    	                	field: 'pValue',
    	                	value: 0.05,
    	                	op: '<='
    	                }
                    };
                scope.applyFilter=function(results){
                	var filtered = $filter('filter')(scope.tTest.results, {
                        id: scope.filterParams.id.value
                    });
                	filtered= $filter('filterThreshold')(filtered, scope.filterParams.pValueThreshold.value, scope.filterParams.pValueThreshold.field);
                	filtered= $filter('filterThreshold')(filtered, scope.filterParams.logFoldChange.value, scope.filterParams.logFoldChange.field, scope.filterParams.logFoldChange.op);
                	filtered = $filter('orderBy')(filtered, scope.tTestTableOrdering);
                	
                	scope.filteredResults=filtered;
                	return scope.filteredResults;
                };
                
                scope.selectionParams = {
                        name: undefined,
                        color: '#'+Math.floor(Math.random()*0xFFFFFF<<0).toString(16)
                };
                
                scope.addSelections = function(){
                    
                    var keys = traverse(scope.filteredResults);
                    var selectionData = {
                        name: scope.selectionParams.name,
                        properties: {
                            selectionDescription: '',
                            selectionColor:scope.selectionParams.color,                     
                        },
                        keys:keys
                    };
                    
                    scope.project.dataset.selection.post({
                        datasetName : scope.project.dataset.datasetName,
                        dimension : "row"
                
                    }, selectionData, 
                    function(response){
                            scope.project.dataset.resetSelections('row')
                            var message = "Added " + scope.selectionParams.name + " as new Selection!";
                            var header = "Heatmap Selection Addition";
                             
                            alertService.success(message,header);
                    }, 
                    function(data, status, headers, config) {
                        var message = "Couldn't add new selection. If "
                            + "problem persists, please contact us.";

                         var header = "Selection Addition Problem (Error Code: "
                            + status
                            + ")";
                         
                         alertService.error(message,header);
                    });
                    
                };
                
                scope.getCaretCss = function(header){                                        	
                	if(header.sort==1){
                		return "caret-up";
                	}else{
                		return "caret-down";
                	}
                }

                var ctr = -1;
                scope.tTestTableOrdering = undefined;                                        
                scope.reorderTTestTable = function(header, $event) {

                    ctr = ctr * (-1);
                    scope.headers[header].sort=scope.headers[header].sort*(-1);
                    if (scope.headers[header].sort == 1) {
                        scope.tTestTableOrdering = scope.headers[header].name;
                    } else {
                        scope.tTestTableOrdering = "-"
                                + scope.headers[header].name;
                    }
                };
                
                function traverse (results) {                    
                    var ids = results.map(function(d){
                        return d.id
                    });                    
                    return ids;
                }
                
                scope.applyToHeatmap=function(){
                    
                    var labels = traverse(scope.filteredResults);

                    scope.project.generateView({
                        viewType:'heatmapView', 
                        labels:{
                            column:{keys:scope.project.dataset.column.keys}, 
                            row:{keys:labels}
                        },
                        expression:{
                            min: scope.project.dataset.expression.min,
                            max: scope.project.dataset.expression.max,
                            avg: scope.project.dataset.expression.avg,
                        }
                    });
                    scope.$emit('ViewVisualizeTabEvent');
                    
                };
                
                
            }

        };
    }]).directive('limmaAccordion',
    ['$filter', 'alertService', 'd3DomService', 'drawBoxPlots',  function($filter, alertService, d3Dom, plot) {
        return {
            restrict : 'E',
            templateUrl : '/container/view/elements/limmaAccordion',
            scope : {
                project : '=project',
            	analysis : "=analysis"
            },
            link : function(scope) {
                
                scope.headers = [
	               {'name':'ID', 'field': "id", 'icon': "search"},
	               {'name':'Log-Fold-Change', 'field': "logFoldChange", 'icon': [">=", "<="]},
	               {'name':'Average Expression', 'field': "averageExpression", 'icon': "none"},
	               {'name':'P-Value', 'field': "pValue", 'icon': "<="},
	               {'name':'q-Value', 'field' : "qValue", 'icon': "<="}
               ];
                
                scope.filterParams = {
	                'id' : {
	                	field: 'id',
	                	value: undefined,
	                	op: "="
	                },
	                'logFoldChange' : {
	                	field: 'logFoldChange',
	                	value: undefined,
	                	op: '>='	                	
	                },
	                'pValue' : {
	                	field: 'pValue',
	                	value: 0.05,
	                	op: '<='
	                },
	                'qValue':{
	                	field: 'qValue',
	                	value: undefined,
	                	op: '<='
	                }
                };
                scope.filteredResults=undefined;
                scope.selectionParams = {
                    name: undefined,
                    color: '#'+Math.floor(Math.random()*0xFFFFFF<<0).toString(16)
                }
                
                scope.viewGenes = function(){
                	var shownGenes = scope.applyFilter(scope.analysis.results);
                	
                	var groups = Object.create(null);
                	
                	
                	shownGenes.map(function(gene){
                		groups[gene] = {
                        		control: {
                        			pairs: [],
                        			values: [],
                        			sortedValues: [],
                        			sort: scope.project.dataset.expression.sort,
                        			statistics: scope.project.dataset.expression.statistics
                        			
                        		},
                        		experiment: {
                        			pairs:[],
                        			values:[],
                        			sortedValues: [],
                        			sort: scope.project.dataset.expression.sort,
                        			statistics: scope.project.dataset.expression.statistics
                        		},
                        		genes:shownGenes,
                        		plot: {
                        			control: {
                            			max: undefined,
                            			min: undefined,
                            			firstq: undefined,
                            			thirdq: undefined,
                            			secondq: undefined
                            		},
                            		experiment: {
                            			max: undefined,
                            			min: undefined,
                            			firstq: undefined,
                            			thirdq: undefined,
                            			secondq: undefined
                            		}
                        		
                        		}
                        	};
                		
                		//set up pairs
                		
                		groups[gene].control.pairs.map(function(pair, index){
                    	//Set up values for control pairs and initial state of sorted values
                    		
                    		//value push
                    		groups[gene].control.values.push(scope.dataset.expression.get(pair));
                    		
                    		//sorted value push
                    		groups[gene].control.sortedValues.push(index);
                    	});
                		
                		groups[gene].experiment.pairs.map(function(pair, index){
                    	//Set up values for experiment pairs
                    		
                    		//value push
                    		groups[gene].experiment.values.push(scope.dataset.expression.get(pair));
                    		
                    		//sorted value push
                    		groups[gene].experiment.sortedValues.push(index);
                    	});

                		//Sort!
                		if (groups[gene].experiment.pairs.length > 0 && groups[gene].control.pairs.length > 0){
                			groups[gene].control.sort();
                        	groups[gene].experiment.sort();
                        	
                        	//Build quartile and drawing information
                        	groups[gene].plot.control = {
                        			max: groups[gene].control.statistics().max(),
                        			min: groups[gene].control.statistics().max(),
                        			firstq: groups[gene].control.statistics().quartile(1),
                        			thirdq: groups[gene].control.statistics().quartile(3),
                        			median: groups[gene].control.statistics().median()
                        	};
                        	
                        	groups[gene].plot.experiment = {
                        			max: groups[gene].experiment.statistics().max(),
                        			min: groups[gene].experiment.statistics().max(),
                        			firstq: groups[gene].experiment.statistics().quartile(1),
                        			thirdq: groups[gene].experiment.statistics().quartile(3),
                        			median: groups[gene].experiment.statistics().median()
                        	};
                        	var svg = d3Dom('div#limma-' + scope.analysis.randomId + '-svg-holder', scope, groups)
                        	
                        	plot(svg, groups)
                        	
                		}
                		
                    	
                	
                	});

                	
                	
                	
                };
                
                scope.$watch('analysis', function(newval){
                	if(newval){
                		scope.viewGenes()
                	}
                	
                })
                
                scope.addSelections = function(){
                    
                    var userselections = getKeys(scope.filteredResults);
                                        
                    var selectionData = {
                        name: scope.selectionParams.name,
                        properties: {
                            selectionDescription: '',
                            selectionColor:scope.selectionParams.color,                     
                        },
                        keys:userselections
                    };
                    
                    
                    
                    scope.project.dataset.selection.post({
                        datasetName : scope.project.dataset.datasetName,
                        dimension : "row"
                        
                    }, selectionData, 
                    function(response){
                            scope.project.dataset.resetSelections('row')
                            var message = "Added " + scope.selectionParams.name + " as new Selection!";
                            var header = "Heatmap Selection Addition";
                             
                            alertService.success(message,header);
                    }, 
                    function(data, status, headers, config) {
                        var message = "Couldn't add new selection. If "
                            + "problem persists, please contact us.";

                         var header = "Selection Addition Problem (Error Code: "
                            + status
                            + ")";
                         
                         alertService.error(message,header);
                    });
                    
                }

                var ctr = -1;
                scope.limmaTableOrdering = undefined;

                scope.reorderLimmaTable = function(header) {

                    ctr = ctr * (-1);
                    if (ctr == 1) {
                        scope.tableOrdering = header.field;
                    } else {
                        scope.tableOrdering = "-"
                                + header.field;
                    }
                }
                
                function getField (fieldName, results) {                    
                    var fieldValues = results.map(function(d){
                        return d[fieldName];
                    });                    
                    return fieldValues;
                }
                function getKeys(results){
                	return getField('id', results);
                };
                
                scope.applyFilter = function (results) {
                	
                    var filtered = $filter('filter')(results, {
                        id: scope.filterParams.id.value
                    });
                    
                    filtered = $filter('filterThreshold')(filtered, scope.filterParams.logFoldChange.value, scope.filterParams.logFoldChange.field, scope.filterParams.logFoldChange.op);
                    filtered= $filter('filterThreshold')(filtered, scope.filterParams.pValue.value, scope.filterParams.pValue.field);
                    filtered= $filter('filterThreshold')(filtered, scope.filterParams.qValue.value, scope.filterParams.qValue.field, scope.filterParams.qValue.op);
                    filtered = $filter('orderBy')(filtered, scope.tableOrdering);
                    scope.filteredResults = filtered;
                    
//                    console.debug("scope.filterParams", scope.filterParams);
//                    console.debug("filteredResults.length", scope.filteredResults.length);
                    
                    return scope.filteredResults;
                }
                
                scope.applyToHeatmap=function(){
                    
                    var labels = getKeys(scope.filteredResults);

                    scope.project.generateView({
                        viewType:'heatmapView', 
                        labels:{
                            column:{keys:scope.project.dataset.column.keys}, 
                            row:{keys:labels}
                        },
                        expression:{
                            min: scope.project.dataset.expression.min,
                            max: scope.project.dataset.expression.max,
                            avg: scope.project.dataset.expression.avg,
                        }
                    });
                    scope.$emit('ViewVisualizeTabEvent');
                    
                };
            }

        };
    }])
    .directive('hierarchicalAccordion',
    [function() {

        return {
            restrict : 'E',
            scope : {
                analysis : "=analysis",
                project : "=project"

            },
            templateUrl : '/container/view/elements/hierarchicalAccordion',
            link : function(scope, elems, attr) {
                
                scope.applyToHeatmap=function(){
                    
                    var labels = traverse(scope.analysis.root);
                    
                    if (scope.analysis.dimension == "column"){

                        scope.project.generateView({
                            viewType:'heatmapView', 
                            labels:{
                                row:{keys:scope.project.dataset.row.keys}, 
                                column:{keys:labels}
                            },
                            expression:{
                                min: scope.project.dataset.expression.min,
                                max: scope.project.dataset.expression.max,
                                avg: scope.project.dataset.expression.avg,
                            },
                            panel : {top: scope.analysis}
                        });
                        
                    } else {
                        scope.project.generateView({
                            viewType:'heatmapView', 
                            labels:{
                                column:{keys:scope.project.dataset.column.keys}, 
                                row:{keys:labels}
                            },
                            expression:{
                                min: scope.project.dataset.expression.min,
                                max: scope.project.dataset.expression.max,
                                avg: scope.project.dataset.expression.avg,
                            },
                            panel: {side: scope.analysis}
                        });
                    }
                    scope.$emit('ViewVisualizeTabEvent');
                };
                
                function traverse(tree) {
                    
                    var leaves = {
                        '0':[],
                        '1':[]
                    };
                        
                    if (tree.children.length > 0){
                        for (var i = 0; i < tree.children.length; i++){
                            leaves[i] = (!tree.children[i].children) ? [tree.children[i].name] : traverse(tree.children[i])
                        }
                    };

                    return leaves[0].concat(leaves[1]);
                };

                var padding = 20;
                
                var labelsGutter = 50;
                
                var panel = {
                    height : 200 + padding,
                    width : pageWidth = 700,
                };

                var Cluster = d3.layout
                    .cluster()
                    .sort(null)
                    .separation(
                            function(a, b) {
                                return a.parent == b.parent
                                        ? 1
                                        : 1
                            })
                    .value(
                            function(d) {
                                return d.distance;
                            })
                    .children(
                            function(d) {
                                return d.children;
                            });

                

                var xPos = d3.scale
                        .linear()
                        .domain([0, 1])
                        .range([padding, panel.width - padding]);
                
                var yPos = d3.scale
                        .linear()
                        .domain([0, 1])
                        .range([padding, panel.height - padding - labelsGutter]);

                function Path(d) {
                    // Path function builder for TOP
                    // heatmap tree path attribute

                    return "M"
                            + (xPos(d.target.x))
                            + ","
                            + (yPos(d.target.y))
                            + "V"
                            + (yPos(d.source.y))
                            + "H"
                            + (xPos(d.source.x));

                };
                
                function noder(d) {

                    var a = [];

                    if (!d.children) {
                        a.push(d);
                    } else {
                        d.children.forEach(function(child) {
                           noder(child).forEach(function(j) {
                               a.push(j)
                           });
                        });
                    };

                    return a;
                };

                function drawAnalysisTree(canvas, cluster, tree, type) {

                    canvas.selectAll('*')
                            .remove();
                    
                    var nodes = cluster.nodes(tree);

                    var links = cluster
                            .links(nodes);

                    var labels = noder(tree);

                    if (labels.length <= 50) {
                        canvas
                                .selectAll(
                                        "text")
                                .data(labels)
                                .enter()
                                .append(
                                        "text")

                                .attr(
                                        "transform",
                                        function(d) {
                                            return "translate("
                                                    + xPos(d.x)
                                                    + ","
                                                    + yPos(d.y)
                                                    + ")rotate(90)"
                                        })
                                .attr(
                                        "text-anchor",
                                        "start")
                                .attr("dx", 5)
                                .attr("dy", 3)
                                .text(
                                        function(d) {
                                            return d.name
                                        })

                    };

                    canvas
                        .selectAll("path")
                        .data(links)
                        .enter()
                        .append("path")
                        .attr("d",function(d) {
                            return Path(d)
                        })
                        .attr("stroke", function() {
                            return "grey"
                        }).attr( "fill", "none");

                    canvas.selectAll( "circle").data(nodes)
                    .enter()
                    .append("circle")
                    .attr("r", 2.5)
                    .attr("cx",function(d) {
                        return xPos(d.x);
                    })
                    .attr("cy", function(d) {
                        return yPos(d.y);
                    })
                    .attr("fill", function(d) {
                        return "red"
                    })
                    .on("click", function(d) {
                        //
                    });

                };
                scope.$watch('analysis',  function(newval, oldval) {
                    if (newval) {
                    	//the svg is declared in the templste along with <style>
                    	//the styles are needed to support 'Save Image' function
//                        d3.select(elems[0]).select('div#svgPlace').append('svg');
                        
                        var svg = d3.select(elems[0]).select('div#svgPlace').select('svg')

                        svg.attr({
                            width : panel.width,
                            height : panel.height + padding
                        });
                        
                        svg.append("g");
                        
                        var panelWindow = d3
                            .select(elems[0])
                            .select("svg")
                            .select("g");
                        
                        

                        drawAnalysisTree(
                                panelWindow,
                                Cluster,
                                newval.root,
                                "horizontal");
                    }
                });
                
                scope.saveImage = function(cluster) {
               	
                	var svg = d3.select(elems[0]).select("svg")
                	console.debug("svg", svg);
                	
                	 var html = svg
                	 .attr("version", 1.1)
                     .attr("xmlns", "http://www.w3.org/2000/svg")
                     .node().parentNode.innerHTML;
                	  
                	 var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
//                	 var img = '<img src="'+imgsrc+'">';
//                	 d3.select("#svgdataurl").html(img);
                	  
                	  
//                	 var canvas = document.querySelector("#canvasHclTree_"+cluster.name);                	 
                	 var canvas = elems.find("canvas")[0];
                	 console.debug("canvas", canvas);
                	 var context = canvas.getContext("2d");
                	 canvas.width=svg.attr('width');
                	 canvas.height=svg.attr('height');
                	 
                	 var image = new Image;
                	 image.src = imgsrc;
                	 image.onload = function() {
                		                                         		 
                    	 canvas.style.opacity = 1;
                    	 context.beginPath();
                         context.rect(0, 0, canvas.width, canvas.height);                                                 
                    	 context.fillStyle ="#FFFFFF";
                    	 context.fill();
                    	 
                    	 context.drawImage(image, 0, 0);
                    	 
                    	 canvas.toBlob(function(blob) {
                    		    saveAs(blob, cluster.name+".png");
                    	 });
//                    	 var canvasdata = canvas.toDataURL("image/png");
//                    	  
//                    	 var pngimg = '<img src="'+canvasdata+'">';
//                    	 d3.select("#pngdataurl").html(pngimg);
//                    	  
//                    	 var a = document.createElement("a");
//                    	 a.download = "sample.png";
//                    	 a.href = canvasdata;
//                    	 a.click();
                	 };
   
                };

            } // end link
        };

    }])
    
	
});