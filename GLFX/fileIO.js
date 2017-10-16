
function saveSettingsToFile (projName)
{
	var obj = createSaveData(projName);
	var json = JSON.stringify(obj);
	var blob = new Blob([json], {type: "application/json"});
	var myURL = window.URL || window.webkitURL
	var url  = myURL.createObjectURL(blob);
	
	
	var a = document.createElement("a");
	a.download = projName + '.json';
	a.href = url;
	document.body.appendChild(a);
	a.click();
	setTimeout(function() {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);  
	}, 0); 
}

function createSaveData(projName)
{
	var outputJson = {
		"projectName": projName,
		"settings": []		
		}
	for (ii = 0; ii !== widgets.length; ++ii) {
		outputJson.settings.push(widgets[ii].data)
	}
	return outputJson
	
}

function loadSettingsFile(evt)
{
	var files = evt.target.files;
	fileInputDlg = document.getElementById('fileInput');
	var reader = new FileReader();
	reader.onload = (function(theFile) {
		console.log (theFile.target.result);
		importLoadData (theFile.target.result);
	})
	reader.readAsText(files[0]);
}

function importLoadData(dataStr)
{
	var dataJson = JSON.parse(dataStr);
	projectName = dataJson.projectName;
	document.querySelector("#projName").value = dataJson.projectName;
	dataJson.settings.forEach (function(data) 
	{
		switch (data.type){
			case "webcam":
				var widget = new webcam();
				widgets.push(widget);
				noOfCams++;
				widget.data = data;
				addWidgetAccordionSegment(widget);
				addWebcamPanel(widget);

				break; 
				
			default:
				console.log ("widget type '" + data.type + "' not supported!");
				alert ("widget type '" + data.type + "' not supported!");
		}
	})
	
	setupAccordion ();
	
	/*for (var x = 0; x < 10; x++)
	{
		populatewidgetSelectors();
	}*/

	
}