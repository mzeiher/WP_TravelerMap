/**
 *  Copyright (C) 2014 bitschubser.org
 *
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to 
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 *  THE SOFTWARE.
 */
(function($) {
    $(document).ready(function() {
        
        var tm_thumbnailIcon = L.Icon.extend({
            options: {
                iconSize:     [50, 50],
                iconAnchor:   [25, 25],
                popupAnchor:  [0, -25]
            }
        });

        var tm_mapSymbols = L.Icon.extend({
            options: {
                iconSize:     [32, 37],
                iconAnchor:   [16, 35],
                popupAnchor:  [0, -35]
            }
        });


        function tm_loadMap(data ,element, options) {
            return new tm_map(data, element, options);
        }

        function tm_map(data, element, options) {
            
            var _map = null;
            var _markerInfoMapping = {};
            var _mapNameMapping = {};
            var _lastMapPoint = null;
            var _mapOptions = {
                connectMaps : false,
                height: 400,
                spinner: true,
                dateFormat: "dd.MM.yyyy",
                zoomLevel: 3
            };
            
            var _currentMap = null;
            var _currentInfo = -1;
            
            var _wrapper = $('<div class="tm_map_wrapper"></div>');
            var _mapWrapper = $('<div class="tm_map"></div>');
            var _infoWrapper = $('<div class="tm_map_info"></div>');
            
            $.extend(_mapOptions, options);

            if(typeof data === 'string') {
                data = JSON.parse(data);
            }
            if(!$.isArray(data)) {
                data = [data];
            }

            function _createMap(data, element) {
                if(!element) {
                    element = $('#tm_map_' + data.mapid);
                }
                if(!element) return;
                
                _wrapper.append(_mapWrapper);
                _wrapper.append(_infoWrapper);
                
                element.append(_wrapper);
                
                if(_mapOptions.height) {
                    _mapWrapper.css('height', _mapOptions.height + "px");
                }
                
                _map = L.map(_mapWrapper[0]).setView([0,0], _mapOptions.zoomLevel);;
                _map.on('popupopen', function(e) {
                    var px = _map.project(e.popup._latlng);
                    px.y -= e.popup._container.clientHeight/2;
                    _map.panTo(_map.unproject(px),{animate: true});
                });
                var baseMaps = {};
                for(var i = 0; i < data.length; i++) {
                    $.extend(baseMaps, _createBaseMapLayer(data[i]));
                }
                var overlayMaps = {};
                for(var i = 0; i < data.length; i++) {
                    $.extend(overlayMaps, _createOverlayLayer(data[i]));
                }
                for(baseMap in baseMaps) {
                    _map.addLayer(baseMaps[baseMap]);
                    break;
                }
                
                var firstMap = null;
                for(var i = 0; i < data.length; i++) {

                    var routeLayer = _createRouteLayer(data[i].data, data[i].lineColor);
                    var markerLayer = _createMarker(data[i].data, data[i].lineColor);

                    var mapLayer = L.layerGroup([routeLayer, markerLayer]);
                    if(!data[i].name) {
                        data[i]['name'] = "Map";
                    }
                    if(!firstMap) {
                        firstMap = data[i].name;
                    }
                    overlayMaps[data[i].name] = mapLayer;
                }
                for(overlayMap in overlayMaps) {
                    _map.addLayer(overlayMaps[overlayMap]);
                }

                L.control.layers(baseMaps, overlayMaps).addTo(_map);
                
                if(_mapOptions.spinner) {
                    _createMarkerInfoMapping(data);
                    _createInfoPanel();
                    window.setTimeout(function() {
                        _showMap(firstMap);
                    }, 500);
                } else {
                    if(data[0] && data[0].data && data[0].data[0]) {
                        if(data[0].data[0]._lf_object) {
                            window.setTimeout(function() {
                                data[0].data[0]._lf_object.openPopup();
                            }, 500);
                        }
                    }
                }
            }
            
            function _createBaseMapLayer(data) {
                var basemaps = {};
                var hasBasemap = false;
                if(data.properties && data.properties.layer) {
                    for(var i = 0; i < data.properties.layer.length; i++) {
                        try {
                            var layer = L.tileLayer.provider(data.properties.layer[i]);
                            if(layer) {
                                basemaps[data.properties.layer[i]]=layer;
                            }
                            hasBasemap = true;
                        } catch(e) {}
                    }
                }
                if(!hasBasemap) {
                    var layer = L.tileLayer.provider("OpenStreetMap.Mapnik");
                    basemaps["OpenStreetMap.Mapnik"]=layer;
                }
                return basemaps;
            }
            
            function _createOverlayLayer(data) {
                var overlays = {};
                if(data.properties && data.properties.overlays) {
                    for(var i = 0; i < data.properties.overlays.length; i++) {
                        try {
                            var layer = L.tileLayer.provider(data.properties.overlays[i]);
                            if(layer) {
                                overlays[data.properties.overlays[i]]=layer;
                            }
                        } catch(e) {}
                    }
                }
                return overlays;
            }
            
            function _createRouteLayer(data /* array */, lineColor) {
                var group = L.layerGroup([]);
                if(!data && data.length === 0) return group;
                if(!lineColor) {
                    lineColor = "#03f";
                }
                var isInFuture = false;
                var switchToFutureLine = false;
                var isInSection = false;
                var currentLine = L.geodesicPolyline([], {color:lineColor});
                if(_mapOptions.connectMaps && _lastMapPoint) {
                    currentLine.addLatLng([_lastMapPoint.lat, _lastMapPoint.lng]);
                }
                var lastPoint = null;
                for(var i = 0; i < data.length; i++) {
                    var feature = data[i];
                    if((feature.type === 'waypoint' || feature.type === 'marker'|| feature.type === 'media' || feature.type === 'post') && !feature.excludeFromPath) {
                        currentLine.addLatLng([feature.lat, feature.lng]);
                        var nextPoint = _findNextWaypointMarker(data,i+1);
                        if(nextPoint) {
                            if(nextPoint.arrival && nextPoint.arrival >= new Date().getTime()) {
                                isInFuture = true;
                            }
                        }
                        if(isInFuture && !isInSection && !switchToFutureLine) {
                            switchToFutureLine = true;
                            group.addLayer(currentLine);
                            currentLine = L.geodesicPolyline([], {color:lineColor});
                            currentLine.addLatLng([feature.lat, feature.lng]); //add as starting point
                        }
                        lastPoint = feature;
                        _lastMapPoint = feature;
                    } else if(feature.type === 'startsection') {
                        currentLine.addLatLng([feature.lat, feature.lng]);
                        group.addLayer(currentLine);
                        currentLine = L.geodesicPolyline([], {color:lineColor});
                        currentLine.on('mouseover', function(evt) {
                            evt.target.setStyle({opacity: 1});
                        });
                        currentLine.on('mouseout', function(evt) {
                            evt.target.setStyle({opacity: 0.5});
                        });
                        currentLine.on('popupopen', function(evt) {
                            evt.target.setStyle({opacity: 1});
                        });
                        currentLine.on('popupclose', function(evt) {
                            evt.target.setStyle({opacity: 0.5});
                        });
                        currentLine.bindPopup(feature.title);
                        currentLine['tm_data'] = feature;
                        feature['_lf_object'] = currentLine;
                        currentLine.addLatLng([feature.lat, feature.lng]);
                        isInSection = true;
                        var nextPoint = _findNextWaypointMarker(data,i+1);
                        if(nextPoint) {
                            if(nextPoint.arrival && nextPoint.arrival >= new Date().getTime()) {
                                isInFuture = true;
                            }
                        }
                    } else if(feature.type === 'endsection') {
                        //var nextPoint = findNextWaypointMarker(data,i);
                        currentLine.addLatLng([feature.lat, feature.lng]);
                        group.addLayer(currentLine);
                        currentLine = L.geodesicPolyline([],{color:lineColor});
                        currentLine.addLatLng([feature.lat, feature.lng]); //add as starting point
                        isInSection = false;
                        var nextPoint = _findNextWaypointMarker(data,i+1);
                        if(nextPoint) {
                            if(nextPoint.arrival && nextPoint.arrival >= new Date().getTime()) {
                                isInFuture = true;
                            }
                        }
                    } else if(feature.type === 'startendsection') {
                        currentLine.addLatLng([feature.lat, feature.lng]);
                        group.addLayer(currentLine);
                        currentLine = L.geodesicPolyline([],{color:lineColor});
                        currentLine.on('mouseover', function(evt) {
                            evt.target.setStyle({opacity: 1});
                        });
                        currentLine.on('mouseout', function(evt) {
                            evt.target.setStyle({opacity: 0.5});
                        });
                        currentLine.on('popupopen', function(evt) {
                            evt.target.setStyle({opacity: 1});
                        });
                        currentLine.on('popupclose', function(evt) {
                            evt.target.setStyle({opacity: 0.5});
                        });
                        currentLine.bindPopup(feature.title);
                        currentLine['tm_data'] = feature;
                        feature['_lf_object'] = currentLine;
                        currentLine.addLatLng([feature.lat, feature.lng]); //add as starting point
                        var nextPoint = _findNextWaypointMarker(data,i+1);
                        if(nextPoint) {
                            if(nextPoint.arrival && nextPoint.arrival >= new Date().getTime()) {
                                isInFuture = true;
                            }
                        }
                    }
                    
                    if(isInFuture) {
                        currentLine.setStyle({dashArray: "5, 10"});
                    }
                }
                group.addLayer(currentLine);
                return group;
            }
            
            function _findStartSection(data, start) {
                for(var i = start; i >= 0; i--) {
                    if(data[i].type === 'startsection' || data[i].type === 'startendsection') {
                        return data[i];
                    }
                }
                return null;
            }

            function _findEndSection(data, start) {
                for(var i = start; i < data.length; i++) {
                    if(data[i].type === 'startendsection' || data[i].type === 'endsection') {
                        return data[i];
                    }
                }
                return null;
            }

            function _findNextWaypointMarker(data, start) {
                for(var i = start; i < data.length; i++) {
                    if((data[i].type === "waypoint" || data[i].type === "startsection" || data[i].type === "startendsection" || data[i].type === "endsection" || data[i].type==='marker' || data[i].type === 'media' || data[i].type === 'post') && !data[i].excludeFromPath) {
                        return data[i];
                    }
                }
                return null;
            }
            
            function _createMarker(data, lineColor) {
                var markerLayer = L.layerGroup([]);
                if(!data && data.length === 0) return markerLayer;
                if(!lineColor) {
                    lineColor = "#03f";
                }
                for(var i = 0; i < data.length; i++) {
                    var feature = data[i];
                    if(feature.type === 'waypoint' || feature.type === 'startsection' || feature.type === 'endsection' || feature.type === 'startendsection') {
                        var wp = null;
                        if(feature.icon === '_none') continue;
                        if(feature.icon === '_thumbnail' && feature.thumbnail) {
                            var icon = new tm_thumbnailIcon({
                                iconUrl: feature.thumbnail
                            });
                            wp = L.marker([feature.lat, feature.lng], {icon:icon});
                        } else if(feature.icon === '_mapsymbols' && feature.mapsymbols) {
                            var icon = new tm_mapSymbols({
                                iconUrl: feature.mapsymbols
                            });
                            wp = L.marker([feature.lat, feature.lng], {icon:icon});
                        } else if(feature.icon.charAt(0) !== "_") {
                            iconName = feature.icon;
                            if(!iconName) {
                                iconName="circle";
                            }

                            var icon = L.AwesomeMarkers.icon({
                                icon: iconName,
                                markerColor: feature.iconColor,
                                prefix: 'fa'
                            });
                            wp = L.marker([feature.lat, feature.lng], {icon:icon});
                        } else {
                            feature.icon = "_default";
                        }
                        if(feature.icon === '_default' || feature.icon === '_dot') {
                            wp = L.circleMarker([feature.lat, feature.lng], {radius: 5, fillOpacity:1, color:lineColor});
                        }
                        if(feature.title) {
                            wp.bindPopup(feature.title)
                        }
                        if(feature.title && feature.type === 'waypoint') {
                            wp['tm_data'] = feature;
                            feature['_lf_object'] = wp;
                        }
                        markerLayer.addLayer(wp);
                    } else if(feature.type === 'marker' || feature.type === 'media' || feature.type === 'post') {
                        var iconName = 'circle';
                        if(iconName === '_none') feature.icon = '_default';
                        if(feature.icon === '_thumbnail' && !feature.thumbnail) {
                            feature.icon === '_default';
                        }
                        if(feature.icon === '_mapsymbols' && !feature.mapsymbols) {
                            feature.icon === '_default';
                        }
                        if(feature.icon === '_default') {
                            if(!iconName) {
                                iconName="circle";
                            }
                        } else {
                            iconName = feature.icon;
                        }
                        var popupElement = feature.title;
                        if(feature.type === 'media') {
                            var pop = $('<div><a class="tm_popup" href="'+feature.fullsize+'" title="'+feature.title+'"><img src="'+feature.thumbnail+'" /></a><div>'+feature.title+'</div></div>');
                            pop.find('a').colorbox({maxWidth:'95%', maxHeight:'95%'});
                            popupElement = pop[0];
                        }
                        var marker = null;
                        if(feature.icon === '_dot') {
                            marker = L.circleMarker([feature.lat, feature.lng], {radius: 5, fillOpacity:1, color:lineColor});
                        } else if(feature.icon === '_thumbnail') {
                            var icon = new tm_thumbnailIcon({
                                iconUrl: feature.thumbnail
                            });
                            marker = L.marker([feature.lat, feature.lng], {icon:icon});
                        } else if(feature.icon === '_mapsymbols') {
                            var icon = new tm_mapSymbols({
                                iconUrl: feature.mapsymbols
                            });
                            marker = L.marker([feature.lat, feature.lng], {icon:icon});
                        } else {
                            var icon = L.AwesomeMarkers.icon({
                                icon: iconName,
                                markerColor: feature.iconColor,
                                prefix: 'fa'
                            });
                            marker = L.marker([feature.lat, feature.lng], {icon:icon})
                        }
                        marker.bindPopup(popupElement);
                        marker['tm_data'] = feature;
                        feature['_lf_object'] = marker;
                        markerLayer.addLayer(marker);
                    }
                }
                return markerLayer;
            }
            
            function _createMarkerInfo(feature, data, position) {
                var wrapper = $('<li class="tm_marker_info_entry" style="display:none;"></li>');
                if(feature.thumbnail) {
                    var img = $('<div class="tm_marker_info_image"><a class="fancybox" href="'+feature.fullsize+'" title="'+feature.title+'"><img src="'+feature.thumbnail+'" /></a></div>');
                    img.find('a').colorbox({maxWidth:'95%', maxHeight:'95%'});
                    wrapper.append(img);
                }
                var dateInfo = '<span>';
                if(feature.type === 'startsection' || feature.type === 'startendsection') {
                    var end = _findEndSection(data, position+1);
                    if(feature.departure) {
                        dateInfo += "Start: " + $.format.date(feature.departure, _mapOptions.dateFormat) + ' | ';
                    } else if(feature.arrival) {
                        dateInfo += "Start: " + $.format.date(feature.arrival, _mapOptions.dateFormat) + ' | ';
                    }
                    if(end && end.arrival) {
                        dateInfo += "End: " + $.format.date(end.arrival, _mapOptions.dateFormat) + ' | ';
                    } else if(end && end.departure) {
                        dateInfo += "End: " + $.format.date(end.departure, _mapOptions.dateFormat) + ' | ';
                    }
                } else {
                    if(feature.date) {
                        dateInfo += 'Date: ' + $.format.date(feature.date, _mapOptions.dateFormat) + ' | ';
                    }
                    if(feature.arrival) {
                        dateInfo += 'Arrival: ' + $.format.date(feature.arrival, _mapOptions.dateFormat) + ' | ';
                    }
                    if(feature.departure) {
                        dateInfo += 'Departure: ' + $.format.date(feature.departure, _mapOptions.dateFormat) + ' | ';
                    }
                }
                dateInfo += '</span>';
                var info = $('<div class="tm_marker_info"><h2><a href="'+feature.link+'">'+ feature.title+'</a>'+dateInfo+'</h2><p>'+feature.description+'</p></div>');
                wrapper.append(info);
                return wrapper;
            }

            function _createMarkerInfoMapping(data) {
                if(!$.isArray(data)) {
                    data = [data];
                } 
                for(var i = 0; i < data.length; i++) {
                    if(!data[i].data && data[i].data.length === 0) continue;
                    _markerInfoMapping[data[i].name] = [];
                    for(var j = 0; j < data[i].data.length; j++) {
                        var feature = data[i].data[j];
                        if(feature.type === 'endsection' || (feature.type === 'waypoint' && !feature._lf_object) ) continue;
                        var markerInfo = _createMarkerInfo(feature, data[i].data, j);
                        _markerInfoMapping[data[i].name].push({marker: feature._lf_object, info: markerInfo});
                        if(feature._lf_object) {
                            feature._lf_object.on('click', function(evt) {
                                _findMarker(evt.target); 
                            });
                        }
                    }
                }
                
            }
            
            function _createInfoPanel() {
                var mapWrapper = $('<div class="tm_marker_map_wrapper"></div>');
                var infoWrapper = $('<div class="tm_marker_info_wrapper"></div>');
                
                _infoWrapper.append(mapWrapper);
                _infoWrapper.append(infoWrapper);
                
                var prevMapBut = $('<a href=""><i class="fa fa-angle-left"></i></a>');
                prevMapBut.on('click', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _previousMapClick();
                });
                
                var nextMapBut = $('<a href=""><i class="fa fa-angle-right"></i></a>');
                nextMapBut.on('click', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _nextMapClick();
                });
                
                var mapList = $('<ul class="tm_marker_info_map_list"></ul>');
                for(var map in _markerInfoMapping) {
                    var liEntry = $('<li class="tm_marker_info_map_entry" style="display:none;">'+map+'</li>');
                    _mapNameMapping[map]=liEntry;
                    mapList.append(liEntry);
                }
                
                mapWrapper.append(prevMapBut);
                mapWrapper.append(mapList);
                mapWrapper.append(nextMapBut);
                
                var prevInfoBut = $('<a href=""><i class="fa fa-angle-left"></i></a>');
                prevInfoBut.on('click', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _previousInfoClick();
                });
                var nextInfoBut = $('<a href=""><i class="fa fa-angle-right"></i></a>');
                nextInfoBut.on('click', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _nextInfoClick();
                });
                
                var infoList = $('<ul class="tm_marker_info_list"></ul>');
                infoWrapper.append(prevInfoBut);
                infoWrapper.append(infoList);
                infoWrapper.append(nextInfoBut);
                
                var nbrmaps = 0;
                for(var map in _markerInfoMapping) {
                    var minfomap = _markerInfoMapping[map];
                    for(var i = 0; i < minfomap.length; i++) {
                        infoList.append(minfomap[i].info);
                    }
                    nbrmaps++;
                }
                if(nbrmaps === 1) {
                    mapWrapper.css('display', 'none');
                }
            }
            
            function _nextInfoClick() {
                _showInfo(_currentInfo + 1);
            }
            
            function _previousInfoClick() {
                _showInfo(_currentInfo - 1);
            }
            
            function _nextMapClick() {
                _showMap(_getNextMap());
            }
            
            function _getNextMap() {
                var first = null;
                var next = null;
                var hasCurrent = false;
                for(var map in _markerInfoMapping) {
                    if(!first) {
                        first = map;
                    }
                    if(hasCurrent) {
                        next = map;
                        break;
                    }
                    if(_markerInfoMapping[map] === _currentMap) {
                        hasCurrent = true;
                    }
                    
                }
                if(!next) {
                    return first;
                } else {
                    return next;
                }
            }
            
            function _previousMapClick() {
                _showMap(_getPreviousMap());
            }
            
            function _getPreviousMap() {
                var last = null;
                var previous = null;
                var counter = 0;
                for(var map in _markerInfoMapping) {
                    last = map;
                    if(_markerInfoMapping[map] === _currentMap && counter !== 0) {
                        break;
                    }
                    previous = map;
                    counter++;
                }
                if(!previous) {
                    return last;
                } else {
                    return previous;
                }
            }
            
            function _showMap(name) {
                if(_markerInfoMapping[name] !== _currentMap) {
                    if(_currentMap && _currentMap[_currentInfo]) {
                        _currentMap[_currentInfo].info.css('display', 'none');
                        _currentMap[_currentInfo].marker.closePopup();
                    }
                    _currentMap = _markerInfoMapping[name];
                    for(var mapname in _markerInfoMapping) {
                        _mapNameMapping[mapname].css('display', 'none');
                    }
                    _mapNameMapping[name].css('display', '');
                    _currentInfo = -1;
                    _showInfo(0);
                }
            }
            
            function _findMarker(marker) {
                for(var mapname in _markerInfoMapping) {
                    for(var i = 0; i < _markerInfoMapping[mapname].length; i++) {
                        if(_markerInfoMapping[mapname][i].marker === marker) {
                            _showMap(mapname);
                            _showInfo(i);
                            return;
                        }
                    }
                }
            }
            
            function _showInfo(id) {
                if(!_currentMap) return;
                if(_currentInfo !== id) {
                    if(_currentMap.length === 0) return;
                    if(id >= _currentMap.length) {
                        if(_mapOptions.connectMaps) {
                            _showMap(_getNextMap());
                            return;
                        } else {
                            id = 0;
                        }
                    } else if(id < 0) {
                        if(_mapOptions.connectMaps) {
                            _showMap(_getPreviousMap());
                            id = _currentMap.length -1;
                        } else {
                            id = _currentMap.length -1;
                        }
                    }
                    if(id < 0) return;
                    if(_currentMap && _currentMap[_currentInfo]) {
                        _currentMap[_currentInfo].info.css('display', 'none');
                        _currentMap[_currentInfo].marker.closePopup();
                    }
                    _currentInfo = id;
                    _currentMap[_currentInfo].info.css('display', '');
                    _currentMap[_currentInfo].marker.openPopup();
                }
            }
            
            this.destroy = function() {
                _map.remove();
            };

            _createMap(data,element);
        }
        window.tm_loadFrontendMap = tm_loadMap;
    });
})(jQuery);
