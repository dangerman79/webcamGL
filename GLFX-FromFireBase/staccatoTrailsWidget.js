var noOfStaccattoTrails = 0;

function CreateStaccatoTrailsWidgetObj (type)
{
	newWidget = new WidgetObj ()
	
	//unique vars on this object
	newWidget.framesPerSampleDom = {}
	newWidget.noOfTrailsDom = {}
	newWidget.data.framesPerSample = 0;
	newWidget.data.noOfTrails = 15;
	newWidget.previousData = [];
	newWidget.frameCount = 0;
	newWidget.disMethodDom = {};
	newWidget.data.disMethod = 'Sudden';
	newWidget.trailBuffers = []
	newWidget.data.drawOrder = 'newestOnTop'
	newWidget.drawOrderDom = {}
	
	//constructor
	noOfStaccattoTrails++;
	newWidget.data.label = "Staccato Trails #" + noOfStaccattoTrails;
	newWidget.data.type = type
	
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
			newSelect.addEventListener("change", inputChange.bind(event, widget));
		})
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Frames Between Samples:';
		controlsDiv.appendChild(newLabel);
	
		framesPerSample = document.createElement('input');
		framesPerSample.type = "text"
		framesPerSample.value = widget.data.framesPerSample ;
		controlsDiv.appendChild(framesPerSample);
		widget.framesPerSampleDom = framesPerSample;
		framesPerSample.addEventListener("change", settingsChange.bind(event, widget));
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Number of Trails:';
		controlsDiv.appendChild(newLabel);
		
		newTextbox = document.createElement('input');
		newTextbox.type = "text"
		newTextbox.value = widget.data.noOfTrails ;
		controlsDiv.appendChild(newTextbox);
		widget.noOfTrailsDom = newTextbox;
		newTextbox.addEventListener("change", settingsChange.bind(event, widget));

		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Disappearance Method: ';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		addDisTypesToDropdown(newSelect);
		newSelect.value = widget.data.disMethod;
		newSelect.addEventListener("change", settingsChange.bind(event, widget));
		widget.disMethodDom = newSelect;
		controlsDiv.appendChild(newSelect);
		
		newLabel = document.createElement('label');
		newLabel.innerHTML = 'Draw Order:';
		controlsDiv.appendChild(newLabel);
		
		newSelect = document.createElement('select');
		addDrawOrderToDropdown(newSelect);
		newSelect.value = widget.data.drawOrder;
		newSelect.addEventListener("change", settingsChange.bind(event, widget));
		widget.drawOrderDom = newSelect;
		controlsDiv.appendChild(newSelect);
		
		newCanvas = document.createElement('canvas');
		widget.panelDom.appendChild(newCanvas);
		widget.canvasDom = newCanvas;
		
		setupTrailBuffers(widget)
		
		var draw = function (widget) {
			if (widget.data.isActive != false )requestAnimationFrame(draw.bind(event, widget));
			
			// apply an image filter to the context
			applyStaccatoTrails(widget);
		}
		requestAnimationFrame(draw.bind(event, widget));
	}
	
	newWidget.changeMethod = function (widget) {
		
		widget.sourceWidgets[0] = getWidgetById (widget.data.selectedDeviceIds[0])
		
		fps = widget.framesPerSampleDom.value
		if(isNumeric(fps)){
			widget.data.framesPerSample = Number(widget.framesPerSampleDom.value);
		}
		if(isNumeric(widget.noOfTrailsDom.value)){
			widget.data.noOfTrails = Number(widget.noOfTrailsDom.value);
		}
		widget.data.disMethod = widget.disMethodDom.value;
		widget.data.drawOrder = widget.drawOrderDom.value;
		setupTrailBuffers(widget);
		
	}
	return newWidget
}

function applyStaccatoTrails(widget)
{
	if(widget.sourceWidgets[0] == null || widget.sourceWidgets[0].canvasDom == null ) return
	writeContext = widget.canvasDom.getContext('2d')

	width = widget.sourceWidgets[0].canvasDom.width;
	height = widget.sourceWidgets[0].canvasDom.height;
	
	widget.canvasDom.width = width;
	widget.canvasDom.height = height;
	
	//copy latest im to buff 0
	buffs = widget.trailBuffers;

	if(widget.frameCount >= widget.data.framesPerSample)
	{
		//copy latest im to buff 0
		buffs[0].width = width;
		buffs[0].height = height;
		ctx = buffs[0].getContext('2d')
		ctx.globalCompositeOperation = "copy";
		ctx.drawImage (widget.sourceWidgets[0].canvasDom, 0, 0)
		// move buff 0 to end of array
		buffs.push(buffs.shift());
		widget.frameCount = 0;
	}else{widget.frameCount++}

	fadePerBuffer = 1/buffs.length;
	if (widget.data.framesPerSample > 0){
		fadePerFrame = (1 -(widget.frameCount / widget.data.framesPerSample)) * fadePerBuffer
	}else{
		fadePerFrame = 0
	}
	
	if (widget.data.drawOrder == 'oldestOnTop')
	{
		writeContext.globalAlpha = 1.0
		writeContext.drawImage(widget.sourceWidgets[0].canvasDom,0,0)
	}
	// draw all buffs to output canvas
	for (var i = 0; i < buffs.length; i++)
	{
		if (widget.data.disMethod == 'Sudden')
		{
			writeContext.globalAlpha = 1.0
		}else{
			writeContext.globalAlpha = (fadePerBuffer * i) + fadePerFrame;
		}
		if (widget.data.drawOrder == 'oldestOnTop'){
			fr = (buffs.length - i) - 1
			writeContext.drawImage(buffs[fr],0,0)
		}else{
			writeContext.drawImage(buffs[i],0,0)
		}
	}
	if (widget.data.drawOrder == 'newestOnTop')
	{
		writeContext.globalAlpha = 1.0
		writeContext.drawImage(widget.sourceWidgets[0].canvasDom,0,0)
	}
}

function setupTrailBuffers(widget)
{
	buffs = widget.trailBuffers
	for (i = 0; i < widget.data.noOfTrails; i++)
	{
		buffs[i] = document.createElement('canvas');
	}
	buffs.length = widget.data.noOfTrails;
}
function addDisTypesToDropdown(newSelect)
{
	var mixTypes = ['Sudden','Fade']
	mixTypes.forEach (function(mixType) 
	{
		var option = document.createElement('option');
		option.value = mixType;
		option.text = mixType;
		newSelect.appendChild(option);
	})
}


function addDrawOrderToDropdown(newSelect)
{
		var option = document.createElement('option');
		option.value = 'newestOnTop';
		option.text = 'Newest On Top';
		newSelect.appendChild(option);
		
		var option = document.createElement('option');
		option.value = 'oldestOnTop';
		option.text = 'Oldest On Top';
		newSelect.appendChild(option);
}