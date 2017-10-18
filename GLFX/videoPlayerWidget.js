var noOfVidPlayers = 0;

function CreateVideoPlayerWidgetObj ()
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.vidwinDom = {}
	newWidget.fileSelector = {}
	newWidget.playbackRateDom
	newWidget.data.playbackRate = 1;
	
	
	//constructor
	noOfVidPlayers++;
	newWidget.data.label = "Video Player #" + noOfVidPlayers;
	newWidget.data.type = 'videoPlayer'
	//methods
	newWidget.buildDomElement = function (widget) {
		controlsDiv = widget.controlsDivDom
		
		
		fileSelector = document.createElement('input');
		fileSelector.type = 'file'
		fileSelector.addEventListener('change', playSelectedFile.bind(event, widget), false)
		controlsDiv.appendChild(fileSelector);
		widget.fileSelector = fileSelector
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Playback Rate:';
		controlsDiv.appendChild(newLabel);
	
		playbackRate = document.createElement('input');
		playbackRate.type = "text"
		playbackRate.value = widget.data.playbackRate ;
		controlsDiv.appendChild(playbackRate);
		widget.playbackRateDom = playbackRate;
		playbackRate.addEventListener("change", chromaSettingsChange.bind(event, widget));
		
		
		
		newVid = document.createElement('video');
		newVid.autoplay = true;
		newVid.controls = true;
		newVid.loop = true;
		widget.vidwinDom = newVid;
		
		widget.panelDom.appendChild(newVid);
		
		newCanvas = document.createElement('canvas');
		widget.canvasDom = newCanvas;

	
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
	
	newWidget.changeMethod = function (widget) {

		/*widget.sourceWidget = getWidgetById (widget.data.selectedDeviceId)
		
		widget.canvasDom = widget.sourceWidget.canvasDom;
		var stream = widget.canvasDom.captureStream();
		widget.vidwinDom.srcObject = stream;*/
		widget.data.playbackRate = widget.playbackRateDom.value;
		videoNode.playbackRate = widget.data.playbackRate;
	}
	
	return newWidget;
}
function playSelectedFile(widget, event)
{
    var file = widget.fileSelector.files[0]
    var type = file.type
	videoNode = widget.vidwinDom

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
	videoNode.playbackRate = widget.data.playbackRate;
}
