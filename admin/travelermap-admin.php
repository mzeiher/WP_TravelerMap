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

add_action( 'admin_init', 'travelermap_init' );
add_action( 'admin_menu', 'travelermap_create_admin_menu');
 
function travelermap_init() {
   wp_enqueue_script( 'jquery');
   wp_enqueue_script( 'jquery-ui-core');
   wp_enqueue_script( 'jquery-ui-sortable ');

   require_once (dirname (__FILE__) . '/travelermap-ajax.php');
   require_once (dirname (__FILE__) . '/travelermap-editmaps.php');
   require_once (dirname (__FILE__) . '/travelermap-editmap.php');
}

function travelermap_create_admin_menu() {
    add_menu_page( 'Travelermap', 'Travelermap', 'manage_options', 'travelermap_editmaps', 'travelermap_editmaps' );
}
 
?>