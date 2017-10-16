var noOfCams = 0;

function CreateCameraWidgetObj ()
{
	returnObj = new WidgetObj ()
	
	//unique vars on this object
	returnObj.vidwinDom = {}

	
	//constructor
	noOfCams++;
	returnObj.data.label = "Webcam #" + noOfCams;
	returnObj.data.type = 'webcam'
	
	//methods
	returnObj.buildDomElement = function (widget) {
		
		controlsDiv = widget.controlsDivDom
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Camera: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		controlsDiv.appendChild(newSelect);
		widget.camSelectors.push(newSelect);
		newSelect.value = widget.data.selectedDeviceId;
		widget.camSelectors.forEach (function(newSelect) {
			newSelect.addEventListener("change", webCamInputChange.bind(event, widget));
		})
		
		newVid = document.createElement('video');
		newVid.autoplay = 'true';
		newVid.className = 'videoWindow';
		newVid.controls = true;
		//widget.panelDom.appendChild(newVid);
		widget.vidwinDom = newVid;
		
		
		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
		
		navigator.mediaDevices.enumerateDevices().then(getCameras).catch(mediaDeviceError);
	
		var draw = function (widget) {
			// schedule next call to this function
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));

			width = widget.vidwinDom.videoWidth;
			height = widget.vidwinDom.videoHeight;
			
			widget.canvasDom.width = width;
			widget.canvasDom.height = height;
			// draw video data into the canvas
			
			context = widget.canvasDom.getContext('2d');
			context.drawImage(widget.vidwinDom, 0, 0, width, height);
			

		};
		
		requestAnimationFrame(draw.bind(event, widget));
	}
	
	returnObj.updateSource = function (src) {
		this.vidwinDom.src = src
	}
	
	returnObj.changeMethod = function (widget) {
		newSrcStr = widget.data.selectedDeviceId
		var constraints = {
			video: {deviceId: newSrcStr ? {exact: newSrcStr} : undefined}
		};
		navigator.getUserMedia(constraints, handleVideo.bind(null ,widget), videoError)
	}
	return returnObj;
}

function webCamInputChange(widget, event)
{
	var newSrcStr = event.target.value;
	widget.data.selectedDeviceId = newSrcStr;
	widget.changeMethod(widget)
}

function handleVideo(widget, stream) {
	widget.updateSource (window.URL.createObjectURL(stream));
	//checkWidgetsSelectingOtherWidgets();
}

function videoError(e) {
	console.log('videoError: ', e);
}

function mediaDeviceError(error) {
	console.log('navigator.getUserMedia error: ', error);
}

function getCameras(deviceInfos)
{
	webcams = []
	for (i = 0; i !== deviceInfos.length; ++i) {
			var deviceInfo = deviceInfos[i];
			if (deviceInfo.kind === 'videoinput') {
				webcams.push(deviceInfo);
			}
	}
	populateCamSelectors(webcams)
}
function populateCamSelectors(webcams)
{
	widgets.forEach (function(widget) 
	{
		widget.camSelectors.forEach (function (selector)
		{
				while (selector.firstChild) {
				  selector.removeChild(selector.firstChild);
				}
				
				//add cameras
				var noOfCams2 = 0
				webcams.forEach( function (webcam)
				{
					noOfCams2++;
					var option = document.createElement('option');
					option.value = webcam.deviceId;
					option.text = 'Cam #' + noOfCams2 + ' ' + webcam.label
					selector.appendChild(option);
				})
				
				selector.value = widget.data.selectedDeviceId;
				
					var constraints = {
						video: {deviceId: widget.data.selectedDeviceId ? {exact: widget.data.selectedDeviceId} : undefined}
					};
					navigator.getUserMedia(constraints, handleVideo.bind(null ,widget), videoError)
				//checkAllSelectors()
		
		})
	})
}
