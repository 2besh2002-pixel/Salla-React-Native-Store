import React, { useState } from 'react';
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
import { getAuthErrorMessage } from '@/api/auth';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreTheme } from '@/theme/ThemeContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { language, isRTL, t } = useLanguage();
  const { colors, borderRadius, spacing, typography, storeConfig } = useStoreTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const textAlign = isRTL ? 'right' : 'left';

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return t('auth.requiredFields');
    }
    if (name.trim().length < 2) {
      return t('auth.shortName');
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return t('auth.invalidEmail');
    }
    if (password.length < 8) {
      return t('auth.shortPassword');
    }
    if (password !== confirmPassword) {
      return t('auth.passwordMismatch');
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
      await signUp(name, email, password);
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

        {/* Register Card */}
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
            {t('أنشئ حسابك وابدأ التسوق')}
          </Text>
          <Text
            style={[
              typography.scale.caption,
              styles.subtitle,
              { color: colors.textSecondary, textAlign },
            ]}>
            {t('auth.createAccountSubtitle')}
          </Text>

          {/* Full Name */}
          <Text style={[typography.scale.bodySm, styles.label, { color: colors.textPrimary, textAlign }]}>
            {t('الاسم الكامل')}
          </Text>
          <TextInput
            accessibilityLabel={t('الاسم الكامل')}
            autoCapitalize="words"
            autoComplete="name"
            onChangeText={(text) => {
              setName(text);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder={t('الاسم الكامل')}
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                color: colors.textPrimary,
                textAlign,
                writingDirection: isRTL ? 'rtl' : 'ltr',
              },
            ]}
            value={name}
          />

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
              autoComplete="new-password"
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder={t('أدخل كلمة المرور')}
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
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

          {/* Confirm Password */}
          <Text style={[typography.scale.bodySm, styles.label, { color: colors.textPrimary, textAlign }]}>
            {t('تأكيد كلمة المرور')}
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
              accessibilityLabel={t('تأكيد كلمة المرور')}
              autoCapitalize="none"
              autoComplete="new-password"
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
              onSubmitEditing={handleSubmit}
              placeholder={t('تأكيد كلمة المرور')}
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              secureTextEntry={!showConfirmPassword}
              style={[
                styles.passwordTextInput,
                {
                  color: colors.textPrimary,
                  textAlign,
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
              value={confirmPassword}
            />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t(showConfirmPassword ? 'auth.hidePassword' : 'auth.showPassword')}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              style={styles.visibilityButton}>
              <Text style={[typography.scale.caption, { color: colors.primary, fontWeight: '700' }]}>
                {t(showConfirmPassword ? 'auth.hidePassword' : 'auth.showPassword')}
              </Text>
            </TouchableOpacity>
          </View>

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
                {t('إنشاء الحساب')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Switch to Login */}
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.push('/login')}
            style={styles.switchMode}
            activeOpacity={0.8}>
            <Text style={[typography.scale.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
              {t('لديك حساب بالفعل؟')}{' '}
              <Text style={[styles.switchModeText, { color: colors.primary }]}>
                {t('تسجيل الدخول')}
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
