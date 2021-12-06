import {
  PANEL_BADGE_TRIGGER,
  EmbeddableSetup,
  EmbeddableStart,
} from '../../../src/plugins/embeddable/public';
import { Action, UiActionsSetup, UiActionsStart } from '../../../src/plugins/ui_actions/public';
import { CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { FiltersBadge } from './filters_badge';
import { QueryBadge } from './query_badge';
import { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { FieldFormatsStart } from '../../../src/plugins/field_formats/public';

interface SetupDependencies {
  embeddable: EmbeddableSetup; // Embeddable are needed because they register basic triggers/actions.
  uiActions: UiActionsSetup;
}

interface StartDependencies {
  embeddable: EmbeddableStart;
  uiActions: UiActionsStart;
  data: DataPublicPluginStart;
  fieldFormats: FieldFormatsStart;
}

export type KibanaFiltersQueryTagsPluginSetup = void;
export type KibanaFiltersQueryTagsPluginStart = void;

export class KibanaFiltersQueryTagsPlugin
  implements
    Plugin<
      KibanaFiltersQueryTagsPluginSetup,
      KibanaFiltersQueryTagsPluginStart,
      SetupDependencies,
      StartDependencies
    > {
  public setup(core: CoreSetup): KibanaFiltersQueryTagsPluginSetup {}

  public start(
    core: CoreStart,
    { uiActions, data, fieldFormats }: StartDependencies
  ): KibanaFiltersQueryTagsPluginStart {
    // @ts-ignore
    const filtersBadge: Action = new FiltersBadge(core);
    uiActions.registerAction(filtersBadge);
    uiActions.attachAction(PANEL_BADGE_TRIGGER, filtersBadge.id);

    // @ts-ignore
    const queryBadge: Action = new QueryBadge(core);
    uiActions.registerAction(queryBadge);
    uiActions.attachAction(PANEL_BADGE_TRIGGER, queryBadge.id);
  }

  public stop() {}
}
