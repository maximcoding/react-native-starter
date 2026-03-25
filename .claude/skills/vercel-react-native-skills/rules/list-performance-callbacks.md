---
title: Hoist callbacks to the root of lists
impact: MEDIUM
impactDescription: Fewer re-renders and faster lists
tags: lists, performance, flashlist, callbacks
---

## List performance callbacks

When passing behavior into list rows, **avoid creating new function instances inside `renderItem` on every parent render**. Hoist stable handlers to the list parent and pass **ids or item references** into memoized row components.

**Incorrect (creates a new callback per row, per parent render):**

```tsx
import { FlashList } from '@shopify/flash-list'

return (
  <FlashList
    data={items}
    estimatedItemSize={72}
    renderItem={({ item }) => {
      const onPress = () => handlePress(item.id)
      return <Row item={item} onPress={onPress} />
    }}
  />
)
```

**Correct (stable `renderItem`; row closes over `item` only inside memoized child):**

```tsx
import { FlashList } from '@shopify/flash-list'
import { memo, useCallback } from 'react'
import { Pressable } from 'react-native'

const handlePress = useCallback((id: string) => {
  // ...
}, [])

const renderItem = useCallback(
  ({ item }: { item: Item }) => <Row item={item} onPressItem={handlePress} />,
  [handlePress],
)

return (
  <FlashList
    data={items}
    estimatedItemSize={72}
    keyExtractor={(item) => item.id}
    renderItem={renderItem}
  />
)

const Row = memo(function Row({
  item,
  onPressItem,
}: {
  item: Item
  onPressItem: (id: string) => void
}) {
  const onPress = useCallback(() => onPressItem(item.id), [item.id, onPressItem])
  return <Pressable onPress={onPress}>{/* ... */}</Pressable>
})
```

Reference: [FlashList performance](https://shopify.github.io/flash-list/docs/fundamentals/performant-components)
