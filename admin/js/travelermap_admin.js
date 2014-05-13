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

        var currentSelection = null;

        // create a map in the "map" div, set the view to a given place and zoom
        var map = L.map('tm_map').setView([0,0], 3);

        // add an OpenStreetMap tile layer
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var marker = L.marker([0,0], {'draggable':true}).addTo(map);
        marker.on('dragend', function(evt) {
                var latlng = marker.getLatLng();
                $('#tm_lat').val(latlng.lat);
                $('#tm_lng').val(latlng.lng);
        });

        $('#tm_points').sortable();
        $('#tm_layer').sortable();
        $('#tm_overlays').sortable();
        $('#tm_arrival').datepicker();
        $('#tm_departure').datepicker();

        function tm_editPoint(elem) {
                if(currentSelection) {
                        $(currentSelection).removeClass("active");
                }
                currentSelection = $(elem);
                currentSelection.addClass("active");
                var data = currentSelection.data('point');
                $('#tm_title').val(data.title);
                $('#tm_thumbnail').val(data.thumbnail);
                $('#tm_description').val(data.description);
                $('#tm_link').val(data.link);
                $('#tm_excludefrompath').val(data.excludeFromPath);
                $('#tm_arrival').val(data.arrival);
                $('#tm_departure').val(data.departure);

                if($.isNumeric(data.lng)) {
                        $('#tm_lng').val(data.lng);
                } else {
                        $('#tm_lng').val(0);
                }
                if($.isNumeric(data.lat)) {
                        $('#tm_lat').val(data.lat);
                } else {
                        $('#tm_lat').val(0);
                }
                marker.setLatLng({
                        lat: parseFloat($('#tm_lat').val()),
                        lng: parseFloat($('#tm_lng').val())
                });
                map.setView([parseFloat($('#tm_lat').val()),parseFloat($('#tm_lng').val())]);
        }

        function tm_saveChanges() {
                if(!currentSelection) return;
                data = {
                        "title" : $('#tm_title').val(),
                        "thumbnail" : $('#tm_thumbnail').val(),
                        "description" : $('#tm_description').val(),
                        "link" : $('#tm_link').val(),
                        "excludeFromPath" : $('#tm_excludefrompath').prop('checked') ? true : false,
                        "lat" : $('#tm_lat').val() != '' ? parseFloat($('#tm_lat').val()) : 0.0,
                        "lng" : $('#tm_lng').val() != '' ? parseFloat($('#tm_lng').val()) : 0.0,
                        "arrival" : $('#tm_arrival').val() != '' ? Date.parse($('#tm_arrival').val()) : null,
                        "departure" : $('#tm_arrival').val() != '' ? Date.parse($('#tm_departure').val()): null
                }
                $(currentSelection).data('point', data);
                $(currentSelection).find('span:first-child').html(data.title);
                $(currentSelection).find('input').prop('checked',data.excludeFromPath);

        }

        function tm_addPoint(data) {
                if(!data) {
                        data = {
                                "title" : "point",
                                "thumbnail" : "",
                                "description" : "",
                                "link" : null,
                                "excludeFromPath" : false,
                                "lat" : 0,
                                "lng" : 0,
                                "arrival" : null,
                                "departure" : null
                        }
                }
                var li = $('<li><span>' + data.title +'</span><span>Exclude From Path<input disabled="true" type="checkbox" '+ (data.excludeFromPath ? 'checked="true"' : "") +'/></span><a href="#">delete</a></li>');
                li.on('click', function() {
                        tm_editPoint(this);
                });
                li.find('a').on('click', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    $(this).parent().remove();
                    if(currentSelection == $(this)) {
                        currentSelection = null;
                    }
                    $('#points').sortable("refresh");
                });
                li.data('point', data);
                $('#tm_points').append(li);
                $('#tm_points').sortable("refresh");
        }

        function tm_addLayer(name) {
                if(!name) {
                    name = $('#tm_layer_select').val();
                }
                var li = $('<li>'+name+'<a href="#">delete</a></li>');
                li.find('a').on('click', function() {
                        $(this).parent().remove();
                        $('#tm_layer').sortable("refresh");
                });
                li.data('value', name);
                $('#tm_layer').append(li);
                $('#tm_layer').sortable("refresh");
        }

        function tm_addOverlay(name) {
                if(!name) {
                    name = $('#tm_overlays_select').val();
                }
                var li = $('<li>'+name+'<a href="#">delete</a></li>');
                li.find('a').on('click', function() {
                        $(this).parent().remove();
                        $('#tm_overlays').sortable("refresh");
                });
                li.data('value', name);
                $('#tm_overlays').append(li);
                $('#tm_overlays').sortable("refresh");
        }

        function tm_saveMap() {
            var obj = {};
            obj['type'] = "FeatureCollection";

            var mainProperties = { layer : [], overlays: [], mapid: $('#tm_map').data('mapid')};
            $('#tm_layer > li').each(function() {
                mainProperties.layer.push($(this).data('value'));
            });
            $('#tm_overlays > li').each(function() {
                mainProperties.overlays.push($(this).data('value'));
            });
            obj['properties'] = mainProperties;

            var features = [];
            $('#tm_points > li').each(function() {
                var point = {};
                point['properties'] = $(this).data('point');
                point['feature'] = "Feature";
                point['geometry'] = {
                    type : "Point",
                    "coordinates" : [point.properties.lng, point.properties.lat]
                };
                features.push(point);
            });

            obj['features'] = features;
            $('#output').val(JSON.stringify(obj));
        }

        function tm_loadMap(mapData) {
            $("#tm_points").empty();
            $("#tm_points").sortable("refresh");
            $("#tm_layer").empty();
            $("#tm_layer").sortable("refresh");
            $("#tm_overlays").empty();
            $("#tm_overlays").sortable("refresh");
            if(mapData.properties) {
                var props = mapData.properties;
                if(props.layer) {
                    for(var i = 0; i < props.layer.length; i++) {
                        tm_addLayer(props.layer[i]);
                    }
                } else {
                    tm_addLayer("OpenStreetMap.Mapnik");
                }
                if(props.overlays) {
                    for(var i = 0; i < props.overlays.length; i++) {
                        tm_addOverlay(props.overlays[i]);
                    }
                }
            }
            if(mapData.features) {
                for(var i = 0; i < mapData.features.length; i++) {
                    if(mapData.features[i].properties) {
                        tm_addPoint(mapData.features[i].properties);
                    }
                }
            }
        }
        window.tm_loadAdminMap = tm_loadMap;

        $('#tm_addPoint').on('click', function() {
                tm_addPoint();
        });
        $('#tm_saveChanges').on('click', function() {
                tm_saveChanges();
        });
        $('#tm_addLayer').on('click', function() {
                tm_addLayer();
        });
        $('#tm_addOverlay').on('click', function() {
                tm_addOverlay();
        });
        $('#tm_saveMap').on('click', function() {
                tm_saveMap();
        });
    });
})(jQuery);