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

        $('body').addClass("wp_travelermap");
        
        var _currentSelection = null;
        var _marker = null;
        var _map = null;
        var _fileFrame;

        function _tm_init() {
            // create a map in the "map" div, set the view to a given place and zoom
            _map = L.map('tm_map').setView([0, 0], 3);

            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(_map);

            _marker = L.marker([0, 0], {'draggable': true}).addTo(_map);
            _marker.on('dragend', function(evt) {
                var latlng = _marker.getLatLng();
                $('#tm_lat').val(latlng.lat);
                $('#tm_lng').val(latlng.lng);
            });

            $('#tm_pointlist').sortable();
            $('#tm_layerlist').sortable();
            $('#tm_overlaylist').sortable();
            $('#tm_arrival').datepicker({dateFormat: 'yy-mm-dd'});
            $('#tm_departure').datepicker({dateFormat: 'yy-mm-dd'});
            $('#tm_date').datepicker({dateFormat: 'yy-mm-dd'});
            //$("#tm_line_color").spectrum({change: function(color) {$("#tm_line_color").val(color.toHexString());}});

            //$('#tm_icon').combobox();
            $('#tm_type').on('change', function() {
                _tm_enableControls({type: $('#tm_type').val()});
            });
        }

        function _tm_editPoint(elem) {
            if (_currentSelection) {
                $(_currentSelection).removeClass("active");
            }
            _currentSelection = $(elem);
            _currentSelection.addClass("active");
            var data = _currentSelection.data('point');
            $('#tm_type').val(data.type);
            $('#tm_title').val(data.title);
            $('#tm_icon').val(data.icon);
            $('#tm_icon_color').val(data.iconColor);
            $('#tm_thumbnail').val(data.thumbnail);
            if (data.date) {
                var date = new Date(data.date);
                $('#tm_date').val(date.toISOString().substr(0, 10));
            } else {
                $('#tm_date').val('');
            }
            $('#tm_mediaid').val(data.mediaId);
            $('#tm_postid').val(data.postId);
            $('#tm_fullsize').val(data.fullsize);
            $('#tm_description').val(data.description);
            $('#tm_link').val(data.link);
            $('#tm_excludefrompath').prop('checked', data.excludeFromPath);
            if (data.arrival) {
                var date = new Date(data.arrival);
                $('#tm_arrival').val(date.toISOString().substr(0, 10));
            } else {
                $('#tm_arrival').val('');
            }
            if (data.departure) {
                var date = new Date(data.departure);
                $('#tm_departure').val(date.toISOString().substr(0, 10));
            } else {
                $('#tm_departure').val('');
            }

            if ($.isNumeric(data.lng)) {
                $('#tm_lng').val(data.lng);
            } else {
                $('#tm_lng').val(0);
            }
            if ($.isNumeric(data.lat)) {
                $('#tm_lat').val(data.lat);
            } else {
                $('#tm_lat').val(0);
            }
            if (data.type === 'waypoint' || data.type === 'marker' || data.type === 'media' || data.type === 'post' || data.type === 'startsection' || data.type === 'endsection') {
                _marker.setLatLng({
                    lat: parseFloat($('#tm_lat').val()),
                    lng: parseFloat($('#tm_lng').val())
                });
                _map.setView([parseFloat($('#tm_lat').val()), parseFloat($('#tm_lng').val())]);
            }
            _tm_enableControls(data);
        }

        function _tm_enableControls(data) {
            $('#tm_type').prop('disabled', true);
            $('#tm_title').prop('disabled', true);
            $('#tm_date').prop('disabled', true);
            $('#tm_icon').prop('disabled', true);
            $('#tm_icon_color').prop('disabled', true);
            $('#tm_thumbnail').prop('disabled', true);
            $('#tm_fullsize').prop('disabled', true);
            $('#tm_description').prop('disabled', true);
            $('#tm_link').prop('disabled', true);
            $('#tm_excludefrompath').prop('disabled', true);
            $('#tm_arrival').prop('disabled', true);
            $('#tm_departure').prop('disabled', true);
            $('#tm_lng').prop('disabled', true);
            $('#tm_lat').prop('disabled', true);

            $('#tm_link_to_media').prop('disabled', true);
            $('#tm_link_to_post').prop('disabled', true);
            $('#tm_save_changes').prop('disabled', true);
            $('#tm_place_at_address').prop('disabled', true);

            if (data.type === 'marker' || data.type === 'post' || data.type === 'media') {
                $('#tm_type').prop('disabled', false);
                $('#tm_icon').prop('disabled', false);
                $('#tm_icon_color').prop('disabled', false);
                $('#tm_title').prop('disabled', false);
                $('#tm_date').prop('disabled', false);
                $('#tm_thumbnail').prop('disabled', false);
                $('#tm_fullsize').prop('disabled', false);
                $('#tm_description').prop('disabled', false);
                $('#tm_link').prop('disabled', false);
                $('#tm_excludefrompath').prop('disabled', false);
                $('#tm_arrival').prop('disabled', false);
                $('#tm_departure').prop('disabled', false);
                $('#tm_lng').prop('disabled', false);
                $('#tm_lat').prop('disabled', false);

                $('#tm_link_to_media').prop('disabled', false);
                $('#tm_link_to_post').prop('disabled', false);
                $('#tm_place_at_address').prop('disabled', false);
                $('#tm_save_changes').prop('disabled', false);
            } else if (data.type === 'waypoint') {
                $('#tm_type').prop('disabled', false);
                $('#tm_title').prop('disabled', false);
                $('#tm_arrival').prop('disabled', false);
                $('#tm_departure').prop('disabled', false);
                $('#tm_lng').prop('disabled', false);
                $('#tm_lat').prop('disabled', false);

                $('#tm_place_at_address').prop('disabled', false);
                $('#tm_save_changes').prop('disabled', false);
            } else if (data.type === 'endsection') {
                $('#tm_type').prop('disabled', false);
                $('#tm_title').prop('disabled', false);
                $('#tm_lng').prop('disabled', false);
                $('#tm_lat').prop('disabled', false);
                $('#tm_arrival').prop('disabled', false);
                $('#tm_departure').prop('disabled', false);
                
                $('#tm_place_at_address').prop('disabled', false);
                $('#tm_save_changes').prop('disabled', false);
            } else if (data.type === 'startsection' || data.type === 'startendsection') {
                $('#tm_type').prop('disabled', false);
                $('#tm_title').prop('disabled', false);
                $('#tm_thumbnail').prop('disabled', false);
                $('#tm_fullsize').prop('disabled', false);
                $('#tm_description').prop('disabled', false);
                $('#tm_link').prop('disabled', false);
                $('#tm_lng').prop('disabled', false);
                $('#tm_lat').prop('disabled', false);
                $('#tm_arrival').prop('disabled', false);
                $('#tm_departure').prop('disabled', false);
                
                $('#tm_link_to_media').prop('disabled', false);
                $('#tm_link_to_post').prop('disabled', false);
                $('#tm_place_at_address').prop('disabled', false);
                $('#tm_save_changes').prop('disabled', false);
            }
        }

        function _tm_saveChanges() {
            if (!_currentSelection)
                return;
            var data = {
                "type": $('#tm_type').val(),
                "title": $('#tm_title').val(),
                "date": $('#tm_date').val() !== '' ? Date.parse($('#tm_date').val()) : null,
                "icon": $('#tm_icon').val(),
                "iconColor": $('#tm_icon_color').val(),
                "thumbnail": $('#tm_thumbnail').val(),
                "fullsize": $('#tm_fullsize').val(),
                "mediaId": parseInt($('#tm_mediaid').val()),
                "postId": parseInt($('#tm_postid').val()),
                "description": $('#tm_description').val(),
                "link": $('#tm_link').val(),
                "excludeFromPath": $('#tm_excludefrompath').prop('checked') ? true : false,
                "lat": $('#tm_lat').val() !== '' ? parseFloat($('#tm_lat').val()) : 0.0,
                "lng": $('#tm_lng').val() !== '' ? parseFloat($('#tm_lng').val()) : 0.0,
                "arrival": $('#tm_arrival').val() !== '' ? Date.parse($('#tm_arrival').val()) : null,
                "departure": $('#tm_departure').val() !== '' ? Date.parse($('#tm_departure').val()) : null
            };
            if (data.type === 'startsection' || data.type === 'endsection' || data.type === 'startendsection' || data.type === 'waypoint') {
                data.excludeFromPath = false;
                $('#tm_excludefrompath').prop('checked', data.excludeFromPath);
            }
            $(_currentSelection).data('point', data);
            $(_currentSelection).find('.tm_title').html(((data.title) ? data.title : '&nbsp;'));
            $(_currentSelection).find('input').prop('checked', data.excludeFromPath);

            $(_currentSelection).removeClass('marker');
            $(_currentSelection).removeClass('waypoint');
            $(_currentSelection).removeClass('media');
            $(_currentSelection).removeClass('post');
            $(_currentSelection).removeClass('startsection');
            $(_currentSelection).removeClass('startendsection');
            $(_currentSelection).removeClass('endsection');

            $(_currentSelection).addClass(data.type);

            _tm_enableControls(data);

        }

        function _tm_addPoint(data) {
            if (!data) {
                data = {
                    "type": "marker",
                    "title": "",
                    "date": null,
                    "thumbnail": "",
                    "fullsize": "",
                    "description": "",
                    "iconColor": "blue",
                    "mediaId": -1,
                    "postId": -1,
                    "link": null,
                    "icon": "",
                    "excludeFromPath": false,
                    "lat": 0,
                    "lng": 0,
                    "arrival": null,
                    "departure": null
                };
            }
            var li = $('<li class="' + data.type + '"><i class="fa fa-fw"></i><span class="tm_title">' + ((data.title) ? data.title : '&nbsp;') + '</span><span>Exclude From Path<input disabled="true" type="checkbox" ' + (data.excludeFromPath ? 'checked="true"' : "") + '/></span><a href="#">delete</a></li>');
            li.on('click', function() {
                _tm_editPoint(this);
            });
            li.find('a').on('click', function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                $(this).parent().remove();
                if (_currentSelection === $(this)) {
                    _currentSelection = null;
                }
                $('#points').sortable("refresh");
            });
            li.data('point', data);
            $('#tm_pointlist').append(li);
            $('#tm_pointlist').sortable("refresh");
            li.trigger('click');
        }

        function _tm_addLayer(name) {
            if (!name) {
                name = $('#tm_layer_select').val();
            }
            var li = $('<li><i class="fa fa-fw"></i>' + name + '<a href="#">delete</a></li>');
            li.find('a').on('click', function() {
                $(this).parent().remove();
                $('#tm_layerlist').sortable("refresh");
            });
            li.data('value', name);
            $('#tm_layerlist').append(li);
            $('#tm_layerlist').sortable("refresh");
        }

        function _tm_addOverlay(name) {
            if (!name) {
                name = $('#tm_overlays_select').val();
            }
            var li = $('<li><i class="fa fa-fw"></i>' + name + '<a href="#">delete</a></li>');
            li.find('a').on('click', function() {
                $(this).parent().remove();
                $('#tm_overlaylist').sortable("refresh");
            });
            li.data('value', name);
            $('#tm_overlaylist').append(li);
            $('#tm_overlaylist').sortable("refresh");
        }

        function _tm_generateMap() {
            var obj = {};
            obj['version'] = "1.3.0";
            obj['mapid'] = $('#tm_map').data('mapid');
            obj['name'] = $('#tm_map_name').val();
            obj['id'] = $('#tm_map_id').val();
            obj['lineColor'] = $("#tm_line_color").val();

            var mainProperties = {layer: [], overlays: []};
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
                for (var i in point) { /* delete temp attachments */
                    if (i.toString().charAt(0) === '_') {
                        delete point[i];
                    }
                }
                data.push(point);
            });

            obj['data'] = data;
            return obj;
        }

        function _tm_linkToMedia() {

            if (_fileFrame) {
                _fileFrame.open();
                return;
            }

            _fileFrame = wp.media.frames.file_frame = wp.media({
                title: "Choose File",
                button: {
                    text: "Select"
                },
                multiple: false
            });

            _fileFrame.on('select', function() {
                attachment = _fileFrame.state().get('selection').first().toJSON();
                console.log(attachment);
                $('#tm_type').val('media');
                $('#tm_title').val(attachment.title);
                $('#tm_icon').val('camera');
                $('#tm_thumbnail').val(attachment.sizes.thumbnail.url);
                $('#tm_mediaid').val(attachment.id);
                $('#tm_postid').val(-1);
                var date = Date.parse(attachment.date);
                if (!isNaN(date)) {
                    $('#tm_date').val(new Date(date).toISOString().substr(0, 10));
                }
                $('#tm_fullsize').val(attachment.sizes.full.url);
                $('#tm_description').val(attachment.description);
                $('#tm_link').val(attachment.link);

            });

            _fileFrame.open();
        }

        function _tm_linkToPost() {
            var data = {
                "action": "travelermap_ajax_getpostnames",
                "_wpnonce": $('#travelermap_ajax_getpostnames').val()
            };

            // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
            $.get(ajaxurl, data, function(response) {
                if (response == '-1') {
                    alert("Error while linking to post");
                    return;
                }
                var select = $('<select></select>');
                for (var i = 0; i < response.length; i++) {
                    select.append($('<option value="' + response[i].value + '">' + response[i].label + '</option>'));
                }
                var dialog = $('<div></div>');
                dialog.append($('<label>Select Post</label>'));
                dialog.append(select);

                dialog.dialog({buttons: [
                        {text: "Ok", click: function() {
                                $(this).dialog("destroy");
                                $.get(ajaxurl, {action: 'travelermap_ajax_getpostinfos', post_id: select.val(), _wpnonce: $('#travelermap_ajax_getpostinfos').val()}, function(response) {
                                    if (response == "-1") {
                                        alert("Error while linking to post");
                                        return;
                                    }
                                    if ($('#tm_type').val() !== 'startsection' && $('#tm_type').val() !== 'startendsection') {
                                        $('#tm_type').val('post');
                                    }
                                    $('#tm_title').val(response.title);
                                    var date = Date.parse(response.date);
                                    if (!isNaN(date)) {
                                        $('#tm_date').val(new Date(date).toISOString().substr(0, 10));
                                    }
                                    $('#tm_thumbnail').val(response.thumbnail);
                                    $('#tm_mediaid').val(response.mediaId);
                                    $('#tm_postid').val(response.postId);
                                    $('#tm_fullsize').val(response.fullsize);
                                    $('#tm_description').val(response.description);
                                    $('#tm_link').val(response.link);
                                });
                            }},
                        {text: "Cancel", click: function() {
                                $(this).dialog("destroy");
                            }}
                    ], minHeight:400});
                dialog.on('close', function() {
                    dialog.dialog('destroy');
                });
                //select.autocomplete({source : response, appendTo:dialog.parent()});
                select.combobox();
            });
        }

        function _tm_placeMarkerAtAddress() {
            var dialog = $('<div></div>');
            dialog.append($('<label>Search</label>'));
            dialog.append($('<input type="text"></input>'));
            dialog.dialog({buttons: [
                    {text: "Search", click: function() {
                            $.getJSON('http://nominatim.openstreetmap.org/search?format=json&q='+dialog.find('input').val().toString().replace(/ /g,"+"), function(response) {
                                if(!response) { alert("Error while retrieving results"); return; };
                                if(response.length == 0) {
                                    alert("No results found");
                                    return;
                                }
                                var selectionDialog = $('<div></div>');
                                var list = $('<ul class="tm_list"></ul>');
                                for(var i = 0; i < response.length; i++) {
                                    var li = $('<li class="tm_list_entry">'+response[i].display_name+'</li>');
                                    li.data("info", response[i]);
                                    li.on('click', function(evt) {
                                        selectionDialog.dialog('destroy');
                                        dialog.dialog('destroy');
                                        $('#tm_lat').val($(this).data('info').lat);
                                        $('#tm_lng').val($(this).data('info').lon);
                                        _marker.setLatLng({
                                            lat: parseFloat($('#tm_lat').val()),
                                            lng: parseFloat($('#tm_lng').val())
                                        });
                                        _map.setView([parseFloat($('#tm_lat').val()), parseFloat($('#tm_lng').val())]);
                                    });
                                    list.append(li);
                                }
                                selectionDialog.append(list);
                                selectionDialog.dialog({ minWidth: 400, maxHeight:400, buttons: [
                                        {
                                            text: "Cancel",
                                            click: function() {
                                               $(this).dialog("destroy"); 
                                            }
                                        }
                                ]});
                                selectionDialog.on('close', function() {
                                    selectionDialog.dialog('destroy');
                                });
                            }).fail(function() {
                                alert("Error while retrieving results");
                            });
                        }},
                    {text: "Cancel", click: function() {
                            $(this).dialog("destroy");
                        }}
                ]});
            dialog.on('close', function() {
                dialog.dialog('destroy');
            });
        }

        function _tm_validate(map) {
            if (map.data && map.data.length > 0) {
                var inSection = false;
                for (var i = 0; i < map.data.length; i++) {
                    var feature = map.data[i];
                    if (feature.type === 'endsection' && !inSection) {
                        return false;
                    } else if (feature.type === 'startsection' && inSection) {
                        return false;
                    } else if (feature.type === 'startsection') {
                        inSection = true;
                    } else if (feature.type === 'endsection') {
                        inSection = false;
                    }
                }
                if (inSection)
                    return false; //no closing section
            }
            return true;
        }

        function _tm_saveMap() {
            var map = _tm_generateMap();
            if (!_tm_validate(map)) {
                alert("Errors in Map, please check the marker order and sections");
                return;
            }
            var data = {
                "action": "travelermap_ajax_updatemap",
                "map": JSON.stringify(map),
                "name": map.name,
                "id": map.id,
                "_wpnonce": $('#travelermap_ajax_updatemap').val()
            };

            // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
            $.post(ajaxurl, data, function(response) {
                if (response.success) {
                    alert('Map updated');
                } else {
                    alert("Error while updating map");
                }
            });
        }

        function _tm_previewMap() {
            var mapData = _tm_generateMap();
            var dialog = $('<div><div>');
            var mapWrapper = $('<div style=""></div>');
            dialog.append(mapWrapper);
            dialog.dialog({close: function(evt) {

                }, minWidth: 650});
            var map = window.tm_loadFrontendMap(mapData, mapWrapper, {dateFormat: $('#tm_date_format').val()});
            dialog.on('close', function() {
                map.destroy();
                dialog.dialog('destroy');
            });
        }

        function _tm_loadMap(mapData) {
            if (mapData && typeof mapData === 'string') {
                mapData = JSON.parse(mapData);
            }
            if (!mapData) {
                mapData = {};
            }
            $("#tm_pointlist").empty();
            $("#tm_pointlist").sortable("refresh");
            $("#tm_layerlist").empty();
            $("#tm_layerlist").sortable("refresh");
            $("#tm_overlaylist").empty();
            $("#tm_overlaylist").sortable("refresh");
            if (mapData.name) {
                $("#tm_map_name").val(mapData.name);
            }
            if (mapData.lineColor) {
                $("#tm_line_color").val(mapData.lineColor);
            } else {
                $("#tm_line_color").val('#fff');
            }
            if (mapData.properties) {
                var props = mapData.properties;
                if (props.layer) {
                    for (var i = 0; i < props.layer.length; i++) {
                        _tm_addLayer(props.layer[i]);
                    }
                } else {
                    _tm_addLayer("OpenStreetMap.Mapnik");
                }
                if (props.overlays) {
                    for (var i = 0; i < props.overlays.length; i++) {
                        _tm_addOverlay(props.overlays[i]);
                    }
                }
            } else {
                _tm_addLayer("OpenStreetMap.Mapnik");
            }
            if (mapData.data) {
                for (var i = 0; i < mapData.data.length; i++) {
                    _tm_addPoint(mapData.data[i]);
                }
            }
        }
        window.tm_loadAdminMap = _tm_loadMap;
        window.tm_init = _tm_init;

        $('#tm_add_point').on('click', function() {
            _tm_addPoint();
        });
        $('#tm_save_changes').on('click', function() {
            _tm_saveChanges();
        });
        $('#tm_add_layer').on('click', function() {
            _tm_addLayer();
        });
        $('#tm_add_overlay').on('click', function() {
            _tm_addOverlay();
        });
        $('#tm_save_map').on('click', function() {
            _tm_saveMap();
        });
        $('#tm_preview_map').on('click', function() {
            _tm_previewMap();
        });
        $('#tm_link_to_post').on('click', function() {
            _tm_linkToPost();
        });
        $('#tm_link_to_media').on('click', function() {
            _tm_linkToMedia();
        });
        $('#tm_place_at_address').on('click', function() {
            _tm_placeMarkerAtAddress();
        });

        $('#tm_type').on('change', function() {
        });
    });
})(jQuery);

/**
 * (c) jQueryUI Combobox sample: http://jqueryui.com/autocomplete/#combobox
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    $.widget("custom.combobox", {
        _create: function() {
            this.wrapper = $("<span>")
                    .addClass("custom-combobox")
                    .insertAfter(this.element);
            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },
        _createAutocomplete: function() {
            var selected = this.element.children(":selected"),
                    value = selected.val() ? selected.text() : "";
            this.input = $("<input>")
                    .appendTo(this.wrapper)
                    .val(value)
                    .attr("title", "")
                    .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                    .autocomplete({
                        delay: 0,
                        minLength: 0,
                        source: $.proxy(this, "_source")
                    })
                    .tooltip({
                        tooltipClass: "ui-state-highlight"
                    });
            this._on(this.input, {
                autocompleteselect: function(event, ui) {
                    ui.item.option.selected = true;
                    this._trigger("select", event, {
                        item: ui.item.option
                    });
                },
                autocompletechange: "_removeIfInvalid"
            });
        },
        _createShowAllButton: function() {
            var input = this.input,
                    wasOpen = false;
            $("<a>")
                    .attr("tabIndex", -1)
                    .attr("title", "Show All Items")
                    .tooltip()
                    .appendTo(this.wrapper)
                    .button({
                        icons: {
                            primary: "ui-icon-triangle-1-s"
                        },
                        text: false
                    })
                    .removeClass("ui-corner-all")
                    .addClass("custom-combobox-toggle ui-corner-right")
                    .mousedown(function() {
                        wasOpen = input.autocomplete("widget").is(":visible");
                    })
                    .click(function() {
                        input.focus();
// Close if already visible
                        if (wasOpen) {
                            return;
                        }
// Pass empty string as value to search for, displaying all results
                        input.autocomplete("search", "");
                    });
        },
        _source: function(request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response(this.element.children("option").map(function() {
                var text = $(this).text();
                if (this.value && (!request.term || matcher.test(text)))
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
            }));
        },
        _removeIfInvalid: function(event, ui) {
// Selected an item, nothing to do
            if (ui.item) {
                return;
            }
// Search for a match (case-insensitive)
            var value = this.input.val(),
                    valueLowerCase = value.toLowerCase(),
                    valid = false;
            this.element.children("option").each(function() {
                if ($(this).text().toLowerCase() === valueLowerCase) {
                    this.selected = valid = true;
                    return false;
                }
            });
// Found a match, nothing to do
            if (valid) {
                return;
            }
// Remove invalid value
            this.input
                    .val("")
                    .attr("title", value + " didn't match any item")
                    .tooltip("open");
            this.element.val("");
            this._delay(function() {
                this.input.tooltip("close").attr("title", "");
            }, 2500);
            this.input.data("ui-autocomplete").term = "";
        },
        _destroy: function() {
            this.wrapper.remove();
            this.element.show();
        }
    });
})(jQuery);