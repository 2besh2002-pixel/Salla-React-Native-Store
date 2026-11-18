import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

const mockLanguageValues = new Map<string, string>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => mockLanguageValues.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      mockLanguageValues.set(key, value);
    }),
  },
}));

function LanguageProbe() {
  const { language, isRTL, setLanguage, t } = useLanguage();

  return (
    <>
      <Text>{language}</Text>
      <Text>{String(isRTL)}</Text>
      <Text>{t('الرئيسية')}</Text>
      <TouchableOpacity onPress={() => setLanguage('ar')}>
        <Text>AR</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setLanguage('en')}>
        <Text>EN</Text>
      </TouchableOpacity>
    </>
  );
}

describe('application language preference', () => {
  beforeEach(() => {
    mockLanguageValues.clear();
  });

  it('starts in English and switches translations and direction immediately', async () => {
    const view = await render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(view.getByText('en')).toBeTruthy();
      expect(view.getByText('Home')).toBeTruthy();
    });

    fireEvent.press(view.getByText('AR'));

    await waitFor(() => {
      expect(view.getByText('ar')).toBeTruthy();
      expect(view.getByText('true')).toBeTruthy();
      expect(view.getByText('الرئيسية')).toBeTruthy();
      expect(mockLanguageValues.get('app_language')).toBe('ar');
    });

    fireEvent.press(view.getByText('EN'));

    await waitFor(() => {
      expect(view.getByText('en')).toBeTruthy();
      expect(view.getByText('false')).toBeTruthy();
      expect(view.getByText('Home')).toBeTruthy();
    });
  });

  it('restores the saved language preference', async () => {
    mockLanguageValues.set('app_language', 'ar');

    const view = await render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(view.getByText('ar')).toBeTruthy();
      expect(view.getByText('الرئيسية')).toBeTruthy();
    });
  });
});
