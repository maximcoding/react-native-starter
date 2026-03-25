---
title: Destructure Functions Early in Render (React Compiler)
impact: HIGH
impactDescription: stable references, fewer re-renders
tags: rerender, hooks, performance, react-compiler
---

> **This starter does not enable the React Compiler by default.** Apply the guidance below only when/if you turn it on in Babel/Metro config.

## Destructure Functions Early in Render

This rule is only applicable if you are using the React Compiler.

Destructure functions from hooks at the top of render scope. Never dot into
objects to call functions. Destructured functions are stable references; dotting
creates new references and breaks memoization.

**Incorrect (dotting into object):**

```tsx
import { useNavigation } from '@react-navigation/native'

function SaveButton(props) {
  const navigation = useNavigation()

  // bad: react-compiler will key the cache on "props" and "navigation", which are objects that change each render
  const handlePress = () => {
    props.onSave()
    navigation.navigate('Success') // unstable reference
  }

  return <Button onPress={handlePress}>Save</Button>
}
```

**Correct (destructure early):**

```tsx
import { useNavigation } from '@react-navigation/native'

function SaveButton({ onSave }) {
  const { navigate } = useNavigation()

  // good: react-compiler will key on navigate and onSave
  const handlePress = () => {
    onSave()
    navigate('Success') // stable reference
  }

  return <Button onPress={handlePress}>Save</Button>
}
```
