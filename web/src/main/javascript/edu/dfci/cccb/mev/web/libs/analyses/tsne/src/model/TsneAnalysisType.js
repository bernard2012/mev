define(["../router/TsneState.tpl.html",
"mev-analysis/src/params/model/integer/IntegerParam"
], function(template, IntegerParam){"use strict";
	function component(MevAnalysisType, mevAnalysisParams){
		var tsneType = new MevAnalysisType({
			id: "tsne",
			name: "TSNE",
			viewModel: "TsneStateVM",
			template: template,
			params: mevAnalysisParams([
				new IntegerParam({
                    "id": "perplexity",
                    "displayName": "Perplexity",
                    "min": 1,
                    "max": 50,
                    "value": 15
                }),
				new IntegerParam({
					"id": "dims",
					"displayName": "Dimensions",
					"min": 2,
					"max": 5,
					"value": 2
				})
			]),
			info: {
				template: "An R wrapper around the fast T-distributed Stochastic Neighbor Embedding implementation by Van der Maaten" +
					"<p>Reference: <a href='https://cran.r-project.org/web/packages/Rtsne/index.html'>" +
					"https://cran.r-project.org/web/packages/Rtsne/index.html</a></p>"
			}
		});
		tsneType.start=function(){
			var paramValues = this.params.getValues();
			this.parent.start.call(this, this, paramValues, {analysisName: paramValues.name}, "put");
		};
		return tsneType;
	}
	component.$name="mevTsneAnalysisType";	
	component.$inject=["mevAnalysisType", "mevAnalysisParams", "mevParentAnalysisParam", "mevSelectionSetParam"];
	component.$provider="factory";
	return component;
});