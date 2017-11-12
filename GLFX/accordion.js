/*var noOfWigets = 0;

function setupAccordion ()
{
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
	  acc[i].onclick = function() {
		//this.classList.toggle("active");
		var panel = this.nextElementSibling;
		if (panel.style.maxHeight){
		  panel.style.maxHeight = null;
		} else {
		  panel.style.maxHeight = panel.scrollHeight + "px";
		} 
	  }
	}
}

function addWidgetAccordionSegment(widget)
{
	noOfWigets++
	panelId = "widgetPanel" + noOfWigets;
	addAccordionSegment(mainDomElement, widget, panelId);

}

function expandWidget(widget, value)
{
		widget.data.expanded = value
		
		if (widget.data.expanded == true)
		{
			widget.panelDom.style.maxHeight = widget.panelDom.scrollHeight + "px";
		}else{
			widget.panelDom.maxHeight = null;
		}
}

*/
function expandWidgetClick(widget, event)
{
	widget.data.expanded = !widget.data.expanded;
	checkWidgetsExpanded();
}

function checkWidgetsExpanded()
{
	widgets.forEach (function(widget) 
	{
		if(widget.data.expanded == true )
		{
			if(widget.panelHeight != widget.panelDom.scrollHeight)
			{
				widget.panelHeight = widget.panelDom.scrollHeight
				widget.panelDom.style.maxHeight = widget.panelDom.scrollHeight + "px";;
			}			
		}else{
			if(widget.panelHeight != null)
			{
				widget.panelHeight = null
				widget.panelDom.style.maxHeight = widget.panelHeight;
			}
		}
		
	})
	
}

setInterval(checkWidgetsExpanded, 500);

function addAccordionSegment(parentElement, widget)
{
	
	//var labelId = id+"Label"
	newButton = document.createElement('button');
	newButton.className  = "accordion";
	newButton.addEventListener("click", expandWidgetClick.bind(event, widget))
	parentElement.insertBefore(newButton, parentElement.childNodes[0]);
	
	
	newInput = document.createElement('input');
	newInput.className  = "accordionLabel";
	newInput.type = "text";
	newInput.value = widget.data.label;
	newInput.addEventListener('change', widget.updateLabel.bind(event, widget), false);
	newInput.addEventListener('keyup', keyupWidgetLabel) 
	//newInput.addEventListener('click', function(event){event.stopPropagation()})
	
	newCloseButton = document.createElement('div');
	newCloseButton.className  = "closeButton";
	newCloseButton.innerHTML = 'X'
	newCloseButton.style.color = '#932626';
	newCloseButton.style.cssFloat = "right";
	newCloseButton.addEventListener("click", deleteWidget.bind(event, widget))
	
	newButton.appendChild(newInput);
	newButton.appendChild(newCloseButton);
	
	newDiv = document.createElement('div');
	newDiv.className ="panel"
	parentElement.insertBefore(newDiv, parentElement.childNodes[1]);
	
	widget.panelDom = newDiv;
	widget.labelDom = newInput;
	widget.accordionDom =  newButton;
	//setupAccordion ()
}
function keyupWidgetLabel(event)
{
	event.stopPropagation();
	if (event.keyCode === 13) {
		this.blur()
       //event.target.
    }
}
