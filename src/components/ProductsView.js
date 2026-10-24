/* ==========================================================================
   PINAS KIT — CATÁLOGO DE PRODUTOS E SERVIÇOS (/painel/crm/produtos)
   Fielmente baseado na engenharia reversa do CentralKit
   ========================================================================== */

import { StorageService, formatCurrencyBRL } from '../services/storage.js';

export function renderProductsView() {
  const products = StorageService.getProducts();

  return `
    <div class="pk-page-container" style="animation: pkFadeIn 0.3s ease;">
      <!-- CABEÇALHO COM BOTÃO VOLTAR (CENTRALKIT PARITY) -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <!-- Link Voltar ao Funil -->
          <button type="button" id="btn-back-to-crm" class="pk-btn pk-btn-ghost pk-btn-xs" style="margin-bottom: 8px; color: var(--pk-text-muted); font-size: 13px; font-weight: 600; padding: 4px 8px; display: inline-flex; align-items: center; gap: 6px;">
            <span>←</span>
            <span>Voltar ao funil</span>
          </button>
          
          <h1 style="font-size: 26px; font-weight: 800; color: var(--pk-text-primary); margin: 0 0 6px 0; letter-spacing: -0.5px;">
            Produtos e serviços
          </h1>
          <p style="font-size: 14px; color: var(--pk-text-secondary); margin: 0;">
            Cadastre os itens do seu portfólio para associar aos negócios no CRM e automatizar valores.
          </p>
        </div>

        <div>
          <button class="pk-btn pk-btn-primary" id="btn-open-new-product" style="font-size: 13px; font-weight: 700;">
            <span>+</span>
            <span>Novo item</span>
          </button>
        </div>
      </div>

      <!-- TABELA DE PRODUTOS E SERVIÇOS -->
      <div class="pk-card" style="padding: 0; overflow: hidden; border: 1px solid var(--pk-border);">
        ${products.length === 0 ? `
          <div style="padding: 48px 24px; text-align: center; color: var(--pk-text-muted); font-size: 14px;">
            Nenhum produto ou serviço cadastrado ainda.
          </div>
        ` : `
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px;">
            <thead>
              <tr style="border-bottom: 1.5px solid var(--pk-border); background: var(--pk-bg-subtle); color: var(--pk-text-secondary); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                <th style="padding: 14px 18px;">Nome</th>
                <th style="padding: 14px 18px; width: 160px;">Tipo</th>
                <th style="padding: 14px 18px; text-align: right; width: 180px;">Preço</th>
                <th style="padding: 14px 18px; text-align: right; width: 100px;">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(item => `
                <tr style="border-bottom: 1px solid var(--pk-border); transition: background 120ms ease;">
                  <!-- Nome (Célula Editável Inline) -->
                  <td style="padding: 14px 18px; font-weight: 600; color: var(--pk-text-primary);">
                    <span class="editable-product-field" data-id="${item.id}" data-field="name" title="Clique para editar o nome" style="cursor: pointer; border-bottom: 1px dotted var(--pk-primary); padding: 2px 4px;">
                      ${item.name}
                    </span>
                  </td>

                  <!-- Tipo (Produto vs Serviço com seletor inline) -->
                  <td style="padding: 14px 18px;">
                    <select class="pk-input select-product-kind" data-id="${item.id}" style="height: 32px; padding: 4px 8px; font-size: 12.5px; border-radius: 6px; cursor: pointer; width: 120px;">
                      <option value="service" ${item.kind === 'service' ? 'selected' : ''}>Serviço</option>
                      <option value="product" ${item.kind === 'product' ? 'selected' : ''}>Produto</option>
                    </select>
                  </td>

                  <!-- Preço (Célula Editável Inline com formatação R$) -->
                  <td style="padding: 14px 18px; text-align: right; font-weight: 700; color: var(--pk-text-primary); font-variant-numeric: tabular-nums;">
                    <span class="editable-product-field" data-id="${item.id}" data-field="price" title="Clique para editar o preço" style="cursor: pointer; border-bottom: 1px dotted var(--pk-success); padding: 2px 4px; color: #10B981;">
                      ${formatCurrencyBRL(item.price_cents)}
                    </span>
                  </td>

                  <!-- Ações (Excluir com Confirmação) -->
                  <td style="padding: 14px 18px; text-align: right;">
                    <button type="button" class="btn-product-delete pk-btn-ghost pk-btn-xs" data-id="${item.id}" data-name="${item.name}" title="Excluir item" style="color: var(--pk-danger); font-size: 14px; cursor: pointer; border: none; background: none;">
                      🗑️
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `;
}
