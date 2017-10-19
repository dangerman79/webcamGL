var noOfStaccatto = 0;

function CreateStaccatoFilterWidgetObj ()
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.framesPerSampleDom = {}
	newWidget.data.framesPerSample = 5;
	newWidget.previousData = [];
	newWidget.frameCount = 0;
	
	//constructor
	noOfStaccatto++;
	newWidget.data.label = "Staccato Filter #" + noOfStaccatto;
	newWidget.data.type = 'staccatoFilter'
	
	//methods
	newWidget.buildDomElement = function (widget) {
		
		controlsDiv = widget.controlsDivDom
	
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Masked Source Widget: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		controlsDiv.appendChild(newSelect);
		newSelect.value = widget.data.selectedDeviceIds[0];
		widget.widgetSelectors.push(newSelect);
		widget.widgetSelectors.forEach (function(newSelect) {
			newSelect.addEventListener("change", staccatoSettingsChange.bind(event, widget));
		})
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Frames Between Samples:';
		controlsDiv.appendChild(newLabel);
	
		framesPerSample = document.createElement('input');
		framesPerSample.type = "text"
		framesPerSample.value = widget.data.framesPerSample ;
		controlsDiv.appendChild(framesPerSample);
		widget.framesPerSampleDom = framesPerSample;
		
		framesPerSample.addEventListener("change", staccatoSettingsChange.bind(event, widget));

		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
		
		var draw = function (widget) {
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));
			
			// apply an image filter to the context
			applyStaccatoFilter(widget);
		}
		requestAnimationFrame(draw.bind(event, widget));
	}
	
	newWidget.changeMethod = function (widget) {
		
		widget.sourceWidgets[0] = getWidgetById (widget.data.selectedDeviceIds[0])
		fps = widget.framesPerSampleDom.value
		if(isNumeric(fps)){
			widget.data.framesPerSample = Number(widget.framesPerSampleDom.value);
		}
		
	}
	return newWidget
}
function staccatoSettingsChange(widget, event)
{	
	widget.data.selectedDeviceIds[0] = widget.widgetSelectors[0].value
	widget.changeMethod(widget)
}

function applyStaccatoFilter(widget)
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
	
	//copyImageData(imageDataIn, imageDataOut)
	
	
		  // modify pixels applying a simple effect
	for (var i = 0; i < inputImData.length; i+=4) {
		r = inputImData[i]
		g = inputImData[i + 1]
		b = inputImData[i + 2]
		if(r == 0 && g == 255 && b == 255)
		{
			//masked pix
			outImData[i] = widget.previousData[i];
			outImData[i + 1] = widget.previousData[i + 1];
			outImData[i + 2] = widget.previousData[i + 2];
			outImData[i + 3] = widget.previousData[i + 3];			
		}else{
			outImData[i] = r;
			outImData[i + 1] = g;
			outImData[i + 2] = b;
			outImData[i + 3] = 255;
		}
		
		
		
	}/**/
	if(widget.frameCount >= widget.data.framesPerSample)
	{
		widget.previousData = outImData;
		widget.frameCount = 0;
	}else{widget.frameCount++}
	
	
	writeContext.putImageData(imageDataOut, 0, 0);
}