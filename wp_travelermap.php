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

if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! defined( 'TM_VERSION' ) )	
	define( 'TM', '0.0.1' );
	
if ( ! defined( 'TM_URL' ) )
	define( 'TM_URL', plugin_dir_url( __FILE__ ) );

if ( !defined( 'TM_BASENAME' ) )
	define( 'TM_BASENAME', plugin_basename( __FILE__ ) );
	

global $wpdb;

$wpdb->nwm_routes = $wpdb->prefix . 'tm_routes';
$wpdb->nwm_custom = $wpdb->prefix . 'tm_layers';

require 'includes/travelermap_leaflet.php';

function tm_activate() {
	require 'admin/travelermap_install.php';
}

function tm_deactivate() {
	
}

if ( is_admin() ) {
    register_activation_hook( __FILE__, 'tm_activate' );
    register_deactivation_hook( __FILE__, 'tm_deactivate' );
        
    require 'admin/travelermap_admin.php';
} else {
    require 'frontend/travelermap_frontend.php';
}

?>