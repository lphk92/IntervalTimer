function formatDate(date)
{
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var frac = Math.floor(date.getMilliseconds()/10);

    var result = "";
    if (min < 10)
        result += "0" + min.toString() + ":";
    else
        result += min.toString() + ":";

    if (sec < 10)
        result += "0" + sec.toString() + ":";
    else
        result += sec.toString() + ":";

    if (frac < 10)
        result += "0" + frac.toString();
    else
        result += frac.toString();

    return result;
}

function updateTime(date)
{
    document.getElementById("time").innerHTML = formatDate(date);
}

var intervalMin = 0;
var intervalSec = 15;

var hasBegun = false;
var intervalStart = (new Date()).getTime();
var intervalEnd = intervalStart + intervalMin * 60 * 1000 + intervalSec * 1000;

var loop = setInterval(function() {

    // It has begun
    if (hasBegun = false)
    {
        hasBegun = true;
        intervalStart = new Date();
    }
    
    var date = new Date(); 
    var diff = intervalEnd - date.getTime();
    if (diff > 0)
    {
        // We still have some time to go;
        updateTime(new Date(diff))
    }
    else
    {
        // The interval has elapsed
        hasBegun = false;
        updateTime(new Date(0));
        clearInterval(loop);
    }
}, 10)
