var widgets = [];
var projectName = "";

function WidgetObj ()
{	
	//accessable dom objs
	this.accordionDom = {}
	this.panelDom = {}
	this.labelDom = {}
	this.controlsDivDom = {}
	this.canvasDom = {}
	this.widgetSelectors = []
	this.camSelectors = []
	
	this.sourceWidget = {}
	
	//save data
	this.data = {
		"type": "",
		"label": "",
		"widgetId": "widget-" + guid(),
		"selectedDeviceId": "", //change to array?
		"isActive": true,
		"expanded": true
	}
	
	//methods
	this.buildDomElement = function (widget) 
	{
		newLabel = document.createElement('label');
		newLabel.innerHTML = widget.data.type + ' buildDomElement not yet defined!';
		widget.controlsDivDom.appendChild(newLabel);
	}
	
	this.updateSource = function (src) 
	{
		alert('updateSource not yet defined!')
	}
	
	this.updateLabel = function (widget, event)
	{
		widget.data.label = event.target.value;
		populateWidgetSelectors();
	}
	
	this.changeMethod = function (widget)
	{
		alert(widget.data.type + ' changeMethod not yet defined!')
	}
}

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