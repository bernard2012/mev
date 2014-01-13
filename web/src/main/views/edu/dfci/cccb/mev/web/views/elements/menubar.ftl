<style type="text/css">
/* 
Author: Start Bootstrap - http://startbootstrap.com
'SB Admin' HTML Template by Start Bootstrap

All Start Bootstrap themes are licensed under Apache 2.0. 
For more info and more free Bootstrap 3 HTML themes, visit http://startbootstrap.com!
*/

/* ATTN: This is mobile first CSS - to update 786px and up screen width use the media query near the bottom of the document! */

/* Global Styles */

body {
  margin-top: 50px;
}

#wrapper {
  padding-left: 0;
}

#page-wrapper {
  width: 100%;
  padding: 5px 15px;
}

/* Nav Messages */

.messages-dropdown .dropdown-menu .message-preview .avatar,
.messages-dropdown .dropdown-menu .message-preview .name,
.messages-dropdown .dropdown-menu .message-preview .message,
.messages-dropdown .dropdown-menu .message-preview .time {
  display: block;
}

.messages-dropdown .dropdown-menu .message-preview .avatar {
  float: left;
  margin-right: 15px;
}

.messages-dropdown .dropdown-menu .message-preview .name {
  font-weight: bold;
}

.messages-dropdown .dropdown-menu .message-preview .message {
  font-size: 12px;
}

.messages-dropdown .dropdown-menu .message-preview .time {
  font-size: 12px;
}


/* Nav Announcements */

.announcement-heading {
  font-size: 50px;
  margin: 0;
}

.announcement-text {
  margin: 0;
}

/* Table Headers */

table.tablesorter thead {
  cursor: pointer;
}

table.tablesorter thead tr th:hover {
  background-color: #f5f5f5;
}

/* Flot Chart Containers */

.flot-chart {
  display: block;
  height: 400px;
}

.flot-chart-content {
  width: 100%;
  height: 100%;
}

/* Edit Below to Customize Widths > 768px */
@media (min-width:768px) {

  /* Wrappers */

  #wrapper {
	padding-left: 225px;
  }

  #page-wrapper {
	padding: 15px 25px;
  }

  /* Side Nav */

  .side-nav {
	margin-left: -225px;
	left: 225px;
	width: 225px;
	position: fixed;
	top: 50px;
	height: 100%;
	border-radius: 0;
	border: none;
	background-color: #EBEBE0;
	overflow-y: auto;
  }

  /* Bootstrap Default Overrides - Customized Dropdowns for the Side Nav */

  .side-nav>li.dropdown>ul.dropdown-menu {
	position: relative;
	min-width: 225px;
	margin: 0;
	padding: 0;
	border: none;
	border-radius: 0;
	background-color: transparent;
	box-shadow: none;
	-webkit-box-shadow: none;
  }

  .side-nav>li.dropdown>ul.dropdown-menu>li>a {
	color: #999999;
	padding: 15px 15px 15px 25px;
  }

  .side-nav>li.dropdown>ul.dropdown-menu>li>a:hover,
  .side-nav>li.dropdown>ul.dropdown-menu>li>a.active,
  .side-nav>li.dropdown>ul.dropdown-menu>li>a:focus {
	color: #fff;
	background-color: #080808;
  }

  .side-nav>li>a {
	width: 225px;
  }

  .navbar-inverse .navbar-nav>li>a:hover,
  .navbar-inverse .navbar-nav>li>a:focus {
	background-color: #080808;
  }

  /* Nav Messages */

  .messages-dropdown .dropdown-menu {
	min-width: 300px;
  }

  .messages-dropdown .dropdown-menu li a {
	white-space: normal;
  }

}

</style>

  <ul class="nav navbar-nav side-nav">
  
    <li><a href="/home"><i class="icon-list"></i> Datasets</a></li>
    
    <li class="dropdown">
       <a href="#" class="dropdown-toggle" data-toggle="dropdown">
          <i class="fa fa-caret-square-o-down"></i> Clustering <b class="caret"></b>
       </a>
       <ul class="dropdown-menu">
          <li><a data-toggle="modal" role="button" href="#hierarchical">Hierarchical</a></li>
          <li><a data-toggle="modal" role="button" class="disabled" href=""><p class="muted">K-Means/Medians</p></a></li>
       </ul>
    </li>
    
    <li class="dropdown">
       <a href="#" class="dropdown-toggle" data-toggle="dropdown">
          <i class="fa fa-caret-square-o-down"></i> Statistics <b class="caret"></b>
       </a>
       <ul class="dropdown-menu">
          <li><a data-toggle="modal" role="button" href="#limma">LIMMA</a></li> 
          <li><a href=""><p class="muted">t-Test</p></a></li>
       </ul>
    </li>
    
    <li><a href=""><i class="icon-download-alt"></i> Export</a></li>
    
  </ul>


<!-- Modals -->
<bsmodal bindid="hierarchical" func="" header="Hierarchical Clustering">
 <div class="modal-Hierarchical"></div>
</bsmodal> 
  
<bsmodal bindid="kmeansclust" func="" header="K-Means/Medians Clustering">
 <div class="modal-Kmeans"></div>
</bsmodal>
  
<bsmodal bindid="limma" func="" header="LIMMA">
 <div class="modal-Limma"></div>
</bsmodal> 