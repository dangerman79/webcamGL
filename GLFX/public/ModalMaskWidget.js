var noOfModalMask = 0;

function CreateModalMaskWidgetObj (type)
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.frameCount = 0;
	newWidget.SampleBuffers = []
	newWidget.modeMaskData = []
	//newWidget.isSampling = false;
	//newWidget.sampleImLo = [];
	//newWidget.sampleImHi = [];
	
	//constructor
	newWidget.data.tolerance = 0;
	noOfModalMask++;
	newWidget.data.label = "Modal Mask #" + noOfModalMask;
	newWidget.data.type = type
	newWidget.data.framesPerSample = 15;
	newWidget.data.noOfSampleFrames = 5;

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
		newLabel.innerHTML = 'No Of Sample Frames:';
		controlsDiv.appendChild(newLabel);
	
		noOfSampleFrames = document.createElement('input');
		noOfSampleFrames.type = "text"
		noOfSampleFrames.value = widget.data.noOfSampleFrames ;
		controlsDiv.appendChild(noOfSampleFrames);
		widget.noOfSampleFramesDom = noOfSampleFrames;
		noOfSampleFrames.addEventListener("change", settingsChange.bind(event, widget));

			
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Tolerance:';
		controlsDiv.appendChild(newLabel);
	
		tolerance = document.createElement('input');
		tolerance.type = "text"
		tolerance.value = widget.data.tolerance ;
		controlsDiv.appendChild(tolerance);
		widget.toleranceDom = tolerance;
		tolerance.addEventListener("change", settingsChange.bind(event, widget));
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Frames Between Samples: ';
		controlsDiv.appendChild(newLabel);
		
		framesPerSample = document.createElement('input');
		framesPerSample.type = "text"
		framesPerSample.value = widget.data.framesPerSample ;
		controlsDiv.appendChild(framesPerSample);
		widget.framesPerSampleDom = framesPerSample;
		framesPerSample.addEventListener("change", settingsChange.bind(event, widget));
		
		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
		
		var draw = function (widget) {
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));
			
			// apply an image filter to the context
			applyModalMask(widget);
		}

		requestAnimationFrame(draw.bind(event, widget));
	}		
	
	newWidget.changeMethod = function (widget) {
		widget.sourceWidgets[0] = getWidgetById (widget.data.selectedDeviceIds[0])
		tol = widget.toleranceDom.value //TODO check tol is loading correctly
		if(isNumeric(tol)){
			widget.data.tolerance = Number(widget.toleranceDom.value);
		}
				
		sf = widget.noOfSampleFramesDom.value //TODO check tol is loading correctly
		if(isNumeric(sf)){
			widget.data.noOfSampleFrames = Number(widget.noOfSampleFramesDom.value);
		}
		
		fps = widget.framesPerSampleDom.value
		if(isNumeric(fps)){
			widget.data.framesPerSample = Number(widget.framesPerSampleDom.value);
		}
		
		setupModalMaskBuffers(widget);
	}
	return newWidget;	
}
		
		
function applyModalMask(widget) 
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
	
	
	if(widget.frameCount >= widget.data.framesPerSample)
	{
		createModalMaskData(widget)
		widget.frameCount = 0;
		
		
		
		//outImData = newWidget.modeMaskData
		//createModelMask(widget, outImData)
		for (var ii = 0; ii < inputImData.length; ii+=4) {
			widget.modeMaskData[ii] = 255
			widget.modeMaskData[ii + 1] = 0
			widget.modeMaskData[ii + 2] = 0
			widget.modeMaskData[ii + 4] = 255			
		}

	}else{widget.frameCount++}
	
	for (var i = 0; i < widget.modeMaskData.length; i++) {
		outImData[i] = widget.modeMaskData[i]
	}
	// modify pixels applying a simple effect
	/*for (var i = 0; i < inputImData.length; i+=4) {
		r = inputImData[i]
		g = inputImData[i + 1]
		b = inputImData[i + 2]
			
		outImData[i] = b;
		outImData[i + 1] = r;
		outImData[i + 2] = g;
		outImData[i + 3] = 255;
		
	}*/
	
	
	// render pixels back
	writeContext.putImageData(imageDataOut, 0, 0);	


}
/*	if(widget.sourceWidgets[0] == null || widget.sourceWidgets[0].canvasDom == null ) return
	writeContext = widget.canvasDom.getContext('2d')

	width = widget.sourceWidgets[0].canvasDom.width;
	height = widget.sourceWidgets[0].canvasDom.height;
	
	widget.canvasDom.width = width;
	widget.canvasDom.height = height;
	var imageDataOut =  writeContext.getImageData(0, 0, width, height);

	//if(widget.frameCount >= widget.data.framesPerSample)
	//{
		//createModalMaskData(widget)
		widget.frameCount = 0;
		
		
		
		outImData = imageDataOut.data
		//createModelMask(widget, outImData)
		for (var ii = 0; ii < imageDataOut.length; ii+=4) {
			imageDataOut[ii] = 255
			imageDataOut[ii + 1] = 0
			imageDataOut[ii + 2] = 0
			imageDataOut[ii + 4] = 255			
		}

	//}else{widget.frameCount++}
	
		// render pixels back
		writeContext.putImageData(imageDataOut, 0, 0);	
}*/

function createModelMask(widget, outImData)
{
	buffs = widget.SampleBuffers
	
	inputImData = getDataFromCanvas(buffs[0])
	
	
	for (var i = 0; i < inputImData.length; i+=4) {
		modeFindArr = []
		//pix = findModeForPx(widget, i, buffs, modeFindArr)
		
		outImData[i] = 255;
		outImData[i + 1] = 0 ;//pix[1];
		outImData[i + 2] = 0;  //pix[2];
		outImData[i + 3] = 255;
	}
}

function findModeForPx(widget, i, buffs, modeFindArr)
{
		for (buffPos = 0; buffPos < buffs.length; buffPos++)
		{
		// modify pixels applying a simple effect
			
		inputImData = getDataFromCanvas(buffs[buffPos])
		inputPx = [inputImData[i], inputImData[i+1], inputImData[i+2]]
		modeColFound = false
		for (x = 0; x < modeFindArr.length; x++)
			{
				modalTestPx = modeFindArr[x][0]
				if (isPxWithinTolerance (inputPx, modalTestPx, widget.data.tolerance) == true ) {
					//There are improvements with taking the ava of those within the modal tolerance but i have nto implemented due to speed concerns (and lazyness)
					modeFindArr[x][1]++
					x = modeFindArr.length
					modeColFound = true
				}
			}
			if (modeColFound == false){
				modeFindArr[modeFindArr.length] = []
				modeFindArr[modeFindArr.length-1][0] = inputPx
				modeFindArr[modeFindArr.length-1][1] = 1
				modeColFound = true
			}
		}
		
		maxHits = 0
		for (x = 0; x < modeFindArr.length; x++)
		{
			if (maxHits <= modeFindArr[x][1] )
			{
				outputPix = modeFindArr[x][0]
				maxHits = modeFindArr[x][1]
			}
		}
		
		return outputPix
}


function getDataFromCanvas(canvasObj)
{
	writeContext = canvasObj.getContext('2d')
	width = canvasObj.width;
	height = canvasObj.height;
	
	var imageDataOut2 =  writeContext.getImageData(0, 0, width, height);
	
	return imageDataOut2.data;
}

function isPxWithinTolerance (inputPx, testPx, tol)
{
		if (
			inputPx[0] >= testPx[0] - tol &&
			inputPx[1] >= testPx[1] - tol &&
			inputPx[2] >= testPx[2] - tol &&
			inputPx[0] <= testPx[0] + tol &&
			inputPx[1] <= testPx[1] + tol &&
			inputPx[2] <= testPx[2] + tol
		){ 
			return true 
		}else {
			return false
		}
}

function createModalMaskData(widget)
{
		buffs = widget.SampleBuffers;
		//copy latest im to buff 0
		//buffs[0].width = width;
		//buffs[0].height = height;
		ctx = buffs[0].getContext('2d')
		ctx.globalCompositeOperation = "copy";
		ctx.drawImage (widget.sourceWidgets[0].canvasDom, 0, 0)
		// move buff 0 to end of array
		buffs.push(buffs.shift());
}

function setupModalMaskBuffers(widget)
{
	buffs = widget.SampleBuffers
	for (i = 0; i < widget.data.noOfSampleFrames; i++)
	{
		buffs[i] = document.createElement('canvas');
	}
	buffs.length = widget.data.noOfSampleFrames;
}