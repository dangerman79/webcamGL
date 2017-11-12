var noOfColourMaps = 0;

function CreateColourMapWidgetObj (type)
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.data.r = 'R';
	newWidget.data.g = 'G';
	newWidget.data.b = 'B';
	newWidget.data.a = 'A';
	
	newWidget.redSelectDom = {};
	newWidget.greenSelectDom = {};
	newWidget.blueSelectDom = {};
	newWidget.alphaSelectDom = {};
	
	/*newWidget.framesPerSampleDom = {}
	newWidget.noOfTrailsDom = {}
	newWidget.data.framesPerSample = 0;
	newWidget.data.noOfTrails = 15;
	newWidget.previousData = [];
	newWidget.frameCount = 0;
	newWidget.disMethodDom = {};
	newWidget.data.disMethod = 'Sudden';
	newWidget.trailBuffers = []
	*/
	//constructor
	noOfColourMaps++;
	newWidget.data.label = "Colour Map #" + noOfColourMaps;
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
		newLabel.innerHTML = 'R: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		addColourTypesToDropdown(newSelect);
		newSelect.value = widget.data.r;
		newSelect.addEventListener("change", settingsChange.bind(event, widget));
		widget.redSelectDom = newSelect;
		controlsDiv.appendChild(newSelect);
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'G: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		addColourTypesToDropdown(newSelect);
		newSelect.value = widget.data.g;
		newSelect.addEventListener("change", settingsChange.bind(event, widget));
		widget.greenSelectDom = newSelect;
		controlsDiv.appendChild(newSelect);
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'B: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		addColourTypesToDropdown(newSelect);
		newSelect.value = widget.data.b;
		newSelect.addEventListener("change", settingsChange.bind(event, widget));
		widget.blueSelectDom = newSelect;
		controlsDiv.appendChild(newSelect);
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'A: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		addColourTypesToDropdown(newSelect);
		newSelect.value = widget.data.a;
		newSelect.addEventListener("change", settingsChange.bind(event, widget));
		widget.alphaSelectDom = newSelect;
		controlsDiv.appendChild(newSelect);
		
		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
		
		negativeButton = document.createElement('button');
		negativeButton.innerHTML = 'Negative';
		controlsDiv.appendChild(negativeButton);
		negativeButton.addEventListener("click", negativeButtonClick.bind(event, widget));
		
		colourMapResetButton = document.createElement('button');
		colourMapResetButton.innerHTML = 'Reset';
		controlsDiv.appendChild(colourMapResetButton);
		colourMapResetButton.addEventListener("click", resetButtonClick.bind(event, widget));
		
		
		var draw = function (widget) {
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));
			
			// apply an image filter to the context
			applyColourMap(widget);
		}

		requestAnimationFrame(draw.bind(event, widget));		
		
	}
	newWidget.changeMethod = function (widget) {
		widget.sourceWidgets[0] = getWidgetById (widget.data.selectedDeviceIds[0])
		widget.data.r = widget.redSelectDom.value;
		widget.data.g = widget.greenSelectDom.value;
		widget.data.b = widget.blueSelectDom.value;
		widget.data.a = widget.alphaSelectDom.value;
	}
	return newWidget
}

function resetButtonClick(widget, event)
{
	widget.redSelectDom.value = 'R';
	widget.greenSelectDom.value = 'G';
	widget.blueSelectDom.value = 'B';
	widget.changeMethod (widget);
}

function negativeButtonClick(widget, event)
{
	widget.redSelectDom.value = 'Inverse R';
	widget.greenSelectDom.value = 'Inverse G';
	widget.blueSelectDom.value = 'Inverse B';
	widget.changeMethod (widget);
}

function addColourTypesToDropdown(newSelect)
{
	var mixTypes = ['R','G','B','A','Inverse R','Inverse G','Inverse B','Inverse A']
	mixTypes.forEach (function(mixType) 
	{
		var option = document.createElement('option');
		option.value = mixType;
		option.text = mixType;
		newSelect.appendChild(option);
	})
}

function applyColourMap(widget) 
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
	
	// modify pixels applying a simple effect
	for (var i = 0; i < inputImData.length; i+=4) {
		rIn = inputImData[i]
		gIn = inputImData[i + 1]
		bIn = inputImData[i + 2]
		aIn = inputImData[i + 3]	
		
		rOut = getSelectedColourValue(widget.data.r, rIn, gIn, bIn, aIn)		
		gOut = getSelectedColourValue(widget.data.g, rIn, gIn, bIn, aIn)		
		bOut = getSelectedColourValue(widget.data.b, rIn, gIn, bIn, aIn)		
		aOut = getSelectedColourValue(widget.data.a, rIn, gIn, bIn, aIn)
		
		outImData[i] = rOut;
		outImData[i + 1] = gOut;
		outImData[i + 2] = bOut;
		outImData[i + 3] = aOut;
		
	}
	
	
	
	// render pixels back
	writeContext.putImageData(imageDataOut, 0, 0);	
}

function getSelectedColourValue (selectorValue, r, g, b, a)
{
	if (selectorValue == 'R'){return r}
	if (selectorValue == 'G'){return g}
	if (selectorValue == 'B'){return b}
	if (selectorValue == 'A'){return a}
	if (selectorValue == 'Inverse R'){return 255-r}
	if (selectorValue == 'Inverse G'){return 255-g}
	if (selectorValue == 'Inverse B'){return 255-b}
	if (selectorValue == 'Inverse A'){return 255-a}
}