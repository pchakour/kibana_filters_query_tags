import { PluginConfigDescriptor, PluginInitializerContext } from 'kibana/server';
import { FiltersQueryTagsPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new FiltersQueryTagsPlugin(initializerContext);
}

export { FiltersQueryTagsPluginSetup, FiltersQueryTagsPluginStart } from './types';
