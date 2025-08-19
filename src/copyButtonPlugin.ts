import type MarkdownIt from 'markdown-it';
import { PluginSimple, Token } from 'markdown-it';

/**
 * Copy button plugin for Markdown-it
 * @param md - The Markdown-it instance
 */
const copyButtonPlugin: PluginSimple = (md: MarkdownIt) => {
    setCodeBlockRule(md);
    setInlineCodeBlockRule(md);
};

function setCodeBlockRule(md: MarkdownIt) {

    // Handle code blocks
    const defaultFence = md.renderer.rules.fence || function(tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: MarkdownIt.Renderer) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.fence = function(tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: MarkdownIt.Renderer) {

        // Generate unique ID for code block
        const blockId = `code-block-${(crypto.randomUUID())}`;

        // Create the copy button with data attributes instead of onclick
        const copyButton = `<button class="copy-button" data-code-block-id="${blockId}" title="Copy code">Copy</button>`;
        const defaultRender = defaultFence(tokens, idx, options, env, self);

        // Wrap everything in a container with the code block ID
        return `
        <div class="code-block-wrapper" id="${blockId}">
            ${copyButton}
            ${defaultRender}
        </div>
        `;
    };
}

function setInlineCodeBlockRule(md: MarkdownIt) {

    // Handle inline code blocks
    const defaultCodeInline = md.renderer.rules.code_inline || function(tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: MarkdownIt.Renderer) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.code_inline = function(tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: MarkdownIt.Renderer) {

        // Generate unique ID for inline code
        const inlineId = `inline-code-${crypto.randomUUID()}`;

        // Create a wrapper with copy functionality
        const copyButton = `<button class="copy-button-inline" data-inline-code-id="${inlineId}" title="Copy code">📋</button>`;
        const defaultRender = defaultCodeInline(tokens, idx, options, env, self);

        // Wrap the inline code with a container
        return `
        <span class="inline-code-wrapper" id="${inlineId}">
            ${defaultRender}
            ${copyButton}
        </span>
        `;
    };
}

export default copyButtonPlugin;
