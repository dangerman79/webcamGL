var widgets = [];
var projectName = "";

function webcam ()
{	
	this.accordionDom = {}
	this.panelDom = {}
	this.labelDom = {}
	this.vidwinDom = {}
	
	this.sourceSelectors = []
	
	this.data = {
		"type": "webcam",
		"label": "",
		"widgetId": "widget-" + guid(),
		"selectedDeviceId": "",
		
		//"expanded": "" // i maybe able to use if (labelDom.style.maxHeight != null) for the save load
		
		/*
		"viewportId" : "",
		"parentDomId": "",
		"selectorDomId": "",
		"videoWinDomId": ""
		*/
	}
}

function updateWidgetLabel(widget, event)
{
	
	widget.data.label = event.target.value;
	populateSourceSelectors();
}
function getWidgetById (id)
{
	for (var x=0; x < widgets.length; x++) 
	{
		if (widgets[x].data.widgetId==id)
		{
			return widgets[x];
		}
	}
	
	return null
}