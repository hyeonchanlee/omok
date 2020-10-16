const formatTime = (time) => {
    var h = parseInt(Math.floor(time / 3600), 10);
    var m = parseInt(Math.floor((time % 3600) / 60), 10);
    var s = parseInt(Math.floor(time % 60), 10);

    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;

    if(time >= 3600) {
        return h + ':' + m + ':' + s;
    }
    else {
        return m + ':' + s;
    }
};

export { formatTime };