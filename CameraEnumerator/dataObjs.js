
function updateWidgetLabel(widget, event)
{
	widget.data.label = event.target.value;
}


function webcam ()
{

	this.data = {
		"type": "Camera",
		"label": "",
		"selectedDeviceId": ""
		
		/*
		"viewportId" : "",
		"parentDomId": "",
		"selectorDomId": "",
		"videoWinDomId": ""
		*/
	}
	
}