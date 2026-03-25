---
title: Use Item Types for Heterogeneous Lists
impact: HIGH
impactDescription: efficient recycling, less layout thrashing
tags: list, performance, recycling, heterogeneous, flashlist
---

## Use Item Types for Heterogeneous Lists

When a list has different item layouts (messages, images, headers, etc.), use a
`type` field on each item and provide **`getItemType`** to **FlashList**. That helps the list recycle cells with compatible layouts.

**Incorrect (single component with conditionals):**

```tsx
type Item = { id: string; text?: string; imageUrl?: string; isHeader?: boolean }

function ListItem({ item }: { item: Item }) {
  if (item.isHeader) {
    return <HeaderItem title={item.text} />
  }
  if (item.imageUrl) {
    return <ImageItem url={item.imageUrl} />
  }
  return <MessageItem text={item.text} />
}

function Feed({ items }: { items: Item[] }) {
  return (
    <FlashList
      data={items}
      estimatedItemSize={72}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ListItem item={item} />}
    />
  )
}
```

**Correct (typed items with separate components):**

```tsx
import { FlashList } from '@shopify/flash-list'

type HeaderItem = { id: string; type: 'header'; title: string }
type MessageItem = { id: string; type: 'message'; text: string }
type ImageItem = { id: string; type: 'image'; url: string }
type FeedItem = HeaderItem | MessageItem | ImageItem

function Feed({ items }: { items: FeedItem[] }) {
  return (
    <FlashList
      data={items}
      estimatedItemSize={72}
      keyExtractor={(item) => item.id}
      getItemType={(item) => item.type}
      renderItem={({ item }) => {
        switch (item.type) {
          case 'header':
            return <SectionHeader title={item.title} />
          case 'message':
            return <MessageRow text={item.text} />
          case 'image':
            return <ImageRow url={item.url} />
        }
      }}
    />
  )
}
```

**Why this matters:**

- **Recycling efficiency**: Items with the same type share a recycling pool
- **No layout thrashing**: A header never recycles into an image cell
- **Type safety**: TypeScript can narrow the item type in each branch

For **very different row heights**, tune **`estimatedItemSize`** (average) and use FlashList’s **`overrideItemSize`** / layout APIs as needed—see the docs below.

Reference: [FlashList — performant components / `getItemType`](https://shopify.github.io/flash-list/docs/fundamentals/performant-components)
