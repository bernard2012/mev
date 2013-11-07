<div class="row-fluid">

	<div class="accordion" id="prevAnalysisList">
	  
	  <div class="accordion-group">
	    <div class="accordion-heading">
	      <a class="accordion-toggle" data-toggle="collapse" data-parent="#prevAnalysisList" href="#collapseOne">
	        Limma Analysis
	      </a>
	    </div>
	    <div id="collapseOne" class="accordion-body collapse">
	      <div class="accordion-inner">
	        <div id="limmaResultsTable">
                    <table class="table table-hover table-bordered">
                            <thead>
                                    <tr>
                                      <th ng-repeat="header in ['ID', 'Log-Fold-Change', 'Average Expression', 'P-Value', 'Q-Value']">{{header}}</th>
                                    </tr>
                            </thead>
                            <tbody>
                                    <tr ng-repeat="row in limmaviewtablerows ">
                                            <td>
                                                    {{row["id"]}}
                                            </td>
                                            <td>
                                                    {{row["logFoldChange"]}}
                                            </td>
                                            <td>
                                                    {{row["averageExpression"]}}
                                            </td>
                                            <td>
                                                    {{row["pValue"]}}
                                            </td>
                                            <td>
                                                    {{row["qValue"]}}
                                            </td>
                                    </tr>
                            </tbody>
                    </table>
            </div> <!-- LIMMA ANALYSIS END -->
            
            
	      </div>
	    </div>
	  </div>
	  
	  <div class="accordion-group">
	    <div class="accordion-heading">
	      <a class="accordion-toggle" data-toggle="collapse" data-parent="#prevAnalysisList" href="#collapseTwo">
	        Radial Clustering
	      </a>
	    </div>
	    <div id="collapseTwo" class="accordion-body collapse">
	      <div class="accordion-inner">
	        <img src="http://revolution-computing.typepad.com/.a/6a010534b1db25970b0120a56d0b8f970b-800wi" width='300' height='300'></img>
	      </div>
	    </div>
	  </div>
	  
	  
	</div>
	
</div>