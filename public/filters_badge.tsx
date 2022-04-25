import React from 'react';
import { getFilterParams } from '@kbn/es-query';
import { Embeddable } from '../../../src/plugins/embeddable/public';
import { Action } from '../../../src/plugins/ui_actions/public';
import { getDisplayValueFromFilter } from '../../../src/plugins/data/public';
import { FilterLabel } from '../../../src/plugins/data/public';
import { CoreStart } from '../../../src/core/public';
import { UISETTINGS_SHOW_TAGS } from '../common';

const FILTERS_BADGE = 'FILTERS_BADGE';

interface ActionContext {
  embeddable: Embeddable;
}

export class FiltersBadge implements Action<ActionContext> {
  public readonly type = FILTERS_BADGE;
  public readonly id = FILTERS_BADGE;
  public order = 7;

  constructor(private core: CoreStart) {}

  private getFilterStyle(position: 'left' | 'middle' | 'right' | 'none') {
    const filterStyle = {
      padding: 5,
    };

    const filterStyleBorderRight = {
      borderRight: '1px solid #777777',
    };

    const filterStyleBorderLeft = {
      borderLeft: '1px solid #777777',
    };

    if (position === 'left') {
      return {
        ...filterStyle,
        ...filterStyleBorderRight,
      };
    } else if (position === 'right') {
      return {
        ...filterStyle,
        ...filterStyleBorderLeft,
      };
    } else if (position === 'middle') {
      return {
        ...filterStyle,
        ...filterStyleBorderRight,
        ...filterStyleBorderLeft,
      };
    }

    return filterStyle;
  }

  public getDisplayName({ embeddable }: ActionContext) {
    const lens = embeddable.savedVis?.state;
    const vis = embeddable.vis?.data.searchSource.fields;
    const maps = embeddable._savedMap?._attributes.mapStateJSON;

    let filters = [];
    let indexPatterns = [];

    if (vis) {
      filters = vis.filter;
      indexPatterns = [vis.index];
    } else if (lens) {
      filters = lens.filters;
      indexPatterns = embeddable.getOutput().indexPatterns;
    } else if (maps) {
      const parsed = JSON.parse(maps);
      filters = parsed.filters;
      indexPatterns = embeddable.getOutput().indexPatterns;
    }

    filters = filters.map((filter) => ({
      ...filter,
      meta: {
        ...filter.meta,
        value: getFilterParams(filter),
      },
    }));

    return (
      <>
        {filters.map((filter, index) => (
          <span
            style={this.getFilterStyle(
              (filters.length === 1 && 'none') ||
                (index + 1 === filters.length && 'right') ||
                (index === 0 && 'left') ||
                'middle'
            )}
          >
            <FilterLabel
              filter={filter}
              valueLabel={getDisplayValueFromFilter(filter, indexPatterns)}
            />
          </span>
        ))}
      </>
    );
  }

  public getIconType() {
    return 'filter';
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
        (lens?.filters?.length || vis?.filter?.length || maps?.filters?.length)
    );
  }

  public async execute({ embeddable }: ActionContext) {
    window.location.href = embeddable.getOutput().editUrl;
  }
}
