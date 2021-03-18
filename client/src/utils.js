
export function getParteiColor(name) {
    switch (name) {
        case "CSU": return "#008AC5";
        case "CDU": return "#000000";
        case "GRÜNE": return "#64A12D";
        case "FREIE WÄHLER": return "#2F6590";
        case "SPD": return "#EB001F";
        case "AfD": return "#009EE0";
        case "FDP": return "#FFED00";
        case "other": return "#a9a9a9";
        default:
            return getColorForUnknownPartei(name);
    }
}

function getColorForUnknownPartei(name) {
    function hashCode(s) {
        for (var i = 0, h = 0; i < s.length; i++)
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;
        return h;
    }

    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor((hashCode(name) * (2 * i + 3)) % 16)];
    }
    return color;
}


