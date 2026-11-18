import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage, getRememberedEmail } from '@/api/auth';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreTheme } from '@/theme/ThemeContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { language, isRTL, t } = useLanguage();
  const { colors, borderRadius, spacing, typography, storeConfig } = useStoreTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const textAlign = isRTL ? 'right' : 'left';

  useEffect(() => {
    async function loadRemembered() {
      try {
        const remembered = await getRememberedEmail();
        if (remembered) {
          setEmail(remembered);
        }
      } catch {
        // ignore
      }
    }
    loadRemembered();
  }, []);

  const validate = (): string | null => {
    if (!email.trim() || !password) {
      return t('auth.requiredFields');
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return t('auth.invalidEmail');
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await signIn(email, password, rememberMe);
      router.replace('/(tabs)');
    } catch (error) {
      setErrorMessage(t(getAuthErrorMessage(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.flex,
        { backgroundColor: colors.background, direction: isRTL ? 'rtl' : 'ltr' },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Top Header Bar with Language Switcher */}
        <View style={styles.topBar}>
          <LanguageSwitcher />
          <View style={styles.storePill}>
            <Text style={[typography.scale.caption, { color: colors.textSecondary, fontWeight: '700' }]}>
              {storeConfig.name[language]}
            </Text>
          </View>
        </View>

        {/* Store Welcome Banner */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: storeConfig.logoUrl }}
            style={[styles.logo, { borderRadius: borderRadius.pill }]}
            resizeMode="cover"
          />
          <Text
            style={[
              typography.scale.title,
              styles.storeName,
              { color: colors.textPrimary, textAlign: 'center' },
            ]}>
            {storeConfig.name[language]}
          </Text>
          {storeConfig.tagline && (
            <Text
              style={[
                typography.scale.caption,
                styles.storeTagline,
                { color: colors.textSecondary, textAlign: 'center' },
              ]}>
              {storeConfig.tagline[language]}
            </Text>
          )}
        </View>

        {/* Login Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
            },
          ]}>
          <Text
            style={[
              typography.scale.titleSm,
              styles.cardTitle,
              { color: colors.textPrimary, textAlign },
            ]}>
            {t('مرحبًا بعودتك')}
          </Text>
          <Text
            style={[
              typography.scale.caption,
              styles.subtitle,
              { color: colors.textSecondary, textAlign },
            ]}>
            {t('auth.loginSubtitle')}
          </Text>

          {/* Email Address */}
          <Text style={[typography.scale.bodySm, styles.label, { color: colors.textPrimary, textAlign }]}>
            {t('البريد الإلكتروني')}
          </Text>
          <TextInput
            accessibilityLabel={t('البريد الإلكتروني')}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="name@example.com"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                color: colors.textPrimary,
                textAlign: 'left',
                writingDirection: 'ltr',
              },
            ]}
            value={email}
          />

          {/* Password */}
          <Text style={[typography.scale.bodySm, styles.label, { color: colors.textPrimary, textAlign }]}>
            {t('كلمة المرور')}
          </Text>
          <View
            style={[
              styles.passwordInput,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}>
            <TextInput
              accessibilityLabel={t('كلمة المرور')}
              autoCapitalize="none"
              autoComplete="current-password"
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
              onSubmitEditing={handleSubmit}
              placeholder={t('أدخل كلمة المرور')}
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              secureTextEntry={!showPassword}
              style={[
                styles.passwordTextInput,
                {
                  color: colors.textPrimary,
                  textAlign,
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
              value={password}
            />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t(showPassword ? 'auth.hidePassword' : 'auth.showPassword')}
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.visibilityButton}>
              <Text style={[typography.scale.caption, { color: colors.primary, fontWeight: '700' }]}>
                {t(showPassword ? 'auth.hidePassword' : 'auth.showPassword')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Remember Me Checkbox */}
          <TouchableOpacity
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}
            onPress={() => setRememberMe((prev) => !prev)}
            style={styles.rememberMeRow}
            activeOpacity={0.8}>
            <View
              style={[
                styles.checkboxBox,
                {
                  borderColor: rememberMe ? colors.primary : colors.border,
                  backgroundColor: rememberMe ? colors.primary : colors.surface,
                  borderRadius: borderRadius.sm,
                },
              ]}>
              {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={[typography.scale.bodySm, { color: colors.textSecondary }]}>
              {t('auth.rememberMe')}
            </Text>
          </TouchableOpacity>

          {/* Error Message */}
          {errorMessage && (
            <View style={[styles.errorContainer, { backgroundColor: '#FEE2E2', borderRadius: borderRadius.sm }]}>
              <Text accessibilityRole="alert" style={[styles.errorText, { color: colors.error, textAlign }]}>
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              {
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md,
                marginTop: spacing.lg,
                opacity: isSubmitting ? 0.7 : 1,
              },
            ]}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[typography.scale.body, styles.submitText]}>
                {t('الدخول')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Switch to Register */}
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.push('/register')}
            style={styles.switchMode}
            activeOpacity={0.8}>
            <Text style={[typography.scale.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
              {t('ليس لديك حساب؟')}{' '}
              <Text style={[styles.switchModeText, { color: colors.primary }]}>
                {t('تسجيل حساب جديد')}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 68,
    height: 68,
    marginBottom: 10,
  },
  storeName: {
    fontWeight: '700',
  },
  storeTagline: {
    marginTop: 4,
  },
  card: {
    borderWidth: 1,
  },
  cardTitle: {
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  passwordInput: {
    flexDirection: 'row',
    minHeight: 50,
    borderWidth: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  passwordTextInput: {
    flex: 1,
    minHeight: 48,
  },
  visibilityButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 15,
  },
  errorContainer: {
    padding: 10,
    marginTop: 12,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  switchMode: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 18,
  },
  switchModeText: {
    fontWeight: '700',
  },
});
