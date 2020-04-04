var noOfAlphaVid = 0;

function CreateAlphaVidWidgetObj ()
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.vidwinDom = {};
	newWidget.fileSelector = {};
	newWidget.playbackRateDom;
	newWidget.data.playbackRate = 1;
	newWidget.alphaCanvasDom = document.createElement('canvas');
	
	//constructor
	noOfAlphaVid++;
	newWidget.data.label = "AlphaVid #" + noOfAlphaVid;
	newWidget.data.type = 'alphaVid'
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
		playbackRate.addEventListener("change", settingsChange.bind(event, widget));
		
        		
		
		
		newVid = document.createElement('video');
		newVid.autoplay = true;
		newVid.controls = true;
		newVid.loop = true;
		widget.vidwinDom = newVid;
		
		widget.panelDom.appendChild(newVid);
		
		newCanvas = document.createElement('canvas');
		widget.canvasDom = newCanvas;
        
        widget.panelDom.appendChild(newCanvas);
        widget.panelDom.appendChild(widget.alphaCanvasDom);
        
        alphaCanvas = widget.alphaCanvasDom;
        
		var draw = function (widget) {
			// schedule next call to this function
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));

			width = widget.vidwinDom.videoWidth;
			height = widget.vidwinDom.videoHeight/2;
			
            if (width == 0) return
            
			widget.canvasDom.width = width;
			widget.canvasDom.height = height;
            
            widget.alphaCanvasDom.width = width;
			widget.alphaCanvasDom.height = height;
            
			// draw video data into the canvas
			
			context = widget.canvasDom.getContext('2d');
			context.drawImage(widget.vidwinDom, 0, 0, width, height, 0, 0, width, height);
			
            alphaContext = widget.alphaCanvasDom.getContext('2d');
            alphaContext.drawImage(widget.vidwinDom, 0, height, width, height, 0,0, width, height);
            
            var colorImDataIn = context.getImageData(0, 0, width, height)
            colorDataIn = colorImDataIn.data;
            alphaDataIn = alphaContext.getImageData(0, 0, width, height).data;
            
            for (var i = 0; i < colorDataIn.length; i+=4) {
                /*r = colorDataIn[i]
                g = colorDataIn[i + 1]
                b = colorDataIn[i + 2]
                a = alphaDataIn[i] //use the blue channel as alpha, just to save an addition per pix
                */
                colorDataIn[i+3] = alphaDataIn[i];
                
                
            }
            
            context.putImageData(colorImDataIn, 0, 0);
            
            /*alphaContext.globalAlpha = 1;
            alphaContext.fillStyle = "red";
            alphaContext.fillRect(20, height/2, height, width);

            alphaContext.fillStyle = "rgba(255, 255, 0, 0.2)";
            alphaContext.fillRect(0, 0, height, width/2);*/
            //'source-over','source-in','source-out','source-atop','destination-over','destination-in','destination-out','destination-atop','lighter','copy','xor','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'
            //alphaContext.globalCompositeOperation = "destination-over";
            //alphaContext.drawImage(widget.vidwinDom, 0, 0, width, height, 0, 0, width, height);

		};
		requestAnimationFrame(draw.bind(event, widget));
	
	}			
	
	newWidget.changeMethod = function (widget) {

		/*widget.sourceWidgets[0] = getWidgetById (widget.data.selectedDeviceIds[0])
		
		widget.canvasDom = widget.sourceWidgets[0].canvasDom;
		var stream = widget.canvasDom.captureStream();
		widget.vidwinDom.srcObject = stream;*/
		widget.data.playbackRate = widget.playbackRateDom.value;
		widget.vidwinDom.playbackRate = widget.data.playbackRate;
	}
    
    newWidget.getAlphaChannel = function () {
        alphaWidget = new WidgetObj ();
        alphaWidget.data.label = "AlphaVidAlpha #" + noOfAlphaVid;
        alphaWidget.data.type = 'alphaVidAlpha'
        alphaWidget.canvasDom = newWidget.alphaCanvasDom;
        
        
        return alphaWidget;
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
