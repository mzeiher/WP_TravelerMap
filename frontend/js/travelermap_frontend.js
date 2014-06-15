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
        
        function tm_loadMap(data ,element) {
            return new tm_map(data, element);
        }

        function tm_map(data, element) {

            var map = null;
            var markerInfoMapping = [];

            if(typeof data === 'string') {
                data = JSON.parse(data);
            }
            if(!$.isArray(data)) {
                data = [data];
            }

            function createMap(data, element) {
                if(element) {
                    map = L.map($(element)[0]).setView([0,0], 3);;
                } else {
                    map = L.map('tm_map_' + data.mapid).setView([0,0], 3);;    
                }
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

                //createMarkerInfoMapping(data.data);
                console.log('');
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
                var currentLine = L.polyline([], {color:lineColor});
                var lastPoint = null;
                for(var i = 0; i < data.length; i++) {
                    var feature = data[i];
                    if((feature.type === 'waypoint' || feature.type === 'marker'|| feature.type === 'media' || feature.type === 'post') && !feature.excludeFromPath) {
                        currentLine.addLatLng([feature.lat, feature.lng]);
                        if(feature.arrival && feature.arrival >= new Date().getTime()) {
                            isInFuture = true;
                        }
                    } else if(feature.type === 'startsection') {
                        var nextPoint = findNextWaypointMarker(data,i);
                        if(nextPoint !== null) {
                            currentLine.addLatLng([nextPoint.lat, nextPoint.lng]);    
                        }
                        group.addLayer(currentLine);
                        currentLine = L.polyline([], {color:'black'});
                        if(nextPoint !== null) {
                            currentLine.addLatLng([nextPoint.lat, nextPoint.lng]); //add as starting point
                        }
                    } else if(feature.type === 'endsection') {
                        //var nextPoint = findNextWaypointMarker(data,i);
                        currentLine.addLatLng([lastPoint.lat, lastPoint.lng]);
                        currentLine.bindPopup(feature.title);
                        currentLine['tm_data'] = feature;
                        group.addLayer(currentLine);
                        feature['_lf_object'] = currentLine;
                        currentLine = L.polyline([],{color:lineColor});
                        currentLine.addLatLng([lastPoint.lat, lastPoint.lng]); //add as starting point
                    }
                    lastPoint = feature;
                    if(isInFuture) {
                        currentLine.setStyle({dashArray: "5, 10"});
                    }
                }
                group.addLayer(currentLine);
                return group;
            }
            
            function findNextWaypointMarker(data, start) {
                for(var i = start; i < data.length; i++) {
                    if((data[i].type === "waypoint" || data[i].type==='marker' || feature.type === 'media' || feature.type === 'post') && !data[i].type.excludeFromPath) {
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
                        var marker = L.marker([feature.lat, feature.lng], {icon:icon}).bindPopup(feature.title);
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
                var wrapper = $('<div class="tm_marker_info_wrapper" style="display:none;"></div>');
                if(feature.thumbnail) {
                    var img = $('<div class="tm_marker_info_image"><img src="'+feature.thumbnail+'" /></div>');
                    wrapper.append(img);
                }
                var info = $('<div class="tm_marker_info"><h1>'+ feature.title+'</h1><p>'+feature.description+'</p></div>');
                wrapper.append(info);
                return wrapper;
            }

            function createMarkerInfoMapping(data) {
                if(!data && data.length === 0) return;
                for(var i = 0; i < data.length; i++) {
                    var feature = data[i];
                    if(feature.type === 'startsection') continue;
                    var markerInfo = createMarkerInfo(feature);
                    markerInfoMapping.push({marker: feature._lf_object, info: markerInfo});
                }
            }
            
            this.destroy = function() {
                map.remove();
            }

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
