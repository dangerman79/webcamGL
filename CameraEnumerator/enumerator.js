var selectors = []
var videoElements = []

	function videoError(e) {
		// do something
	}
	function start() {
		var arrayLength = selectors.length;
		for (var i = 0; i < arrayLength; i++)		{
			var videoSource = selectors[i].value;
			var constraints = {
				video: {deviceId: videoSource ? {exact: videoSource} : undefined}
			};
			navigator.getUserMedia(constraints, function(stream, i) {
				//I am here, i need to pass i in instead of 0
				console.log(i)
				videoElements[0].src = window.URL.createObjectURL(stream);
			}
			, videoError)
			
		  }
	}

	function createVideoWindow (iparentElement, iid)
	{
		//console.log('hello: ' + selectors.length);
		parentElement = iparentElement;
		id = iid;
		webcamHTML = "<div class='select'>";
		webcamHTML = webcamHTML + "<label for='videoSource'>Video source: </label><select id='videoSource"+id+"'></select>";
		webcamHTML = webcamHTML + "</div>"
		webcamHTML = webcamHTML + "<video autoplay='true' class='videoWindow' id='videoElement"+id+"'/>"
		parentElement.innerHTML = webcamHTML
		videoWin = document.querySelector('#videoElement' + id);
		videoSelect  = document.querySelector('select#videoSource' + id);
		
		selectors.push(videoSelect);
		videoElements.push(videoWin);
		videoSelect.onchange = start;
		
		navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
		start()
		
	}
	
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	
	function gotDevices(deviceInfos) {

	  // Handles being called several times to update labels. Preserve values.
	  var values = selectors.map(function(select) {
		return select.value;
	  });
	  selectors.forEach(function(select) {
		while (select.firstChild) {
		  select.removeChild(select.firstChild);
		}
	  });
	  for (var i = 0; i !== deviceInfos.length; ++i) {
		var deviceInfo = deviceInfos[i];
		var option = document.createElement('option');
		option.value = deviceInfo.deviceId;
		if (deviceInfo.kind === 'videoinput') {
		  option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
		  selectors.forEach(function(select) {
			console.log ('hello: ' + select)
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
	}	 

	function handleError(error) {
		console.log('navigator.getUserMedia error: ', error);
	}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);