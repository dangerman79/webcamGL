var selectors = [];
var i = 0
	function videoError(e) {
		// do something
	}

	function start() {
		//storeSelectorVals();
		var arrayLength = viewports.length;
		for (iii = 0; iii < arrayLength; iii++)		{
			var videoSource = document.querySelector('#' + viewports[iii].data.selectorDomId).value;
			var constraints = {
				video: {deviceId: videoSource ? {exact: videoSource} : undefined}
			};
			navigator.getUserMedia(constraints, attachStreamToWindow.bind(null ,iii), videoError)
		  }
	}
	
	function attachStreamToWindow (x, stream)
	{
				console.log("0called " + x)
				//I am here, i need to pass i in instead of 0
				document.querySelector('#' + viewports[x].data.videoWinDomId).src = window.URL.createObjectURL(stream);
	}
	
	function createViewport(parentDomId, label)
	{
		var viewport = new camera();
		viewport.data.parentDomId = parentDomId;
		viewport.data.label = label;
		viewport.data.viewportId = viewports.length;
		viewports.push(viewport);
		createCam (viewports[viewport.data.viewportId]);
		
	}
	
	function createCam (viewport)
	{
		//console.log('hello: ' + selectors.length);
		parentElement = document.querySelector('#' + viewport.data.parentDomId);
		id = viewport.data.viewportId;
		viewport.data.selectorDomId = "videoSelector"+id;
		viewport.data.videoWinDomId = "videoWin"+id;
		
		webcamHTML = "<div class='select'>";
		webcamHTML = webcamHTML + "<label for='videoSource'>Video source: </label><select id='"+viewport.data.selectorDomId+"'></select>";
		webcamHTML = webcamHTML + "</div>"
		webcamHTML = webcamHTML + "<video autoplay='true' class='videoWindow' id='"+viewport.data.videoWinDomId+"'/>"
		parentElement.innerHTML = webcamHTML
		videoSelect  = document.querySelector('select#' + viewport.data.selectorDomId);
		
		//videoSelect.onchange = function() {start();};
		//selectors.push(videoSelect);
		//selectors[selectors.length-1].onchange = function() {start();};
		
		navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
		start()
		
	}
	
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	function storeSelectorVals()
	{
		for (i = 0; i !== viewports.length; ++i) {
			videoSelect  = document.querySelector('select#' + viewports[i].data.selectorDomId);
			viewports[i].data.selectedDeviceId = videoSelect.value;
		}
		
		
	}
	function gotDevices(deviceInfos) {
		
		
		// remove data from all current selectors
		for (i = 0; i !== viewports.length; ++i) {
			videoSelect  = document.querySelector('select#' + viewports[i].data.selectorDomId);
			while (videoSelect.firstChild) {
			  videoSelect.removeChild(videoSelect.firstChild);
			}
		}
		
		// add options to all dropdowns
		for (i = 0; i !== deviceInfos.length; ++i) {
			var deviceInfo = deviceInfos[i];
			if (deviceInfo.kind === 'videoinput') {
				for (ii = 0; ii !== viewports.length; ++ii) {
					var option = document.createElement('option');
					option.value = deviceInfo.deviceId;
					option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
					videoSelect  = document.querySelector('select#' + viewports[ii].data.selectorDomId);
					videoSelect.appendChild(option);
				}
			}
		}
		
		//ensure original selection is restored
		for (ii = 0; ii !== viewports.length; ++ii) {
			videoSelect  = document.querySelector('select#' + viewports[ii].data.selectorDomId);
			videoSelect.value = viewports[ii].data.selectedDeviceId;
			videoSelect.onchange = function() {
				storeSelectorVals()
				start();
			};
			start();
		}
	}
		
	
	/*
	  // Handles being called several times to update labels. Preserve values.
	  var values = selectors.map(function(select) {
		return select.value;
	  });
	  selectors.forEach(function(select) {
		while (select.firstChild) {
		  select.removeChild(select.firstChild);
		}
	  });
	  for (i = 0; i !== deviceInfos.length; ++i) {
		var deviceInfo = deviceInfos[i];
		var option = document.createElement('option');
		option.value = deviceInfo.deviceId;
		if (deviceInfo.kind === 'videoinput') {
		  option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
		  selectors.forEach(function(select) {
			select.appendChild(option);
		  })
		  

		} else {
		  // console.log('Some other kind of source/device: ', deviceInfo);
		}
	  }
	  selectors.forEach(function(select, selectorIndex) {
		if (Array.prototype.slice.call(select.childNodes).some(function(n) {
		  return n.value === values[selectorIndex];
		})) {
		  select.value = values[selectorIndex];
		}
	  });
	}	 */

	function handleError(error) {
		console.log('navigator.getUserMedia error: ', error);
	}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);