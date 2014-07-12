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
        var _pluginUrl;

        var _mapsymbols = ["2hand.png","360degrees.png","abduction.png","aboriginal.png","accesdenied.png","acupuncture.png","administration.png","administrativeboundary.png","aed-2.png","agritourism.png","aircraftcarrier.png","aircraftsmall.png","air_fixwing.png","airport_apron.png","airport.png","airport_runway.png","airport_terminal.png","airshow-2.png","algae.png","alien.png","alligator.png","amphitheater-2.png","amphitheater.png","anchorpier.png","anemometer_mono.png","animal-shelter-export.png","anniversary.png","ant-export.png","anthropo.png","apartment-3.png","apple.png","aquarium.png","archery.png","arch.png","army.png","artgallery.png","art-museum-2.png","atm-2.png","atv.png","audio.png","australianfootball.png","avalanche1.png","award.png","badminton-2.png","bags.png","bank.png","barbecue.png","barber.png","bar_coktail.png","bar_juice.png","bar.png","barrier.png","baseball.png","basketball.png","bats.png","battlefield.png","battleship-3.png","beach.png","beachvolleyball.png","beautifulview.png","beautysalon.png","bed_breakfast1-2.png","beergarden.png","bicycle_shop.png","bigcity.png","bike_downhill.png","bike_rising.png","billiard-2.png","binoculars.png","birds-2.png","blast.png","boardercross.png","boatcrane.png","boat.png","bobsleigh.png","bollie.png","bomber-2.png","bomb.png","bouddha.png","bowling.png","boxing.png","bread.png","brewery1.png","bridge_modern.png","bridge_old.png","bulldozer.png","bullfight.png","bunker-2-2.png","bus.png","busstop.png","bustour.png","butcher-2.png","butterfly-2.png","cabin-2.png","cablecar.png","cafetaria.png","calendar-3.png","campfire-2.png","camping-2.png","candy.png","canyon-2.png","caraccident.png","car.png","carrental.png","carwash.png","casino-2.png","castle-2.png","cathedral.png","catholicgrave.png","caution.png","cave-2.png","cctv.png","cemetary.png","channelchange.png","chapel-2.png","chart-2.png","cheese.png","chemistry-2.png","chicken-2.png","childmuseum01.png","chiropractor.png","christmasmarket.png","church-2.png","cinema.png","circus.png","citysquare.png","citywalls.png","climbing.png","clock.png","closedroad.png","clothers_female.png","clothers_male.png","cloudy.png","cloudysunny.png","coffee.png","coins.png","comedyclub.png","comics.png","comment-map-icon.png","communitycentre.png","company.png","compost.png","computers.png","condominium.png","conference.png","congress.png","constructioncrane.png","construction.png","contract.png","conveniencestore.png","convent-2.png","conversation-map-icon.png","convertible.png","corral.png","country.png","court.png","cowabduction.png","cow-export.png","craftstore.png","cramschool.png","cricket.png","crimescene.png","cromlech.png","cropcircles.png","cross-2.png","crossingguard.png","cruiseship.png","cup.png","curling-2.png","currencyexchange.png","customs.png","cycling_feed.png","cycling.png","cycling_sprint.png","dam.png","dance_class.png","dancinghall.png","database.png","daycare.png","deepseafishing.png","deer.png","dentist.png","departmentstore.png","desert-2.png","dinopark.png","direction_down.png","disability.png","diving.png","dogs_leash.png","dolphins.png","doublebendright.png","downloadicon.png","drinkingfountain.png","drinkingwater.png","drugstore.png","duck-export.png","earthquake-3.png","eggs.png","elephants.png","elevator_down.png","elevator.png","elevator_up.png","embassy.png","entrance.png","exchequer.png","exit.png","expert.png","factory.png","fallingrocks.png","family.png","farm-2.png","farmstand.png","fastfood.png","female-2.png","ferriswheel.png","ferry.png","festival.png","fetalalcoholsyndrom.png","field.png","fillingstation.png","findajob.png","finish.png","fireexstinguisher.png","fire-hydrant-2.png","firemen.png","fire.png","fireworks.png","firstaid.png","fishchips.png","fishingboat.png","fishing.png","fishingstore.png","fitness.png","fjord-2.png","flag-export.png","flood.png","flowers.png","folder-2.png","fooddeliveryservice.png","foodtruck.png","footprint.png","ford-2.png","forest2.png","forest.png","fossils.png","foundry-2.png","fountain-2.png","fourbyfour.png","freqchg.png","frog-2.png","fruits.png","ft.png","funicolar-22x22.png","gas_cylinder1.png","gay-female.png","gay-male.png","geocaching-3.png","geothermal-site.png","geyser-2.png","ghosttown.png","gifts.png","glacier-2.png","glasses.png","golfing.png","gondola-2.png","gourmet_0star.png","grass.png","grocery.png","group-2.png","gumball_machine.png","handball.png","hanggliding.png","harbor.png","hare1.png","hats.png","haybale.png","headstone-2.png","helicopter.png","highhills.png","highschool.png","highway.png","hiking.png","historical_museum.png","historicalquarter.png","hoergeraeteakustiker_22px.png","home-2.png","homecenter.png","honeycomb.png","hookah_final.png","horseriding.png","hospital-building.png","hostel_0star.png","hotairbaloon.png","hotel_0star.png","hotspring.png","house.png","hunting.png","hut.png","icecream.png","icehockey.png","iceskating.png","icy_road.png","indoor-arena.png","information.png","iobridge.png","jacuzzi.png","japanese-food.png","japanese-lantern.png","japanese-sake.png","japanese-sweet-2.png","japanese-temple.png","jazzclub.png","jeep.png","jetfighter.png","jewelry.png","jewishgrave.png","jewishquarter.png","jogging.png","judo.png","junction.png","karate.png","karting.png","kayak1.png","kayaking.png","kebab.png","kingair.png","kiosk.png","kitesurfing.png","laboratory.png","lake.png","landfill.png","landmark.png","laterne.png","laundromat.png","levelcrossing.png","library.png","lifeguard-2.png","lighthouse-2.png","linedown.png","lingerie.png","liquor.png","lobster-export.png","lockerrental.png","lock.png","lodging_0star.png","love_date.png","loveinterest.png","magicshow.png","mainroad.png","male-2.png","mall.png","mapicon.png","map.png","marina-2.png","market.png","massage.png","mastcrane1.png","medicalstore.png","medicine.png","megalith.png","memorial.png","metronetwork.png","military.png","mine.png","missile-2.png","mobilephonetower.png","modernmonument.png","moderntower.png","monkey-export.png","monument-historique-icon-white-22x22.png","monument.png","moonstar.png","mosquee.png","mosquito-2.png","motel-2.png","motorbike.png","motorcycle.png","mountainbiking-3.png","mountain-pass-locator-diagonal-reverse-export.png","mountains.png","movierental.png","moving-walkway-enter-export.png","muffin_bagle.png","mural.png","museum_archeological.png","museum_art.png","museum_crafts.png","museum_industry.png","museum_naval.png","museum_openair.png","museum_science.png","museum_war.png","mushroom.png","music_choral.png","music_classical.png","music_hiphop.png","music_live.png","music.png","music_rock.png","nanny.png","ne_barn-2.png","newsagent.png","no-nuke-export.png","nordicski.png","notvisited.png","nursery.png","nursing_home_icon.png","observatory.png","office-building.png","oil-2.png","oilpumpjack.png","oilrig2.png","olympicsite.png","ophthalmologist.png","outlet2.png","out.txt","oyster-3.png","pagoda-2.png","paintball.png","paint.png","palace-2.png","palm-tree-export.png","panoramicview.png","paragliding.png","parasailing.png","parkandride.png","parkinggarage.png","parking-meter-export.png","party-2.png","patisserie.png","peace.png","pedestriancrossing.png","penguin-2.png","pens.png","perfumery.png","petanque.png","petroglyphs-2.png","pets.png","phantom.png","phones.png","photography.png","photo.png","picnic-2.png","pig.png","pin-export.png","pirates.png","pizzaria.png","planecrash.png","planetarium-2.png","playground.png","pleasurepier.png","poker.png","police.png","postal.png","powerlinepole.png","poweroutage.png","powerplant.png","powersubstation.png","prayer.png","presentation.png","price-tag-export.png","printer-2.png","prison.png","publicart.png","pyramid.png","quadrifoglio.png","radar.png","radiation.png","radio-control-model-car.png","radio-station-2.png","rainy.png","rape.png","reatorlogowhite-22x22.png","recycle.png","regroup.png","repair.png","rescue-2.png","resort.png","restaurant_african.png","restaurant_breakfast.png","restaurant_buffet.png","restaurant_chinese.png","restaurant_fish.png","restaurant_greek.png","restaurant_indian.png","restaurant_italian.png","restaurant_korean.png","restaurant_mediterranean.png","restaurant_mexican.png","restaurant.png","restaurant_romantic.png","restaurant_steakhouse.png","restaurant_tapas.png","restaurant_thai.png","restaurant_turkish.png","restaurant_vegetarian.png","revolt.png","riparianhabitat.png","river-2.png","road.png","roadtype_gravel.png","rockhouse.png","rodent.png","rollerskate.png","ropescourse.png","rowboat.png","rugbyfield.png","ruins-2.png","sailing.png","sandwich-2.png","sauna.png","sawmill-2.png","school.png","schreibwaren_web.png","scoutgroup.png","scubadiving.png","seals.png","segway.png","seniorsite.png","septic_tank.png","share.png","shark-export.png","shintoshrine.png","shipwreck.png","shoes.png","shooting.png","shootingrange.png","shore-2.png","shower.png","sight-2.png","signpost-2.png","sikh.png","skiing.png","skijump.png","skilifting.png","ski_shoe1.png","skis.png","skull.png","sledge.png","sledgerental.png","sledge_summer.png","slipway.png","smallcity.png","smiley_happy.png","smoking.png","snail.png","snakes.png","sneakers.png","snorkeling.png","snowboarding.png","snowmobiling.png","snowpark_arc.png","snowshoeing.png","snowy-2.png","soccer.png","solarenergy.png","sozialeeinrichtung.png","spaceport-2.png","spa.png","speed_50.png","speedhump.png","speedriding.png","spelunking.png","spider.png","splice.png","sportscar.png","sportutilityvehicle.png","square-compass.png","squash-2.png","stadium.png","stairs.png","star-3.png","stargate-raw.png","start-race-2.png","statue-2.png","steamtrain.png","stop.png","strike.png","stripclub2.png","submarine-2.png","sugar-shack.png","summercamp.png","sumo-2.png","sunny.png","sunsetland.png","supermarket.png","surfacelift.png","surfing.png","surfpaddle.png","surveying-2.png","swimming.png","synagogue-2.png","taekwondo-2.png","tailor.png","takeaway.png","targ.png","taxiboat.png","taxi.png","taxiway.png","teahouse.png","tebletennis.png","telephone.png","temple-2.png","templehindu.png","tennis.png","terrace.png","textiles.png","text.png","theater.png","theft.png","themepark.png","therapy.png","theravadapagoda.png","theravadatemple.png","thunderstorm.png","ticket_office2.png","tidaldiamond.png","tiger-2.png","tires.png","toilets.png","tollstation.png","tools.png","tornado-2.png","torture.png","tower.png","townhouse.png","toys.png","trafficcamera.png","trafficlight.png","train.png","tramway.png","trash.png","travel_agency.png","treasure-mark.png","treedown.png","triskelion.png","trolley.png","truck3.png","tsunami.png","tunnel.png","turtle-2.png","tweet.png","ufo.png","umbrella-2.png","underground.png","university.png","u-pick_stand.png","usfootball.png","van.png","vespa.png","veterinary.png","videogames.png","video.png","villa.png","vineyard-2.png","volcano-2.png","volleyball.png","waiting.png","walkingtour.png","warehouse-2.png","war.png","watercraft.png","waterfall-2.png","watermill-2.png","waterpark.png","water.png","waterskiing.png","watertower.png","waterwell.png","waterwellpump.png","webcam.png","wedding.png","weights.png","wetlands.png","whale-2.png","wifi.png","wiki-export.png","wildlifecrossing.png","wind-2.png","windmill-2.png","windsurfing.png","windturbine.png","winebar.png","winetasting.png","woodshed.png","workoffice.png","workshop.png","worldheritagesite.png","world.png","worldwildway.png","wrestling-2.png","yoga.png","yooner.png","you-are-here-2.png","youthhostel.png","zombie-outbreak1.png","zoom.png","zoo.png"];

        function _tm_init(data) {
            if(data) {
                _pluginUrl = data['pluginurl'];
            }
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
                _tm_enableControls($.extend(_currentSelection.data('point'),{type: $('#tm_type').val()}));
            });
            $('#tm_icon').on('change', function() {
                _tm_enableControls($.extend(_currentSelection.data('point'),{icon: $('#tm_icon').val()}));
            });
            $('#tm_mapsymbols').find('a').on('click', function() {
                var dialog = $('<div></div>');

                var onclick = function(evt) {
                    $('#tm_mapsymbols').find('img').attr('src', $(this).attr('data-url'));
                    dialog.dialog('destroy');
                };

                var ul = $('<ul></ul>');
                for(var i = 0; i < _mapsymbols.length; i++) {
                    var url = _pluginUrl + 'media/mapsymbols/' + _mapsymbols[i];
                    var li = $('<li style="cursor:pointer;" data-url="'+ url +'"><img src="'+url+'"></img>'+_mapsymbols[i]+'</li>')
                    ul.append(li);
                    li.on('click', onclick);
                }
                dialog.append(ul);
                dialog.dialog({buttons: [
                        {text: "Cancel", click: function() {
                                $(this).dialog("destroy");
                            }}
                    ], minHeight:400, minWidth: 400, maxHeight:400});
                dialog.on('close', function() {
                    dialog.dialog('destroy');
                });
            });
            $('#tm_mapsymbols').find('img').attr('src', _pluginUrl + 'media/mapsymbols/information.png');
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
            if(data.icon === undefined || data.icon === "" || data.icon === null) {
                data.icon = "_default";
            }
            $('#tm_icon').val(data.icon);
            $('#tm_icon_color').val(data.iconColor);
            $('#tm_mapsymbols').find('img').attr('src', data.mapsymbols);
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
            $('#tm_mapsymbols').css('display', 'none');
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

            if(data.icon !== null && data.icon !== undefined && data.icon.charAt(0) !== "_") {
                $('#tm_icon_color').prop('disabled', false);
            }
            if(data.icon === "_mapsymbols") {
                $('#tm_mapsymbols').css('display', '');
            }

            if (data.type === 'marker' || data.type === 'post' || data.type === 'media') {
                $('#tm_type').prop('disabled', false);
                $('#tm_icon').prop('disabled', false);
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
                $('#tm_icon').prop('disabled', false);
                $('#tm_type').prop('disabled', false);
                $('#tm_title').prop('disabled', false);
                $('#tm_arrival').prop('disabled', false);
                $('#tm_departure').prop('disabled', false);
                $('#tm_lng').prop('disabled', false);
                $('#tm_lat').prop('disabled', false);

                $('#tm_place_at_address').prop('disabled', false);
                $('#tm_save_changes').prop('disabled', false);
            } else if (data.type === 'endsection') {
                $('#tm_icon').prop('disabled', false);
                $('#tm_type').prop('disabled', false);
                $('#tm_title').prop('disabled', false);
                $('#tm_lng').prop('disabled', false);
                $('#tm_lat').prop('disabled', false);
                $('#tm_arrival').prop('disabled', false);
                $('#tm_departure').prop('disabled', false);
                
                $('#tm_place_at_address').prop('disabled', false);
                $('#tm_save_changes').prop('disabled', false);
            } else if (data.type === 'startsection' || data.type === 'startendsection') {
                $('#tm_icon').prop('disabled', false);
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
                "mapsymbols" : $('#tm_mapsymbols').find('img').attr('src'),
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
            obj['version'] = "1.4.0";
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