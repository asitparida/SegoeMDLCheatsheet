var jsonfile = require('jsonfile');
var _ = require('underscore-node');
var fs = require("fs");

String.prototype.lowerFirstLetter = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

jsonfile.readFile('source.json', function (err, obj) {
    morphJSON(obj);
});

function morphJSON(objects) {
    var icons = [];
    for (var i = 0, max = objects.length; i < max; i++) {
        var _hex = objects[i].hex;
        var _name = objects[i].name;
        var _keyWords = objects[i].keywords.split(',');
        var _isLang = _.contains(_keyWords, 'language');
        var _isDup = _.contains(_keyWords, 'duplicate');
        icons.push({ hex: _hex, name: _name, keywords: _keyWords, isLang: _isLang, isDup: _isDup });
    }
    var hexRegex = /E(.*?)$/;
    _.each(icons, function (icon) {
        if (icon.name == '') {
            var _keyWords = icon.keywords;
            _keyWords = _.reject(_keyWords, function (key) { return key == 'language' || key == 'duplicate' });
            icon.keywords = _keyWords;
            if (icon.keywords.length == 0) {
                var _hex = hexRegex.exec(icon.hex)[1];
                icon.name = 'glyph-' + _hex;
            }
            else {
                icon.name = icon.keywords[0];
            }
        }
        icon.name = icon.name.lowerFirstLetter();
    });
    icons = _.sortBy(icons, 'name');
    var _uniqueNames = _.uniq(icons, function (icon) { return icon.name });
    if (_uniqueNames.length < icons.length) {
        var _countByNames = _.countBy(icons, function (icon) {
            return icon.name
        });
        for (var prop in _countByNames) {
            if (_countByNames[prop] > 1) {
                _.each(icons, function (icon) {
                    if (icon.name == prop) {
                        icon.name = icon.name + '-' + hexRegex.exec(icon.hex)[1];
                    }
                });
            }
        }
    }
    icons = _.sortBy(icons, 'name');
    jsonfile.writeFile('modified.json', icons, function (err) {
        console.error(err)
    });
    writeToSCSSFile(icons);
}

function writeToSCSSFile(icons) {
    var _iconsAllTmpl = '.icon { font-family: "SegoeMDL"; font-weight: normal; font-style: normal; position: relative; top: 1px; display: inline-block; line-height: 1; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; ICONS_SCSS_ALL }';
    var _txt = '';
    _.each(icons, function (icon) {
        var _iconTmpl = '&.icon-SCSSICONNAME:before { /* KEYWORDS - SCSSKEYWORDS */ content: "\\SCSSICONCOCDE"; }';
        var _comment = '';
        if (icon.isLang == true)
            _comment = _comment + 'LANG ';
        if (icon.isDup == true)
            _comment = _comment + 'DUP ';
        _comment = _comment + icon.keywords.join(' ');
        _iconTmpl = _iconTmpl.replace('SCSSKEYWORDS', _comment);
        _iconTmpl = _iconTmpl.replace('SCSSICONNAME', icon.name);
        _iconTmpl = _iconTmpl.replace('SCSSICONCOCDE', icon.hex);
        _txt = _txt + _iconTmpl;
    });
    _iconsAllTmpl = _iconsAllTmpl.replace('ICONS_SCSS_ALL', _txt);
    fs.writeFile('segoe-icons.scss', _iconsAllTmpl, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("Data written successfully!");
    });
}