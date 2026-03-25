---
title: Optimize List Performance with Stable Object References
impact: CRITICAL
impactDescription: virtualization relies on reference stability
tags: lists, performance, flatlist, flashlist, virtualization
---

## Optimize List Performance with Stable Object References

Don't map or filter data before passing to virtualized lists in ways that **replace every row object on each keystroke**. Virtualization works best when **element identities** in `data` are stable. Prefer moving dynamic text (e.g. search keyword) into **selectors inside row components** or stable derived stores.

Where needed, use context selectors within list items.

**Incorrect (creates new object references on every keystroke):**

```tsx
import { FlashList } from '@shopify/flash-list'

function DomainSearch() {
  const { keyword, setKeyword } = useKeywordZustandState()
  const { data: tlds } = useTlds()

  // Bad: creates new objects on every render, reparenting the entire list on every keystroke
  const domains = tlds.map((tld) => ({
    domain: `${keyword}.${tld.name}`,
    tld: tld.name,
    price: tld.price,
  }))

  return (
    <>
      <TextInput value={keyword} onChangeText={setKeyword} />
      <FlashList
        data={domains}
        estimatedItemSize={56}
        keyExtractor={(item) => item.tld}
        renderItem={({ item }) => <DomainItem item={item} keyword={keyword} />}
      />
    </>
  )
}
```

**Correct (stable references, transform inside items):**

```tsx
import { FlashList } from '@shopify/flash-list'

const renderItem = ({ item }: { item: Tld }) => <DomainItem tld={item} />

function DomainSearch() {
  const { data: tlds } = useTlds()

  return (
    <FlashList
      data={tlds}
      estimatedItemSize={56}
      keyExtractor={(item) => item.name}
      renderItem={renderItem}
    />
  )
}

function DomainItem({ tld }: { tld: Tld }) {
  const domain = useKeywordZustandState((s) => s.keyword + '.' + tld.name)
  return <Text>{domain}</Text>
}
```

**Updating parent array reference:**

Creating a new array instance can be okay, as long as its inner object
references are stable. For instance, if you sort a list of objects:

```tsx
const sortedTlds = tlds.toSorted((a, b) => a.name.localeCompare(b.name))

return (
  <FlashList
    data={sortedTlds}
    estimatedItemSize={56}
    keyExtractor={(item) => item.name}
    renderItem={renderItem}
  />
)
```

Even though this creates a new array instance `sortedTlds`, the inner object
references are stable.

**With zustand for dynamic data (avoids parent re-renders):**

```tsx
import { FlashList } from '@shopify/flash-list'

const useSearchStore = create<{ keyword: string }>(() => ({ keyword: '' }))

function DomainSearch() {
  const { data: tlds } = useTlds()

  return (
    <>
      <SearchInput />
      <FlashList
        data={tlds}
        estimatedItemSize={56}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <DomainItem tld={item} />}
      />
    </>
  )
}

function DomainItem({ tld }: { tld: Tld }) {
  const keyword = useSearchStore((s) => s.keyword)
  const domain = `${keyword}.${tld.name}`
  return <Text>{domain}</Text>
}
```

Virtualization can now skip items that haven't changed when typing. Only visible
items (~20) re-render on keystroke, rather than the parent.

**Deriving state within list items based on parent data (avoids parent
re-renders):**

For components where the data is conditional based on the parent state, this
pattern is even more important. For example, if you are checking if an item is
favorited, toggling favorites only re-renders one component if the item itself
is in charge of accessing the state rather than the parent:

```tsx
function DomainItemFavoriteButton({ tld }: { tld: Tld }) {
  const isFavorited = useFavoritesStore((s) => s.favorites.has(tld.id))
  return <TldFavoriteButton isFavorited={isFavorited} />
}
```

Note: if you're using the React Compiler, you can read React Context values
directly within list items. Although this is slightly slower than using a
Zustand selector in most cases, the effect may be negligible.
