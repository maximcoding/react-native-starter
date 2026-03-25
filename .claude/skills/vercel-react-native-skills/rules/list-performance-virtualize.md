---
title: Use a List Virtualizer for Any List
impact: HIGH
impactDescription: reduced memory, faster mounts
tags: lists, performance, virtualization, scrollview, flashlist
---

## Use a List Virtualizer for Any List

Use a list virtualizer like **FlashList** (this repo) or `FlatList` instead of `ScrollView` with
mapped children—even for short lists. Virtualizers only render visible items,
reducing memory usage and mount time. ScrollView renders all children upfront,
which gets expensive quickly.

**Incorrect (ScrollView renders all items at once):**

```tsx
function Feed({ items }: { items: Item[] }) {
  return (
    <ScrollView>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </ScrollView>
  )
}
// 50 items = 50 components mounted, even if only 10 visible
```

**Correct (FlashList — default in this starter):**

```tsx
import { FlashList } from '@shopify/flash-list'

function Feed({ items }: { items: Item[] }) {
  return (
    <FlashList
      data={items}
      renderItem={({ item }) => <ItemCard item={item} />}
      keyExtractor={(item) => item.id}
      estimatedItemSize={80}
    />
  )
}
// Only ~10–15 visible items mounted at a time
```

**Alternative:** `FlatList` from `react-native` if you are not using FlashList.

**Optional third-party:** [@legendapp/list](https://legendapp.com/open-source/list) (LegendList) is not a dependency of this template—do not assume it is installed.

Benefits apply to any screen with scrollable content—profiles, settings, feeds,
search results. Default to virtualization.
