var widgets = [];
var projectName = "";

function WidgetObj ()
{	
	this.accordionDom = {}
	this.panelDom = {}
	this.labelDom = {}
	this.vidwinDom = {}
	this.canvasDom = {}
	this.controlsDivDom = {}
	
	this.sourceSelectors = []
	
	this.data = {
		"type": "webcam",
		"label": "",
		"widgetId": "widget-" + guid(),
		"selectedDeviceId": "", //change to array
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