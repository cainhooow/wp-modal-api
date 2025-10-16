/**
 * Modal API - JavaScript
 * Arquivo: assets/js/modal-api.js
 */

(function ($) {
    'use strict';

    window.ModalAPI = {
        modals: {},

        /**
         * Criar um novo modal
         * @param {Object} options - Configurações do modal
         * @param {string} options.id - ID único do modal
         * @param {string} options.title - Título do modal
         * @param {string} options.body - Conteúdo HTML do corpo
         * @param {string} options.footer - Conteúdo HTML do rodapé
         * @param {string} options.width - Largura do modal (ex: '600px')
         * @param {boolean} options.showClose - Mostrar botão de fechar
         * @param {function} options.onOpen - Callback ao abrir
         * @param {function} options.onClose - Callback ao fechar
         */
        create: function (options) {
            const defaults = {
                id: 'modal-' + Date.now(),
                title: '',
                body: '',
                footer: '',
                width: '600px',
                showClose: true,
                onOpen: null,
                onClose: null
            };

            const settings = $.extend({}, defaults, options);

            // Se o modal já existe, apenas atualizar e abrir
            if (this.modals[settings.id]) {
                this.update(settings.id, settings);
                this.open(settings.id);
                return settings.id;
            }

            // Criar overlay se não existir
            if ($('#modal-api-overlay').length === 0) {
                $('body').append('<div id="modal-api-overlay" class="modal-api-overlay"></div>');

                $('#modal-api-overlay').on('click', function () {
                    ModalAPI.closeAll();
                });
            }

            // Criar estrutura do modal
            const modalHTML = `
                <div id="${settings.id}" class="modal-api-container" style="width: ${settings.width}">
                    <div class="modal-api-header">
                        <h3 class="modal-api-title">${settings.title}</h3>
                        ${settings.showClose ? '<button class="modal-api-close" aria-label="Fechar">&times;</button>' : ''}
                    </div>
                    <div class="modal-api-body">
                        ${settings.body}
                    </div>
                    ${settings.footer ? `<div class="modal-api-footer">${settings.footer}</div>` : ''}
                </div>
            `;

            $('#modal-api-root').append(modalHTML);

            // Adicionar evento de fechar
            $(`#${settings.id} .modal-api-close`).on('click', function () {
                ModalAPI.close(settings.id);
            });

            // Prevenir fechar ao clicar no modal
            $(`#${settings.id}`).on('click', function (e) {
                e.stopPropagation();
            });

            // Armazenar configurações
            this.modals[settings.id] = settings;

            // Abrir modal
            this.open(settings.id);

            return settings.id;
        },

        /**
         * Abrir um modal existente
         * @param {string} id - ID do modal
         */
        open: function (id) {
            if (!this.modals[id]) {
                console.error('Modal não encontrado:', id);
                return;
            }

            // Mostrar overlay
            $('#modal-api-overlay').addClass('active');

            // Mostrar modal
            setTimeout(() => {
                $(`#${id}`).addClass('active');
            }, 10);

            // Callback
            if (this.modals[id].onOpen) {
                this.modals[id].onOpen();
            }

            // Prevenir scroll no body
            $('body').css('overflow', 'hidden');
        },

        /**
         * Fechar um modal
         * @param {string} id - ID do modal
         */
        close: function (id) {
            if (!this.modals[id]) {
                console.error('Modal não encontrado:', id);
                return;
            }

            // Callback antes de fechar
            if (this.modals[id].onClose) {
                this.modals[id].onClose();
            }

            // Remover classe active
            $(`#${id}`).removeClass('active');

            // Verificar se há outros modais abertos
            setTimeout(() => {
                if ($('.modal-api-container.active').length === 0) {
                    $('#modal-api-overlay').removeClass('active');
                    $('body').css('overflow', '');
                }
            }, 300);
        },

        /**
         * Fechar todos os modais
         */
        closeAll: function () {
            $('.modal-api-container.active').removeClass('active');
            $('#modal-api-overlay').removeClass('active');
            $('body').css('overflow', '');

            // Callbacks
            Object.keys(this.modals).forEach(id => {
                if (this.modals[id].onClose) {
                    this.modals[id].onClose();
                }
            });
        },

        /**
         * Atualizar conteúdo de um modal
         * @param {string} id - ID do modal
         * @param {Object} options - Novas configurações
         */
        update: function (id, options) {
            if (!this.modals[id]) {
                console.error('Modal não encontrado:', id);
                return;
            }

            const $modal = $(`#${id}`);

            if (options.title !== undefined) {
                $modal.find('.modal-api-title').html(options.title);
            }

            if (options.body !== undefined) {
                $modal.find('.modal-api-body').html(options.body);
            }

            if (options.footer !== undefined) {
                if (options.footer) {
                    if ($modal.find('.modal-api-footer').length) {
                        $modal.find('.modal-api-footer').html(options.footer);
                    } else {
                        $modal.append(`<div class="modal-api-footer">${options.footer}</div>`);
                    }
                } else {
                    $modal.find('.modal-api-footer').remove();
                }
            }

            if (options.width !== undefined) {
                $modal.css('width', options.width);
            }

            // Atualizar configurações armazenadas
            this.modals[id] = $.extend({}, this.modals[id], options);
        },

        /**
         * Destruir um modal completamente
         * @param {string} id - ID do modal
         */
        destroy: function (id) {
            if (!this.modals[id]) {
                console.error('Modal não encontrado:', id);
                return;
            }

            this.close(id);

            setTimeout(() => {
                $(`#${id}`).remove();
                delete this.modals[id];
            }, 300);
        },

        /**
         * Verificar se um modal está aberto
         * @param {string} id - ID do modal
         * @returns {boolean}
         */
        isOpen: function (id) {
            return $(`#${id}`).hasClass('active');
        }
    };

    // Fechar modal com ESC
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            ModalAPI.closeAll();
        }
    });

})(jQuery);