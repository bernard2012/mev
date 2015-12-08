define(["ng", "lodash"], function(ng, _){
	"use strict";
	var AnyAnalysisDirective = function AnyAnalysisDirective(AnalysisTypes, $state, $resolve, $injector, AnalysisEventBus){
		
		
		
		function resolveProject($state){
			return $state.$current.locals["@root.dataset"].project;
		}
		function resolveAnalysis(analysisName){
			var project = resolveProject($state);
			var analysis = _.find(project.dataset.analyses, function(analysis){
				return analysis.name === analysisName;
			});
			return analysis;
		}
		
		return {
			restrict: "AE",
			scope: {
				anyAnalysis: "@",
				anyTemplateUrl: "@",
				anyViewModel: "@" ,
				anyAnalysisLaunch: "="
			},
			template: function(tElement, tAttrs){
				console.debug("anyAnalysis template", tAttrs);
				return "<div ng-include=\"getTemplateUrl()\" onload=\"processAnalysis()\">"+tAttrs.anyAnalysis+"</div>";				
			},
//			templateUrl: function(tElement, tAttrs){				
//				var templateUrl="app/views/dataset/analysis/default/view.analysis.default.tpl.html";
//				
//				var analysis = resolveAnalysis(tAttrs.anyAnalysis);				
//				var analysisType = AnalysisTypes[analysis.type];				
//				if(analysisType && analysisType.shortName){
//					templateUrl=templateUrl.replace("default", analysisType.shortName).replace("default", analysisType.shortName);
//				}
//				console.debug("anyAnalysis templateUrl:", templateUrl, analysisType, tAttrs, $state, resolveProject($state), analysis);
//				return templateUrl;
//			},
			controllerAs: "DatasetAnalysisVM",
			controller: ["$scope", "AnalysisEventBus",  function($scope, AnalysisEventBus){
				console.debug("anyAnalysis ctrl:", $scope);
				var project = resolveProject($state);
				var analysis = resolveAnalysis($scope.anyAnalysis);
								
				var analysisType;
				if(analysis){
					analysisType = AnalysisTypes[analysis.type];					
				}else if($scope.anyAnalysisLaunch && $scope.anyAnalysisLaunch.analysisType){					
					analysisType = AnalysisTypes[AnalysisTypes.reverseLookup[$scope.anyAnalysisLaunch.analysisType]];
				}
				
				var ctrlName;
				if($scope.anyViewModel){
					ctrlName = $scope.anyViewModel;
				}else{					
					ctrlName = analysisType.viewModel+"Factory";
					console.debug("anyAnalysis ctrlName:", ctrlName, analysisType, $state, resolveProject($state), analysis);
				}
				$scope.DatasetAnalysisVM.project=project;				
				$scope.DatasetAnalysisVM.analysis=analysis;
				$scope.getTemplateUrl=function(){
					if($scope.anyTemplateUrl){
						return $scope.anyTemplateUrl; 
					}
					
					var templateUrl="app/views/dataset/analysis/default/view.analysis.default.tpl.html";						
					if($scope.DatasetAnalysisVM.analysis){
						var analysis = $scope.DatasetAnalysisVM.analysis;
						if(analysis.status && analysis.status === "IN_PROGRESS"){
							//analysis is not ready - keep the default template
						}else{
							var analysisType = AnalysisTypes[$scope.DatasetAnalysisVM.analysis.type];
							templateUrl=templateUrl.replace("default", analysisType.shortName).replace("default", analysisType.shortName);								
						}	
					}
//					console.debug("anyAnalysis templateUrl:", templateUrl, analysisType, $state, resolveProject($state), analysis);
					return templateUrl;
				};
				
				AnalysisEventBus.onAnalysisSuccess($scope, function(type, name, data){
					if($scope.anyAnalysisLaunch){
						var analysis = data.response;
						if(analysis.name===$scope.anyAnalysisLaunch.analysisName){							
							$scope.DatasetAnalysisVM.analysis = analysis;
							var analysisType = AnalysisTypes[$scope.DatasetAnalysisVM.analysis.type];
							var ctrlName = analysisType.viewModel+"Factory";
							if($injector.has(ctrlName)){					
								var ctrl = $injector.get(ctrlName); 														
								$injector.invoke(ctrl, $scope.DatasetAnalysisVM, {$scope: $scope, project: project, analysis: analysis});
//						ctrl.call(this, $scope, project, analysis);	
							}
						}
					}
				});
				
				AnalysisEventBus.onAnalysisLoadedAll($scope, function(){
					
					if($scope.anyAnalysisLaunch){
						var analysis = _.find(project.dataset.analyses, function(analysis){ return analysis.name===$scope.anyAnalysisLaunch.analysisName; });
						if(analysis){							
							$scope.DatasetAnalysisVM.analysis = analysis;
							var analysisType = AnalysisTypes[$scope.DatasetAnalysisVM.analysis.type];
							var ctrlName = analysisType.viewModel+"Factory";
							if($injector.has(ctrlName)){					
								var ctrl = $injector.get(ctrlName); 														
								$injector.invoke(ctrl, $scope.DatasetAnalysisVM, {$scope: $scope, project: project, analysis: analysis});
//						ctrl.call(this, $scope, project, analysis);	
							}
						}
					}
		        });
				
				if($scope.DatasetAnalysisVM.analysis || $scope.anyViewModel){					
					if($injector.has(ctrlName)){					
						var ctrl = $injector.get(ctrlName); 
						console.debug("any controller", ctrlName, ctrl, $scope.$id);
						$injector.invoke(ctrl, $scope.DatasetAnalysisVM, {$scope: $scope, project: project, analysis: analysis});
//					ctrl.call(this, $scope, project, analysis);	
					}
				}
				
				
				
			}],
			compile: function(tElm, tAttr){				
				console.debug("anyAnalysis compile", tElm, tAttr);
				return function(scope, elm, attr, controller){
					console.debug("anyAnalysis link", scope, attr);
					
					scope.processAnalysis=function(){
						if(!controller.analysis) {
							console.debug("anyAnalysis: not found");
							return;
						};
						console.debug("processAnalysis", elm);						
						elm.find("[href]").each(function(){							
							var href = this.attributes.getNamedItem("href").value;
							if(href && href.indexOf("#") === 0){
								var newId = controller.analysis.name.replace(" ", "_")+"-"+href.substr(1);								
								console.debug("id ...", href, newId);	
								this.href="#"+newId;								
								elm.find(href).each(function(){
									console.debug("... changing", this.id, newId);
									this.id=newId;
								});								
							}							
						});
					};
					
					
				};
			}			
			
		};
	};
	AnyAnalysisDirective.$name="anyAnalysisDirective";
	AnyAnalysisDirective.$inject=["AnalysisTypes", "$state", "$resolve", "$injector", "AnalysisEventBus"];
	return AnyAnalysisDirective;
});