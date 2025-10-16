<?php

/**
 * Plugin Name: Modal API
 * Description: API de modais estilizados para integração com outros plugins wordpress
 * Version: 1.0.1
 * Author: Cainhooow
 * License: MIT
 * Text Domain: modal-api
 */

if (!defined('ABSPATH')) {
    exit;
}

class MODAL_API
{
    private static $instance = null;

    public static function get_instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('wp_footer', [$this, 'render_modal_container']);
        add_action('admin_footer', [$this, 'render_modal_container']);
    }

    public function enqueue_assets()
    {
        wp_enqueue_style(
            'modal-api-styles',
            plugin_dir_url(__FILE__) . 'assets/css/modal-api.css',
            [],
            '1.0.1'
        );

        wp_enqueue_script(
            'modal-api-script',
            plugin_dir_url(__FILE__) . 'assets/js/modal-api.js',
            ['jquery'],
            '1.0.1',
            ['strategy' => 'defer', 'in_footer' => true]
        );
    }

    public function render_modal_container()
    {
        echo '<div id="modal-api-root"></div>';
    }
}

MODAL_API::get_instance();

/**
 * Função helper para outros plugins usarem
 * 
 * Exemplo de uso:
 * 
 * modal_api_create([
 *     'id' => 'meu-modal',
 *     'title' => 'Título do Modal',
 *     'body' => '<p>Conteúdo do modal</p>',
 *     'footer' => '<button onclick="ModalAPI.close(\'meu-modal\')">Fechar</button>'
 * ]);
 */
function modal_api_create($args = [])
{
    $defaults = [
        'id' => 'modal-' . uniqid(),
        'title' => '',
        'body' => '',
        'footer' => '',
        'width' => '600px',
        'show_close' => true
    ];

    $args = wp_parse_args($args, $defaults);
    ob_start();
?>

    <script>
        jQuery(document).ready(function($) {
            ModalAPI.create({
                id: '<?php echo esc_js($args['id']); ?>',
                title: '<?php echo esc_js($args['title']); ?>',
                body: <?php echo json_encode($args['body']); ?>,
                footer: <?php echo json_encode($args['footer']); ?>,
                width: '<?php echo esc_js($args['width']); ?>',
                showClose: <?php echo $args['show_close'] ? 'true' : 'false'; ?>
            })
        })
    </script>
<?php
    echo ob_get_clean();
}
