import { PluginRegistry } from '../services/pluginRegistry';
import { subtitlesPlugin } from './subtitlesPlugin';
import { particlesPlugin } from './particlesPlugin';
import { deviceMockupPlugin } from './deviceMockupPlugin';

export function initializePlugins(): void {
  PluginRegistry.register(subtitlesPlugin);
  PluginRegistry.register(particlesPlugin);
  PluginRegistry.register(deviceMockupPlugin);
}
