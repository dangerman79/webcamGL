var noOfVidOuts = 0;

function CreateVideoOutputWidgetObj ()
{
	returnObj = new WidgetObj ()
	
	//unique vars on this object
	returnObj.vidwinDom = {}

	
	//constructor
	noOfVidOuts++;
	returnObj.data.label = "Video Output #" + noOfVidOuts;
	returnObj.data.type = 'videoOutput'
	
	//methods
	returnObj.buildDomElement = function (widget) {
		controlsDiv = widget.controlsDivDom
	
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Source Widget: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		controlsDiv.appendChild(newSelect);
		newSelect.value = widget.data.selectedDeviceId;
		widget.widgetSelectors.push(newSelect);
		widget.widgetSelectors.forEach (function(newSelect) {
			newSelect.addEventListener("change", vidOutInputChange.bind(event, widget));
		})
		
		newVid = document.createElement('video');
		newVid.autoplay = 'true';
		newVid.className = 'videoWindow';
		newVid.controls = true;
		widget.panelDom.appendChild(newVid);
		widget.vidwinDom = newVid;
	}
	
	returnObj.changeMethod = function (widget) {

		widget.sourceWidget = getWidgetById (widget.data.selectedDeviceId)
		
		widget.canvasDom = widget.sourceWidget.canvasDom;
		var stream = widget.canvasDom.captureStream();
		widget.vidwinDom.srcObject = stream;
	}
	return returnObj;
}

function vidOutInputChange(widget, event)
{
	var newSrcStr = event.target.value;
	widget.data.selectedDeviceId = newSrcStr;
	widget.changeMethod(widget)
}