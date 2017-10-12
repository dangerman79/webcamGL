var noOfCams = 0;
var noOfChromaFilters = 0;
var webcams = [];
var gotCameras = false;


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
		populateSourceSelectors();
}*/

function createWidget(type)
{
		var widget = new WidgetObj();
		widgets.push(widget);
		
		widget.data.type = type
		
		switch(type) {
			case 'webcam':
				noOfCams++;
				label = "Webcam #" + noOfCams;
				widget.data.label = label;
				addWidgetAccordionSegment(widget);
				addBasePanel(widget);
				addVidWin(widget);
				addBaseListener(widget);
				widget.updateSource = function(src){
					this.vidwinDom.src = src
				}
			break;
			case 'chromaFilter':
				noOfChromaFilters++;
				label = "ChromaFilter #" + noOfChromaFilters;
				widget.data.label = label;
				addWidgetAccordionSegment(widget);
				addBasePanel(widget);
				addBaseListener(widget);
				addCanvas(widget);
				widget.updateSource = function(src){
					//this.vidwinDom.src = src
				}
			break;
			
		
		}	
		setupAccordion ()
		
		expandWidget (widget, true)
		populateSourceSelectors();
	
}

function createChromaFilterPanel(widget)
{
	addBasePanel(widget)
	// I am here
	widget.sourceSelectors.forEach (function(newSelect) {
		newSelect.addEventListener("change", chromaFilterInputChange.bind(event, widget));
	})
}

function addBaseListener (widget)
{
	widget.sourceSelectors.forEach (function(newSelect) {
		newSelect.addEventListener("change", webCamInputChange.bind(event, widget));
	})
}

function addBasePanel(widget)
{
	selectDomId = 'selector' + widgets.length
		
	newDiv = document.createElement('div');
	newDiv.className ="controls";
	
	newLabel = document.createElement('label');
	newLabel.innerHTML = 'Video source: ';
	newDiv.appendChild(newLabel);
	
	newSelect = document.createElement('select');
	newSelect.id = selectDomId;
	newDiv.appendChild(newSelect);
	
	widget.panelDom.appendChild(newDiv);

	widget.controlsDivDom = newDiv;
	widget.sourceSelectors.push(newSelect);
	
		
}
function addCanvas(widget)
{
	newCanvas = document.createElement('canvas');
	newCanvas.className = 'videoWindow';
	
	widget.panelDom.appendChild(newCanvas);
	
	widget.canvasDom = newCanvas;
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
	widget.data.selectedDeviceId = newSrcStr;
	
	checkAllSelectors()

	
}

function webCamInputChange(widget, event)
{
	//console.log(widget)
	//console.log(event)
	
	var newSrcStr = event.target.value;
	widget.data.selectedDeviceId = newSrcStr;
	
	checkAllSelectors()
}

function checkAllSelectors()
{
	widgets.forEach (function(widget) 
	{
		widget.sourceSelectors.forEach (function(selector)
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
			if (widget2.data.selectedDeviceId == widget.data.widgetId)
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

function populateSourceSelectors()
{
	
	if (gotCameras != true){
		navigator.mediaDevices.enumerateDevices().then(getCameras).catch(mediaDeviceError);
		return;
	}
	
	widgets.forEach (function(widget) 
	{
		widget.sourceSelectors.forEach (function (selector)
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
			
			selector.value = widget.data.selectedDeviceId;
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
	populateSourceSelectors()
}

function mediaDevicesError(error) {
	console.log('navigator.getUserMedia error: ', error);
	console.log('something to do with enumerating attached media devices');
}