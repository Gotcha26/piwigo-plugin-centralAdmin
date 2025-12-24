function central_admin_generate_css_vars(array $config): string
{
    $css = '';

    // Layout
    foreach ($config['layout'] as $key => $value) {
        $css .= "--ca-" . str_replace('_', '-', $key) . ": {$value}px;\n";
    }

    // Colors
    foreach ($config['colors'] as $scheme => $colors) {
        foreach ($colors as $key => $value) {
            $css .= "--ca-{$scheme}-" . str_replace('_', '-', $key) . ": {$value};\n";
        }
    }

    return $css;
}
