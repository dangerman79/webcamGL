var noOfWigets = 0;

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




function addAccordionSegment(parentElement, widget, id)
{
	
	var labelId = id+"Label"
	newButton = document.createElement('button');
	newButton.className  = "accordion";
	parentElement.appendChild(newButton);
	
	newInput = document.createElement('input');
	newInput.className  = "accordionLabel";
	newInput.type = "text";
	newInput.id = labelId;
	newInput.value = widget.data.label;
	newInput.addEventListener('change', updateWidgetLabel.bind(event, widget), false);
	newInput.addEventListener('keyup', keyupWidgetLabel) 
	newInput.addEventListener('click', function(event){event.stopPropagation()})
	
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
	newDiv.id = id;
	parentElement.appendChild(newDiv);
	
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
