import { CoreSetup, CoreStart, Plugin } from 'kibana/server';
import { schema } from '@kbn/config-schema';
import { FiltersQueryTagsPluginSetup, FiltersQueryTagsPluginStart } from './types';
import { UISETTINGS_SHOW_TAGS } from '../common';

export class FiltersQueryTagsPlugin
  implements Plugin<FiltersQueryTagsPluginSetup, FiltersQueryTagsPluginSetup> {
  public setup(core: CoreSetup<object, FiltersQueryTagsPluginSetup>): FiltersQueryTagsPluginSetup {
    core.uiSettings.register({
      [UISETTINGS_SHOW_TAGS]: {
        schema: schema.boolean(),
        name: 'Show filters of a visualization',
        value: true,
        description:
          'Allow you to disable displayed on each visualization in the dashboard of filters and query from visualization configuration',
        category: ['hawk'],
        requiresPageReload: false,
      },
    });

    return {};
  }

  public start(_core: CoreStart): FiltersQueryTagsPluginStart {
    return {};
  }

  public stop() {}
}
