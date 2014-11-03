var beep = new Audio('beep.wav');
var stop = false
var pause = false

function Interval(m, s)
{
    this.minutes = m;
    this.seconds = s;
}

function storeIntervals()
{
    //alert("Storing");
    var intervals = getIntervalStrings();
    var list = intervals.join("-");
    localStorage["interval_list"] = list;
}

function restoreIntervals()
{
    var list = localStorage["interval_list"];
    intervals = list.split("-");
    for (var i = 0 ; i < intervals.length ; i++)
        addInterval(intervals[i]);
}

function addInterval(intervalString)
{
    var ul = document.getElementById("intervals");
    var li = document.createElement("li");
    li.innerHTML = intervalString + "<span class=\"remove\">x</span>";
    ul.appendChild(li);
}

function parseInterval(str)
{
    var min = str.split(":")[0];
    var sec = str.split(":")[1];
    return new Interval(parseInt(min), parseInt(sec));
}

function getIntervalStrings()
{
    var items = document.getElementsByTagName("li");
    var arr = [];
    for (var i = 0 ; i < items.length ; i++)
    {
        arr.push(items[i].firstChild.textContent);
    }
    return arr;
}
function getIntervals()
{
    var items = document.getElementsByTagName("li");
    var arr = [];
    for (var i = 0 ; i < items.length ; i++)
    {
        arr.push(parseInterval(items[i].firstChild.textContent));
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

        // Show stop button
        document.getElementById("start").classList.add("hidden");
        document.getElementById("pause").classList.remove("hidden");
        document.getElementById("resume").classList.add("hidden");
        document.getElementById("stop").classList.remove("hidden");
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

        // Hide stop button
        document.getElementById("start").classList.remove("hidden");
        document.getElementById("pause").classList.add("hidden");
        document.getElementById("resume").classList.add("hidden");
        document.getElementById("stop").classList.add("hidden");
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
    var wasPaused = false;
    var interval, intervalStart, intervalEnd, diff;

    setRunning(true);
    var loop = setInterval(function() {
        if (!pause)
        {
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

                if (wasPaused)
                {
                    wasPaused = false;
                    intervalEnd = (new Date()).getTime() + diff;
                }

                var date = new Date();
                diff = intervalEnd - date.getTime();
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
        }
        else
        {
            wasPaused = true;
        }
    }, 10)
}

document.getElementById("add-interval").onclick = function() {
    var newInterval = prompt("Enter your new interval");
    addInterval(newInterval);
    storeIntervals();
};

document.getElementById("start").onclick = function() { begin() };
document.getElementById("pause").onclick = function() {
    document.getElementById("pause").classList.add("hidden");
    document.getElementById("resume").classList.remove("hidden");
    pause = true
};
document.getElementById("resume").onclick = function() {
    document.getElementById("pause").classList.remove("hidden");
    document.getElementById("resume").classList.add("hidden");
    pause = false;
};
document.getElementById("stop").onclick = function() { pause = false; stop = true };

var intervalList = document.getElementById("intervals");
var sortable = new Sortable(intervalList, {
    animation: 150,
    filter: ".remove",
    onFilter: function (evt) {
        var el = sortable.closest(evt.item);
        el && el.parentNode.removeChild(el);
        storeIntervals();
    }
});

restoreIntervals();
