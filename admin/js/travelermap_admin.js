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
        var map = L.map('tm_preview_map').setView([0,0], 3);

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

        $('#tm_pointlist').sortable();
        $('#tm_layerlist').sortable();
        $('#tm_overlaylist').sortable();
        $('#tm_arrival').datepicker();
        $('#tm_departure').datepicker();
        $('#tm_type').on('change', function() {
            tm_enableControls({type: $('#tm_type').val()});
        });

        function tm_editPoint(elem) {
                if(currentSelection) {
                        $(currentSelection).removeClass("active");
                }
                currentSelection = $(elem);
                currentSelection.addClass("active");
                var data = currentSelection.data('point');
                $('#tm_type').val(data.type);
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
                if(data.type == 'waypoint' || data.type == 'marker' || data.type== 'media' || data.type == 'post') {
                    marker.setLatLng({
                            lat: parseFloat($('#tm_lat').val()),
                            lng: parseFloat($('#tm_lng').val())
                    });
                    map.setView([parseFloat($('#tm_lat').val()),parseFloat($('#tm_lng').val())]);
                }
                tm_enableControls(data);
        }

        function tm_enableControls(data) {
            $('#tm_type').prop('disabled', true);
            $('#tm_title').prop('disabled', true);
            $('#tm_thumbnail').prop('disabled', true);
            $('#tm_description').prop('disabled', true);
            $('#tm_link').prop('disabled', true);
            $('#tm_excludefrompath').prop('disabled', true);
            $('#tm_arrival').prop('disabled', true);
            $('#tm_departure').prop('disabled', true);
            $('#tm_lng').prop('disabled', true);
            $('#tm_lat').prop('disabled', true);

            $('#tm_linkToMedia').prop('disabled', true);
            $('#tm_linkToPost').prop('disabled', true);
            $('#tm_saveChanges').prop('disabled', true);

            if(data.type === 'marker' || data.type === 'post' || data.type === 'media') {
                $('#tm_type').prop('disabled', false);
                $('#tm_title').prop('disabled', false);
                $('#tm_thumbnail').prop('disabled', false);
                $('#tm_description').prop('disabled', false);
                $('#tm_link').prop('disabled', false);
                $('#tm_excludefrompath').prop('disabled', false);
                $('#tm_arrival').prop('disabled', false);
                $('#tm_departure').prop('disabled', false);
                $('#tm_lng').prop('disabled', false);
                $('#tm_lat').prop('disabled', false);

                $('#tm_linkToMedia').prop('disabled', false);
                $('#tm_linkToPost').prop('disabled', false);
                $('#tm_saveChanges').prop('disabled', false);
            } else if(data.type === 'waypoint') {
                $('#tm_type').prop('disabled', false);
                $('#tm_title').prop('disabled', false);
                $('#tm_arrival').prop('disabled', false);
                $('#tm_departure').prop('disabled', false);
                $('#tm_lng').prop('disabled', false);
                $('#tm_lat').prop('disabled', false);

                $('#tm_saveChanges').prop('disabled', false);
            } else if(data.type === 'startsection') {
                $('#tm_type').prop('disabled', false);

                $('#tm_saveChanges').prop('disabled', false);
            } else if(data.type === 'endsection') {
                $('#tm_type').prop('disabled', false);
                $('#tm_title').prop('disabled', false);
                $('#tm_thumbnail').prop('disabled', false);
                $('#tm_description').prop('disabled', false);
                $('#tm_link').prop('disabled', false);

                $('#tm_linkToMedia').prop('disabled', false);
                $('#tm_linkToPost').prop('disabled', false);
                $('#tm_saveChanges').prop('disabled', false);
            }
        }
        
        function tm_selectNextPoint() {
            if(currentSelection) {
                if(currentSelection.next()) {
                    currentSelection.next().trigger('click');
                } else {
                    //TODO: implement round
                }
            }
        }
        
        function tm_selectPrevPoint() {
            if(currentSelection) {
                if(currentSelection.prev()) {
                    currentSelection.prev().trigger('click');
                } else {
                    //TODO: implement round
                }
            }
        }

        function tm_saveChanges() {
                if(!currentSelection) return;
                var data = {
                        "type" : $('#tm_type').val(),
                        "title" : $('#tm_title').val(),
                        "thumbnail" : $('#tm_thumbnail').val(),
                        "media_id" : -1,
                        "post_id" : -1,
                        "description" : $('#tm_description').val(),
                        "link" : $('#tm_link').val(),
                        "excludeFromPath" : $('#tm_excludefrompath').prop('checked') ? true : false,
                        "lat" : $('#tm_lat').val() != '' ? parseFloat($('#tm_lat').val()) : 0.0,
                        "lng" : $('#tm_lng').val() != '' ? parseFloat($('#tm_lng').val()) : 0.0,
                        "arrival" : $('#tm_arrival').val() != '' ? Date.parse($('#tm_arrival').val()) : null,
                        "departure" : $('#tm_arrival').val() != '' ? Date.parse($('#tm_departure').val()): null
                }
                $(currentSelection).data('point', data);
                $(currentSelection).find('.tm_title').html(data.title);
                $(currentSelection).find('input').prop('checked',data.excludeFromPath);

                $(currentSelection).removeClass('marker');
                $(currentSelection).removeClass('waypoint');
                $(currentSelection).removeClass('media');
                $(currentSelection).removeClass('post');
                $(currentSelection).removeClass('startsection');
                $(currentSelection).removeClass('endsection');
                
                $(currentSelection).addClass(data.type);

                tm_enableControls(data);

        }

        function tm_addPoint(data) {
                if(!data) {
                        data = {
                                "type" : "marker",
                                "title" : "",
                                "thumbnail" : "",
                                "description" : "",
                                "media_id" : -1,
                                "post_id" : -1,
                                "link" : null,
                                "excludeFromPath" : false,
                                "lat" : 0,
                                "lng" : 0,
                                "arrival" : null,
                                "departure" : null
                        }
                }
                var li = $('<li class="marker"><i class="fa fa-fw"></i><span class="tm_title">' + data.title +'</span><span>Exclude From Path<input disabled="true" type="checkbox" '+ (data.excludeFromPath ? 'checked="true"' : "") +'/></span><a href="#">delete</a></li>');
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
                $('#tm_pointlist').append(li);
                $('#tm_pointlist').sortable("refresh");
                li.trigger('click');
        }

        function tm_addLayer(name) {
                if(!name) {
                    name = $('#tm_layer_select').val();
                }
                var li = $('<li><i class="fa fa-fw"></i>'+name+'<a href="#">delete</a></li>');
                li.find('a').on('click', function() {
                        $(this).parent().remove();
                        $('#tm_layerlist').sortable("refresh");
                });
                li.data('value', name);
                $('#tm_layerlist').append(li);
                $('#tm_layerlist').sortable("refresh");
        }

        function tm_addOverlay(name) {
                if(!name) {
                    name = $('#tm_overlays_select').val();
                }
                var li = $('<li><i class="fa fa-fw"></i>'+name+'<a href="#">delete</a></li>');
                li.find('a').on('click', function() {
                        $(this).parent().remove();
                        $('#tm_overlaylist').sortable("refresh");
                });
                li.data('value', name);
                $('#tm_overlaylist').append(li);
                $('#tm_overlaylist').sortable("refresh");
        }

        function tm_generateMap() {
            var obj = {};
            obj['version'] = "1.0.0";
            obj['mapid'] = $('#tm_map').data('mapid');
            obj['name'] = $('#tm_map_name').val();

            var mainProperties = { layer : [], overlays: [] };
            $('#tm_layerlist > li').each(function() {
                mainProperties.layer.push($(this).data('value'));
            });
            $('#tm_overlaylist > li').each(function() {
                mainProperties.overlays.push($(this).data('value'));
            });
            obj['properties'] = mainProperties;

            var data = [];
            $('#tm_pointlist > li').each(function() {
                var point = $(this).data('point');
                for(var i in point) { /* delete temp attachments */
                    if(i.toString().charAt(0) === '_') {
                        delete point[i];
                    }
                }
                data.push(point);
            });

            obj['data'] = data;
            $('#output').val(JSON.stringify(obj));
            return obj;
        }

        function tm_previewMap() {
            var map = tm_generateMap();
            var div = $('<div><div style="height:400px;width:400px;" class="tm_previewmap"></div><div>');
            
            div.dialog({close : function(evt) {
                
            },minWidth: 450});
            var map = window.tm_loadFrontendMap(map,div.find("> div")[0]);
            div.on('close', function() {
                map.destroy();
                div.dialog('destroy');
            });
        }

        function tm_loadMap(mapData) {
            if(mapData && typeof mapData === 'string') {
                mapData = JSON.parse(mapData);
            }
            if(!mapData) { mapData = {};}
            $("#tm_pointlist").empty();
            $("#tm_pointlist").sortable("refresh");
            $("#tm_layerlist").empty();
            $("#tm_layerlist").sortable("refresh");
            $("#tm_overlaylist").empty();
            $("#tm_overlaylist").sortable("refresh");
            if(mapData.name) {
                $("#tm_map_name").val(mapData.name);
            }
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
            } else {
                tm_addLayer("OpenStreetMap.Mapnik");
            }
            if(mapData.data) {
                for(var i = 0; i < mapData.data.length; i++) {
                    tm_addPoint(mapData.data[i]);
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
                tm_generateMap();
        });
        $('#tm_previewMap').on('click', function() {
                tm_previewMap();
        });
        $('#tm_type').on('change', function() {
        });
        $('#tm_loadMap').on('click', function() {
            window.tm_loadAdminMap($("#output").val());
        });
    });
})(jQuery);