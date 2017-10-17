function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getCol(x,y, width, height, data)
{
	dataLoc = getPointLocationInData(x,y, width, height)
	return new Col(data[dataLoc], data[dataLoc+1], data[dataLoc+2], data[dataLoc+3])
	
}

function getPointLocationInData(x,y, width, height)
{
	dataLocation = (x + y * width) * 4;
	return (dataLocation)
	
}

function copyImageData(source, result)
{
	result.width = source.width;
	result.height = source.height;
	
	//result.data = source.data.slice(0);
	
	result.data = [];
	for (var i = 0; i < source.data.length; i++) {
		result.data[i] = source.data[i];
	}
}

function copyImageRawData(source, result)
{
	//result.data = source.data.slice(0);
	
	result = [];
	for (var i = 0; i < source.length; i++) {
		result[i] = source[i];
	}
	return result
}