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

    var loop = setInterval(function() {
        if (hasBegun == true || intervalArray.length > 0)
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
                hasBegun = false;
            }
        }
        else
        {
            // When we run out of intervals, stop
            updateTime(new Date(0));
            clearInterval(loop);
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

var intervalList = document.getElementById("intervals");
var sortable = new Sortable(intervalList, {
    animation: 150,
    filter: ".remove",
    onFilter: function (evt) {
        var el = sortable.closest(evt.item);
        el && el.parentNode.removeChild(el);
    }
});
