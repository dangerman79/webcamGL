var noOfCams = 0;
var webcams = [];
var gotCameras = false;

function createWebcamWidget()
{
		var widget = new webcam();
		widgets.push(widget);
		
		noOfCams++;
		label = "Webcam #" + noOfCams;
		
		widget.data.label = label
		
		
		// Maybe split out from here for save load?
		addWidgetAccordionSegment(widget);
		addWebcamPanel(widget)
		
		
		// I AM HERE
		
		//createCam (viewports[widget.data.viewportId]);

		
		setupAccordion ()
		
		expandWidget (widget, true)
		populateSourceSelectors();
	
}

function addWebcamPanel(widget)
{
	selectDomId = 'selector' + widgets.length
	videoDomId = 'videoWin' + widgets.length
		
	newDiv = document.createElement('div');
	newDiv.className ="select";
	
	newLabel = document.createElement('label');
	newLabel.innerHTML = 'Video source: ';
	newDiv.appendChild(newLabel);
	
	newSelect = document.createElement('select');
	newSelect.id = selectDomId;
	newDiv.appendChild(newSelect);
	
	widget.panelDom.appendChild(newDiv);
	
	newVid = document.createElement('video');
	newVid.autoplay = 'true';
	newVid.className = 'videoWindow';
	newVid.id=videoDomId;
	newVid.controls = true;
	
	widget.panelDom.appendChild(newVid);
	
	widget.vidwinDom = newVid;
	widget.sourceSelectors.push(newSelect);
	newSelect.addEventListener("change", webCamInputChange.bind(event, widget));
	
		
}

function webCamInputChange(widget, event)
{
	//console.log(widget)
	//console.log(event)
	
	var newSrcStr = event.target.value;
	widget.data.selectedDeviceId = newSrcStr;
	
	if (newSrcStr.substring(0,6)=='widget')
	{
		//console.log('widget')
		selectedWidget = getWidgetById (newSrcStr)
		widget.vidwinDom.src = selectedWidget.vidwinDom.src
		
	}else{
		//console.log('cam')
		var constraints = {
			video: {deviceId: newSrcStr ? {exact: newSrcStr} : undefined}
		  };
		navigator.getUserMedia(constraints, handleVideo.bind(null ,widget), videoError)
	}
	
}

function handleVideo(widget, stream) {
	widget.vidwinDom.src = window.URL.createObjectURL(stream);
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
			
			//selector.onchange = widget.inputChangeFunction
			//Todo ensure original selections are returned
			selector.value = widget.data.selectedDeviceId;
		})
		
	})
	
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
	console.log('something to do with enumerating attached media devices')
}