// src/shared/components/ui/SectionHeader.tsx

import React from 'react'
import { View } from 'react-native'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

interface Props {
  label: string
  /** Optional badge shown on the right. */
  sublabel?: string | null
  /** When true the badge renders in warning colour; otherwise success. */
  sublabelIsOffline?: boolean
}

export function SectionHeader({ label, sublabel, sublabelIsOffline }: Props) {
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: sp.lg,
        paddingBottom: sp.xs,
        gap: sp.xs,
      }}
    >
      <Text style={[ty.caps, { color: c.textTertiary, flex: 1 }]}>{label}</Text>
      {sublabel ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: sublabelIsOffline
              ? c.warning + '22'
              : c.success + '22',
            borderRadius: r.pill,
            paddingHorizontal: sp.xs,
            paddingVertical: 2,
            gap: 4,
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: sublabelIsOffline ? c.warning : c.success,
            }}
          />
          <Text
            style={[
              ty.labelSmall,
              { color: sublabelIsOffline ? c.warning : c.success },
            ]}
          >
            {sublabel}
          </Text>
        </View>
      ) : null}
    </View>
  )
}
