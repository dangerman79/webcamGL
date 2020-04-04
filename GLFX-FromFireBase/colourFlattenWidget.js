var noOfColFlat = 0;

function CreateColourFlattenWidgetObj (type)
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.data.colSpan = 50;
	newWidget.colSpanDom = {}
	
	//constructor
	noOfColFlat++;
	newWidget.data.label = "Colour Flatten #" + noOfColFlat;
	newWidget.data.type = type

		//methods
	newWidget.buildDomElement = function (widget) {
		
		controlsDiv = widget.controlsDivDom
	
	
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Source Widget: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		controlsDiv.appendChild(newSelect);
		newSelect.value = widget.data.selectedDeviceIds[0];
		widget.widgetSelectors.push(newSelect);
		widget.widgetSelectors.forEach (function(newSelect) {
			newSelect.addEventListener("change", inputChange.bind(event, widget));
		})
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Colour Span:';
		controlsDiv.appendChild(newLabel);
		
		colSpanDom = document.createElement('input');
		colSpanDom.type = "text"
		colSpanDom.value = widget.data.colSpan ;
		controlsDiv.appendChild(colSpanDom);
		widget.colSpanDom = colSpanDom;
		colSpanDom.addEventListener("change", settingsChange.bind(event, widget));
	
		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
	
		var draw = function (widget) {
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));
			
			// apply an image filter to the context
			applyColFlat(widget);
		}

		requestAnimationFrame(draw.bind(event, widget));
	}
	
	newWidget.changeMethod = function (widget) {
		widget.sourceWidgets[0] = getWidgetById (widget.data.selectedDeviceIds[0])
		colSpan = widget.colSpanDom.value 
		if(isNumeric(colSpan)){
			widget.data.colSpan = Number(widget.colSpanDom.value);
		}	
	}
	return newWidget;
}

function applyColFlat(widget) 
{	
	if(widget.sourceWidgets[0] == null || widget.sourceWidgets[0].canvasDom == null ) return
	
	readContext = widget.sourceWidgets[0].canvasDom.getContext('2d')
	writeContext = widget.canvasDom.getContext('2d')

	width = widget.sourceWidgets[0].canvasDom.width;
	height = widget.sourceWidgets[0].canvasDom.height;
	
	widget.canvasDom.width = width;
	widget.canvasDom.height = height;
	
	// read pixels
	var imageDataIn = readContext.getImageData(0, 0, width, height);
	inputImData = imageDataIn.data; // data is an array of pixels in RGBA
	
	var imageDataOut =  writeContext.getImageData(0, 0, width, height);
	outImData = imageDataOut.data
	colSpan = widget.data.colSpan
	
	// modify pixels applying a simple effect
	for (var i = 0; i < inputImData.length; i+=4) {
		r = inputImData[i]
		g = inputImData[i + 1]
		b = inputImData[i + 2]
		
		r = r - (r % colSpan)
		g = g - (g % colSpan)
		b = b - (b % colSpan)		
		
		outImData[i] = r;
		outImData[i + 1] = g;
		outImData[i + 2] = b;
		outImData[i + 3] = inputImData[i + 3];
		
	}
	
	
	
	// render pixels back
	writeContext.putImageData(imageDataOut, 0, 0);	
}
		
	
	