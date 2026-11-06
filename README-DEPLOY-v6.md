# FAROUK GRUP Admin Dashboard v6.0 — دليل النشر

## الملفات المطلوبة

| الملف | الوظيفة |
|-------|---------|
| `admin.html` | الصفحة الرئيسية (اللوحة الجديدة) |
| `FaroukAdminAPI_v6.gs` | Google Apps Script (Backend) |
| `sw.js` | Service Worker |
| `manifest.webmanifest` | تعريف PWA |
| `icon-192.png` / `icon-512.png` | أيقونات |

---

## 1) تحديث Google Apps Script

1. افتح مشروع Google Apps Script المرتبط بجدول البيانات.
2. **احذف** الكود القديم أو انسخ محتوى `FaroukAdminAPI_v6.gs` كاملاً واستبدل به.
3. احفظ المشروع (Ctrl+S).
4. من **Deploy → Manage deployments → Edit → New version → Deploy**.
5. تأكد أن الإعدادات:
   - Execute as: **Me**
   - Who has access: **Anyone**

> الورقة `Staff` تُنشأ تلقائياً عند أول تشغيل، ويُضاف المسؤول الرئيسي:
> `faroukgrup@gmail.com` بكلمة مرور مؤقتة: `CHANGE_ME_ON_FIRST_LOGIN`
> **غيّرها فوراً** من داخل الشيت أو بعد الدخول.

---

## 2) هيكل ورقة Staff (تُنشأ تلقائياً)

| Email | Password | FullName | Role | PermissionsJSON | Active | LastLogin | CreatedAt | CreatedBy |
|-------|----------|----------|------|-----------------|--------|-----------|-----------|-----------|

- **Role**: `super` أو `staff`
- **PermissionsJSON** مثال:
```json
{
  "platforms": ["restaurantCourse", "newCourse"],
  "actions": ["manage_subscribers", "manage_bookings", "send_messages", "use_audit_tools"]
}
```

---

## 3) رفع ملفات الواجهة

ضع الملفات التالية في نفس المجلد على السيرفر (أو Cloudflare Pages / GitHub Pages / أي استضافة HTTPS):

- `admin.html`
- `sw.js`
- `manifest.webmanifest`
- `icon-192.png`
- `icon-512.png`

> يجب أن يكون الموقع على **HTTPS** حتى يعمل PWA والإشعارات.

---

## 4) ربط رابط الـ Script

في `admin.html` تأكد أن السطر التالي يشير إلى رابط النشر الجديد:

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXX/exec";
```

استبدل `XXXXXX` برابط الـ Web App بعد الـ Deploy.

---

## 5) أول استخدام

1. افتح `admin.html`
2. سجّل الدخول بـ:
   - البريد: `faroukgrup@gmail.com`
   - كلمة المرور: `CHANGE_ME_ON_FIRST_LOGIN` (ثم غيّرها من ورقة Staff)
3. من القائمة اليمنى → **إدارة الموظفين** → أضف موظفين وحدد صلاحياتهم.

---

## 6) الصلاحيات المتاحة

### المنصات
- comprehensive (المنصة الشاملة)
- portaltr (الشاملة تركي)
- restaurantCourse (دورة المطاعم)
- menuEngineering (هندسة المينيو)
- newCourse (دورة الماليات)

### الإجراءات
- `manage_subscribers` — إضافة/تعديل/تجميد مشتركين
- `manage_bookings` — إدارة حجوزات العملاء
- `booking_settings` — تعديل أوقات العمل
- `view_reports` — التقارير
- `use_audit_tools` — أدوات التدقيق (60/150/جاذبية)
- `send_messages` — إرسال رسائل داخلية
- `manage_staff` — إدارة الموظفين (يفضّل للمسؤول فقط)

---

## 7) الميزات الجديدة

- ✅ تسجيل دخول متعدد المستخدمين
- ✅ صلاحيات مرنة لكل موظف
- ✅ لوحة شخصية (مهام + مواعيد + ملاحظات)
- ✅ رسائل داخلية كاملة (وارد / مرسل / قراءة / غير مقروء)
- ✅ إدارة الموظفين + آخر دخول
- ✅ مزامنة تلقائية عند الخروج
- ✅ إخفاء/إظهار الأقسام حسب الصلاحيات
- ✅ نظام الحجوزات محمي بالصلاحيات
- ✅ PWA جاهز للتثبيت على الجوال

---

## ملاحظات أمنية

- غيّر كلمة مرور المسؤول الرئيسي فوراً.
- التوكن يُخزَّن في `localStorage` لمدة 24 ساعة.
- SECRET_KEY يُحفظ في Script Properties تلقائياً.
- لا تشارك رابط الـ Script مع غير الموثوقين.

---

تم البناء بواسطة Grok — FAROUK GRUP v6.0
