var noOfMixer = 0;

function CreateMixerWidgetObj (type)
{
	newWidget = new WidgetObj ()
	
	
	//unique vars on this object
	newWidget.data.mixType = 'source-over';
	
	//constructor
	noOfMixer++;
	newWidget.data.label = "Mixer #" + noOfMixer;
	newWidget.data.type = type
	
	
	//methods
	newWidget.buildDomElement = function (widget) {
		controlsDiv = widget.controlsDivDom
		
		newbutton = document.createElement('button');
		newbutton.innerHTML = 'Add Source';
		controlsDiv.appendChild(newbutton);
		newbutton.addEventListener("click", addSource.bind(event, widget));
		
		newLink = document.createElement('a');
		newLink.setAttribute('href', "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation");
		newLink.setAttribute('target','_blank')
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Mix Type: ';
		newLink.appendChild(newLabel);
		controlsDiv.appendChild(newLink);
		
		newSelect = document.createElement('select');
		addMixTypesToDropdown(newSelect)
		newSelect.addEventListener("change", settingsChange.bind(event, widget));
		newSelect.value = newWidget.data.mixType
		controlsDiv.appendChild(newSelect);
		widget.mixTypeDom = newSelect
		
		
		newBr = document.createElement('BR');
		controlsDiv.appendChild(newBr);
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Source Widgets: ';
		controlsDiv.appendChild(newLabel);
		
		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
		
		var draw = function (widget) {
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));
			
			// apply an image filter to the context
			applyMixer(widget);
		}

		requestAnimationFrame(draw.bind(event, widget));
	}	

	newWidget.changeMethod = function (widget) {
		while (widget.data.selectedDeviceIds.length > widget.widgetSelectors.length) {
			addSource(widget, null)
		}
		
		for (var i = 0; i < widget.data.selectedDeviceIds.length; i++)
		{
			widget.sourceWidgets[i] = getWidgetById (widget.data.selectedDeviceIds[i])
		}
		
		widget.data.mixType = widget.mixTypeDom.value
		
		/*widget.sourceWidgets[0] = getWidgetById (widget.data.selectedDeviceIds[0])
		widget.data.showSamplePx = widget.samplePxDom.checked;
		widget.data.liveSampling = widget.liveSampleDom.checked
		tol = widget.toleranceDom.value //TODO check tol is loading correctly
		if(isNumeric(tol)){
			widget.data.tolerance = Number(widget.toleranceDom.value);
		}
		setChromaRangeFromSamples(widget);*/
		
	}
	return newWidget;
}	
function applyMixer(widget)
{
	if(widget.sourceWidgets[0] == null || widget.sourceWidgets[0].canvasDom == null ) return
	
	//copy first sorce to new buffer...
	writeContext = widget.canvasDom.getContext('2d')

	width = widget.sourceWidgets[0].canvasDom.width;
	height = widget.sourceWidgets[0].canvasDom.height;
	
	widget.canvasDom.width = width;
	widget.canvasDom.height = height;
	
	writeContext.globalCompositeOperation = "copy";
	writeContext.drawImage (widget.sourceWidgets[0].canvasDom, 0, 0)
	
	writeContext.globalCompositeOperation = widget.data.mixType;
	for (i=1 ; i < widget.sourceWidgets.length; i++)
	{
		writeContext.drawImage (widget.sourceWidgets[i].canvasDom, 0, 0)
	}
	
}

function addSource(widget, event)
{
	controlsDiv = widget.controlsDivDom
	
	newSelect = document.createElement('select');
	controlsDiv.appendChild(newSelect);
	newSelect.value = widget.data.selectedDeviceIds[widget.widgetSelectors.value];
	widget.widgetSelectors.push(newSelect);
	widget.widgetSelectors.forEach (function(newSelect) {
		newSelect.addEventListener("change", inputChange.bind(event, widget));
	})
	
	populateWidgetSelectors()
}
function addMixTypesToDropdown(newSelect)
{
	var mixTypes = ['source-over','source-in','source-out','source-atop','destination-over','destination-in','destination-out','destination-atop','lighter','copy','xor','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity']
	mixTypes.forEach (function(mixType) 
	{
		var option = document.createElement('option');
		option.value = mixType;
		option.text = mixType;
		newSelect.appendChild(option);
	})
}