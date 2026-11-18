import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { useStoreTheme } from '@/theme/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, registrationComplete, updateName, clearRegistrationComplete, signOut } = useAuth();
  const { isRTL, t } = useLanguage();
  const { colors, borderRadius, typography, spacing } = useStoreTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textAlign = isRTL ? 'right' : 'left';

  const userInitial = (user?.name?.trim()?.charAt(0) || 'U').toUpperCase();

  const handleSaveName = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setNameSaved(false);
    try {
      await updateName(editedName);
      setIsEditing(false);
      setNameSaved(true);
    } catch (error) {
      setErrorMessage(t(getAuthErrorMessage(error)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      t('تسجيل الخروج'),
      t('هل أنت متأكد من رغبتك في تسجيل الخروج؟'),
      [
        { text: t('إلغاء'), style: 'cancel' },
        {
          text: t('تسجيل الخروج'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/login');
            } catch (error) {
              Alert.alert(t('auth.unknown'), t(getAuthErrorMessage(error)));
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background, direction: isRTL ? 'rtl' : 'ltr' },
      ]}
      contentContainerStyle={[styles.content, { padding: spacing.md }]}>
      {registrationComplete && (
        <View
          accessibilityRole="alert"
          style={[
            styles.successBanner,
            { backgroundColor: colors.primaryLight, borderRadius: borderRadius.md },
          ]}>
          <Text style={[typography.scale.bodySm, { color: colors.primary, textAlign, flex: 1 }]}>
            {t('auth.accountCreated')} — {t('auth.welcomeMessage')}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('auth.dismiss')}
            onPress={clearRegistrationComplete}
            style={styles.dismissButton}>
            <Text style={[typography.scale.bodySm, { color: colors.primary, fontWeight: '700' }]}>
              {t('auth.dismiss')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Customer Avatar Header */}
      <View
        style={[
          styles.avatarCard,
          {
            backgroundColor: colors.card,
            borderRadius: borderRadius.lg,
            borderColor: colors.borderLight,
            padding: spacing.lg,
            marginBottom: spacing.md,
          },
        ]}>
        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: colors.primary, borderRadius: borderRadius.pill },
          ]}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>
        <View style={styles.avatarInfo}>
          <Text
            style={[
              typography.scale.title,
              { color: colors.textPrimary, textAlign },
            ]}>
            {user?.name || 'Customer'}
          </Text>
          <Text
            style={[
              typography.scale.caption,
              { color: colors.textSecondary, textAlign: 'left', writingDirection: 'ltr' },
            ]}>
            {user?.email}
          </Text>
          <View
            style={[
              styles.customerBadge,
              {
                backgroundColor: colors.primaryLight,
                borderRadius: borderRadius.sm,
              },
            ]}>
            <Text style={[typography.scale.caption, { color: colors.primary, fontWeight: '700' }]}>
              ✓ {t('حساب عميل')}
            </Text>
          </View>
        </View>
      </View>

      {/* Account Info & Edit Section */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderRadius: borderRadius.lg,
            borderColor: colors.borderLight,
            padding: spacing.lg,
            marginBottom: spacing.md,
          },
        ]}>
        <Text
          style={[
            typography.scale.titleSm,
            styles.sectionTitle,
            { color: colors.textPrimary, textAlign },
          ]}>
          {t('حسابي')}
        </Text>

        <Text style={[typography.scale.caption, styles.fieldLabel, { color: colors.textSecondary, textAlign }]}>
          {t('auth.fullName')}
        </Text>
        {isEditing ? (
          <TextInput
            accessibilityLabel={t('auth.fullName')}
            autoCapitalize="words"
            autoComplete="name"
            onChangeText={setEditedName}
            placeholder={t('auth.fullName')}
            placeholderTextColor={colors.textMuted}
            style={[
              styles.nameInput,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                color: colors.textPrimary,
                textAlign,
                writingDirection: isRTL ? 'rtl' : 'ltr',
              },
            ]}
            value={editedName}
          />
        ) : (
          <Text style={[typography.scale.body, styles.accountValue, { color: colors.textPrimary, textAlign }]}>
            {user?.name}
          </Text>
        )}

        <Text style={[typography.scale.caption, styles.fieldLabel, { color: colors.textSecondary, textAlign }]}>
          {t('auth.email')}
        </Text>
        <Text
          style={[
            typography.scale.body,
            styles.accountValue,
            { color: colors.textPrimary, textAlign: 'left', writingDirection: 'ltr' },
          ]}>
          {user?.email}
        </Text>

        {errorMessage && (
          <Text accessibilityRole="alert" style={[styles.feedback, { color: colors.error, textAlign }]}>
            {errorMessage}
          </Text>
        )}
        {nameSaved && (
          <Text accessibilityRole="alert" style={[styles.feedback, { color: colors.success, textAlign }]}>
            {t('auth.profileUpdated')}
          </Text>
        )}

        {isEditing ? (
          <View style={styles.actionRow}>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={isSaving}
              onPress={handleSaveName}
              style={[styles.actionButton, { backgroundColor: colors.primary, borderRadius: borderRadius.md }]}>
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[typography.scale.bodySm, styles.primaryButtonText]}>
                  {t('auth.saveChanges')}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={isSaving}
              onPress={() => {
                setEditedName(user?.name ?? '');
                setIsEditing(false);
                setErrorMessage(null);
              }}
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}>
              <Text style={[typography.scale.bodySm, { color: colors.textPrimary, fontWeight: '700' }]}>
                {t('auth.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              setEditedName(user?.name ?? '');
              setNameSaved(false);
              setIsEditing(true);
            }}
            style={[
              styles.secondaryButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                marginTop: spacing.md,
              },
            ]}>
            <Text style={[typography.scale.bodySm, { color: colors.primary, fontWeight: '700' }]}>
              {t('auth.editName')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Language Preference Section */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderRadius: borderRadius.lg,
            borderColor: colors.borderLight,
            padding: spacing.lg,
            marginBottom: spacing.md,
          },
        ]}>
        <Text
          style={[
            typography.scale.titleSm,
            styles.sectionTitle,
            { color: colors.textPrimary, textAlign, marginBottom: spacing.md },
          ]}>
          {t('auth.language')}
        </Text>
        <LanguageSwitcher />
      </View>

      {/* Log Out Button */}
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.85}
        onPress={handleSignOut}
        style={[
          styles.secondaryButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            marginBottom: spacing.xl,
          },
        ]}>
        <Text style={[typography.scale.bodySm, { color: colors.error, fontWeight: '700' }]}>
          {t('تسجيل الخروج')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 16,
  },
  dismissButton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  avatarInfo: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 4,
  },
  customerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  card: {
    borderWidth: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 18,
  },
  fieldLabel: {
    marginBottom: 4,
  },
  accountValue: {
    marginBottom: 16,
  },
  nameInput: {
    minHeight: 48,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  feedback: {
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 48,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
