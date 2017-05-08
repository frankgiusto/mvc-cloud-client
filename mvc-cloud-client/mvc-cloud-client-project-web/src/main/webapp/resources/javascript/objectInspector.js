function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                s = 'array';
            }
			if (value instanceof Date) {
				s = 'date';
			}
        } else {
            s = 'null';
        }
    }
    return s;
}

var staticObject={};
function showObject(tagId, source) {
	$(tagId).empty(); // clear all existing content
	
	// build menu bar
	var menubar=document.createElement("div");
	$(tagId).append(menubar);
	var expandAll=document.createElement("button");
	$(menubar).append(expandAll);
	var collapseAll=document.createElement("button");
	$(menubar).append(collapseAll);
	$(expandAll).text("Expand All");
	$(collapseAll).text("Collapse All");
	var searchText=document.createElement("input");
	searchText.type="text";
	searchText.size=20;
	$(menubar).append(searchText);
	var searchButton=document.createElement("button");
	$(menubar).append(searchButton);
	$(searchButton).text("Search");
	
	// build tree structure
	var node=document.createElement("ul");
	$(tagId).append(node);
	$(node).addClass("jqtree_common");
	$(node).addClass("jqtree-tree");
	buildObjectNodeTree(node, source);
	$("li.jqtree-folder li.jqtree-folder",node).addClass("jqtree-closed");
	var closingAnchors=$("li.jqtree-closed a",node);
	closingAnchors.addClass("jqtree-closed");
	closingAnchors.text("►");
	$("a.jqtree-toggler", node).click(
		function(event) {
			if (event.target!==event.currentTarget) return;
			var li=$(this).parent().parent();
			if ($(this).hasClass("jqtree-closed")) {
				$(this).removeClass("jqtree-closed");
				$(this).text("▼");
			} else {
				$(this).addClass("jqtree-closed");
				$(this).text("►");
			}
			if (li.hasClass("jqtree-closed")) {
				li.removeClass("jqtree-closed");
			} else {
				li.addClass("jqtree-closed");
			}
		}
	);
	
	// attach actions to menu bar
	var doSearch=function() {
		var search=searchText.value;
		search=$.trim(search); // trim the input
		if (search) { // not empty
			var matchedSpans=$("span", node).filter(function(index){
				return $(this).text().search(new RegExp(search,"i"))>=0;
			});
			// hide all
			$("li", node).addClass("hidden");
			matchedSpans.parents("li.jqtree_common").each(function(index, elem) {
				$(elem).removeClass("hidden");
				$(elem).children("div").children("a.jqtree-closed").text("▼");
				$(elem).children("div").children("a").removeClass("jqtree-closed");
				$(elem).removeClass("jqtree-closed");
			});
		} else {
			$("li", node).removeClass("hidden");
		}
	};
	$(expandAll).click(function(event) {
		searchText.value="";
		doSearch();
		event.preventDefault();
		var closedNodes=$("a.jqtree-closed", node);
		closedNodes.text("▼");
		closedNodes.removeClass("jqtree-closed");
		$("li.jqtree-closed", node).removeClass("jqtree-closed");
	});
	$(collapseAll).click(function(event) {
		searchText.value="";
		doSearch();
		event.preventDefault();
		$("li.jqtree-folder a", node).each(function(index, node) {
			if (!$(node).hasClass("jqtree-closed")) {
				$(node).text("►");
				$(node).addClass("jqtree-closed");
			}
		});
		$("li.jqtree-folder", node).each(function(index, node) {
			if (!$(node).hasClass("jqtree-closed")) {
				$(node).addClass("jqtree-closed");
			}
		});
	});
	$(searchButton).click(function(event) {
		if (event) event.preventDefault();
		doSearch();
	});
}


function buildObjectNodeTree(node, source) {
	var dataType=typeOf(source);
	if (dataType==='array') {
		for (var name=0; name<source.length; name++) {
			var value=source[name];
			buildNode(node, name, value);
		}		
	} else if (dataType==='object') {
		for (var name in source) {
			if (staticObject[name]) continue; // avoid the native properties
			var value=source[name];
			buildNode(node, name, value);
		}
	}
}

function buildNode(node, name, value) {
	var display=name;
	var dataType=typeOf(value);
	if (dataType==='null') {
		display=name+": null";
	} else if (dataType==='string') {
		display=name+": "+value;
	} else if (dataType==='number') {
		display=name+": "+value;
	} else if (dataType==='boolean') {
		display=name+": "+value;
	} else if (dataType==='date') {
		display=name+": "+value;
	} else if (dataType==='function') {
		display=name+": function";
	}
	var li=document.createElement("li");
	$(node).append(li);
	var div=document.createElement("div");
	$(li).append(div);
	$(li).addClass("jqtree_common");
	$(div).addClass("jqtree-element");
	$(div).addClass("jqtree_common");
	if (dataType==='object' || dataType==='array') {
		$(li).addClass("jqtree-folder");
		var a=document.createElement("a");
		var span=document.createElement("span");
		$(div).append(a, span);
		$(a).text("▼");
		$(span).text(display);
		$(a).addClass("jqtree_common");
		$(a).addClass("jqtree-toggler");
		$(span).addClass("jqtree_common");
		$(span).addClass("jqtree-title");
		var ul=document.createElement("ul");
		$(li).append(ul);
		$(ul).addClass("jqtree_common");
		buildObjectNodeTree(ul, value);
	} else if (value != null) {
		var span=document.createElement("span");
		$(div).append(span);
		$(span).text(display);
		$(span).addClass("jqtree_common");
		$(span).addClass("jqtree-title");
	}
}