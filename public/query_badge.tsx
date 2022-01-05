import { CoreStart } from '../../../src/core/public';
import { Embeddable } from '../../../src/plugins/embeddable/public';
import { Action } from '../../../src/plugins/ui_actions/public';
import { UISETTINGS_SHOW_TAGS } from '../common';

const QUERY_BADGE = 'QUERY_BADGE';

interface ActionContext {
  embeddable: Embeddable;
}

export class QueryBadge implements Action<ActionContext> {
  public readonly type = QUERY_BADGE;
  public readonly id = QUERY_BADGE;
  public order = 7;

  constructor(private core: CoreStart) {}

  public getDisplayName({ embeddable }: ActionContext) {
    const lens = embeddable.savedVis?.state;
    const vis = embeddable.vis?.data.searchSource.fields;
    const maps = embeddable._savedMap?._attributes.mapStateJSON;

    let query = { query: '' };

    if (vis) {
      query = vis.query;
    } else if (lens) {
      query = lens.query;
    } else if (maps) {
      const parsed = JSON.parse(maps);
      query = parsed.query;
    }

    return query.query;
  }

  public getIconType() {
    return 'kqlSelector';
  }

  public async isCompatible({ embeddable }: ActionContext) {
    const showFiltersQueryTags = this.core.uiSettings.get(UISETTINGS_SHOW_TAGS, true);
    const lens = embeddable.savedVis?.state;
    const vis = embeddable.vis?.data.searchSource.fields;
    let maps = embeddable._savedMap?._attributes.mapStateJSON;

    if (maps) {
      maps = JSON.parse(maps);
    }

    return Boolean(
      showFiltersQueryTags &&
        embeddable &&
        (lens?.query.query || maps?.query.query || vis?.query.query)
    );
  }

  public async execute({ embeddable }: ActionContext) {
    window.location.href = embeddable.getOutput().editUrl;
  }
}
