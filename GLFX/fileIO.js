isLoading = false;

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
	isLoading = true;
	var dataJson = JSON.parse(dataStr);
	projectName = dataJson.projectName;
	document.querySelector("#projName").value = dataJson.projectName;
	dataJson.settings.forEach (function(data) 
	{
		widget = createWidget(data.type)
		widget.data = data
		createWidgetDom(widget);
	})
	
	widgets.forEach (function(widget){
		widget.changeMethod(widget);
	})
	
	isLoading = false;


	
}