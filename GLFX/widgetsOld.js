var noOfChromaFilters = 0;
var noOfStaccatoFilters = 0;



/*function createChromaFilterWidget()
{
	// to much duplication from here and createWebcamWidget(), look to merge
		var widget = new webcam();
		
		widget.data.type = "ChromaFilter"
		widgets.push(widget);
		noOfChromaFilters++;
		label = "ChromaFilter #" + noOfChromaFilters;
		widget.data.label = label
		addWidgetAccordionSegment(widget);
		createChromaFilterPanel(widget)
		
		setupAccordion ()
		
		expandWidget (widget, true)
		populatewidgetSelectors();
}*/

function createWidget(type)
{
		//var widget = new WidgetObj();
		
		switch(type) {
			case 'webcam':
				var widget = CreateCameraWidgetDataObj ();
				
				
				
				
				/*addWidgetAccordionSegment(widget);
				addBasePanel(widget);
				addVidWin(widget);
				addBaseListener(widget);
				widget.updateSource = function(src){
					this.vidwinDom.src = src/
				}*/
			break;
			case 'chromaFilter':
				noOfChromaFilters++;
				label = "ChromaFilter #" + noOfChromaFilters;
				widget.data.label = label;
				widget.data.samplePx = [];
				addWidgetAccordionSegment(widget);
				addChromaControls(widget);
				addCanvas(widget);
				
				addBaseListener(widget);
				addCanvasListener(widget);
				widget.updateSource = function(src){
					this.vidwinDom.src = src
				}
			break;
			case 'staccatoFilter':
				noOfStaccatoFilters++;
				label = "StaccatoFilter #" + noOfStaccatoFilters;
				widget.data.label = label;
				addWidgetAccordionSegment(widget);
				addStaccatoControls(widget);
				addCanvas(widget);
				addBaseListener(widget);
				widget.updateSource = function(src){
					this.vidwinDom.src = src // change this to get the data from the canvas.
				}
				
			break;
			
		
		}	
		widgets.push(widget);
		
		createWidgetDom(widget);
		
		setupAccordion ()
		
		expandWidget (widget, true)//needs work?
		populatewidgetSelectors();
	
}

function createWidgetDom(widget)
{
	addWidgetAccordionSegment(widget);
	addControlsDiv(widget);
	widget.buildDomElement(widget);
	
}

function addControlsDiv(widget)
{
	newDiv = document.createElement('div');
	widget.panelDom.appendChild(newDiv);
	widget.controlsDivDom = newDiv;

}

function addCanvas(widget)
{	
	newCanvas = document.createElement('canvas');
	widget.panelDom.appendChild(newCanvas);
	widget.canvasDom = newCanvas;
}












function addBaseListener (widget)
{
	widget.widgetSelectors.forEach (function(newSelect) {
		newSelect.addEventListener("change", webCamInputChange.bind(event, widget));
	})
}
function addCanvasListener (widget)
{
	widget.canvasDom.addEventListener("click", addSamplePx.bind(event, widget));
	
}
function addStaccatoControls(widget)
{
	addBasePanel(widget)
	controlsDiv = widget.controlsDivDom
	newLabel = document.createElement('label');
	newLabel.innerHTML = 'Frames Per Strobe:';
	controlsDiv.appendChild(newLabel);
	
	framesPerStrobe = document.createElement('input');
	framesPerStrobe.type = "text"
	framesPerStrobe.value = 30;
	controlsDiv.appendChild(framesPerStrobe);
	widget.framesPerStrobeDom = framesPerStrobe;
	
	framesPerStrobe.addEventListener("change", staccatoSettingsChange.bind(event, widget));
}	
	
function staccatoSettingsChange(widget, event)
{
	fps = widget.toleranceDom.value
	if(isNumeric(fps)){
		widget.data.framesPerStrobe = Number(fps);
	}
}

function addChromaControls(widget)
{
	addBasePanel(widget)
	controlsDiv = widget.controlsDivDom
	
	newLabel = document.createElement('label');
	newLabel.innerHTML = 'Tolerance:';
	controlsDiv.appendChild(newLabel);
	
	tolerance = document.createElement('input');
	tolerance.type = "text"
	tolerance.value = 0;
	controlsDiv.appendChild(tolerance);
	widget.toleranceDom = tolerance;
	
	newLabel = document.createElement('label');
	newLabel.innerHTML = 'Show Sample Pixels:';
	controlsDiv.appendChild(newLabel);
	
	showSamplePxCheck = document.createElement('input');
	showSamplePxCheck.type = "checkbox"
	controlsDiv.appendChild(showSamplePxCheck);
	widget.samplePxDom = showSamplePxCheck;
	
	newbutton = document.createElement('button');
	newbutton.innerHTML = 'Clear Sample Pixels';
	controlsDiv.appendChild(newbutton);
	
	showSamplePxCheck.addEventListener("change", settingsChange.bind(event, widget));
	tolerance.addEventListener("change", settingsChange.bind(event, widget));
	
	
	newbutton.addEventListener("click", clearSamplePx.bind(event, widget));
}

function settingsChange(widget, event)
{
	widget.data.showSamplePx = widget.samplePxDom.checked;
	tol = widget.toleranceDom.value
	if(isNumeric(tol)){
		widget.data.tolerance = Number(widget.toleranceDom.value);
	}
}




/*function addCanvas(widget)
{
	videoDomId = 'videoWin' + widgets.length
	newVid = document.createElement('video');
	newVid.autoplay = 'true';
	newVid.className = 'videoWindow';
	newVid.id=videoDomId;
	newVid.controls = true;
	
	//widget.panelDom.appendChild(newVid);
	
	widget.vidwinDom = newVid;
	
	newCanvas = document.createElement('canvas');
	//newCanvas.className = 'videoWindow';
	
	widget.panelDom.appendChild(newCanvas);
	
	widget.canvasDom = newCanvas;
	
	// tidy tidy tidy 
	context = widget.canvasDom.getContext('2d');
	
	var draw = function () {
		// schedule next call to this function
		requestAnimationFrame(draw);

		width = widget.vidwinDom.videoWidth;
		height = widget.vidwinDom.videoHeight;
		
		newCanvas.width = width;
		newCanvas.height = height;
		// draw video data into the canvas
		context.drawImage(widget.vidwinDom, 0, 0, width, height);

		// apply an image filter to the context
		applyFilter(context, width, height, widget);
	};
	
	requestAnimationFrame(draw);
	
	
}*/

function applyFilter(context, width, height, widget) {
  // read pixels
  var imageData = context.getImageData(0, 0, width, height);
  var data = imageData.data; // data is an array of pixels in RGBA

	colLo = new Col(255,255,255,0);
	colHi = new Col(0,0,0,0);
  widget.data.samplePx.forEach (function(px) 
	{
		sampleCol = getCol(px.x, px.y, width, height, data)
		if (sampleCol.r > colHi.r) {colHi.r = sampleCol.r}
		if (sampleCol.g > colHi.g) {colHi.g = sampleCol.g}
		if (sampleCol.b > colHi.b) {colHi.b = sampleCol.b}
		
		if (sampleCol.r < colLo.r) {colLo.r = sampleCol.r}
		if (sampleCol.g < colLo.g) {colLo.g = sampleCol.g}
		if (sampleCol.b < colLo.b) {colLo.b = sampleCol.b}
	})
	
	colHi.r = colHi.r + widget.data.tolerance;
	colHi.g = colHi.g + widget.data.tolerance;
	colHi.b = colHi.b + widget.data.tolerance;
	
	colLo.r = colLo.r - widget.data.tolerance;
	colLo.g = colLo.g - widget.data.tolerance;
	colLo.b = colLo.b - widget.data.tolerance;
  
  
  // modify pixels applying a simple effect
  for (var i = 0; i < data.length; i+=4) {
    r = data[i]
    g = data[i + 1]
    b = data[i + 2]
	
	if (
		r >= colLo.r &&
		g >= colLo.g &&
		b >= colLo.b &&
		r <= colHi.r &&
		g <= colHi.g &&
		b <= colHi.b
	){
		data[i] = 0;
		data[i + 1] = 255;
		data[i + 2] = 255;
		
	}
	
    // note: i+3 is the alpha channel, we are skipping that one
  }
  
  
  if (widget.data.showSamplePx == true)
  {
	  widget.data.samplePx.forEach (function(px) 
	  {
		  for(var q = -5; q<=5; q++)
		  {
			dataLoc = getPointLocationInData(px.x+q, px.y+q, width, height)
			data[dataLoc] = 255;
			data[dataLoc + 1] = 0;
			data[dataLoc + 2] = 0;
			
			dataLoc = getPointLocationInData(px.x-q, px.y+q, width, height)
			data[dataLoc] = 255;
			data[dataLoc + 1] = 0;
			data[dataLoc + 2] = 0;
		  }
	  })
  }
  
    // render pixels back
  context.putImageData(imageData, 0, 0);
  
  
}
function getCol(x,y, width, height, data)
{
	dataLoc = getPointLocationInData(x,y, width, height)
	return new Col(data[dataLoc], data[dataLoc+1], data[dataLoc+2], data[dataLoc+3])
	
}

function getPointLocationInData(x,y, width, height)
{
	dataLocation = (x + y * width) * 4;
	return (dataLocation)
	
}

function addVidWin(widget)
{
	videoDomId = 'videoWin' + widgets.length
	newVid = document.createElement('video');
	newVid.autoplay = 'true';
	newVid.className = 'videoWindow';
	newVid.id=videoDomId;
	newVid.controls = true;
	
	widget.panelDom.appendChild(newVid);
	
	widget.vidwinDom = newVid;
}
function deleteWidget (widget, event)
{
	event.stopPropagation();
	var r = confirm("Are you sure you want to delete " + widget.data.label);
	if (r == true) {
		widget.accordionDom.parentNode.removeChild(widget.accordionDom);
		widget.panelDom.parentNode.removeChild(widget.panelDom);
	}
	index = widgets.indexOf(widget);
	if (index > -1) {
		widgets.splice(index, 1);
	}
	
}

function chromaFilterInputChange(widget, event)
{
	//console.log(widget)
	//console.log(event)
	
	var newSrcStr = event.target.value;
	widget.data.selectedDeviceIds[0] = newSrcStr;
	
	checkAllSelectors()

	
}

function addSamplePx(widget, event)
{
	
	
	var px= new Point(event.offsetX, event.offsetY);
	widget.data.samplePx.push(px);
}

function clearSamplePx(widget, event)
{
	widget.data.samplePx = [];
}

function webCamInputChange(widget, event)
{
	//console.log(widget)
	//console.log(event)
	
	var newSrcStr = event.target.value;
	widget.data.selectedDeviceIds[0] = newSrcStr;
	
	checkAllSelectors()
}

function checkAllSelectors()
{
	widgets.forEach (function(widget) 
	{
		widget.widgetSelectors.forEach (function(selector)
		{
			newSrcStr = selector.value;
			if (newSrcStr.substring(0,6)=='widget')
			{
				//console.log('widget')
				selectedWidget = getWidgetById (newSrcStr)
				//widget.vidwinDom.src = selectedWidget.vidwinDom.src
				widget.updateSource (selectedWidget.vidwinDom.src);
				
			}else{
				//console.log('cam')
				var constraints = {
					video: {deviceId: newSrcStr ? {exact: newSrcStr} : undefined}
				  };
				navigator.getUserMedia(constraints, handleVideo.bind(null ,widget), videoError)
			}
		})
	})
	
}

function checkWidgetsSelectingOtherWidgets ()
{
	widgets.forEach (function(widget) 
	{
		widgets.forEach (function(widget2) 
		{
			if (widget2.data.selectedDeviceIds[0] == widget.data.widgetId)
			{
				//widget2.vidwinDom.src = widget.vidwinDom.src
				widget2.updateSource (widget.vidwinDom.src);
				
			}
		})
	})
}

function handleVideo(widget, stream) {
	//widget.vidwinDom.src = window.URL.createObjectURL(stream);
	widget.updateSource (window.URL.createObjectURL(stream));
	checkWidgetsSelectingOtherWidgets();
}

function videoError(e) {
	console.log('videoError: ', e);
}

function mediaDeviceError(error) {
	console.log('navigator.getUserMedia error: ', error);
}

function populatewidgetSelectors()
{
	
	if (gotCameras != true){
		navigator.mediaDevices.enumerateDevices().then(getCameras).catch(mediaDeviceError);
		return;
	}
	
	widgets.forEach (function(widget) 
	{
		widget.widgetSelectors.forEach (function (selector)
		{
			//remove current options from dropdown
			while (selector.firstChild) {
			  selector.removeChild(selector.firstChild);
			}
			
			// add cameras
			var noOfCams2 = 0
			webcams.forEach( function (webcam)
			{
				noOfCams2++;
				var option = document.createElement('option');
				option.value = webcam.deviceId;
				option.text = 'Cam #' + noOfCams2 + ' ' + webcam.label
				selector.appendChild(option);
			})
			widgets.forEach (function (widget2) 
			{
				var option = document.createElement('option');
				option.value = widget2.data.widgetId;
				option.text = widget2.data.label;
				selector.appendChild(option);
				
			})
			
			selector.value = widget.data.selectedDeviceIds[0];
		})
		
	})
	checkAllSelectors()
}

function getCameras(deviceInfos)
{
	webcams = [];
	for (i = 0; i !== deviceInfos.length; ++i) {
			var deviceInfo = deviceInfos[i];
			if (deviceInfo.kind === 'videoinput') {
				webcams.push(deviceInfo);
			}
	}
	gotCameras = true
	populatewidgetSelectors()
}

function mediaDevicesError(error) {
	console.log('navigator.getUserMedia error: ', error);
	console.log('something to do with enumerating attached media devices');
}