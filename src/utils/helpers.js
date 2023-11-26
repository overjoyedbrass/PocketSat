export function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);  
    element.style.display = 'none';
    document.body.appendChild(element);  
    element.click();  
    document.body.removeChild(element);
}

export function getUserLocation(e, callBack) {
    e.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            callBack({ lat: latitude, lng: longitude, alt: ""}, "Current location");
        }, () => {
            console.log("Unable to get location");
        });
    } else {
        console.log("Geolocation not supported");
    }
}

export function isNumeric(str) {
    if (typeof str == "number") return true;
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}