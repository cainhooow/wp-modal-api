# Modal API - WordPress Plugin

Plugin de API de modais estilizados para WordPress que permite outros plugins criarem modais facilmente com um design moderno e elegante.

## 📁 Estrutura de Arquivos

```
wp-content/plugins/modal-api/
├── modal-api.php              (Arquivo principal do plugin)
├── assets/
│   ├── css/
│   │   └── modal-api.css      (Estilos do modal)
│   └── js/
│       └── modal-api.js       (JavaScript da API)
└── README.md                  (Este arquivo)
```

## 🚀 Instalação

1. Faça upload da pasta `modal-api` para `/wp-content/plugins/`
2. Ative o plugin através do menu 'Plugins' no WordPress
3. Pronto! A API está disponível globalmente via JavaScript

## 💻 Como Usar

### Método 1: JavaScript Direto

```javascript
jQuery(document).ready(function($) {
    // Criar modal simples
    ModalAPI.create({
        id: 'meu-modal',
        title: 'Buscar produtos...',
        body: '<p>Digite para buscar produtos...</p>',
        footer: '<button onclick="ModalAPI.close(\'meu-modal\')">Fechar</button>',
        width: '660px'
    });
});
```

### Método 2: Em um Plugin PHP

```php
function meu_plugin_adicionar_modal() {
    ?>
    <script>
    jQuery(document).ready(function($) {
        $('#meu-botao').on('click', function() {
            ModalAPI.create({
                id: 'modal-busca',
                title: 'Buscar produtos...',
                body: `
                    <input type="text" id="busca-input" placeholder="Digite aqui..." style="
                        width: 100%;
                        padding: 12px;
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.1);
                        border-radius: 6px;
                        color: #e5e5e5;
                        font-size: 14px;
                    ">
                    <div id="resultados" style="margin-top: 20px;">
                        <p style="color: #666;">Digite para buscar...</p>
                    </div>
                `,
                footer: `
                    <button onclick="ModalAPI.close('modal-busca')">Cancelar</button>
                    <button class="primary" onclick="realizarBusca()">Buscar</button>
                `,
                width: '700px',
                onOpen: function() {
                    console.log('Modal aberto!');
                    $('#busca-input').focus();
                },
                onClose: function() {
                    console.log('Modal fechado!');
                }
            });
        });
    });
    </script>
    <?php
}
add_action('wp_footer', 'meu_plugin_adicionar_modal');
```

### Método 3: Exemplo Completo (Estilo da Imagem)

```javascript
jQuery(document).ready(function($) {
    ModalAPI.create({
        id: 'modal-produtos',
        title: 'Buscar produtos...',
        body: `
            <div style="padding: 20px 0;">
                <h4 style="color: #999; font-size: 12px; margin-bottom: 10px; text-transform: uppercase;">
                    Resultados da busca
                </h4>
                <h5 style="color: #888; font-size: 11px; margin-bottom: 15px;">
                    Pesquisas recentes
                </h5>
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #666;">🔍</span>
                    <span style="color: #ccc;">teste</span>
                </div>
                <p style="color: #666; margin-top: 20px; font-size: 13px;">
                    Digite para buscar produtos...
                </p>
            </div>
        `,
        footer: '',
        width: '660px'
    });
});
```

## 📚 Métodos da API

### `ModalAPI.create(options)`

Cria e abre um novo modal.

**Opções:**

- `id` (string) - ID único do modal (obrigatório)
- `title` (string) - Título do modal
- `body` (string) - Conteúdo HTML do corpo
- `footer` (string) - Conteúdo HTML do rodapé (botões de ação)
- `width` (string) - Largura do modal (ex: '600px', '80%')
- `showClose` (boolean) - Mostrar botão X de fechar (padrão: true)
- `onOpen` (function) - Callback executado quando o modal abre
- `onClose` (function) - Callback executado quando o modal fecha

**Retorna:** ID do modal criado

```javascript
var modalId = ModalAPI.create({
    id: 'meu-modal',
    title: 'Título',
    body: '<p>Conteúdo</p>',
    footer: '<button>Ação</button>',
    width: '500px',
    onOpen: function() {
        console.log('Abriu!');
    }
});
```

### `ModalAPI.open(id)`

Abre um modal existente.

```javascript
ModalAPI.open('meu-modal');
```

### `ModalAPI.close(id)`

Fecha um modal específico.

```javascript
ModalAPI.close('meu-modal');
```

### `ModalAPI.closeAll()`

Fecha todos os modais abertos.

```javascript
ModalAPI.closeAll();
```

### `ModalAPI.update(id, options)`

Atualiza o conteúdo de um modal existente.

```javascript
ModalAPI.update('meu-modal', {
    title: 'Novo Título',
    body: '<p>Novo conteúdo</p>',
    footer: '<button>Nova ação</button>'
});
```

### `ModalAPI.destroy(id)`

Remove completamente um modal (fecha e remove do DOM).

```javascript
ModalAPI.destroy('meu-modal');
```

### `ModalAPI.isOpen(id)`

Verifica se um modal está aberto.

```javascript
if (ModalAPI.isOpen('meu-modal')) {
    console.log('Modal está aberto');
}
```

## 🎨 Estilos Personalizados

O modal já vem com um design moderno e escuro. Para adicionar estilos personalizados ao conteúdo:

```javascript
ModalAPI.create({
    id: 'modal-custom',
    title: 'Modal Customizado',
    body: `
        <div class="meu-conteudo-custom">
            <style>
                .meu-conteudo-custom {
                    /* Seus estilos aqui */
                }
            </style>
            <p>Conteúdo com estilo personalizado</p>
        </div>
    `
});
```

## ⌨️ Atalhos de Teclado

- **ESC** - Fecha todos os modais abertos
- Clicar no overlay (fundo escuro) também fecha os modais

## 🎯 Casos de Uso

- Formulários de busca
- Confirmações de ação
- Exibição de detalhes de produtos
- Galerias de imagens
- Formulários de contato
- Mensagens de aviso
- Qualquer conteúdo que precise ser exibido em uma camada superior

## 📝 Notas Técnicas

- O plugin usa jQuery (já incluído no WordPress)
- Scripts carregados com `defer` para melhor performance
- Z-index: 999998 (overlay) e 999999 (modal)
- Suporta múltiplos modais simultâneos
- Responsivo e otimizado para mobile
- Animações suaves com CSS transitions

## 🤝 Compatibilidade

- WordPress 5.0+
- PHP 7.0+
- Todos os navegadores modernos (Chrome, Firefox, Safari, Edge)