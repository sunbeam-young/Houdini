registerLayout('masonry', class {
  static get inputProperties() {
    return [ '--padding', '--columns' ];
  }

  *intrinsicSizes(children, edges, styleMap) {}
  *layout(children, edges, constraints, styleMap) {
    const inlineSize = constraints.fixedInlineSize; // 父元素的宽

    const padding = parseInt(styleMap.get('--padding').toString());
    const columnValue = styleMap.get('--columns').toString();

    // We also accept 'auto', which will select the BEST number of columns.
    let columns = parseInt(columnValue);
    if (columnValue == 'auto' || !columns) {
      columns = Math.ceil(inlineSize / 350); // MAGIC NUMBER \o/.
    }

    // Layout all children with simply their column size.
    const childInlineSize = (inlineSize - ((columns + 1) * padding)) / columns; // 子元素的宽
    const childFragments = yield children.map((child) => {
      return child.layoutNextFragment({fixedInlineSize: childInlineSize});
    });

    let autoBlockSize = 0;
    const columnOffsets = Array(columns).fill(0);
    for (let childFragment of childFragments) {
      // Select the column with the least amount of stuff in it.
      const min = columnOffsets.reduce((acc, val, idx) => {
        if (!acc || val < acc.val) {
          return {idx, val};
        }

        return acc;
      }, {val: +Infinity, idx: -1});

      childFragment.inlineOffset = padding + (childInlineSize + padding) * min.idx; // 相对于最左边的偏移
      childFragment.blockOffset = padding + min.val; // 相对于顶部的偏移

      columnOffsets[min.idx] = childFragment.blockOffset + childFragment.blockSize;
      autoBlockSize = Math.max(autoBlockSize, columnOffsets[min.idx] + padding);
    }

    return {autoBlockSize, childFragments};
  }
});
