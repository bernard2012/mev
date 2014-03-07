<nav class="navbar navbar-default" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header navbar-right">
      <a class="navbar-brand brand" href="/">mev<img src="/container/images/favicon/favicon-32x32.png"/></a>
    </div>
</nav>

<a class="brand" href="/"></a>
     		
<div class="container-fluid imports-container">

	<div class="row">
	
	  <div class="col-md-3">
	  
	    <div class="row">
	        <div class="col-md-10 col-md-offset-1">
	        
	            <div class="row">
	                <div class='uploadDrag'></div>
	            </div>
	        </div>
	    </div>
	  
	  </div>
	
	
	  <div class="col-md-8">
	    <div class="row">
	      <ul class="nav nav-tabs" id="importTabs">
	        <li class="active"><a href="#current" data-toggle="tab" ng-click="loadUploads()">Files</a></li>
	        <li><a href="#googleDrive" data-toggle="tab">Google Drive</a></li>
	        <li><a href="#tcga" data-toggle="tab">TCGA</a></li>
	      </ul>
	 	  
	      <div class="tab-content">
	      
	         <div class="tab-pane active" id="current">
	         
	            <div class="row">
	            
	              <div class="col-md-12">
	                <div uploads-Table uploads="userUploads"></div>
	              </div>
	              
	            </div>
	           
	         </div>
	        
	        <div class="tab-pane" id="tcga">
			  <div id="presetMgr" preset-manager ng-controller="PresetManagerController">
			  </div>
	        </div>
	       
	        
	      </div>
	      
	    </div>
	    
	  </div>
	
	</div>
</div>