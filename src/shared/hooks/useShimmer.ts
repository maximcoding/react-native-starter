import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

/**
 * Returns an Animated.Value that pulses between 0.4 and 1 opacity —
 * use it to drive shimmer/skeleton placeholder animations.
 */
export function useShimmer(): Animated.Value {
  const anim = useRef(new Animated.Value(0.4)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [anim])
  return anim
}
