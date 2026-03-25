// src/features/auth/screens/AuthScreen.tsx

import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import Animated, {
  interpolateColor,
  makeMutable,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, {
  Circle,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
} from 'react-native-svg'
import { flags } from '@/config/constants'
import { AUTH_MOCK_DEMO } from '@/features/auth/constants'
import {
  OAUTH_FACEBOOK_BLUE,
  OAUTH_GOOGLE_BLUE,
  OAUTH_GOOGLE_GREEN,
  OAUTH_GOOGLE_RED,
  OAUTH_GOOGLE_YELLOW,
} from '@/features/auth/constants/oauth-brand-colors'
import { useLoginMutation } from '@/features/auth/hooks/useLoginMutation'
import { useT } from '@/i18n/useT'
import { resetRoot } from '@/navigation/helpers/navigation-helpers'
import { ROUTES } from '@/navigation/routes'
import { Button } from '@/shared/components/ui/Button'
import { ScreenWrapper } from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useToggle } from '@/shared/hooks/useToggle'
import { useTheme } from '@/shared/theme'
import { normalizeError } from '@/shared/utils/normalize-error'
import { showErrorToast } from '@/shared/utils/toast'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

/** Vertical rhythm for this screen only (values unchanged — avoids magic numbers). */
const AUTH_SCREEN_LAYOUT = {
  logoWrapperMarginBottom: 24,
  headerBlockMarginBottom: 34,
  socialRowMarginBottom: 28,
  dividerMarginBottom: 26,
  fieldMarginBottom: 18,
  themeToggleSize: 42,
  signupRowTopMargin: 26,
} as const

// ─── Floating particle ─────────────────────────────────────────────
const PARTICLE_CONFIG = Array.from({ length: 6 }, (_, i) => ({
  left: 12 + i * 16, // percentage
  top: 90 + (i % 3) * 55,
  size: 4 + (i % 3) * 3,
  duration: 2800 + i * 500,
  delay: i * 250,
  initOpacity: 0.12 + (i % 3) * 0.08,
}))

type ParticleConfig = (typeof PARTICLE_CONFIG)[number]

// Each particle is its own component so hooks are called at the top level
const Particle = memo(function Particle({
  config,
  color,
}: {
  config: ParticleConfig
  color: string
}) {
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(config.initOpacity)

  // biome-ignore lint/correctness/useExhaustiveDependencies: one-shot entrance; config is fixed per particle instance
  useEffect(() => {
    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(-16, { duration: config.duration }),
          withTiming(0, { duration: config.duration }),
        ),
        -1,
      ),
    )
    opacity.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(0.35, { duration: config.duration }),
          withTiming(0.1, { duration: config.duration }),
        ),
        -1,
      ),
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: `${config.left}%` as unknown as number,
          top: config.top,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  )
})

function FloatingParticles({ color }: { color: string }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PARTICLE_CONFIG.map((p, i) => (
        <Particle key={i} config={p} color={color} />
      ))}
    </View>
  )
}

// ─── Stagger entrance ──────────────────────────────────────────────
type StaggerAnim = {
  opacity: SharedValue<number>
  translateY: SharedValue<number>
}

// makeMutable is not a hook — safe to use inside useRef callback
function useStaggerEntrance(count: number, staggerMs = 65) {
  const anims = useRef<StaggerAnim[]>(
    Array.from({ length: count }, () => ({
      opacity: makeMutable(0),
      translateY: makeMutable(24),
    })),
  ).current

  // biome-ignore lint/correctness/useExhaustiveDependencies: one-shot stagger; anims ref + count are fixed for this screen
  useEffect(() => {
    anims.forEach((anim, i) => {
      const delay = 120 + i * staggerMs
      anim.opacity.value = withDelay(delay, withTiming(1, { duration: 480 }))
      anim.translateY.value = withDelay(
        delay,
        withSpring(0, { damping: 10, stiffness: 60 }),
      )
    })
  }, [])

  return anims
}

// AnimatedBlock: defined outside screen so it has a stable component identity
const AnimatedBlock = memo(function AnimatedBlock({
  anim,
  children,
  style,
}: {
  anim: StaggerAnim
  children: React.ReactNode
  style?: object
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: anim.opacity.value,
    transform: [{ translateY: anim.translateY.value }],
  }))

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  )
})

// ─── Press scale hook ──────────────────────────────────────────────
function usePressScale(toValue = 0.96) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const onPressIn = useCallback(() => {
    scale.value = withSpring(toValue, {
      mass: 0.2,
      stiffness: 400,
      damping: 12,
    })
  }, [toValue, scale])

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { mass: 0.2, stiffness: 150, damping: 10 })
  }, [scale])

  return { animatedStyle, onPressIn, onPressOut }
}

// ─── SVG Icons ─────────────────────────────────────────────────────
const GoogleIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill={OAUTH_GOOGLE_BLUE}
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill={OAUTH_GOOGLE_GREEN}
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      fill={OAUTH_GOOGLE_YELLOW}
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill={OAUTH_GOOGLE_RED}
    />
  </Svg>
)

const FacebookIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill={OAUTH_FACEBOOK_BLUE}
    />
  </Svg>
)

const AppleIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="2.5 3 15 18" fill={color}>
    <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </Svg>
)

const MailIcon = ({ color }: { color: string }) => (
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
    <Rect x={2} y={4} width={20} height={16} rx={2} />
    <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Svg>
)

const LockIcon = ({ color }: { color: string }) => (
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
    <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
)

const EyeIcon = ({ visible, color }: { visible: boolean; color: string }) => (
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
    {visible ? (
      <>
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <Circle cx={12} cy={12} r={3} />
      </>
    ) : (
      <>
        <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <Line x1={1} y1={1} x2={23} y2={23} />
      </>
    )}
  </Svg>
)

const LogoIcon = ({ color }: { color: string }) => (
  <Svg
    width={30}
    height={30}
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

// ─── Screen ────────────────────────────────────────────────────────
export default function AuthScreen() {
  const t = useT()
  const { theme, mode, setTheme } = useTheme()
  const systemScheme = useColorScheme()
  const { bottom, top } = useSafeAreaInsets()
  const login = useLoginMutation()
  const anims = useStaggerEntrance(8)

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark')
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  const [email, setEmail] = useState(() =>
    flags.USE_MOCK ? AUTH_MOCK_DEMO.email : '',
  )
  const [password, setPassword] = useState(() =>
    flags.USE_MOCK ? AUTH_MOCK_DEMO.password : '',
  )
  const [showPassword, toggleShowPassword] = useToggle(false)
  const [emailFocused, , setEmailFocused, clearEmailFocused] = useToggle(false)
  const [passFocused, , setPassFocused, clearPassFocused] = useToggle(false)

  // Input focus — Reanimated shared values for color interpolation
  const emailFocus = useSharedValue(0)
  const passFocus = useSharedValue(0)

  // Press scales — each called separately (rules of hooks)
  const cta = usePressScale(0.975)
  const social0 = usePressScale(0.93)
  const social1 = usePressScale(0.93)
  const social2 = usePressScale(0.93)

  // Animated input styles — color interpolation on UI thread
  const emailInputStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      emailFocus.value,
      [0, 1],
      [c.inputBorder, c.primary],
    ),
    backgroundColor: interpolateColor(
      emailFocus.value,
      [0, 1],
      [c.inputBackground, c.inputBackgroundFocused],
    ),
  }))

  const passInputStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      passFocus.value,
      [0, 1],
      [c.inputBorder, c.primary],
    ),
    backgroundColor: interpolateColor(
      passFocus.value,
      [0, 1],
      [c.inputBackground, c.inputBackgroundFocused],
    ),
  }))

  const animateFocus = useCallback(
    (sv: SharedValue<number>, focused: boolean) => {
      sv.value = withTiming(focused ? 1 : 0, { duration: 220 })
    },
    [],
  )

  const handleLogin = useCallback(async () => {
    try {
      await login.mutateAsync({ email, password })
      resetRoot({ index: 0, routes: [{ name: ROUTES.ROOT_APP }] })
    } catch (e) {
      showErrorToast(normalizeError(e))
    }
  }, [email, password, login])

  const handleToggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  const S = useCallback(
    ({
      i,
      children,
      style,
    }: {
      i: number
      children: React.ReactNode
      style?: object
    }) => (
      <AnimatedBlock anim={anims[i]!} style={style}>
        {children}
      </AnimatedBlock>
    ),
    [anims],
  )

  return (
    <ScreenWrapper
      disableTopInset
      disableBottomInset
      statusBarProps={{
        translucent: true,
        backgroundColor: 'transparent',
      }}
    >
      {/* Ambient glow (two layers) */}
      <View style={styles.glowWrap} pointerEvents="none">
        <View
          style={[styles.glowVertical, { backgroundColor: c.primaryAmbient }]}
        />
        <View
          style={[
            styles.glowHorizontal,
            { backgroundColor: c.primaryAmbient, opacity: 0.45 },
          ]}
        />
      </View>

      {/* Floating particles — each is its own component with Reanimated hooks */}
      <FloatingParticles color={c.primary} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingHorizontal: sp.xxl,
            paddingTop: top + sp.xs,
            paddingBottom: bottom + sp.xxl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Theme toggle */}
        <S i={0} style={[styles.topRow, { marginBottom: sp.xs }]}>
          <View style={styles.flex} />
          <TouchableOpacity
            onPress={handleToggleTheme}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('auth.a11y_toggle_theme')}
            style={[
              styles.themeBtn,
              {
                width: AUTH_SCREEN_LAYOUT.themeToggleSize,
                height: AUTH_SCREEN_LAYOUT.themeToggleSize,
                backgroundColor: c.surfaceSecondary,
                borderColor: c.border,
                borderRadius: r.xl,
              },
            ]}
          >
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke={c.textSecondary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isDark ? (
                <>
                  <Circle cx="12" cy="12" r="5" />
                  <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </>
              ) : (
                <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              )}
            </Svg>
          </TouchableOpacity>
        </S>

        {/* Logo + heading */}
        <S
          i={1}
          style={[
            styles.header,
            { marginBottom: AUTH_SCREEN_LAYOUT.headerBlockMarginBottom },
          ]}
        >
          <View
            style={[
              {
                marginBottom: AUTH_SCREEN_LAYOUT.logoWrapperMarginBottom,
                borderRadius: r.xxxl,
              },
              Platform.select({
                ios: {
                  shadowColor: c.primary,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.35,
                  shadowRadius: 28,
                },
                android: { elevation: 12 },
              }),
            ]}
          >
            <View
              style={[
                styles.logoGradient,
                { backgroundColor: c.primary, borderRadius: r.xxxl },
              ]}
            >
              <LogoIcon color={c.onPrimary} />
            </View>
          </View>
          <Text
            style={[
              ty.displayMedium,
              { color: c.textPrimary, textAlign: 'center' },
            ]}
          >
            {t('auth.welcome')}
          </Text>
          <Text
            style={[
              ty.bodyMedium,
              {
                color: c.textTertiary,
                marginTop: sp.xs,
                textAlign: 'center',
                alignSelf: 'stretch',
              },
            ]}
          >
            {t('auth.subtitle')}
          </Text>
          {flags.USE_MOCK ? (
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[
                ty.bodySmall,
                {
                  color: c.textTertiary,
                  marginTop: sp.sm,
                  textAlign: 'center',
                  opacity: 0.85,
                  alignSelf: 'stretch',
                },
              ]}
            >
              {t('auth.mock_demo_hint')}
            </Text>
          ) : null}
        </S>

        {/* Social buttons */}
        <S
          i={2}
          style={[
            styles.socialRow,
            {
              gap: sp.sm,
              marginBottom: AUTH_SCREEN_LAYOUT.socialRowMarginBottom,
            },
          ]}
        >
          {[
            {
              key: 'google' as const,
              Icon: <GoogleIcon />,
              label: 'Google',
              press: social0,
            },
            {
              key: 'facebook' as const,
              Icon: <FacebookIcon />,
              label: 'Facebook',
              press: social1,
            },
            {
              key: 'apple' as const,
              Icon: <AppleIcon color={c.textPrimary} />,
              label: 'Apple',
              press: social2,
            },
          ].map(({ key, Icon, label, press }) => (
            <TouchableOpacity
              key={key}
              onPressIn={press.onPressIn}
              onPressOut={press.onPressOut}
              activeOpacity={1}
              style={styles.socialTouchable}
            >
              <Animated.View
                style={[
                  styles.socialCard,
                  {
                    backgroundColor: c.surface,
                    borderColor: c.border,
                    borderRadius: r.xxl,
                    gap: sp.xxs,
                  },
                  press.animatedStyle,
                ]}
              >
                {Icon}
                <Text style={[ty.labelSmall, { color: c.textSecondary }]}>
                  {label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </S>

        {/* Divider */}
        <S
          i={3}
          style={[
            styles.dividerRow,
            {
              gap: sp.md,
              marginBottom: AUTH_SCREEN_LAYOUT.dividerMarginBottom,
            },
          ]}
        >
          <View style={[styles.dividerLine, { backgroundColor: c.divider }]} />
          <Text style={[ty.caps, { color: c.textTertiary }]}>
            {t('auth.or')}
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: c.divider }]} />
        </S>

        {/* Email */}
        <S i={4} style={{ marginBottom: AUTH_SCREEN_LAYOUT.fieldMarginBottom }}>
          <Text
            style={[
              ty.labelMedium,
              {
                color: emailFocused ? c.primary : c.textSecondary,
                marginBottom: sp.xs,
              },
            ]}
          >
            {t('auth.email')}
          </Text>
          <Animated.View
            style={[styles.inputBox, { borderRadius: r.xxl }, emailInputStyle]}
          >
            <View style={styles.iconSlot}>
              <MailIcon color={emailFocused ? c.primary : c.textTertiary} />
            </View>
            <TextInput
              style={[
                ty.bodyMedium,
                styles.input,
                { color: c.textPrimary, paddingRight: sp.md },
              ]}
              placeholder={t('auth.email_placeholder')}
              placeholderTextColor={c.textTertiary}
              value={email}
              onChangeText={setEmail}
              onFocus={() => {
                setEmailFocused()
                animateFocus(emailFocus, true)
              }}
              onBlur={() => {
                clearEmailFocused()
                animateFocus(emailFocus, false)
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
            />
          </Animated.View>
        </S>

        {/* Password */}
        <S i={5} style={{ marginBottom: AUTH_SCREEN_LAYOUT.fieldMarginBottom }}>
          <View style={[styles.labelRow, { marginBottom: sp.xs }]}>
            <Text
              style={[
                ty.labelMedium,
                { color: passFocused ? c.primary : c.textSecondary },
              ]}
            >
              {t('auth.password')}
            </Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={[ty.labelMedium, { color: c.primary }]}>
                {t('auth.forgot_password')}
              </Text>
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[styles.inputBox, { borderRadius: r.xxl }, passInputStyle]}
          >
            <View style={styles.iconSlot}>
              <LockIcon color={passFocused ? c.primary : c.textTertiary} />
            </View>
            <TextInput
              style={[
                ty.bodyMedium,
                styles.input,
                { color: c.textPrimary, flex: 1, paddingRight: sp.md },
              ]}
              placeholder={t('auth.password_placeholder')}
              placeholderTextColor={c.textTertiary}
              value={password}
              onChangeText={setPassword}
              onFocus={() => {
                setPassFocused()
                animateFocus(passFocus, true)
              }}
              onBlur={() => {
                clearPassFocused()
                animateFocus(passFocus, false)
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
            />
            <TouchableOpacity
              onPress={toggleShowPassword}
              activeOpacity={0.6}
              style={styles.eyeSlot}
            >
              <EyeIcon visible={showPassword} color={c.textTertiary} />
            </TouchableOpacity>
          </Animated.View>
        </S>

        {/* CTA */}
        <S i={6} style={{ marginTop: sp.xl }}>
          <Animated.View
            style={[
              cta.animatedStyle,
              Platform.select({
                ios: {
                  shadowColor: c.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.45,
                  shadowRadius: 22,
                },
                android: { elevation: 14 },
              }),
            ]}
          >
            <Button
              title={login.isPending ? t('auth.signing_in') : t('auth.sign_in')}
              variant="primary"
              size="lg"
              loading={login.isPending}
              onPress={handleLogin}
              onPressIn={cta.onPressIn}
              onPressOut={cta.onPressOut}
              style={{ borderRadius: r.xxl }}
            />
          </Animated.View>
        </S>

        {/* Sign up */}
        <S
          i={7}
          style={[
            styles.signupRow,
            { marginTop: AUTH_SCREEN_LAYOUT.signupRowTopMargin },
          ]}
        >
          <Text style={[ty.bodySmall, { color: c.textTertiary }]}>
            {t('auth.no_account')}{' '}
          </Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={[ty.labelLarge, { color: c.primary }]}>
              {t('auth.sign_up')}
            </Text>
          </TouchableOpacity>
        </S>

        {/* Terms */}
        <View
          style={[styles.terms, { paddingTop: sp.md, paddingBottom: sp.xs }]}
        >
          <Text
            style={[ty.labelSmall, styles.termsText, { color: c.textTertiary }]}
          >
            {t('auth.terms_prefix')}{' '}
            <Text style={[ty.labelSmall, { color: c.textSecondary }]}>
              {t('auth.terms_of_service')}
            </Text>{' '}
            {t('auth.and')}{' '}
            <Text style={[ty.labelSmall, { color: c.textSecondary }]}>
              {t('auth.privacy_policy')}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1 },

  glowWrap: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    height: 340,
    alignItems: 'center',
  },
  glowVertical: {
    width: SCREEN_WIDTH * 0.9,
    height: 280,
    borderRadius: 140,
    position: 'absolute',
    top: 0,
  },
  glowHorizontal: {
    width: SCREEN_WIDTH,
    height: 200,
    position: 'absolute',
    top: 30,
  },

  scroll: { flexGrow: 1 },

  topRow: { flexDirection: 'row', alignItems: 'center' },
  themeBtn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: { alignItems: 'center' },
  logoGradient: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },

  socialRow: { flexDirection: 'row' },
  socialTouchable: { flex: 1 },
  socialCard: {
    height: 72,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dividerRow: { flexDirection: 'row', alignItems: 'center' },
  dividerLine: { flex: 1, height: 1 },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  iconSlot: { width: 48, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    height: '100%' as unknown as number,
    paddingVertical: 0,
  },
  eyeSlot: {
    width: 48,
    height: '100%' as unknown as number,
    alignItems: 'center',
    justifyContent: 'center',
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  terms: {
    marginTop: 'auto' as unknown as number,
  },
  termsText: { textAlign: 'center', opacity: 0.6 },
})
