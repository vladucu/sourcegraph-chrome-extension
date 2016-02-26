//Sourcegraph Token Code Search
var url, query, user, repo, branch, table, nomatch, taburl, original, button, xhr;
var taburlcurrent='';
var current = '';
var logo2 = document.createElement('img');
logo2.src = chrome.extension.getURL("assets/src4.png");
var search = document.createElement('img');
search.src = chrome.extension.getURL("assets/search.png");
 
//setup for each new tab
chrome.runtime.sendMessage({query: 'whoami'}, function(response){
	comboUsed = false;
	taburl = response.tabUrl;
	var urlsplit = taburl.split("/")
	user = urlsplit[3];
	repo = urlsplit[4];
	branch = 'master';
	if (urlsplit[6] !== null && (urlsplit[5]==='tree' || urlsplit[5]==='blob')) {
		branch = urlsplit[6];
	}
	url = "https://sourcegraph.com/.ui/github.com/"+user+"/"+repo+"@"+branch+"/.search/tokens?q="+query+"&PerPage=50&Page=1" //url
	table = "<div class='repository-content' id='toRemove'> <div class='breadcrumb flex-table'> <div class='flex-table-item'> <span class='bold'><a href=/"+user+"/"+repo+">"+repo+"</a></span> / </div> <input type='text' name='query' autocomplete='off' spellcheck='false' autofocus='' id='tree-finder-field2' data-results='tree-finder-results' style='width:85%' class='tree-finder-input2' role='search' js-tree-finder-field js-navigation-enable flex-table-item-primary'></div><div id='loadingDiv' style='display:none'>Searching...</div ><div class='tree-finder clearfix' data-pjax=''><div class='flash-messages js-notice'> <div class='flash' ><form accept-charset='UTF-8' action='/sourcegraph/go-git/dismiss-tree-finder-help' class='flash-close js-notice-dismiss' data-form-nonce='9e84d03d8bcc6640b285af494d66a530ef543a51' data-remote='true' method='post'><div style='margin:0;padding:0;display:inline'><input name='utf8' type='hidden' value='✓'><input name='authenticity_token' type='hidden' value='mP8EUglfiCcfAl1tEEOFKkAhyNAQG/mxzCkwmqqhKapITZjnk06XW6lB6kmSxo6NLU6sI+cwDHdqrUlZiewlBA=='></div> <button type='submit' class='close-button' aria-label='Hide this notice forever'> <svg aria-hidden='true' class='octicon octicon-x' height='16' role='img' version='1.1' viewBox='0 0 12 16' width='12'><path d='M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z'></path></svg> </button> </form> You’ve activated the Sourcegraph code search extension. Type in a query and press <kbd>enter</kbd> to view results.  Press <kbd>esc</kbd> to exit. </div> </div> <table id='tree-finder-results' class='tree-browser css-truncate' cellpadding='0' cellspacing='0' width='100%' style='border-bottom:1px solid #;cacaca;width:100%'> <tbody class='tree-browser-result-template js-tree-browser-result-template'> <tr class='js-navigation-item tree-browser-result'><td> <a class='css-truncate-target js-navigation-open js-tree-finder-path'></a></td> </tr> </tbody> </table>"; 
	nomatch = "<p style='text-align:center;font-size:16px'><b> No matching definitions found. </br></b></p>"//<span style='font-size:12pt;'> Is this a private repository? Private code must be mirrored on <a href=http://sourcegraph.com> Sourcegraph.com</a>.</br> Not <b>Go</b> or <b>Java</b>? Support for additional languages will be rolled out soon, stay tuned.</span></p>";
	button  = "<li><a href='/sd9org/golang-lib/find/master' class='btn btn-sm empty-icon right js-show-file-finder' data-pjax='' data-hotkey='t' data-ga-click='Repository, find file, location:repo overview'>Find Def</a></li>";

	var pageScript = document.createElement('script');
	pageScript.innerHTML = '$(document).on("pjax:success", function () { var evt = new Event("PJAX_PUSH_STATE_0923"); document.dispatchEvent(evt); });';
	document.querySelector('body').appendChild(pageScript);
	document.addEventListener('PJAX_PUSH_STATE_0923', function() {
		addButton();
	})
});



function addButton (){
	var buttonHeader = document.querySelector('ul.pagehead-actions');
	var sgButton = buttonHeader.querySelector('#sg-search-button-container');
	if (!sgButton) {
		sgButton = document.createElement('li');
		sgButton.id = 'sg-search-button-container';
		buttonHeader.insertBefore(sgButton, buttonHeader.firstChild);
	}
	sgButton.innerHTML = "<a id='sg-search-button' class='btn btn-sm minibutton sg-button tooltipped tooltipped-s' aria-label='Find code definitions in this repository.\nKeyboard shortcut: shift-T'><img id='searchlogo' src="+search.src+" style='vertical-align:text-top' height='14' width='14'> Search code</a>";
	document.getElementById('sg-search-button-container').addEventListener("click", buttonClick);

}


function buttonClick(){
	//store value of current page
	if ($('.container.new-discussion-timeline').not(':has(#toRemove)')) {
		original = $('.container.new-discussion-timeline').children().html();
	}

	if (document.getElementById('toRemove')) {
		$('div').remove("#toRemove");
	}

	

	//hide current page, show search bar 
	$('.container.new-discussion-timeline').children().hide();
	$('.container.new-discussion-timeline').append(table);
	
	if (xhr !== undefined) {
		xhr.abort();
	}
	
	//delay before focusing on search bar so T doesn't show up
	setTimeout(function(){
		$('.tree-finder-input2:last').focus();
	}, 1);
	
	current='';

}


//amplitude tracking
var _window = this;
$(document).ready(function(){
	addButton();
	(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script");r.type="text/javascript";
	r.async=true;r.src="https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-2.9.0-min.gz.js";
	r.onload=function(){e.amplitude.runQueuedFunctions()};var i=t.getElementsByTagName("script")[0];
	i.parentNode.insertBefore(r,i);var s=function(){this._q=[];return this};function a(e){
	s.prototype[e]=function(){this._q.push([e].concat(Array.prototype.slice.call(arguments,0)));
	return this}}var o=["add","append","clearAll","set","setOnce","unset"];for(var c=0;c<o.length;c++){
	a(o[c])}n.Identify=s;var u=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify","clearUserProperties"];
	function l(e){function t(t){e[t]=function(){e._q.push([t].concat(Array.prototype.slice.call(arguments,0)));
	}}for(var n=0;n<u.length;n++){t(u[n])}}l(n);n.getInstance=function(e){e=(!e||e.length===0?"$default_instance":e).toLowerCase();
	if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};l(n._iq[e])}return n._iq[e]};e.amplitude=n;
	})(_window, document);
	amplitude.init("f7491eae081c8c94baf15838b0166c63");
});


//events for key presses: get search screen when shift+t, submit + get request when enter, go back to previous page when esc 
document.addEventListener('keydown', keyboardevents);
var inputarray = document.getElementsByClassName('tree-finder-input2');
var treefinderarray = document.getElementsByClassName('tree-finder');

function keyboardevents (e) {
	if (e.which===84 && e.shiftKey && (e.target.tagName.toLowerCase()) !=='input' && (e.target.tagName.toLowerCase())!=='textarea') {
	    //store value of current page
	    if ($('.container.new-discussion-timeline').not(':has(#toRemove)')) {
	      original = $('.container.new-discussion-timeline').children().html();
	    }
		
		if (document.getElementById('toRemove')) {
			$('div').remove("#toRemove");
		}

		
		//hide current page, show search bar 
		$('.container.new-discussion-timeline').children().hide();
		$('.container.new-discussion-timeline').append(table);
		
		if (xhr !== undefined) {
			xhr.abort();
		}
		//delay before focusing on search bar so T doesn't show up
		setTimeout(function(){
			$('.tree-finder-input2:last').focus();
		}, 1);
		
		current='';
	}
	else if (e.which===13 && (e.target.tagName.toLowerCase())==='input') {
		e.stopImmediatePropagation();

    	//table that replaces existing one during a search (does not include search bar)
    	var table2 = "<table id='tree-finder-results' class='tree-browser css-truncate' cellpadding='0' cellspacing='0' style='border-bottom:1px solid #;cacaca'> <tbody class='tree-browser-result-template js-tree-browser-result-template' aria-hidden='true'> <tr class='js-navigation-item tree-browser-result'><td> <a class='css-truncate-target js-navigation-open js-tree-finder-path'></a> </td> </tr> </tbody> </table>";
		
		
		query = $('.tree-finder-input2:last').val();
    	
    	//condition because we don't want to replace table if the query is the same and enter is pressed
    	if (current !== query ) {
    		$('.flash-messages').remove();
    		
    		//add logo if not already present
    		if (document.getElementById('logo')===null || (!(document.getElementById('logo').offsetWidth >0) && !(document.getElementById.offsetHeight >0))) {
      			$('.tree-finder.clearfix:last').after("<div  width='100%' align='right' class='logodiv'><a href=http://sourcegraph.com><img id='logo' src="+logo2.src+" style='opacity:0.6;'></a></div>");
    		}
    		
    		(treefinderarray[treefinderarray.length-1]).innerHTML=table2;
		    if (xhr !== undefined) {
		    	xhr.abort();
		    }
			ajaxCall();
    	}    
		amplitude.getInstance().logEvent('SEARCH');
		
		current=query;
	}


	else if (e.keyCode === 27) {
		$('div').remove("#toRemove");
		$('.repository-content').show();
	}

};

//Get request to Sourcegraph API based on current user/repo/branch
function ajaxCall() {
	xhr = $.ajax ({
		method: "GET",
		url: "https://sourcegraph.com/.ui/github.com/"+user+"/"+repo+"@"+branch+"/.search/tokens?q="+query+"&PerPage=10000&Page=1"
	}).done(showResults);
}

$(document).on({
	ajaxStart: function() {document.getElementById("loadingDiv").style.display='block'},
	ajaxStop: function() {document.getElementById("loadingDiv").style.display='none'}
})

//Iterate thru JSON object array and generate results table
function showResults(dataArray) {
	console.log(dataArray.Results);
	//console.log(dataArray.SrclibDataVersion.CommitID);
	if (dataArray.SrclibDataVersion===null){
		nomatch = "<p style='text-align:center;font-size:16px'><b> No matching definitions found. </b></br><p style='text-align:center;font-size:12px'>This repository has not been analyzed and built by Sourcegraph yet.</br> Currently, Go and Java repositories are supported.  More language support will be rolled out soon, stay tuned.</p>";
	}
	if (dataArray.Results.length===0) {
		if ($('body').hasClass('vis-private') && dataArray.SrclibDataVersion===null) {
			nomatch ="<p style='text-align:center;font-size:16px'><b> No matching definitions found. </b></br><p style='text-align:center;font-size:12px'>This private repository is not authorized for analysis on Sourcegraph yet.</br> Mirror this repository for free on <a href='https://sourcegraph.com'>sourcegraph.com</a> to authorize.</p>";
		}
		$('.tree-browser:last tbody:last').after(nomatch);
		$('.tree-browser:last').attr("style","border-top:none;border-bottom:none;");
	}
	

	for(var i =0; i<dataArray.Results.length;i++) {
		var eachRes = dataArray.Results[i];
		console.log(eachRes);
		var repWideQualified = eachRes.Def.FmtStrings.Type.RepositoryWideQualified;
		if (repWideQualified === undefined) {
			repWideQualified = ''; 
		}
		var strToReturn = eachRes.QualifiedName.__html;
		var hrefurl = eachRes.URL;

		if (i !== dataArray.Results.length -1) { 
			$('.tree-browser:last tbody:last').after("<tbody class='js-tree-finder-results'><tr id='searchrow' class='js-navigation-item tree-browser-result' style='border-bottom: 1px solid rgb(238, 238, 238);'><td class='icon' width='21px'><svg aria-hidden='true' class='octicon octicon-chevron-right' height='16' role='img' version='1.1' viewBox='0 0 8 16' width='8'><path d='M7.5 8L2.5 13l-1.5-1.5 3.75-3.5L1 4.5l1.5-1.5 5 5z'></path></svg></td><td class='icon'><svg aria-hidden='true' class='octicon octicon-file-text' height='16' role='img' version='1.1' viewBox='0 0 12 16' width='12'><path d='M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z'></path></svg></td></td><td><a href=https://sourcegraph.com"+hrefurl+" target='blank'><span class='res'>"+eachRes.Def.Kind+ " "+ strToReturn + "</span></a></td></tr></tbody>");
		}
		else {
			$('.tree-browser:last tbody:last').after("<tbody class='js-tree-finder-results'><tr id='searchrow' class='js-navigation-item tree-browser-result'><td id='icon' style='width:21px;padding-left:10px'><svg aria-hidden='true' class='octicon octicon-chevron-right' height='16' role='img' version='1.1' viewBox='0 0 8 16' width='8'><path d='M7.5 8L2.5 13l-1.5-1.5 3.75-3.5L1 4.5l1.5-1.5 5 5z'></path></svg></td><td class='icon'><svg aria-hidden='true' class='octicon octicon-file-text' height='16' role='img' version='1.1' viewBox='0 0 12 16' width='12'><path d='M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z'></path></svg></td></td><td><a class='css-truncate-target' href=https://sourcegraph.com"+hrefurl+" target='blank' style='box-height:18px;'><span class='res'>"+eachRes.Def.Kind + " " + strToReturn + "</span></a></td></tr></tbody>");
		}

	}
}	
