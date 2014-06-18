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

function travelermap_managemaps() {

    global $wpdb;

    $map_table = $wpdb->prefix . "travelermap_maps";
    $results = $wpdb->get_results("SELECT * FROM $map_table");

    if (isset($_POST['travelermap_managemaps'])) {
        check_admin_referer( 'travelermap_managemaps' );
        if (isset($_POST['action']) && $_POST['action'] == "travelermap_add_new_map") {
            $wpdb->query(
                    $wpdb->prepare(
                            "
                        INSERT INTO $map_table
                         (name, map)
                         VALUES
                         (%s,%s)
                        ", 'New Map', '{ "name":"New Map", "data":[]}'
                    )
            );
            wp_redirect(admin_url('admin.php?page=travelermap_managemaps'));
            exit();
        } elseif (isset($_POST['action']) && strpos($_POST['action'],"travelermap_delete_map_") == 0) {
            $mapId = intval(substr($_POST['action'], strlen("travelermap_delete_map_")));
            $wpdb->query(
                    $wpdb->prepare(
                            "
                        DELETE FROM $map_table
                         WHERE id = %d
                        ", $mapId
                    )
            );
            wp_redirect(admin_url('admin.php?page=travelermap_managemaps'));
            exit();
        }
    }
    ?>
    <h2>Manage Maps</h2>
    <form method="POST" action="admin.php?page=travelermap_managemaps" accept-charset="utf-8">
        <?php wp_nonce_field('travelermap_managemaps') ?>
        <input type="hidden" name="travelermap_managemaps" value="1" />
        <div class="tablenav top">
            <div class="alignleft actions">
                <button id="travelermap_add_map" type="submit" name="action" class="button-secondary action"  value="travelermap_add_new_map">Add New Map</button>
            </div>
        </div>

        <table class="wp-list-table widefat fixed" cellspacing="0">
            <thead>
                <tr>
                    <th id="id" scope="col" class="manage-column column-id sortable asc">ID</th>
                    <th id="name" scope="col" class="manage-column column-description">Name</th>
                    <th scope="col" class="manage-column column-description"></th>
                </tr>
            </thead>
            <tbody id="travelermap_map_list">
                <?php
                    $alternate_class = '';
                    foreach ( $results as $map ) {
                    $alternate_class = ( $alternate_class == 'class="alternate"' ) ? '' : 'class="alternate"';
                ?>
                    <tr <?php echo $alternate_class; ?>>
                    <td><?php echo absint( $map->id ); ?></td>
                    <td>
                    <a href="<?php echo admin_url( 'admin.php?page=travelermap_editmap&map_id=' . absint( $map->id ) ); ?>" class=""><?php echo esc_html( $map->name ); ?></a>
                    </td>
                    <td>
                        <button name="action" value="travelermap_delete_map_<?php echo absint( $map->id ); ?>">Delete</button>
                    </td>
                    </tr>
                <?php
                    }
                ?>    
            </tbody>
            <tfoot>
                <tr>
                    <th scope="col" class="manage-column column-id sortable asc">ID</th>
                    <th scope="col" class="manage-column column-description">Name</th>
                    <th scope="col" class="manage-column column-description"></th>
                </tr>
            </tfoot>
        </table>
    </form>
    <?php
}
?>
