import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

export type AppLanguage = 'ar' | 'en';

const LANGUAGE_KEY = 'app_language';

const englishTranslations: Record<string, string> = {
  // Navigation & Headers
  'الرئيسية': 'Home',
  'التصنيفات': 'Categories',
  'الأقسام': 'Categories',
  'البحث عن منتج': 'Search products',
  'البحث': 'Search',
  'سلة المشتريات': 'Shopping Cart',
  'السلة': 'Cart',
  'حسابي': 'My Account',
  'تفاصيل المنتج': 'Product Details',
  'رجوع': 'Back',
  'إتمام الطلب': 'Checkout',
  'عرض الكل': 'View all',
  'التصنيفات المميزة': 'Featured categories',
  'الكل': 'All',
  'المنتجات': 'Products',
  'أحدث المنتجات المختارة': 'Latest picks',
  'لا توجد منتجات متوفرة في هذا القسم حالياً.': 'No products are currently available in this category.',
  'ابحث بالاسم، الوصف، أو الرمز...': 'Search by name, description, or code...',
  'اكتب كلمة البحث لاستعراض المنتجات المتاحة.': 'Enter a search term to find available products.',
  'لا توجد نتائج مطابقة لـ': 'No results match',
  'الأكثر طلباً': 'Popular',
  'أضف إلى السلة': 'Add to cart',
  'إعادة المحاولة': 'Try again',
  'عذراً، حدث خطأ غير متوقع': 'Sorry, an unexpected error occurred',
  'لم نتمكن من إتمام طلبك في الوقت الحالي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.':
    'We could not complete your request. Check your internet connection and try again.',
  'اختر...': 'Choose...',
  'خصم خاص': 'Special offer',
  'الأكثر مبيعاً': 'Best seller',
  'نفذت الكمية': 'Out of stock',
  'شامل ضريبة القيمة المضافة': 'VAT included',
  'وصف المنتج': 'Product description',
  'متوفر بالمخزون': 'In stock',
  '✓ تمت الإضافة': '✓ Added',
  'إضافة للسلة': 'Add to cart',
  'سلة المشتريات فارغة': 'Your cart is empty',
  'تصفح تشكيلة منتجاتنا المميزة وأضف مشترياتك إلى السلة.':
    'Browse our products and add your favorites to the cart.',
  'تسوق الآن': 'Start shopping',
  'تفريغ السلة': 'Clear cart',
  'هل أنت متأكد من حذف جميع المنتجات من السلة؟': 'Are you sure you want to remove all items from your cart?',
  'إلغاء': 'Cancel',
  'تفريغ': 'Clear',
  'كوبون الخصم': 'Discount coupon',
  'إزالة': 'Remove',
  'تطبيق': 'Apply',
  'أدخل رمز الكوبون (مثال: SALLA10)': 'Enter coupon code (e.g. SALLA10)',
  'تفاصيل الفاتورة': 'Order summary',
  'المجموع الفرعي': 'Subtotal',
  'خصم الكوبون': 'Coupon discount',
  'رسوم الشحن والتوصيل': 'Shipping',
  'الإجمالي الكلي': 'Total',
  'يحدد عند إتمام الطلب': 'Calculated at checkout',
  'متابعة إتمام الطلب': 'Continue to checkout',
  'رمز القسيمة غير صالح أو منتهي الصلاحية.': 'This coupon code is invalid or expired.',
  'تم تطبيق الكوبون': 'Coupon applied',
  '📍 عنوان التوصيل': '📍 Delivery address',
  '🚚 طريقة الشحن': '🚚 Shipping method',
  '💳 وسيلة الدفع': '💳 Payment method',
  'موجز الطلب': 'Order summary',
  'الاسم الأول *': 'First name *',
  'اسم العائلة': 'Last name',
  'رقم الجوال (05xxxxxxxx) *': 'Phone number *',
  'المدينة *': 'City *',
  'الحي والشارع *': 'District and street *',
  'ملاحظات إضافية للتوصيل (اختياري)': 'Delivery notes (optional)',
  'المجموع': 'Subtotal',
  'الخصم': 'Discount',
  'الشحن': 'Shipping',
  'الإجمالي للدفع': 'Total due',
  'تأكيد وإتمام الطلب': 'Place order',
  'تم استلام طلبك بنجاح!': 'Your order was received!',
  'شكراً لتسوقك من': 'Thank you for shopping at',
  'رقم طلبك هو:': 'Your order number is:',
  'العودة للرئيسية': 'Back to home',
  'بيانات غير مكتملة': 'Missing information',
  'يرجى إدخال الاسم، رقم الجوال، وعنوان التوصيل للمتابعة.':
    'Enter your name, phone number, and delivery address to continue.',
  'خطأ في إتمام الطلب': 'Checkout error',
  'تعذر إتمام طلبك في الوقت الحالي. يرجى إعادة المحاولة.':
    'We could not place your order. Please try again.',
  'بطاقة مدى البنكية': 'Mada card',
  'الأكثر أماناً': 'Most secure',
  'دفع سريع': 'Fast payment',
  'البطاقة الائتمانية (Visa / Mastercard)': 'Credit card (Visa / Mastercard)',
  'تمارا - قسمها على 4 دفعات بدون فوائد': 'Tamara - split into 4 interest-free payments',
  'الدفع عند الاستلام': 'Cash on delivery',
  'ضريبة القيمة المضافة': 'VAT',
  'تقييم': 'reviews',
  'متجرنا': 'Our store',
  'المملكة العربية السعودية': 'Saudi Arabia',
  'الرياض': 'Riyadh',
  'أرامكس - شحن سريع للمنزل': 'Aramex - Express home delivery',
  'خلال 2-3 أيام عمل': 'Within 2-3 business days',
  'سمسا إكسبريس': 'SMSA Express',
  'خلال 1-2 أيام عمل': 'Within 1-2 business days',
  'سبل - البريد السعودي': 'SPL - Saudi Post',
  'خلال 3-5 أيام عمل': 'Within 3-5 business days',
  'الاسم الكامل': 'Full name',
  'تمت الإضافة بنجاح': 'Added successfully',
  'مواصلة التسوق': 'Continue shopping',
  'الذهاب للسلة': 'Go to cart',
  'تمت إضافة العنصر إلى سلة المشتريات.': 'The item was added to your cart.',
  'تسجيل الدخول': 'Log In',
  'تسجيل الخروج': 'Log Out',
  'تسجيل حساب جديد': 'Create an Account',
  'إنشاء حساب': 'Create Account',
  'إنشاء الحساب': 'Create Account',
  'الدخول': 'Log In',
  'البريد الإلكتروني': 'Email address',
  'كلمة المرور': 'Password',
  'تأكيد كلمة المرور': 'Confirm password',
  'أدخل كلمة المرور': 'Enter your password',
  'أدخل البريد الإلكتروني وكلمة المرور.': 'Enter your email and password.',
  'ليس لديك حساب؟': "Don't have an account?",
  'لديك حساب بالفعل؟': 'Already have an account?',
  'سجّل الدخول للوصول إلى حسابك.': 'Log in to access your account.',
  'جارٍ التحقق من الجلسة...': 'Checking session...',
  'تم تسجيل الخروج': 'Logged out',
  'هل أنت متأكد من رغبتك في تسجيل الخروج؟': 'Are you sure you want to log out?',
  'حساب عميل': 'Customer Account',
  'اللغة': 'Language',
  'تعديل الاسم': 'Edit name',
  'حفظ التغييرات': 'Save changes',
  'مرحبًا بعودتك': 'Welcome back',
  'أنشئ حسابك وابدأ التسوق': 'Create your account and start shopping',

  // Authentication Keys
  'auth.invalidCredentials': 'The email or password is incorrect.',
  'auth.emailExists': 'An account with this email already exists.',
  'auth.invalidEmail': 'Enter a valid email address.',
  'auth.shortPassword': 'Password must be at least 8 characters.',
  'auth.shortName': 'Full name must be at least 2 characters.',
  'auth.passwordMismatch': 'Passwords do not match.',
  'auth.unknown': 'Something went wrong. Please try again.',
  'auth.requiredFields': 'Please fill in all required fields.',
  'auth.accountCreated': 'Account created successfully!',
  'auth.welcomeMessage': 'Your account is ready. Welcome to our store.',
  'auth.dismiss': 'Dismiss',
  'auth.accountNotFound': 'Account not found. Please sign in again.',
  'auth.storageUnavailable': 'Secure account storage is unavailable.',
  'auth.nameUpdated': 'Your name has been updated.',
  'auth.editName': 'Edit name',
  'auth.saveChanges': 'Save changes',
  'auth.cancel': 'Cancel',
  'auth.rememberMe': 'Remember me',
  'auth.showPassword': 'Show password',
  'auth.hidePassword': 'Hide password',
  'auth.createAccountSubtitle': 'Create an account to start shopping.',
  'auth.loginSubtitle': 'Sign in to access your account and continue shopping.',
  'auth.passwordLength': 'Use at least 8 characters.',
  'auth.profileUpdated': 'Profile updated successfully.',
  'auth.fullName': 'Full name',
  'auth.email': 'Email address',
  'auth.language': 'Language',
  'auth.save': 'Save',
  'auth.couponInvalid': 'This coupon code is invalid or expired.',
  'auth.orderAdded': 'Added to cart',
  'auth.productRating': 'reviews',
  'auth.networkError': 'Could not connect. Please try again.',
  'payment.codFee': '+15 SAR',

  // Product categories & descriptions in catalog
  'العود الطبيعي والمروكي': 'Natural and Marouki Oud',
  'دهن العود الفاخر': 'Premium Oud Oil',
  'عطور شرقية ملكية': 'Royal Oriental Perfumes',
  'محاصيل مختصة فلتر': 'Specialty Filter Coffee',
  'محاصيل إسبريسو': 'Espresso Beans',
  'هوديز وسويت شيرت': 'Hoodies & Sweatshirts',
  'الإلكترونيات': 'Electronics',
  'الموضة': 'Fashion',
  'المنزل': 'Home',
  'الجمال': 'Beauty',
  'الرياضة': 'Sports',
  'الكتب': 'Books',

  'رقائق مروكي آصق طبيعي سوبر': 'Super Natural Asaq Marouki Chips',
  'أجود رقائق العود المروكي الفاخر المستخرج من غابات آصق الإندونيسية. نكهة سويتية بخورية كثيفة تدوم طويلاً وتثبت في المجالس والملابس.':
    'Finest luxury Marouki oud chips harvested from Indonesian Asaq forests. Rich, sweet incense aroma with enduring longevity.',
  'عود مروكي طبيعي فاخر بنكهة بخورية فواحة وثبات استثنائي.':
    'Natural luxury Marouki oud with a fragrant incense scent and exceptional longevity.',
  'دهن عود براشين كلاسيك قديم معتق': 'Aged Classic Prachin Oud Oil',
  'دهن عود بيور نقي 100% بنكهة خشبية فواحة وسويتية تدوم لأكثر من 18 ساعة على البشرة وثلاثة أيام على الأقمشة.':
    'Pure 100% oud oil with an aromatic, sweet woody fragrance lasting over 18 hours on skin and 3 days on fabric.',
  'دهن براشين نقي معتق ذو فوحان ملكي وثبات عالي.':
    'Pure aged Prachin oil with royal sillage and long-lasting scent.',
  'عطر مسك الفخامة الملكي 100 مل': 'Royal Luxury Musk Perfume 100ml',
  'مزيج فاخر من المسك الأبيض الحريري مع لمسات من الفانيلا والعنبر والورد الطائفي.':
    'A luxurious blend of silky white musk with touches of vanilla, amber, and Taif rose.',
  'مسك نقي أنثوي ورجالي يعكس الفخامة والنقاء.':
    'Pure unisex musk reflecting elegance and pristine freshness.',
  'إثيوبيا قوجي هامبيلا - مجففة': 'Ethiopia Guji Hambela - Natural',
  'إيحاءات الفراولة، الخوخ، وزهور الياسمين بقوام حريري ممتع مع حلاوة واضحة متوازنة للتقطير V60 و Chemex.':
    'Notes of strawberry, peach, and jasmine flowers with a silky body and balanced sweetness for V60 and Chemex.',
  'محصول إثيوبي مميز بإيحاءات الفاكهة الاستوائية والزهور العطرية.':
    'Distinctive Ethiopian origin with tropical fruit notes and floral fragrance.',
  'كولومبيا ويلا سوبريمو - مغسولة': 'Colombia Huila Supremo - Washed',
  'شوكولاتة داكنة، كراميل، ومكسرات محمصة. قوام ممتلئ غني مثالي للإسبريسو ومشروبات الحليب (كورتادو، فلات وايت، لاتيه).':
    'Dark chocolate, caramel, and roasted nuts. Rich, full body ideal for espresso and milk beverages.',
  'محصول كولومبي كلاسيكي للشوكولاتة والكراميل بقوام مخملي.':
    'Classic Colombian crop with chocolate and caramel notes and a velvety texture.',
  'هودي أوفرسايز قطن عضوي ثقيل 450GSM': 'Heavyweight 450GSM Organic Cotton Oversized Hoodie',
  'هودي عصري مصمم بقصة مريحة واسعة من القطن الثقيل الممتاز مع جيب كنغر وقبعة مبطنة مزدوجة.':
    'Modern relaxed-fit hoodie crafted from premium heavyweight organic cotton with kangaroo pocket.',
  'قطن 100% ثقيل بقصة عصرية مريحة ودافئة.':
    '100% heavy cotton with a comfortable, stylish, warm modern fit.',
  'سماعات لاسلكية': 'Wireless Noise-Canceling Headphones',
  'سماعات بلوتوث محمولة بخاصية إلغاء الضوضاء وتحكم صوتي، مصممة للعمل لساعات طويلة.':
    'Portable Bluetooth headphones with active noise cancellation and voice control, engineered for long sessions.',
  'سماعات لاسلكية عالية الدقة مع بطارية تدوم طويلاً.':
    'High-fidelity wireless headphones with extended battery life.',
  'ساعة ذكية': 'Smart Fitness Watch',
  'ساعة ذكية بقياس نبضات القلب ومعدل الأيض ومعلومات GPS، مقاومة للماء.':
    'Smart watch with heart rate sensor, metabolic tracking, GPS navigation, and water resistance.',
  'ساعة ذكية متكاملة لتتبع الصحة واللياقة البدنية.':
    'Complete smart watch for comprehensive health and fitness tracking.',

  // Product options
  'الوزن': 'Weight',
  'تولة (12 جرام)': 'Tola (12g)',
  'أوقية (28 جرام)': 'Ounce (28g)',
  'ثمن كيلو (125 جرام)': '1/8 Kilo (125g)',
  'نوع الطحنة': 'Grind Type',
  'حبوب كاملة (بدون طحن)': 'Whole Beans (Unground)',
  'طحنة فلتر V60': 'V60 Filter Grind',
  'طحنة إسبريسو': 'Espresso Grind',
  'المقاس': 'Size',

  // Banners
  'عروض الموسم الملكية': 'Royal Seasonal Offers',
  'خصومات تصل إلى 25% على أفخر أدهان العود والمروكي':
    'Discounts up to 25% on the finest oud oils and Marouki',
  'خصومات تصل إلى 25% على أفخر المنتجات':
    'Discounts up to 25% on our finest products',
  'جديد المسك الأبيض': 'New White Musk Collection',
  'نقاء يدوم طوال اليوم مع لمسات من زهور الربيع':
    'All-day purity with delicate notes of spring blossoms',
  'محاصيل الموسم الإثيوبية': 'Ethiopian Seasonal Crops',
  'حلاوة الفواكه الاستوائية بلمسة تحميص احترافية طازجة':
    'Tropical fruit sweetness freshly roasted with mastery',
  'تشكيلة الشتاء المحدودة': 'Limited Winter Collection',
  'أقمشة قطنية ثقيلة وقصات أوفرسايز مريحة':
    'Heavy cotton fabrics and comfortable oversized cuts',
};

const arabicTranslations: Record<string, string> = {
  'auth.invalidCredentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  'auth.emailExists': 'يوجد حساب مسجل بهذا البريد الإلكتروني.',
  'auth.invalidEmail': 'أدخل بريدًا إلكترونيًا صحيحًا.',
  'auth.shortPassword': 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.',
  'auth.shortName': 'يجب أن يتكون الاسم من حرفين على الأقل.',
  'auth.passwordMismatch': 'كلمتا المرور غير متطابقتين.',
  'auth.couponInvalid': 'رمز القسيمة غير صالح أو منتهي الصلاحية.',
  'auth.unknown': 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  'auth.requiredFields': 'يرجى إكمال جميع الحقول المطلوبة.',
  'auth.accountCreated': 'تم إنشاء الحساب بنجاح!',
  'auth.welcomeMessage': 'أصبح حسابك جاهزًا. أهلًا بك في متجرنا.',
  'auth.dismiss': 'إغلاق',
  'auth.accountNotFound': 'تعذر العثور على الحساب. يرجى تسجيل الدخول مرة أخرى.',
  'auth.storageUnavailable': 'مساحة تخزين الحساب الآمنة غير متاحة.',
  'auth.nameUpdated': 'تم تحديث اسمك.',
  'auth.editName': 'تعديل الاسم',
  'auth.saveChanges': 'حفظ التغييرات',
  'auth.cancel': 'إلغاء',
  'auth.rememberMe': 'تذكرني',
  'auth.showPassword': 'إظهار كلمة المرور',
  'auth.hidePassword': 'إخفاء كلمة المرور',
  'auth.createAccountSubtitle': 'أنشئ حسابًا لتبدأ التسوق.',
  'auth.loginSubtitle': 'سجّل الدخول لمتابعة التسوق.',
  'auth.passwordLength': 'استخدم 8 أحرف على الأقل.',
  'auth.profileUpdated': 'تم تحديث الملف الشخصي بنجاح.',
  'auth.fullName': 'الاسم الكامل',
  'auth.email': 'البريد الإلكتروني',
  'auth.language': 'اللغة',
  'auth.save': 'حفظ',
  'payment.codFee': '+15 ر.س.',
  'ضريبة القيمة المضافة': 'ضريبة القيمة المضافة',
  'تقييم': 'تقييم',
  'متجرنا': 'متجرنا',
  'مرحبًا بعودتك': 'مرحبًا بعودتك',
  'أنشئ حسابك وابدأ التسوق': 'أنشئ حسابك وابدأ التسوق',
};

const arabicResource = Object.fromEntries(
  Object.keys(englishTranslations).map((key) => [key, key])
);

const i18nInstance = createInstance();
i18nInstance.use(initReactI18next).init({
  resources: {
    en: { translation: englishTranslations },
    ar: { translation: { ...arabicResource, ...arabicTranslations } },
  },
  lng: 'en',
  fallbackLng: 'ar',
  keySeparator: false,
  interpolation: { escapeValue: false },
  returnNull: false,
});

interface LanguageContextValue {
  language: AppLanguage;
  isRTL: boolean;
  isLoading: boolean;
  setLanguage: (language: AppLanguage) => void;
  t: (arabicText: string) => string;
  countLabel: (
    count: number,
    arabicSingular: string,
    arabicPlural: string,
    englishSingular: string,
    englishPlural: string
  ) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: React.PropsWithChildren) {
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    I18nManager.allowRTL(true);

    async function restoreLanguage() {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        const nextLanguage: AppLanguage =
          savedLanguage === 'ar' || savedLanguage === 'en' ? savedLanguage : 'en';
        await i18nInstance.changeLanguage(nextLanguage);
        I18nManager.forceRTL(nextLanguage === 'ar');
        if (active) {
          setLanguageState(nextLanguage);
        }
      } catch (error) {
        console.error('Unable to restore the language preference:', error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void restoreLanguage();

    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(nextLanguage === 'ar');
    i18nInstance.changeLanguage(nextLanguage).catch((error: unknown) => {
      console.error('Unable to update the application language:', error);
    });
    AsyncStorage.setItem(LANGUAGE_KEY, nextLanguage).catch((error: unknown) => {
      console.error('Unable to save the language preference:', error);
    });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      isRTL: language === 'ar',
      isLoading,
      setLanguage,
      t: (arabicText) => String(i18nInstance.t(arabicText)),
      countLabel: (count, arabicSingular, arabicPlural, englishSingular, englishPlural) => {
        const label =
          language === 'ar'
            ? count === 1
              ? arabicSingular
              : arabicPlural
            : count === 1
              ? englishSingular
              : englishPlural;
        return `${count} ${label}`;
      },
    }),
    [language, isLoading, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
