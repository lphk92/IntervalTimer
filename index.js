var beep = new Audio('beep.wav');
var stop = false

function Interval(m, s)
{
    this.minutes = m;
    this.seconds = s;
}

function parseInterval(str)
{
    var min = str.split(":")[0];
    var sec = str.split(":")[1];
    return new Interval(parseInt(min), parseInt(sec));
}

function getIntervals()
{
    var items = document.getElementsByTagName("li");
    var arr = [];
    for (var i = 0 ; i < items.length ; i++)
    {
        arr.push(parseInterval(items[i].innerHTML));
    }
    return arr;
}

function incrementSelection()
{
    var items = document.getElementsByTagName("li");
    var found = false;
    for (var i = 0 ; i < items.length ; i++)
    {
        if (items[i].classList.contains("selected"))
        {
            found = true;
            if (i < items.length-1)
            {
                items[i].classList.remove("selected");
                items[i+1].classList.add("selected");
                break;
            }
        }
    }
    if (!found)
    {
        document.getElementsByTagName("li")[0].classList.add("selected");
    }
}

function setRunning(isRunning)
{
    if (isRunning)
    {
        // Select the first interval
        incrementSelection();

        // Hide the x's
        var items = document.getElementsByClassName("remove");
        for (var i = 0 ; i < items.length ; i++)
        {
            items[i].classList.add("hidden");
        }
    }
    else
    {
        // Clear any selected intervals (should only be one)
        var items = document.getElementsByTagName("li");
        for (var i = 0 ; i < items.length ; i++)
        {
            if (items[i].classList.contains("selected"))
                items[i].classList.remove("selected");
        }

        // Restore the x's
        var items = document.getElementsByClassName("remove");
        for (var i = 0 ; i < items.length ; i++)
        {
            items[i].classList.remove("hidden");
        }

        // Clear stop flag
        stop = false;
    }
}

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

function begin()
{
    var intervalArray = getIntervals();

    var hasBegun = false;
    var interval, intervalStart, intervalEnd;

    setRunning(true);
    var loop = setInterval(function() {
        if (!stop && (hasBegun == true || intervalArray.length > 0))
        {
            // It has begun
            if (hasBegun == false)
            {
                hasBegun = true;
                interval = intervalArray.shift();
                intervalStart = (new Date()).getTime();
                intervalEnd = intervalStart +
                            interval.minutes * 60 * 1000 +
                            interval.seconds * 1000;
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
                beep.play();
                incrementSelection();
                hasBegun = false;
            }
        }
        else
        {
            // When we run out of intervals, stop
            updateTime(new Date(0));
            clearInterval(loop);
            setRunning(false);
        }
    }, 10)
}

document.getElementById("add-interval").onclick = function() {
    var newInterval = prompt("Enter your new interval");
    var ul = document.getElementById("intervals");
    var li = document.createElement("li");
    li.innerHTML = newInterval + "<span class=\"remove\">x</span>";
    ul.appendChild(li);
};

document.getElementById("start").onclick = function() { begin() };
document.getElementById("stop").onclick = function() {
    //TODO: stop
    stop = true;
};

var intervalList = document.getElementById("intervals");
var sortable = new Sortable(intervalList, {
    animation: 150,
    filter: ".remove",
    onFilter: function (evt) {
        var el = sortable.closest(evt.item);
        el && el.parentNode.removeChild(el);
    }
});
