var noOfDifMask = 0;

function CreateDiffMaskWidgetObj ()
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.lastIm = []
	newWidget.data.framesPerSample = 0;
	newWidget.frameCount = 0;
	newWidget.framesPerSampleDom = {}
	
	//constructor
	noOfDifMask++;
	newWidget.data.tolerance = 10;
	newWidget.data.label = "Diff Mask #" + noOfDifMask;
	newWidget.data.type = 'diffMask'
	
	//methods
	newWidget.buildDomElement = function (widget) {
		
		controlsDiv = widget.controlsDivDom
	
	
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Source Widget: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		controlsDiv.appendChild(newSelect);
		newSelect.value = widget.data.selectedDeviceId;
		widget.widgetSelectors.push(newSelect);
		widget.widgetSelectors.forEach (function(newSelect) {
			newSelect.addEventListener("change", chromaInputChange.bind(event, widget));
		})
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Tolerance:';
		controlsDiv.appendChild(newLabel);
	
		tolerance = document.createElement('input');
		tolerance.type = "text"
		tolerance.value = widget.data.tolerance ;
		controlsDiv.appendChild(tolerance);
		widget.toleranceDom = tolerance;
		tolerance.addEventListener("change", chromaSettingsChange.bind(event, widget));
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Frames Between Samples:';
		controlsDiv.appendChild(newLabel);
	
		framesPerSample = document.createElement('input');
		framesPerSample.type = "text"
		framesPerSample.value = widget.data.framesPerSample ;
		framesPerSample.addEventListener("change", chromaSettingsChange.bind(event, widget));
		controlsDiv.appendChild(framesPerSample);
		widget.framesPerSampleDom = framesPerSample;
		
		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
		
		var draw = function (widget) {
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));
			
			// apply an image filter to the context
			applyDiffMask(widget);
		}

		requestAnimationFrame(draw.bind(event, widget));

		newWidget.changeMethod = function (widget) {
			widget.sourceWidget = getWidgetById (widget.data.selectedDeviceId)
			tol = widget.toleranceDom.value //TODO check tol is loading correctly
			if(isNumeric(tol)){
				widget.data.tolerance = Number(widget.toleranceDom.value);
			}
			fps = widget.framesPerSampleDom.value
			if(isNumeric(fps)){
				widget.data.framesPerSample = Number(fps);
			}
		
			
		}
		
	}
	return newWidget;
}

function applyDiffMask(widget) 
{
	if(widget.sourceWidget == null || widget.sourceWidget.canvasDom == null ) return
		readContext = widget.sourceWidget.canvasDom.getContext('2d')
	writeContext = widget.canvasDom.getContext('2d')

	width = widget.sourceWidget.canvasDom.width;
	height = widget.sourceWidget.canvasDom.height;
	
	widget.canvasDom.width = width;
	widget.canvasDom.height = height;
	
	// read pixels
	var imageDataIn = readContext.getImageData(0, 0, width, height);
	inputImData = imageDataIn.data; // data is an array of pixels in RGBA
	
	var imageDataOut =  writeContext.getImageData(0, 0, width, height);
	outImData = imageDataOut.data
	
	tol = widget.data.tolerance
	
	if (widget.lastIm.length == 0){widget.lastIm = copyImageRawData(inputImData, widget.lastIm)}
	for (var i = 0; i < inputImData.length; i+=4) {
		r = inputImData[i]
		g = inputImData[i + 1]
		b = inputImData[i + 2]
		
		rHi = widget.lastIm[i]
		gHi = widget.lastIm[i+1]
		bHi = widget.lastIm[i+2]
		
		rLo = widget.lastIm[i]
		gLo = widget.lastIm[i+1]
		bLo = widget.lastIm[i+2]
	
		if (
			r >= rLo - tol &&
			g >= gLo - tol &&
			b >= bLo - tol &&
			r <= rHi + tol &&
			g <= gHi + tol &&
			b <= bHi + tol
		){
			outImData[i] = 0;
			outImData[i + 1] = 255;
			outImData[i + 2] = 255;
			outImData[i + 3] = 255;
			
		}else{
			outImData[i] = r;
			outImData[i + 1] = g;
			outImData[i + 2] = b;
			outImData[i + 3] = 255;
		}	
	}
	if(widget.frameCount >= widget.data.framesPerSample)
	{
		widget.lastIm = copyImageRawData(inputImData, widget.lastIm)
		//widget.previousData = outImData;
		widget.frameCount = 0;
	}else{widget.frameCount++}
	
	
	
	
	// render pixels back
	writeContext.putImageData(imageDataOut, 0, 0);	
	
}
