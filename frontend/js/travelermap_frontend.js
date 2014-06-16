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
        
        function tm_loadMap(data ,element, options) {
            return new tm_map(data, element, options);
        }

        function tm_map(data, element, options) {
            
            var map = null;
            var markerInfoMapping = {};
            var mapNameMapping = {};
            var lastMapPoint = null;
            var mapOptions = {
                connectMaps : false,
                height: 400,
                spinner: true
            };
            
            var currentMap = -1;
            var currentInfo = -1;
            
            var wrapper = $('<div class="tm_map_wrapper"></div>');
            var mapWrapper = $('<div class="tm_map"></div>');
            var infoWrapper = $('<div class="tm_map_info"></div>');
            
            $.extend(mapOptions, options);

            if(typeof data === 'string') {
                data = JSON.parse(data);
            }
            if(!$.isArray(data)) {
                data = [data];
            }

            function createMap(data, element) {
                if(!element) {
                    element = $('#tm_map_' + data.mapid);
                }
                if(!element) return;
                
                wrapper.append(mapWrapper);
                wrapper.append(infoWrapper);
                
                element.append(wrapper);
                
                if(mapOptions.height) {
                    mapWrapper.css('height', mapOptions.height + "px");
                }
                
                map = L.map(mapWrapper[0]).setView([0,0], 3);;
                map.on('popupopen', function(e) {
                    var px = map.project(e.popup._latlng);
                    px.y -= e.popup._container.clientHeight/2;
                    map.panTo(map.unproject(px),{animate: true});
                });
                var baseMaps = {};
                for(var i = 0; i < data.length; i++) {
                    $.extend(baseMaps, createBaseMapLayer(data[i]));
                }
                var overlayMaps = {};
                for(var i = 0; i < data.length; i++) {
                    $.extend(overlayMaps, createOverlayLayer(data[i]));
                }
                for(baseMap in baseMaps) {
                    map.addLayer(baseMaps[baseMap]);
                }
                
                for(var i = 0; i < data.length; i++) {

                    var routeLayer = createRouteLayer(data[i].data, data[i].lineColor);
                    var markerLayer = createMarker(data[i].data);

                    var mapLayer = L.layerGroup([routeLayer, markerLayer]);
                    if(!data[i].name) {
                        data[i]['name'] = "Map";
                    }
                    overlayMaps[data[i].name] = mapLayer;
                }
                for(overlayMap in overlayMaps) {
                    map.addLayer(overlayMaps[overlayMap]);
                }

                L.control.layers(baseMaps, overlayMaps).addTo(map);
                
                if(mapOptions.spinner) {
                    createMarkerInfoMapping(data);
                    createInfoPanel();
                }
            }
            
            function createBaseMapLayer(data) {
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
            
            function createOverlayLayer(data) {
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
            
            function createRouteLayer(data /* array */, lineColor) {
                var group = L.layerGroup([]);
                if(!data && data.length === 0) return group;
                if(!lineColor) {
                    lineColor = "#03f";
                }
                var isInFuture = false;
                var switchToFutureLine = false;
                var isInSection = false;
                var currentLine = L.polyline([], {color:lineColor});
                if(mapOptions.connectMaps && lastMapPoint) {
                    currentLine.addLatLng([lastMapPoint.lat, lastMapPoint.lng]);
                }
                var lastPoint = null;
                for(var i = 0; i < data.length; i++) {
                    var feature = data[i];
                    if((feature.type === 'waypoint' || feature.type === 'marker'|| feature.type === 'media' || feature.type === 'post') && !feature.excludeFromPath) {
                        currentLine.addLatLng([feature.lat, feature.lng]);
                        if(feature.arrival && feature.arrival >= new Date().getTime()) {
                            isInFuture = true;
                        }
                        if(isInFuture && !isInSection && !switchToFutureLine) {
                            switchToFutureLine = true;
                            var nextPoint = findNextWaypointMarker(data,i);
                            if(nextPoint !== null) {
                                currentLine.addLatLng([nextPoint.lat, nextPoint.lng]);    
                            }
                            group.addLayer(currentLine);
                            currentLine = L.polyline([], {color:lineColor});
                            if(nextPoint !== null) {
                                currentLine.addLatLng([nextPoint.lat, nextPoint.lng]); //add as starting point
                            }
                        }
                        lastPoint = feature;
                        lastMapPoint = feature;
                    } else if(feature.type === 'startsection') {
                        var nextPoint = findNextWaypointMarker(data,i);
                        if(nextPoint !== null) {
                            currentLine.addLatLng([nextPoint.lat, nextPoint.lng]);    
                        }
                        group.addLayer(currentLine);
                        currentLine = L.polyline([], {color:'black', weight: 5});
                        if(nextPoint !== null) {
                            currentLine.addLatLng([nextPoint.lat, nextPoint.lng]); //add as starting point
                        }
                        isInSection = true;
                    } else if(feature.type === 'endsection') {
                        //var nextPoint = findNextWaypointMarker(data,i);
                        currentLine.addLatLng([lastPoint.lat, lastPoint.lng]);
                        currentLine.bindPopup(feature.title);
                        currentLine['tm_data'] = feature;
                        group.addLayer(currentLine);
                        feature['_lf_object'] = currentLine;
                        currentLine = L.polyline([],{color:lineColor});
                        currentLine.addLatLng([lastPoint.lat, lastPoint.lng]); //add as starting point
                        isInSection = false;
                    }
                    
                    if(isInFuture) {
                        currentLine.setStyle({dashArray: "5, 10"});
                    }
                }
                group.addLayer(currentLine);
                return group;
            }
            
            function findNextWaypointMarker(data, start) {
                for(var i = start; i < data.length; i++) {
                    if((data[i].type === "waypoint" || data[i].type==='marker' || data[i].type === 'media' || data[i].type === 'post') && !data[i].type.excludeFromPath) {
                        return data[i];
                    }
                }
                return null;
            }
            
            function createMarker(data) {
                var markerLayer = L.layerGroup([]);
                if(!data && data.length === 0) return markerLayer;
                for(var i = 0; i < data.length; i++) {
                    var feature = data[i];
                    if(feature.type === 'waypoint') {
                        var wp = L.circleMarker([feature.lat, feature.lng], {radius: 5}).bindPopup(feature.title);
                        //feature['_lf_object'] = wp;
                        wp['tm_data'] = feature;
                        feature['_lf_object'] = wp;
                        markerLayer.addLayer(wp);
                    } else if(feature.type === 'marker' || feature.type === 'media' || feature.type === 'post') {
                        var iconName = feature.icon;
                        if(!iconName) {
                            iconName="circle";
                        } 
                        var icon = L.AwesomeMarkers.icon({
                            icon: iconName,
                            markerColor: feature.iconColor,
                            prefix: 'fa'
                        });
                        var popupElement = feature.title;
                        if(feature.type === 'media') {
                            var pop = $('<div><a class="tm_popup fancybox" href="'+feature.fullsize+'" title="'+feature.title+'"><img src="'+feature.thumbnail+'" /></a><div>'+feature.title+'</divp></div>');
                            pop.find('a').fancybox();
                            popupElement = pop[0];
                        }
                        var marker = L.marker([feature.lat, feature.lng], {icon:icon}).bindPopup(popupElement);
                        //var marker = L.marker([feature.lat, feature.lng]).bindPopup('<img src="'+feature.thumbnail+'"/>');
                        //feature['_lf_object'] = marker;
                        marker['tm_data'] = feature;
                        feature['_lf_object'] = marker;
                        markerLayer.addLayer(marker);
                    }
                }
                return markerLayer;
            }
            
            function createMarkerInfo(feature) {
                var wrapper = $('<li class="tm_marker_info_entry" style="display:none;"></li>');
                if(feature.thumbnail) {
                    var img = $('<div class="tm_marker_info_image"><a class="fancybox" href="'+feature.fullsize+'" title="'+feature.title+'"><img src="'+feature.thumbnail+'" /></a></div>');
                    img.find('a').fancybox();
                    wrapper.append(img);
                }
                var info = $('<div class="tm_marker_info"><h2><a href="'+feature.link+'">'+ feature.title+'</a><span>'+ (feature.date ? new Date(feature.date).toLocaleDateString() : '') +'</span></h2><p>'+feature.description+'</p></div>');
                wrapper.append(info);
                //infoWrapper.append(wrapper);
                return wrapper;
            }

            function createMarkerInfoMapping(data) {
                if(!$.isArray(data)) {
                    data = [data];
                } 
                for(var i = 0; i < data.length; i++) {
                    if(!data[i].data && data[i].data.length === 0) continue;
                    markerInfoMapping[data[i].name] = [];
                    for(var j = 0; j < data[i].data.length; j++) {
                        var feature = data[i].data[j];
                        if(feature.type === 'startsection') continue;
                        var markerInfo = createMarkerInfo(feature);
                        markerInfoMapping[data[i].name].push({marker: feature._lf_object, info: markerInfo});
                        if(feature._lf_object) {
                            feature._lf_object.on('click', function(evt) {
                                _findMarker(evt.target); 
                            });
                        }
                    }
                }
                
            }
            
            function createInfoPanel() {
                var _mapWrapper = $('<div class="tm_marker_map_wrapper"></div>');
                var _infoWrapper = $('<div class="tm_marker_info_wrapper"></div>');
                
                infoWrapper.append(_mapWrapper);
                infoWrapper.append(_infoWrapper);
                
                var _prevMapBut = $('<a href=""><i class="fa fa-angle-left"></i></a>');
                _prevMapBut.on('click', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _previousMapClick();
                });
                
                var _nextMapBut = $('<a href=""><i class="fa fa-angle-right"></i></a>');
                _nextMapBut.on('click', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _nextMapClick();
                });
                
                var _mapList = $('<ul class="tm_marker_info_map_list"></ul>');
                for(var map in markerInfoMapping) {
                    var liEntry = $('<li class="tm_marker_info_map_entry" style="display:none;">'+map+'</li>');
                    mapNameMapping[map]=liEntry;
                    _mapList.append(liEntry);
                }
                
                _mapWrapper.append(_prevMapBut);
                _mapWrapper.append(_mapList);
                _mapWrapper.append(_nextMapBut);
                
                var _prevInfoBut = $('<a href=""><i class="fa fa-angle-left"></i></a>');
                _prevInfoBut.on('click', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _previousInfoClick();
                });
                var _nextInfoBut = $('<a href=""><i class="fa fa-angle-right"></i></a>');
                _nextInfoBut.on('click', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _nextInfoClick();
                });
                
                var _infoList = $('<ul class="tm_marker_info_list"></ul>');
                _infoWrapper.append(_prevInfoBut);
                _infoWrapper.append(_infoList);
                _infoWrapper.append(_nextInfoBut);
                
                var nbrmaps = 0;
                for(var map in markerInfoMapping) {
                    var minfomap = markerInfoMapping[map];
                    for(var i = 0; i < minfomap.length; i++) {
                        _infoList.append(minfomap[i].info);
                    }
                    nbrmaps++;
                }
                if(nbrmaps === 1) {
                    _mapWrapper.css('display', 'none');
                }
                for(var map in markerInfoMapping) {
                    _showMap(map);
                    return;
                }
            }
            
            function _nextInfoClick() {
                _showInfo(currentInfo + 1);
            }
            
            function _previousInfoClick() {
                _showInfo(currentInfo - 1);
            }
            
            function _nextMapClick() {
                _showMap(_getNextMap());
            }
            
            function _getNextMap() {
                var first = null;
                var next = null;
                var hasCurrent = false;
                for(var map in markerInfoMapping) {
                    if(!first) {
                        first = map;
                    }
                    if(hasCurrent) {
                        next = map;
                        break;
                    }
                    if(markerInfoMapping[map] === currentMap) {
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
                for(var map in markerInfoMapping) {
                    last = map;
                    if(markerInfoMapping[map] === currentMap && counter !== 0) {
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
                if(markerInfoMapping[name] !== currentMap) {
                    if(currentMap && currentMap[currentInfo]) {
                        currentMap[currentInfo].info.css('display', 'none');
                        currentMap[currentInfo].marker.closePopup();
                    }
                    currentMap = markerInfoMapping[name];
                    for(var mapname in markerInfoMapping) {
                        mapNameMapping[mapname].css('display', 'none');
                    }
                    mapNameMapping[name].css('display', '');
                    currentInfo = -1;
                    _showInfo(0);
                }
            }
            
            function _findMarker(marker) {

                for(var mapname in markerInfoMapping) {
                    for(var i = 0; i < markerInfoMapping[mapname].length; i++) {
                        if(markerInfoMapping[mapname][i].marker === marker) {
                            _showMap(mapname);
                            _showInfo(i);
                            return;
                        }
                    }
                }
                console.log(marker);
            }
            
            function _showInfo(id) {
                if(!currentMap) return;
                if(currentInfo !== id) {
                    if(currentMap.length === 0) return;
                    if(id >= currentMap.length) {
                        if(mapOptions.connectMaps) {
                            _showMap(_getNextMap());
                            return;
                        } else {
                            id = 0;
                        }
                    } else if(id < 0) {
                        if(mapOptions.connectMaps) {
                            _showMap(_getPreviousMap());
                            id = currentMap.length -1;
                        } else {
                            id = currentMap.length -1;
                        }
                    }
                    if(id < 0) return;
                    if(currentMap && currentMap[currentInfo]) {
                        currentMap[currentInfo].info.css('display', 'none');
                        currentMap[currentInfo].marker.closePopup();
                    }
                    currentInfo = id;
                    currentMap[currentInfo].info.css('display', '');
                    currentMap[currentInfo].marker.openPopup();
                }
            }
            
            this.destroy = function() {
                map.remove();
            };

            createMap(data,element);
        }
        window.tm_loadFrontendMap = tm_loadMap;

        $('#tm_load').on('click', function() {
           window.tm_loadFrontendMap($('#tm_mapdata').val());
        });
        
        $('#tm_loadTestData').on('click', function() {
           $('#tm_mapdata').val('{"version":"1.0.0","mapid":0,"properties":{"layer":[],"overlays":[]},"data":[{"type":"marker","title":"Start","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":-8.754794702435605,"lng":-59.4140625,"arrival":null,"departure":null},{"type":"waypoint","title":"point","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":-5.7908968128719565,"lng":-27.773437499999996,"arrival":null,"departure":null},{"type":"waypoint","title":"point","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":-12.039320557540572,"lng":3.8671874999999996,"arrival":null,"departure":null},{"type":"waypoint","title":"point","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":-7.18810087117902,"lng":22.148437499999996,"arrival":null,"departure":null},{"type":"waypoint","title":"point","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":12.211180191503997,"lng":23.5546875,"arrival":null,"departure":null},{"type":"waypoint","title":"point","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":16.46769474828897,"lng":-14.414062499999998,"arrival":null,"departure":null},{"type":"marker","title":"End","thumbnail":"","description":"","link":"","excludeFromPath":false,"lat":12.554563528593656,"lng":-48.515625,"arrival":null,"departure":null}]}');
        });
    });
})(jQuery);
