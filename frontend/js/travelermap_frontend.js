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
        
            if(typeof data === 'string') {
                data = JSON.parse(data);
            }
            
            function createMap(data, element) {
                if(element) {
                    map = L.map($(element)[0]).setView([0,0], 3);;
                } else {
                    map = L.map('tm_map_' + data.mapid).setView([0,0], 3);;    
                }
                var baseMaps = createBaseMapLayer(data);
                var overlayMaps = createOverlayLayer(data);
                L.control.layers(baseMaps, overlayMaps).addTo(map);
                for(baseMap in baseMaps) {
                    map.addLayer(baseMaps[baseMap]);
                }
                
                var routeLater = createRouteLayer(data.data);
                map.addLayer(routeLater);
                
                var markerLayer = createMarker(data.data);
                map.addLayer(markerLayer);
                console.log(routeLayer);
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
            
            function createRouteLayer(data /* array */) {
                if(!data && data.length === 0) return null;
                var group = L.layerGroup([]);
                var isInFuture = false;
                var currentLine = L.polyline([]);
                var lastPoint = null;
                for(var i = 0; i < data.length; i++) {
                    var feature = data[i];
                    if((feature.type === 'waypoint' || feature.type === 'marker') && !feature.excludeFromPath) {
                        currentLine.addLatLng([feature.lat, feature.lng]);
                        if(feature.arrival && feature.arrival >= new Date().getTime()) {
                            isInFuture = true;
                        }
                    } else if(feature.type === 'startsection') {
                        var nextPoint = findNextWaypointMarker(data,i);
                        currentLine.addLatLng([nextPoint.lat, nextPoint.lng]);
                        group.addLayer(currentLine);
                        currentLine = L.polyline([], {color:'black'});
                        currentLine.addLatLng([nextPoint.lat, nextPoint.lng]); //add as starting point
                    } else if(feature.type === 'endsection') {
                        //var nextPoint = findNextWaypointMarker(data,i);
                        currentLine.addLatLng([lastPoint.lat, lastPoint.lng]);
                        group.addLayer(currentLine);
                        currentLine = L.polyline([]);
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
                    if((data[i].type === "waypoint" || data[i].type==='marker') && !data[i].type.excludeFromPath) {
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
                        markerLayer.addLayer(wp);
                    } else if(feature.type === 'marker') {
                        var marker = L.marker([feature.lat, feature.lng]).bindPopup(feature.title);
                        markerLayer.addLayer(marker);
                    }
                }
                return markerLayer;
            }
            
            function createWaypoint(data) {
                
            } 
           
            function oldImplementation() {
                var firstLayer = null;

                var baseMaps = {};
                for(var i = 0 ; i < data.properties.layer.length; i++) {
                    var layer = L.tileLayer.provider(data.properties.layer[i]);
                    if(layer) {
                        baseMaps[data.properties.layer[i]] = layer;
                        if(!firstLayer) {
                            firstLayer = layer;
                        }
                    }

                }
                if(firstLayer) {
                    map.addLayer(firstLayer);    
                } else {
                    var firstLayer = L.tileLayer.provider("OpenStreetMap.Mapnik");
                    map.addLayer(firstLayer);
                    baseMaps["OpenStreetMap.Mapnik"] = firstLayer;
                }


                var overlayMaps = {};
                for(var i = 0 ; i < data.properties.overlays.length; i++) {
                    var layer = L.tileLayer.provider(data.properties.overlays[i]);
                    layer.addTo(map);
                    if(layer) {
                        overlayMaps[data.properties.overlays[i]] = layer;
                    }
                }
                L.control.layers(baseMaps, overlayMaps).addTo(map);

                var mapping = [];
                var marker = [];
                var lines = [];
                //var traveledlineList = L.polyline([], {smoothFactor:1, color: 'black', noClip:true, opacity:1, weight:3});
                //var toTravelLineList = L.polyline([], {smoothFactor:1, color: 'black', noClip:true, opacity:1, dashArray:'5, 10', weight:3});
                var firstPoint = null;
                var lastPoint = null;

                var traveled = true;
                var section = false;

                var currentLayerGroup = null;
                var currentLine = null;

                for(var i = 0; i < data.data.length; i++) {
                    var feature = data.data[i];
                    if(!feature.excludeFromPath && feature.arrival !== null && feature.arrival >= new Date().getTime() && traveled) {
                        traveled = false;
                    }
                    if(feature.type === 'startsection') {
                        section = true;
                        if(currentLayerGroup) {
                            lines.push(currentLayerGroup);
                            currentLayerGroup = L.featureGroup([]);
                        }
                    } else if(feature.type === 'endsection') {
                        section = false;
                    }
                    if(!firstPoint && !feature.excludeFromPath) {
                        firstPoint = feature;
                        currentLayerGroup = L.featureGroup([]);
                    }
                    if(feature.type === 'marker') {
                        var pointMarker = L.marker([feature.lat, feature.lng]).bindPopup(feature.title);
                        mapping.push({marker: pointMarker, feature: feature});
                        marker.push(pointMarker);
                        lastPoint = [feature.lat, feature.lng];
                    } else if(feature.type === 'waypoint') {
                        var circleMarker = L.circleMarker([feature.lat, feature.lng], {radius: 5}).bindPopup(feature.title);
                        mapping.push({marker: circleMarker, feature: feature});
                        marker.push(circleMarker);
                        lastPoint = [feature.lat, feature.lng];
                    }

                }
                L.layerGroup(marker).addTo(map);
                if(firstPoint) {
                    setTimeout(function() {
                        map.setView([firstPoint.lat, firstPoint.lng], 5);    
                    }, 500);
                }
            }

            this.destroy = function() {
                map.remove();
            }
            //oldImplementation();
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
