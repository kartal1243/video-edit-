import { ClipForgePlugin, FrameContext } from '../types/plugin';
import { Clip } from '../types/editor';

export class PluginRegistry {
  private static plugins: Map<string, ClipForgePlugin> = new Map();

  /**
   * Register a new editing plugin/skill
   */
  static register(plugin: ClipForgePlugin): void {
    // Check local storage for user enabled/disabled preference
    const savedState = localStorage.getItem(`clipforge_plugin_${plugin.id}`);
    if (savedState !== null) {
      plugin.enabled = savedState === 'true';
    }

    if (plugin.initialize && plugin.enabled) {
      try {
        plugin.initialize();
      } catch (err) {
        console.warn(`Plugin ${plugin.id} initialize failed:`, err);
      }
    }

    this.plugins.set(plugin.id, plugin);
  }

  /**
   * Get all registered plugins
   */
  static getAll(): ClipForgePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Toggle a plugin's enabled status
   */
  static setEnabled(pluginId: string, enabled: boolean): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    plugin.enabled = enabled;
    localStorage.setItem(`clipforge_plugin_${pluginId}`, String(enabled));

    if (enabled && plugin.initialize) {
      plugin.initialize();
    } else if (!enabled && plugin.destroy) {
      plugin.destroy();
    }
  }

  /**
   * Execute beforeRenderFrame hooks for all enabled plugins
   */
  static runBeforeRender(context: FrameContext): void {
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled && plugin.beforeRenderFrame) {
        try {
          plugin.beforeRenderFrame(context);
        } catch (err) {
          console.warn(`Plugin ${plugin.id} beforeRender error:`, err);
        }
      }
    }
  }

  /**
   * Execute afterRenderFrame hooks for all enabled plugins
   */
  static runAfterRender(context: FrameContext): void {
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled && plugin.afterRenderFrame) {
        try {
          plugin.afterRenderFrame(context);
        } catch (err) {
          console.warn(`Plugin ${plugin.id} afterRender error:`, err);
        }
      }
    }
  }

  /**
   * Check if any enabled plugin handles custom element drawing
   */
  static tryCustomDraw(element: Clip, context: FrameContext): boolean {
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled && plugin.customDrawElement) {
        try {
          const handled = plugin.customDrawElement(element, context);
          if (handled) return true;
        } catch (err) {
          console.warn(`Plugin ${plugin.id} customDraw error:`, err);
        }
      }
    }
    return false;
  }
}
