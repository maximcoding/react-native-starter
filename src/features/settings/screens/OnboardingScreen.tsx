/**
 * FILE: OnboardingScreen.tsx
 * LAYER: features/onboarding/screens
 */

import React, { memo, useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Circle, Line, Polygon, Polyline } from 'react-native-svg'
import { useT } from '@/i18n/useT'
import { resetRoot } from '@/navigation/helpers/navigation-helpers'
import { ROUTES } from '@/navigation/routes'
import { setOnboardingDone } from '@/session/bootstrap'
import { Button } from '@/shared/components/ui/Button'
import { ScreenWrapper } from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme'

const { width: SCREEN_W } = Dimensions.get('window')

// ─── Logo ───────────────────────────────────────────────────────────────────
const LogoIcon = ({ color }: { color: string }) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
    <Line x1={12} y1={22} x2={12} y2={15.5} />
    <Polyline points="22 8.5 12 15.5 2 8.5" />
  </Svg>
)

// ─── Feature pill icons ──────────────────────────────────────────────────────
const WifiOffIcon = ({ color }: { color: string }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Line x1={1} y1={1} x2={23} y2={23} />
    <Polyline points="16.72 11.06 10 17.78" />
    <Polyline points="5 12.55 12 5 14.42 7.43" />
    <Polyline points="10.71 5.05 12 4 14.42 7.43" />
    <Circle cx={12} cy={20} r={1} />
  </Svg>
)

const ShieldIcon = ({ color }: { color: string }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polygon points="12 2 22 6 22 12 12 22 2 12 2 6 12 2" />
  </Svg>
)

const ZapIcon = ({ color }: { color: string }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Svg>
)

// ─── Stagger entrance ────────────────────────────────────────────────────────
function useStaggerFade(count: number, baseDelay = 120, stagger = 80) {
  const anims = useRef(
    Array.from({ length: count }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    })),
  ).current

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only stagger; anims ref + delays fixed for this hook
  useEffect(() => {
    const animations = anims.map((a, i) =>
      Animated.parallel([
        Animated.timing(a.opacity, {
          toValue: 1,
          duration: 500,
          delay: baseDelay + i * stagger,
          useNativeDriver: true,
        }),
        Animated.spring(a.translateY, {
          toValue: 0,
          delay: baseDelay + i * stagger,
          damping: 12,
          stiffness: 80,
          useNativeDriver: true,
        }),
      ]),
    )
    Animated.parallel(animations).start()
  }, [])

  return anims
}

// ─── Feature card ────────────────────────────────────────────────────────────
type FeatureCardProps = {
  icon: React.ReactNode
  title: string
  body: string
  iconBg: string
}

const FeatureCard = memo(function FeatureCard({
  icon,
  title,
  body,
  iconBg,
}: FeatureCardProps) {
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  return (
    <View
      style={[
        styles.featureCard,
        {
          backgroundColor: c.surface,
          borderColor: c.border,
          borderRadius: r.xl,
          padding: sp.md,
          gap: sp.sm,
          ...Platform.select({
            ios: {
              ...theme.elevation.card,
            },
            android: { elevation: 1 },
          }),
        },
      ]}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: r.lg,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ gap: sp.micro }}>
        <Text style={[ty.titleSmall, { color: c.textPrimary }]}>{title}</Text>
        <Text style={[ty.bodySmall, { color: c.textTertiary }]}>{body}</Text>
      </View>
    </View>
  )
})

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const t = useT()
  const { theme } = useTheme()
  const { top, bottom } = useSafeAreaInsets()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  const anims = useStaggerFade(5)

  const S = ({
    i,
    children,
    style,
  }: {
    i: number
    children: React.ReactNode
    style?: object
  }) => (
    <Animated.View
      style={[
        {
          opacity: anims[i]!.opacity,
          transform: [{ translateY: anims[i]!.translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )

  const handleContinue = () => {
    setOnboardingDone()
    resetRoot({ index: 0, routes: [{ name: ROUTES.ROOT_AUTH as never }] })
  }

  return (
    <ScreenWrapper
      disableTopInset
      disableBottomInset
      statusBarProps={{ translucent: true, backgroundColor: 'transparent' }}
    >
      {/* Ambient glow */}
      <View style={styles.glowWrap} pointerEvents="none">
        <View
          style={[
            styles.glowBlob,
            {
              backgroundColor: c.primaryAmbient,
              width: SCREEN_W * 0.85,
              height: 260,
            },
          ]}
        />
        <View
          style={[
            styles.glowBlob,
            styles.glowBlobSecondary,
            {
              backgroundColor: c.primaryAmbient,
              opacity: 0.4,
              width: SCREEN_W,
              height: 180,
            },
          ]}
        />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: top + sp.xxl,
            paddingBottom: bottom + sp.xxl,
            paddingHorizontal: sp.lg,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <S i={0} style={styles.logoSection}>
          <View
            style={[
              {
                borderRadius: r.xxxl,
                marginBottom: sp.xxl,
                ...Platform.select({
                  ios: {
                    shadowColor: c.primary,
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.35,
                    shadowRadius: 28,
                  },
                  android: { elevation: 12 },
                }),
              },
            ]}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: r.xxxl,
                backgroundColor: c.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogoIcon color={c.onPrimary} />
            </View>
          </View>
        </S>

        {/* Headline */}
        <S i={1} style={{ marginBottom: sp.sm }}>
          <Text
            style={[
              ty.displayMedium,
              { color: c.textPrimary, textAlign: 'center' },
            ]}
          >
            {t('onboarding.headline')}
          </Text>
        </S>

        {/* Tagline */}
        <S i={2} style={{ marginBottom: sp.xxxl }}>
          <Text
            style={[
              ty.bodyLarge,
              { color: c.textTertiary, textAlign: 'center' },
            ]}
          >
            {t('onboarding.tagline')}
          </Text>
        </S>

        {/* Feature cards */}
        <S
          i={3}
          style={{ gap: sp.sm, marginBottom: sp.xxxl, alignSelf: 'stretch' }}
        >
          <FeatureCard
            icon={<WifiOffIcon color={c.primary} />}
            title={t('onboarding.feature_1_title')}
            body={t('onboarding.feature_1_body')}
            iconBg={c.primaryAmbient}
          />
          <FeatureCard
            icon={<ShieldIcon color={c.success} />}
            title={t('onboarding.feature_2_title')}
            body={t('onboarding.feature_2_body')}
            iconBg={c.success + '1A'}
          />
          <FeatureCard
            icon={<ZapIcon color={c.warning} />}
            title={t('onboarding.feature_3_title')}
            body={t('onboarding.feature_3_body')}
            iconBg={c.warning + '1A'}
          />
        </S>

        {/* CTA */}
        <S i={4}>
          <Animated.View
            style={Platform.select({
              ios: {
                shadowColor: c.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
              },
              android: { elevation: 12 },
            })}
          >
            <Button
              title={t('onboarding.get_started')}
              variant="primary"
              size="lg"
              onPress={handleContinue}
              style={{ borderRadius: r.xxl }}
            />
          </Animated.View>
        </S>
      </ScrollView>
    </ScreenWrapper>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1 },

  glowWrap: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 320,
    alignItems: 'center',
  },
  glowBlob: {
    position: 'absolute',
    top: 0,
    borderRadius: 9999,
  },
  glowBlobSecondary: {
    top: 40,
  },

  scroll: {
    flexGrow: 1,
    alignItems: 'center',
  },

  logoSection: {
    alignItems: 'center',
  },

  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
})
