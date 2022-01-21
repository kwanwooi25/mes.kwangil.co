import React, { ReactElement, memo, useEffect, useMemo } from 'react';
import { useVirtualInfiniteScroll } from './useVirtualInfiniteScroll';

export interface VirtualInfiniteScrollProps {
  itemCount: number;
  itemHeight: number;
  renderItem: (index: number) => false | ReactElement;
  threshold?: number;
  onLoadMore?: () => void;
}

function VirtualInfiniteScroll({
  itemCount,
  itemHeight,
  renderItem,
  threshold = 10,
  onLoadMore = () => {},
}: VirtualInfiniteScrollProps) {
  const nodePositions = useMemo(() => {
    const positions = [0];
    for (let i = 1; i < itemCount; i += 1) {
      positions.push(positions[i - 1] + itemHeight);
    }
    return positions;
  }, [itemHeight, itemCount]);

  const totalHeight = itemCount * itemHeight;

  const {
    containerRef,
    containerHeight,
    contentTotalRef,
    startNode,
    endNode,
    shouldLoadMore,
    setShouldLoadMore,
  } = useVirtualInfiniteScroll({
    nodePositions,
    itemCount,
    itemHeight,
    threshold,
  });

  const visibleNodeCount = endNode - startNode + 1;
  const offsetY = nodePositions[startNode];

  const visibleNodes = useMemo(
    () => new Array(visibleNodeCount).fill(null).map((_, i) => renderItem(startNode + i)),
    [visibleNodeCount, renderItem, startNode],
  );

  useEffect(() => {
    if (shouldLoadMore) {
      onLoadMore();
      setShouldLoadMore(false);
    }
  }, [shouldLoadMore]);

  return (
    <div className="overflow-auto" style={{ height: containerHeight }} ref={containerRef}>
      <div
        className="overflow-hidden relative will-change-transform"
        style={{ height: totalHeight }}
        ref={contentTotalRef}
      >
        <div className="will-change-transform" style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleNodes}
        </div>
      </div>
    </div>
  );
}

export default memo(VirtualInfiniteScroll);
