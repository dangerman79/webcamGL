var widgets = [];
var projectName = "";

function Point(x, y){
	this.x = x || 0;
	this.y = y || 0;
};

function Col(r, g, b, a)
{
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
	this.a = a || 0;
}

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