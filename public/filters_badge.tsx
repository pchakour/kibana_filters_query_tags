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
    const filters = embeddable.vis.data.searchSource.fields.filter;
    filters.map((filter) => (filter.meta.value = getFilterParams(filter)));

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
              valueLabel={getDisplayValueFromFilter(filter, [
                embeddable.vis.data.searchSource.fields.index,
              ])}
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

    return Boolean(
      showFiltersQueryTags &&
        embeddable &&
        embeddable.vis.data.searchSource?.fields?.filter?.length &&
        embeddable.vis.data.searchSource?.fields?.index
    );
  }

  public async execute({ embeddable }: ActionContext) {
    window.location.href = embeddable.getOutput().editUrl;
  }
}
