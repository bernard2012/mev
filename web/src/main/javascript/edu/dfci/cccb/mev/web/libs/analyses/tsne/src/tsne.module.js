define(["mui", "mev-scatter-plot",
	"./model/TsneAnalysisType",
	"./router/TsneState",
	"./router/TsneStateVM",
	"angular-ui-router",
	"mev-analysis",
	"mev-domain-common"
], function(ng){
	return ng.module("mev-tsne", arguments, arguments);
});
