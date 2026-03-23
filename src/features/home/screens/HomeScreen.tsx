// src/features/home/screens/HomeScreen.tsx

import { FlashList } from '@shopify/flash-list'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg'
import { useMeQuery } from '@/features/user/hooks/useMeQuery'
import { useT } from '@/i18n/useT'
import { ScreenHeader } from '@/shared/components/ui/ScreenHeader'
import { ScreenWrapper } from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

const { width: SCREEN_W } = Dimensions.get('window')
const TAB_BAR_CLEARANCE = 88

// ─── Demo data ───────────────────────────────────────────────────────────────
type ActivityType = 'task' | 'message' | 'alert' | 'success'
type FeedItem = {
  id: string
  type: ActivityType
  title: string
  subtitle: string
  time: string
}

const FEED: FeedItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'Sprint completed',
    subtitle: 'Q1 goals — 100% achieved',
    time: '2m ago',
  },
  {
    id: '2',
    type: 'task',
    title: 'Task assigned',
    subtitle: 'Design review for v2.0',
    time: '15m ago',
  },
  {
    id: '3',
    type: 'message',
    title: 'Team update',
    subtitle: 'Alice: API changes are ready',
    time: '1h ago',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Deadline tomorrow',
    subtitle: 'Mobile release candidate',
    time: '2h ago',
  },
  {
    id: '5',
    type: 'success',
    title: 'Deployment live',
    subtitle: 'v1.4.2 shipped successfully',
    time: '3h ago',
  },
  {
    id: '6',
    type: 'task',
    title: 'Code review',
    subtitle: 'PR #142 — Auth refactor',
    time: '4h ago',
  },
  {
    id: '7',
    type: 'message',
    title: 'Meeting moved',
    subtitle: 'Daily standup → 10:00 AM',
    time: '5h ago',
  },
  {
    id: '8',
    type: 'alert',
    title: 'Storage at 80%',
    subtitle: 'Archive old logs soon',
    time: 'Yesterday',
  },
]

type QuickActionIcon = 'task' | 'message' | 'schedule' | 'report' | 'upload'

function QuickActionSvg({
  icon,
  color,
}: {
  icon: QuickActionIcon
  color: string
}) {
  const props = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (icon) {
    case 'task':
      return (
        <Svg {...props}>
          <Polyline points="9 11 12 14 22 4" />
          <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </Svg>
      )
    case 'message':
      return (
        <Svg {...props}>
          <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </Svg>
      )
    case 'schedule':
      return (
        <Svg {...props}>
          <Rect x="3" y="4" width="18" height="18" rx="2" />
          <Path d="M16 2v4M8 2v4M3 10h18" />
        </Svg>
      )
    case 'report':
      return (
        <Svg {...props}>
          <Path d="M18 20V10M12 20V4M6 20v-6" />
        </Svg>
      )
    case 'upload':
      return (
        <Svg {...props}>
          <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <Polyline points="17 8 12 3 7 8" />
          <Line x1="12" y1="3" x2="12" y2="15" />
        </Svg>
      )
  }
}

type QuickActionColorKey = 'success' | 'info' | 'primary' | 'warning' | 'danger'
const QUICK_ACTIONS: {
  id: string
  icon: QuickActionIcon
  colorKey: QuickActionColorKey
  labelKey:
    | 'home.quick_action_task'
    | 'home.quick_action_message'
    | 'home.quick_action_schedule'
    | 'home.quick_action_report'
    | 'home.quick_action_upload'
}[] = [
  {
    id: '1',
    icon: 'task',
    colorKey: 'success',
    labelKey: 'home.quick_action_task',
  },
  {
    id: '2',
    icon: 'message',
    colorKey: 'info',
    labelKey: 'home.quick_action_message',
  },
  {
    id: '3',
    icon: 'schedule',
    colorKey: 'primary',
    labelKey: 'home.quick_action_schedule',
  },
  {
    id: '4',
    icon: 'report',
    colorKey: 'warning',
    labelKey: 'home.quick_action_report',
  },
  {
    id: '5',
    icon: 'upload',
    colorKey: 'danger',
    labelKey: 'home.quick_action_upload',
  },
]

// ─── Shimmer ─────────────────────────────────────────────────────────────────
function useShimmer() {
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

function SkeletonBlock({
  w,
  h = 14,
  radius,
  shimmer,
  style,
}: {
  w: number | string
  h?: number
  radius?: number
  shimmer: Animated.Value
  style?: object
}) {
  const { theme } = useTheme()
  return (
    <Animated.View
      style={[
        {
          width: w as number,
          height: h,
          borderRadius: radius ?? theme.radius.sm,
          backgroundColor: theme.colors.surfaceSecondary,
          opacity: shimmer,
        },
        style,
      ]}
    />
  )
}

// ─── Skeleton layout ─────────────────────────────────────────────────────────
function HomeScreenSkeleton() {
  const { theme } = useTheme()
  const shimmer = useShimmer()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius

  const S = (props: Omit<Parameters<typeof SkeletonBlock>[0], 'shimmer'>) => (
    <SkeletonBlock {...props} shimmer={shimmer} />
  )

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={{
        paddingBottom: TAB_BAR_CLEARANCE,
        backgroundColor: c.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <View
        style={{
          paddingHorizontal: sp.lg,
          paddingTop: sp.lg,
          paddingBottom: sp.md,
          gap: sp.xs,
        }}
      >
        <S w={100} h={12} />
        <S w={200} h={24} radius={r.md} />
      </View>

      {/* Section header */}
      <S
        w={64}
        h={11}
        style={{ marginHorizontal: sp.lg, marginBottom: sp.xs }}
      />

      {/* Stats row */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: sp.lg,
          gap: sp.sm,
          marginBottom: sp.md,
        }}
      >
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={{
              flex: 1,
              backgroundColor: c.surface,
              borderRadius: r.xl,
              borderWidth: 1,
              borderColor: c.border,
              padding: sp.sm,
              gap: sp.xs,
            }}
          >
            <S w={36} h={10} />
            <S w={44} h={22} radius={r.md} />
            <S w={28} h={10} />
          </View>
        ))}
      </View>

      {/* Featured card */}
      <View
        style={{
          marginHorizontal: sp.lg,
          marginBottom: sp.lg,
          borderRadius: r.xxl,
          backgroundColor: c.primaryAmbient,
          padding: sp.lg,
          gap: sp.sm,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ gap: sp.xxs, flex: 1 }}>
            <S w={80} h={14} radius={r.sm} />
            <S w="85%" h={11} radius={r.sm} />
          </View>
          <S w={36} h={24} radius={r.rounded} style={{ marginLeft: sp.sm }} />
        </View>
        <S w="100%" h={6} radius={r.pill} />
        <S w={70} h={10} />
      </View>

      {/* Section header */}
      <S
        w={120}
        h={11}
        style={{ marginHorizontal: sp.lg, marginBottom: sp.xs }}
      />

      {/* Activity skeletons */}
      {[0, 1, 2, 3, 4].map(i => (
        <View
          key={i}
          style={{
            marginHorizontal: sp.lg,
            marginBottom: sp.sm,
            backgroundColor: c.surface,
            borderRadius: r.xl,
            borderWidth: 1,
            borderColor: c.border,
            padding: sp.md,
            flexDirection: 'row',
            alignItems: 'center',
            gap: sp.sm,
          }}
        >
          <S w={48} h={48} radius={r.rounded} />
          <View style={{ flex: 1, gap: sp.xs }}>
            <S w="60%" h={14} radius={r.sm} />
            <S w="80%" h={11} radius={r.sm} />
          </View>
          <S w={44} h={20} radius={r.xl} />
        </View>
      ))}
    </ScrollView>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useGreetingKey():
  | 'home.greeting_morning'
  | 'home.greeting_afternoon'
  | 'home.greeting_evening' {
  const h = new Date().getHours()
  if (h < 12) return 'home.greeting_morning'
  if (h < 17) return 'home.greeting_afternoon'
  return 'home.greeting_evening'
}

type ActivityColors = { bg: string; accent: string }
function typeConfig(
  type: ActivityType,
  c: ReturnType<typeof useTheme>['theme']['colors'],
): ActivityColors {
  switch (type) {
    case 'success':
      return { accent: c.success, bg: c.success + '1F' }
    case 'task':
      return { accent: c.primary, bg: c.primaryAmbient }
    case 'message':
      return { accent: c.info, bg: c.info + '1F' }
    case 'alert':
      return { accent: c.warning, bg: c.warning + '1F' }
  }
}

function ActivityIcon({
  type,
  accent,
}: {
  type: ActivityType
  accent: string
}) {
  const props = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: accent,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (type) {
    case 'success':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="10" />
          <Polyline points="9 12 11 14 15 10" />
        </Svg>
      )
    case 'task':
      return (
        <Svg {...props}>
          <Rect x="9" y="2" width="6" height="4" rx="1" />
          <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <Path d="M9 12h6M9 16h4" />
        </Svg>
      )
    case 'message':
      return (
        <Svg {...props}>
          <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </Svg>
      )
    case 'alert':
      return (
        <Svg {...props}>
          <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <Path d="M12 9v4M12 17h.01" strokeLinecap="round" />
        </Svg>
      )
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GreetingSection({
  name,
  greetingKey,
}: {
  name: string
  greetingKey: ReturnType<typeof useGreetingKey>
}) {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const ty = theme.typography
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <View
      style={{
        paddingHorizontal: sp.lg,
        paddingTop: sp.lg,
        paddingBottom: sp.md,
        gap: sp.xxs,
      }}
    >
      <Text style={[ty.bodySmall, { color: c.textTertiary }]}>{today}</Text>
      <Text style={[ty.displaySmall, { color: c.textPrimary }]}>
        {t(greetingKey)}
        {name ? `, ${name.split(' ')[0]}` : ''} 👋
      </Text>
    </View>
  )
}

function SectionHeader({ label }: { label: string }) {
  const { theme } = useTheme()
  return (
    <Text
      style={[
        theme.typography.caps,
        {
          color: theme.colors.textTertiary,
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xs,
        },
      ]}
    >
      {label}
    </Text>
  )
}

type StatTrend = { kind: 'text'; value: string } | { kind: 'flame' }

function StatTrendBadge({
  trend,
  color,
  radius,
}: {
  trend: StatTrend
  color: string
  radius: number
}) {
  const { theme } = useTheme()
  const ty = theme.typography
  const SIZE = 28
  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: radius,
        backgroundColor: color + '1F',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {trend.kind === 'text' ? (
        <Text style={[ty.labelSmall, { color }]}>{trend.value}</Text>
      ) : (
        <Svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill={color}
          stroke="none"
        >
          <Path d="M12 2s-6 6.5-6 12a6 6 0 0 0 12 0C18 8.5 12 2 12 2zm0 16a2 2 0 0 1-2-2c0-2 2-5 2-5s2 3 2 5a2 2 0 0 1-2 2z" />
        </Svg>
      )}
    </View>
  )
}

function StatsRow() {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  const stats: {
    key: string
    label: string
    value: string
    trend: StatTrend
    trendColor: string
  }[] = [
    {
      key: 'done',
      label: t('home.stat_done'),
      value: '12',
      trend: { kind: 'text', value: '+3' },
      trendColor: c.success,
    },
    {
      key: 'active',
      label: t('home.stat_active'),
      value: '4',
      trend: { kind: 'text', value: '–1' },
      trendColor: c.danger,
    },
    {
      key: 'streak',
      label: t('home.stat_streak'),
      value: '7d',
      trend: { kind: 'flame' },
      trendColor: c.warning,
    },
  ]

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: sp.lg,
        gap: sp.sm,
        marginBottom: sp.md,
      }}
    >
      {stats.map(s => (
        <View
          key={s.key}
          style={[
            styles.statCard,
            {
              flex: 1,
              backgroundColor: c.surface,
              borderColor: c.border,
              borderRadius: r.xl,
              paddingVertical: sp.md,
              paddingHorizontal: sp.sm,
              gap: sp.xs,
              ...Platform.select({
                ios: { ...theme.elevation.card },
                android: { elevation: 1 },
              }),
            },
          ]}
        >
          <Text
            style={[ty.caps, { color: c.textTertiary, textAlign: 'center' }]}
          >
            {s.label}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: sp.xxs,
            }}
          >
            <Text style={[ty.headlineLarge, { color: c.textPrimary }]}>
              {s.value}
            </Text>
            <StatTrendBadge
              trend={s.trend}
              color={s.trendColor}
              radius={r.xl}
            />
          </View>
        </View>
      ))}
    </View>
  )
}

function FeaturedCard() {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography
  const done = 8
  const total = 12
  const progress = done / total

  return (
    <View
      style={{
        marginHorizontal: sp.lg,
        marginBottom: sp.lg,
        borderRadius: r.xxl,
        backgroundColor: c.primaryAmbient,
        borderWidth: 1,
        borderColor: c.primary + '2E',
        padding: sp.lg,
        gap: sp.sm,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1, gap: sp.xxs }}>
          <Text style={[ty.titleMedium, { color: c.primary }]}>
            {t('home.featured_title')}
          </Text>
          <Text style={[ty.bodySmall, { color: c.textSecondary }]}>
            {t('home.featured_subtitle')}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: c.primary,
            borderRadius: r.rounded,
            paddingHorizontal: sp.sm,
            paddingVertical: sp.xxs,
            marginLeft: sp.sm,
          }}
        >
          <Text style={[ty.labelSmall, { color: c.onPrimary }]}>
            {done}/{total}
          </Text>
        </View>
      </View>
      <View style={{ gap: sp.xxs }}>
        <View
          style={{
            height: 6,
            borderRadius: r.pill,
            backgroundColor: c.primaryAmbient,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              borderRadius: r.pill,
              backgroundColor: c.primary,
            }}
          />
        </View>
        <Text style={[ty.labelSmall, { color: c.textTertiary }]}>
          {Math.round(progress * 100)}% complete
        </Text>
      </View>
    </View>
  )
}

// ─── Activity card (redesigned — full card, more breathing room) ──────────────
const ActivityRow = memo(function ActivityRow({ item }: { item: FeedItem }) {
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography
  const cfg = typeConfig(item.type, c)

  return (
    <View
      style={[
        styles.activityCard,
        {
          marginHorizontal: sp.lg,
          marginBottom: sp.sm,
          backgroundColor: c.surface,
          borderRadius: r.xl,
          borderWidth: 1,
          borderColor: c.border,
          padding: sp.md,
          gap: sp.sm,
          ...Platform.select({
            ios: { ...theme.elevation.card },
            android: { elevation: 1 },
          }),
        },
      ]}
    >
      {/* Colored left accent bar */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: sp.md,
          bottom: sp.md,
          width: 3,
          borderRadius: r.pill,
          backgroundColor: cfg.accent,
        }}
      />

      {/* Icon */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: r.xl,
          backgroundColor: cfg.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIcon type={item.type} accent={cfg.accent} />
      </View>

      {/* Content */}
      <View style={[styles.activityContent, { gap: sp.micro }]}>
        <Text
          style={[ty.titleSmall, { color: c.textPrimary }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          style={[ty.bodySmall, { color: c.textSecondary }]}
          numberOfLines={1}
        >
          {item.subtitle}
        </Text>
      </View>

      {/* Time badge */}
      <View
        style={{
          backgroundColor: c.surfaceSecondary,
          borderRadius: r.xl,
          paddingHorizontal: sp.xs,
          paddingVertical: sp.xxs,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={[ty.labelSmall, { color: c.textTertiary }]}>
          {item.time}
        </Text>
      </View>
    </View>
  )
})

const NUM_COLS = 4

function QuickActionsSection() {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  // Exact item width so all columns are equal regardless of row count
  const gap = sp.sm
  const itemWidth = (SCREEN_W - sp.lg * 2 - gap * (NUM_COLS - 1)) / NUM_COLS

  return (
    <View style={{ paddingTop: sp.lg, gap: sp.sm }}>
      <SectionHeader label={t('home.quick_actions')} />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: sp.lg,
          gap,
        }}
      >
        {QUICK_ACTIONS.map(a => (
          <Pressable
            key={a.id}
            accessibilityRole="button"
            accessibilityLabel={t(a.labelKey)}
            style={({ pressed }) => ({
              width: itemWidth,
              backgroundColor: pressed ? c.surfaceSecondary : c.surface,
              borderColor: c.border,
              borderWidth: 1,
              borderRadius: r.xl,
              paddingVertical: sp.sm,
              alignItems: 'center' as const,
              justifyContent: 'center' as const,
              gap: sp.xxs,
            })}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: r.xl,
                backgroundColor: c[a.colorKey] + '1F',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QuickActionSvg icon={a.icon} color={c[a.colorKey]} />
            </View>
            <Text
              style={[
                ty.labelSmall,
                { color: c.textSecondary, textAlign: 'center' },
              ]}
            >
              {t(a.labelKey)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors

  const me = useMeQuery()
  const greetingKey = useGreetingKey()
  const name = me.data?.name ?? ''

  const ListHeader = useCallback(
    () => (
      <>
        <GreetingSection name={name} greetingKey={greetingKey} />
        <SectionHeader label={t('home.overview')} />
        <StatsRow />
        <FeaturedCard />
        <SectionHeader label={t('home.recent_activity')} />
      </>
    ),
    [name, greetingKey, t],
  )

  const ListFooter = useCallback(
    () => (
      <>
        <QuickActionsSection />
        <View style={{ height: TAB_BAR_CLEARANCE }} />
      </>
    ),
    [],
  )

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => <ActivityRow item={item} />,
    [],
  )
  const keyExtractor = useCallback((item: FeedItem) => item.id, [])

  return (
    <ScreenWrapper header={<ScreenHeader title={t('home.title')} />}>
      {me.isLoading ? (
        <HomeScreenSkeleton />
      ) : (
        <FlashList
          data={FEED}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ backgroundColor: c.background }}
        />
      )}
    </ScreenWrapper>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  statCard: { borderWidth: 1, alignItems: 'center' },
  activityCard: { flexDirection: 'row', alignItems: 'center' },
  activityContent: { flex: 1 },
})
