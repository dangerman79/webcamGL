function createWidget(type)
{
		//var widget = new WidgetObj();
		
		switch(type) {
			case 'webcam':
				var widget = CreateCameraWidgetObj ();	
			break;
			case 'colourFlatten':
				var widget = CreateColourFlattenWidgetObj (type);	
			break
			case 'mixer':
				var widget = CreateMixerWidgetObj (type);
			break
			case 'chromaMask':
				var widget = CreateChromaMaskWidgetObj ();
				
			break;
			case 'staccatoFilter':
				var widget = CreateStaccatoFilterWidgetObj ();
			break;
			case 'videoOutput':
				var widget = CreateVideoOutputWidgetObj ();
			break;
			
			case 'videoPlayer':
				var widget = CreateVideoPlayerWidgetObj ();
			break;
			
			case 'backroundMask':
				var widget = CreateBackroundMaskWidgetObj ();
			break;
			
			case 'diffMask':
				var widget = CreateDiffMaskWidgetObj ();
			break;
		}	
		widgets.push(widget);
		
		if (isLoading != true) {createWidgetDom(widget);}
		
		//setupAccordion ()
		
		//expandWidget (widget, true)//needs work?
		
		
		return widget;
}



function createWidgetDom(widget)
{
	addAccordionSegment(mainDomElement, widget);
	addControlsDiv(widget);
	widget.buildDomElement(widget);
	
	populateWidgetSelectors();
	checkWidgetsExpanded();
}

function addControlsDiv(widget)
{
	newDiv = document.createElement('div');
	newDiv.className ="widgetControls"
	widget.panelDom.appendChild(newDiv);
	widget.controlsDivDom = newDiv;

}

function addCanvas(widget)
{	
	newCanvas = document.createElement('canvas');
	widget.panelDom.appendChild(newCanvas);
	widget.canvasDom = newCanvas;
}

function deleteWidget (widget, event)
{
	event.stopPropagation();
	var r = confirm("Are you sure you want to delete " + widget.data.label);
	if (r == true) {
		widget.accordionDom.parentNode.removeChild(widget.accordionDom);
		widget.panelDom.parentNode.removeChild(widget.panelDom);
		widget.data.isActive = false
	}
	index = widgets.indexOf(widget);
	if (index > -1) {
		widgets.splice(index, 1);
	}
	populateWidgetSelectors();
}

function populateWidgetSelectors()
{

	widgets.forEach (function(widget) 
	{
		for (var i = 0; i < widget.widgetSelectors.length; i++)
		{
			selector = widget.widgetSelectors[i]
			//remove current options from dropdown
			while (selector.firstChild) {
			  selector.removeChild(selector.firstChild);
			}
			
			widgets.forEach (function (widget2) 
			{
				var option = document.createElement('option');
				option.value = widget2.data.widgetId;
				option.text = widget2.data.label;
				selector.appendChild(option);
				
			})
			
			selector.value = widget.data.selectedDeviceIds[i];
		}
		
	})
}

function inputChange(widget, event)
{
	//var newSrcStr = event.target.value;
	for (var i = 0; i < widget.widgetSelectors.length; i++)
	{
		widget.data.selectedDeviceIds[i] = widget.widgetSelectors[i].value
	}
	//widget.data.selectedDeviceIds[0] = newSrcStr;
	widget.changeMethod(widget)
}

function settingsChange(widget, event)
{
	widget.changeMethod(widget)
}
