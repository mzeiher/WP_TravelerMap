<?php
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
?>

<?php
function travelermap_editmap() {
?>

<?php
if(isset($_GET['map_id'])) {
    global $wpdb;
    
    $map_table = $wpdb->prefix . "travelermap_maps";
    $map = $wpdb->get_row(
            $wpdb->prepare(
                    "
                SELECT * FROM $map_table WHERE id = %d
                ", $_GET['map_id']
            )
    );
?>
<script type="text/javascript">
    (function($) {
    $(document).ready(function() {
    window.tm_init();
    window.tm_loadAdminMap('<?php echo $map->map ?>');    
    });
})(jQuery);
</script>
<?php
}   
?>
<div class="tm_mapoptions">
                <input id="travelermap_ajax_getpostnames" type="hidden" value="<?php echo wp_create_nonce('travelermap_ajax_getpostnames') ?>"/>
                <input id="travelermap_ajax_updatemap" type="hidden" value="<?php echo wp_create_nonce('travelermap_ajax_updatemap') ?>"/>
                <input id="travelermap_ajax_getpostinfos" type="hidden" value="<?php echo wp_create_nonce('travelermap_ajax_getpostinfos') ?>"/>
                <input id="tm_map_id" type="hidden" value="<?php echo $map->id ?>" />
		<label for="tm_map_name">Name</label>
		<input type="text" id="tm_map_name" /><br />
                <label for="tm_line_color">Line Color</label>
		<input type="text" id="tm_line_color" value="#03f" />
		<div class="tm_layer">
			<div class="tm_maplayer">
				<div class="tm_toolbar">
					<select id="tm_layer_select">
						<option value="OpenStreetMap.Mapnik">OpenStreetMap.Mapnik</option>
						<option value="OpenStreetMap.BlackAndWhite">OpenStreetMap.BlackAndWhite</option>
						<option value="OpenStreetMap.DE">OpenStreetMap.DE</option>
						<option value="OpenStreetMap.HOT">OpenStreetMap.HOT</option>
						<option value="Thunderforest.OpenCycleMap">Thunderforest.OpenCycleMap</option>
						<option value="Thunderforest.Transport">Thunderforest.Transport</option>
						<option value="Thunderforest.Landscape">Thunderforest.Landscape</option>
						<option value="Thunderforest.Outdoors">Thunderforest.Outdoors</option>
						<option value="OpenMapSurfer.Roads">OpenMapSurfer.Roads</option>
						<option value="OpenMapSurfer.Grayscale">OpenMapSurfer.Grayscale</option>
						<option value="MapQuestOpen.OSM">MapQuestOpen.OSM</option>
						<option value="MapQuestOpen.Aerial">MapQuestOpen.Aerial</option>
						<option value="Stamen.Toner">Stamen.Toner</option>
						<option value="Stamen.TonerBackground">Stamen.TonerBackground</option>
						<option value="Stamen.Terrain">Stamen.Terrain</option>
						<option value="Stamen.TerrainBackground">Stamen.TerrainBackground</option>
						<option value="Stamen.Watercolor">Stamen.Watercolor</option>
						<option value="Esri.WorldStreetMap">Esri.WorldStreetMap</option>
						<option value="Esri.DeLorme">Esri.DeLorme</option>
						<option value="Esri.WorldTopoMap">Esri.WorldTopoMap</option>
						<option value="Esri.WorldImagery">Esri.WorldImagery</option>
						<option value="Esri.WorldTerrain">Esri.WorldTerrain</option>
						<option value="Esri.WorldShadedRelief">Esri.WorldShadedRelief</option>
						<option value="Esri.WorldPhysica">Esri.WorldPhysica</option>
						<option value="Esri.OceanBasemap">Esri.OceanBasemap</option>
						<option value="Esri.NatGeoWorldMap">Esri.NatGeoWorldMap</option>
						<option value="Esri.WorldGrayCanvas">Esri.WorldGrayCanvas</option>
						<option value="HERE.normalDay">HERE.normalDay</option>
						<option value="HERE.normalDayCustom">HERE.normalDayCustom</option>
						<option value="HERE.normalDayGrey">HERE.normalDayGrey</option>
						<option value="HERE.normalDayMobile">HERE.normalDayMobile</option>
						<option value="HERE.normalDayGreyMobile">HERE.normalDayGreyMobile</option>
						<option value="HERE.normalDayTransit">HERE.normalDayTransit</option>
						<option value="HERE.normalDayTransitMobile">HERE.normalDayTransitMobile</option>
						<option value="HERE.normalNight">HERE.normalNight</option>
						<option value="HERE.normalNightMobile">HERE.normalNightMobile</option>
						<option value="HERE.normalNightGrey">HERE.normalNightGrey</option>
						<option value="HERE.normalNightGreyMobile">HERE.normalNightGreyMobile</option>
						<option value="HERE.carnavDayGrey">HERE.carnavDayGrey</option>
						<option value="HERE.hybridDay">HERE.hybridDay</option>
						<option value="HERE.hybridDayMobile">HERE.hybridDayMobile</option>
						<option value="HERE.pedestrianDay">HERE.pedestrianDay</option>
						<option value="HERE.pedestrianNight">HERE.pedestrianNight</option>
						<option value="HERE.satelliteDay">HERE.satelliteDay</option>
						<option value="HERE.terrainDay">HERE.terrainDay</option>
						<option value="HERE.terrainDayMobile">HERE.terrainDayMobile</option>
						<option value="Acetate.basemap">Acetate.basemap</option>
						<option value="Acetate.terrain">Acetate.terrain</option>
						<option value="Acetate.all">Acetate.all</option>
						<option value="Acetate.hillshading">Acetate.hillshading</option>
					</select>
					<button id="tm_addLayer">AddLayer</button>
				</div>
				<ul id="tm_layerlist">
				</ul>
			</div>
			<div class="tm_overlays">
				<div class="tm_toolbar">
					<select id="tm_overlays_select">
						<option value="OpenMapSurfer.AdminBounds">OpenMapSurfer.AdminBounds</option>
						<option value="Stamen.TonerHybrid">Stamen.TonerHybrid</option>
						<option value="Stamen.TonerLines">Stamen.TonerLines</option>
						<option value="Stamen.TonerLabels">Stamen.TonerLabels</option>
						<option value="OpenWeatherMap.Clouds">OpenWeatherMap.Clouds</option>
						<option value="OpenWeatherMap.CloudsClassic">OpenWeatherMap.CloudsClassic</option>
						<option value="OpenWeatherMap.Precipitation">OpenWeatherMap.Precipitation</option>
						<option value="OpenWeatherMap.PrecipitationClassic">OpenWeatherMap.PrecipitationClassic</option>
						<option value="OpenWeatherMap.Rain">OpenWeatherMap.Rain</option>
						<option value="OpenWeatherMap.RainClassic">OpenWeatherMap.RainClassic</option>
						<option value="OpenWeatherMap.Pressure">OpenWeatherMap.Pressure</option>
						<option value="OpenWeatherMap.PressureContour">OpenWeatherMap.PressureContour</option>
						<option value="OpenWeatherMap.Wind">OpenWeatherMap.Wind</option>
						<option value="OpenWeatherMap.Temperature">OpenWeatherMap.Temperature</option>
						<option value="OpenWeatherMap.Snow">OpenWeatherMap.Snow</option>
						<option value="Acetate.foreground">Acetate.foreground</option>
						<option value="Acetate.roads">Acetate.roads</option>
						<option value="Acetate.labels">Acetate.labels</option>
					</select>
					<button id="tm_addOverlay">AddOverlay</button>
				</div>
				<ul id="tm_overlaylist">
				</ul>
			</div>
		</div>
	</div>
	<div class="tm_pointdetails">
		<div class="tm_form">
                        <input type="hidden" id="tm_postid" value="-1" disabled="true"/>
                        <input type="hidden" id="tm_mediaid" value="-1" disabled="true"/>
			<label for="tm_type">Type</label>
			<select id="tm_type" disabled="true">
				<option value="marker">Marker</option>
				<option value="post">Post</option>
				<option value="media">Media</option>
				<option value="waypoint">Waypoint</option>
				<option value="startsection">Start Section</option>
				<option value="endsection">End Section</option>
			</select><br />
                        <label for="tm_icon">Marker Symbol</label>
                        <select id="tm_icon" style="font-family: FontAwesome;">
                            <option value="">Default</option><option value="adjust"></option><option value="adn"></option><option value="align-center"></option><option value="align-justify"></option><option value="align-left"></option><option value="align-right"></option><option value="ambulance"></option><option value="anchor"></option><option value="android"></option><option value="angle-double-down"></option><option value="angle-double-left"></option><option value="angle-double-right"></option><option value="angle-double-up"></option><option value="angle-down"></option><option value="angle-left"></option><option value="angle-right"></option><option value="angle-up"></option><option value="apple"></option><option value="archive"></option><option value="arrow-circle-down"></option><option value="arrow-circle-left"></option><option value="arrow-circle-o-down"></option><option value="arrow-circle-o-left"></option><option value="arrow-circle-o-right"></option><option value="arrow-circle-o-up"></option><option value="arrow-circle-right"></option><option value="arrow-circle-up"></option><option value="arrow-down"></option><option value="arrow-left"></option><option value="arrow-right"></option><option value="arrow-up"></option><option value="arrows"></option><option value="arrows-alt"></option><option value="arrows-h"></option><option value="arrows-v"></option><option value="asterisk"></option><option value="automobile"></option><option value="backward"> </option><option value="ban"></option><option value="bank"></option><option value="bar-chart-o"> </option><option value="barcode"></option><option value="bars"></option><option value="beer"></option><option value="behance"></option><option value="behance-square"></option><option value="bell"></option><option value="bell-o"></option><option value="bitbucket"></option><option value="bitbucket-square"></option><option value="bitcoin"></option><option value="bold"> </option><option value="bolt"></option><option value="bomb"></option><option value="book"></option><option value="bookmark"></option><option value="bookmark-o"></option><option value="briefcase"></option><option value="btc"></option><option value="bug"></option><option value="building"></option><option value="building-o"></option><option value="bullhorn"></option><option value="bullseye"></option><option value="cab"></option><option value="calendar"> </option><option value="calendar-o"></option><option value="camera"></option><option value="camera-retro"></option><option value="car"></option><option value="caret-down"></option><option value="caret-left"></option><option value="caret-right"></option><option value="caret-square-o-down"></option><option value="caret-square-o-left"></option><option value="caret-square-o-right"></option><option value="caret-square-o-up"></option><option value="caret-up"></option><option value="certificate"></option><option value="chain"></option><option value="chain-broken"> </option><option value="check"></option><option value="check-circle"></option><option value="check-circle-o"></option><option value="check-square"></option><option value="check-square-o"></option><option value="chevron-circle-down"></option><option value="chevron-circle-left"></option><option value="chevron-circle-right"></option><option value="chevron-circle-up"></option><option value="chevron-down"></option><option value="chevron-left"></option><option value="chevron-right"></option><option value="chevron-up"></option><option value="child"></option><option value="circle"></option><option value="circle-o"></option><option value="circle-o-notch"></option><option value="circle-thin"></option><option value="clipboard"></option><option value="clock-o"></option><option value="cloud"></option><option value="cloud-download"></option><option value="cloud-upload"></option><option value="cny"></option><option value="code"> </option><option value="code-fork"></option><option value="codepen"></option><option value="coffee"></option><option value="cog"></option><option value="cogs"></option><option value="columns"></option><option value="comment"></option><option value="comment-o"></option><option value="comments"></option><option value="comments-o"></option><option value="compass"></option><option value="compress"></option><option value="copy"></option><option value="credit-card"> </option><option value="crop"></option><option value="crosshairs"></option><option value="css3"></option><option value="cube"></option><option value="cubes"></option><option value="cut"></option><option value="cutlery"> </option><option value="dashboard"></option><option value="database"> </option><option value="dedent"></option><option value="delicious"> </option><option value="desktop"></option><option value="deviantart"></option><option value="digg"></option><option value="dollar"></option><option value="dot-circle-o"> </option><option value="download"></option><option value="dribbble"></option><option value="dropbox"></option><option value="drupal"></option><option value="edit"></option><option value="eject"> </option><option value="ellipsis-h"></option><option value="ellipsis-v"></option><option value="empire"></option><option value="envelope"></option><option value="envelope-o"></option><option value="envelope-square"></option><option value="eraser"></option><option value="eur"></option><option value="euro"></option><option value="exchange"> </option><option value="exclamation"></option><option value="exclamation-circle"></option><option value="exclamation-triangle"></option><option value="expand"></option><option value="external-link"></option><option value="external-link-square"></option><option value="eye"></option><option value="eye-slash"></option><option value="facebook"></option><option value="facebook-square"></option><option value="fast-backward"></option><option value="fast-forward"></option><option value="fax"></option><option value="female"></option><option value="fighter-jet"></option><option value="file"></option><option value="file-archive-o"></option><option value="file-audio-o"></option><option value="file-code-o"></option><option value="file-excel-o"></option><option value="file-image-o"></option><option value="file-movie-o"></option><option value="file-o"> </option><option value="file-pdf-o"></option><option value="file-photo-o"></option><option value="file-picture-o"> </option><option value="file-powerpoint-o"> </option><option value="file-sound-o"></option><option value="file-text"> </option><option value="file-text-o"></option><option value="file-video-o"></option><option value="file-word-o"></option><option value="file-zip-o"></option><option value="files-o"> </option><option value="film"></option><option value="filter"></option><option value="fire"></option><option value="fire-extinguisher"></option><option value="flag"></option><option value="flag-checkered"></option><option value="flag-o"></option><option value="flash"></option><option value="flask"> </option><option value="flickr"></option><option value="floppy-o"></option><option value="folder"></option><option value="folder-o"></option><option value="folder-open"></option><option value="folder-open-o"></option><option value="font"></option><option value="forward"></option><option value="foursquare"></option><option value="frown-o"></option><option value="gamepad"></option><option value="gavel"></option><option value="gbp"></option><option value="ge"></option><option value="gear"> </option><option value="gears"> </option><option value="gift"> </option><option value="git"></option><option value="git-square"></option><option value="github"></option><option value="github-alt"></option><option value="github-square"></option><option value="gittip"></option><option value="glass"></option><option value="globe"></option><option value="google"></option><option value="google-plus"></option><option value="google-plus-square"></option><option value="graduation-cap"></option><option value="group"></option><option value="h-square"> </option><option value="hacker-news"></option><option value="hand-o-down"></option><option value="hand-o-left"></option><option value="hand-o-right"></option><option value="hand-o-up"></option><option value="hdd-o"></option><option value="header"></option><option value="headphones"></option><option value="heart"></option><option value="heart-o"></option><option value="history"></option><option value="home"></option><option value="hospital-o"></option><option value="html5"></option><option value="image"></option><option value="inbox"> </option><option value="indent"></option><option value="info"></option><option value="info-circle"></option><option value="inr"></option><option value="instagram"></option><option value="institution"></option><option value="italic"> </option><option value="joomla"></option><option value="jpy"></option><option value="jsfiddle"></option><option value="key"></option><option value="keyboard-o"></option><option value="krw"></option><option value="language"></option><option value="laptop"></option><option value="leaf"></option><option value="legal"></option><option value="lemon-o"> </option><option value="level-down"></option><option value="level-up"></option><option value="life-bouy"></option><option value="life-ring"> </option><option value="life-saver"></option><option value="lightbulb-o"> </option><option value="link"></option><option value="linkedin"></option><option value="linkedin-square"></option><option value="linux"></option><option value="list"></option><option value="list-alt"></option><option value="list-ol"></option><option value="list-ul"></option><option value="location-arrow"></option><option value="lock"></option><option value="long-arrow-down"></option><option value="long-arrow-left"></option><option value="long-arrow-right"></option><option value="long-arrow-up"></option><option value="magic"></option><option value="magnet"></option><option value="mail-forward"></option><option value="mail-reply"> </option><option value="mail-reply-all"> </option><option value="male"> </option><option value="map-marker"></option><option value="maxcdn"></option><option value="medkit"></option><option value="meh-o"></option><option value="microphone"></option><option value="microphone-slash"></option><option value="minus"></option><option value="minus-circle"></option><option value="minus-square"></option><option value="minus-square-o"></option><option value="mobile"></option><option value="mobile-phone"></option><option value="money"> </option><option value="moon-o"></option><option value="mortar-board"></option><option value="music"> </option><option value="navicon"></option><option value="openid"> </option><option value="outdent"></option><option value="pagelines"></option><option value="paper-plane"></option><option value="paper-plane-o"></option><option value="paperclip"></option><option value="paragraph"></option><option value="paste"></option><option value="pause"> </option><option value="paw"></option><option value="pencil"></option><option value="pencil-square"></option><option value="pencil-square-o"></option><option value="phone"></option><option value="phone-square"></option><option value="photo"></option><option value="picture-o"> </option><option value="pied-piper"></option><option value="pied-piper-alt"></option><option value="pied-piper-square"></option><option value="pinterest"> </option><option value="pinterest-square"></option><option value="plane"></option><option value="play"></option><option value="play-circle"></option><option value="play-circle-o"></option><option value="plus"></option><option value="plus-circle"></option><option value="plus-square"></option><option value="plus-square-o"></option><option value="power-off"></option><option value="print"></option><option value="puzzle-piece"></option><option value="qq"></option><option value="qrcode"></option><option value="question"></option><option value="question-circle"></option><option value="quote-left"></option><option value="quote-right"></option><option value="ra"></option><option value="random"> </option><option value="rebel"></option><option value="recycle"></option><option value="reddit"></option><option value="reddit-square"></option><option value="refresh"></option><option value="renren"></option><option value="reorder"></option><option value="repeat"> </option><option value="reply"></option><option value="reply-all"></option><option value="retweet"></option><option value="rmb"></option><option value="road"> </option><option value="rocket"></option><option value="rotate-left"></option><option value="rotate-right"> </option><option value="rouble"> </option><option value="rss"> </option><option value="rss-square"></option><option value="rub"></option><option value="ruble"></option><option value="rupee"> </option><option value="save"> </option><option value="scissors"> </option><option value="search"></option><option value="search-minus"></option><option value="search-plus"></option><option value="send"></option><option value="send-o"> </option><option value="share"> </option><option value="share-alt"></option><option value="share-alt-square"></option><option value="share-square"></option><option value="share-square-o"></option><option value="shield"></option><option value="shopping-cart"></option><option value="sign-in"></option><option value="sign-out"></option><option value="signal"></option><option value="sitemap"></option><option value="skype"></option><option value="slack"></option><option value="sliders"></option><option value="smile-o"></option><option value="sort"></option><option value="sort-alpha-asc"></option><option value="sort-alpha-desc"></option><option value="sort-amount-asc"></option><option value="sort-amount-desc"></option><option value="sort-asc"></option><option value="sort-desc"></option><option value="sort-down"></option><option value="sort-numeric-asc"> </option><option value="sort-numeric-desc"></option><option value="sort-up"></option><option value="soundcloud"> </option><option value="space-shuttle"></option><option value="spinner"></option><option value="spoon"></option><option value="spotify"></option><option value="square"></option><option value="square-o"></option><option value="stack-exchange"></option><option value="stack-overflow"></option><option value="star"></option><option value="star-half"></option><option value="star-half-empty"></option><option value="star-half-full"> </option><option value="star-half-o"> </option><option value="star-o"></option><option value="steam"></option><option value="steam-square"></option><option value="step-backward"></option><option value="step-forward"></option><option value="stethoscope"></option><option value="stop"></option><option value="strikethrough"></option><option value="stumbleupon"></option><option value="stumbleupon-circle"></option><option value="subscript"></option><option value="suitcase"></option><option value="sun-o"></option><option value="superscript"></option><option value="support"></option><option value="table"> </option><option value="tablet"></option><option value="tachometer"></option><option value="tag"></option><option value="tags"></option><option value="tasks"></option><option value="taxi"></option><option value="tencent-weibo"></option><option value="terminal"></option><option value="text-height"></option><option value="text-width"></option><option value="th"></option><option value="th-large"></option><option value="th-list"></option><option value="thumb-tack"></option><option value="thumbs-down"></option><option value="thumbs-o-down"></option><option value="thumbs-o-up"></option><option value="thumbs-up"></option><option value="ticket"></option><option value="times"></option><option value="times-circle"></option><option value="times-circle-o"></option><option value="tint"></option><option value="toggle-down"></option><option value="toggle-left"> </option><option value="toggle-right"> </option><option value="toggle-up"> </option><option value="trash-o"> </option><option value="tree"></option><option value="trello"></option><option value="trophy"></option><option value="truck"></option><option value="try"></option><option value="tumblr"></option><option value="tumblr-square"></option><option value="turkish-lira"></option><option value="twitter"> </option><option value="twitter-square"></option><option value="umbrella"></option><option value="underline"></option><option value="undo"></option><option value="university"></option><option value="unlink"></option><option value="unlock"> </option><option value="unlock-alt"></option><option value="unsorted"></option><option value="upload"> </option><option value="usd"></option><option value="user"></option><option value="user-md"></option><option value="users"></option><option value="video-camera"></option><option value="vimeo-square"></option><option value="vine"></option><option value="vk"></option><option value="volume-down"></option><option value="volume-off"></option><option value="volume-up"></option><option value="warning"></option><option value="wechat"> </option><option value="weibo"> </option><option value="weixin"></option><option value="wheelchair"></option><option value="windows"></option><option value="won"></option><option value="wordpress"> </option><option value="wrench"></option><option value="xing"></option><option value="xing-square"></option><option value="yahoo"></option><option value="yen"></option><option value="youtube"> </option><option value="youtube-play"></option><option value="youtube-square"></option>
                        </select><br />
                        <label for="tm_icon_color">Icon Color</label>
			<select id="tm_icon_color" disabled="true">
				<option value="red">red</option>
                                <option value="darkred">darkred</option>
                                <option value="orange">orange</option>
                                <option value="green">green</option>
                                <option value="darkgreen">darkgreen</option>
                                <option value="blue">blue</option>
                                <option value="purple">purple</option>
                                <option value="darkpuple">darkpuple</option>
                                <option value="cadetblue">cadetblue</option>
				
			</select><br />
			<label for="tm_title">Title</label>
			<input type="text" id="tm_title" disabled="true"/><br />
			<label for="tm_thumbnail">Thumbnail</label>
			<input type="text" id="tm_thumbnail" disabled="true" /><br />
                        <label for="tm_fullsize">Fullsize</label>
			<input type="text" id="tm_fullsize" disabled="true" /><br />
			<label for="tm_description">Description</label>
			<textarea id="tm_description" disabled="true" ></textarea><br />
			<label for="tm_link">Link</label>
			<input type="text" id="tm_link" disabled="true" /><br />
			<label for="tm_excludefrompath">Exclude From Path</label>
			<input type="checkbox" id="tm_excludefrompath" disabled="true"  /><br />
			<label for="tm_lat">Lat</label>
			<input type="text" id="tm_lat" disabled="true"  /><br />
			<label for="tm_lng">Lng</label>
			<input type="text" id="tm_lng" disabled="true"  /><br />
			<label for="tm_arrival">Arrival</label>
			<input type="text" id="tm_arrival" disabled="true"  /><br />
			<label for="tm_departure">Departure</label>
			<input type="text" id="tm_departure" disabled="true"  /><br />
			<button id="tm_linkToMedia" disabled="true" >Link To Media</button><button id="tm_linkToPost" disabled="true" >Link To Post</button><button id="tm_saveChanges" disabled="true" >Save Changes</button>
		</div>
		<div class="tm_preview_map" style="height: 300px;" id="tm_preview_map" data-mapid="0"></div>
	</div>
	<div class="tm_points">
		<div class="tm_toolbar">
			<button id="tm_addPoint">AddPoint</button><button id="tm_saveMap">Save Map</button><button id="tm_previewMap">Preview Map</button>
		</div>
		<ul id="tm_pointlist">
		</ul>
	</div>
	<textarea id="output"></textarea><button id="tm_loadMap">LoadMap</button>
        
<?php
}
?>
