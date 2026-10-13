# لوحة التحكم — دعم PWA + مزامنة المهام والملاحظات

## الملفات المطلوبة
ضع الثلاثة معاً في نفس المجلد على السيرفر:

| الملف | الوظيفة |
|-------|---------|
| `admin.html` | الصفحة الرئيسية |
| `manifest.webmanifest` | تعريف التطبيق (اسم، لوجو، ألوان) |
| `sw.js` | Service Worker للتخزين المؤقت والعمل دون اتصال |

## 1) تثبيت كتطبيق (PWA)
- افتح الصفحة من **Chrome / Edge / Safari** على الجوال أو الكمبيوتر.
- سيظهر شريط أسفل الشاشة: **«ثبّت لوحة التحكم»**.
- أو من قائمة المتصفح: **إضافة إلى الشاشة الرئيسية / Install app**.
- اللوجو المستخدم هو شعار مجموعة فاروق الحالي.

> ملاحظة: يجب أن تُخدم الملفات عبر **HTTPS** (أو localhost) حتى يعمل التثبيت وService Worker.

## 2) مزامنة المهام والملاحظات والمواعيد عبر Google Sheets

الصفحة تحفظ محلياً (localStorage) **و** تحاول المزامنة مع الـ API:

```
POST https://admin-api-proxy.faroukgrup.workers.dev/
action=getPersonalData   + token
action=savePersonalData  + token + data (JSON)
```

### ما يجب إضافته في الـ Backend (Google Apps Script / Worker)

#### `getPersonalData`
- يقرأ من ورقة (مثلاً `PersonalData`) الصف الخاص بالمستخدم (أو صف واحد للإدمن).
- يعيد:
```json
{
  "status": "success",
  "data": {
    "notes": "...",
    "todos": [ { "id":"t1", "text":"...", "due":"2026-10-15", "priority":"high", "completed":false } ],
    "appointments": [ { "id":"a1", "title":"...", "date":"2026-10-14", "time":"10:00", "desc":"" } ],
    "updatedAt": 1728800000000
  }
}
```

#### `savePersonalData`
- يستقبل `data` (JSON) ويحفظه في الشيت.
- يعيد `{ "status": "success" }`.

إذا لم يكن الـ backend جاهزاً بعد، الصفحة تعمل **محلياً فقط** وتظهر حالة «محلي» بجانب زر التحديث.

### اقتراح هيكل ورقة Google Sheet
| A (key) | B (value) | C (updatedAt) |
|---------|-----------|---------------|
| notes | نص الملاحظات | timestamp |
| todos | JSON array | timestamp |
| appointments | JSON array | timestamp |

أو صف واحد يحتوي الأعمدة: `notes`, `todos_json`, `appointments_json`, `updatedAt`.

## 3) تحسينات الجوال
- الشريط الجانبي يصبح أفقياً ومرتباً.
- البطاقات والرسوم والجداول متجاوبة.
- دعم Safe Area للهواتف ذات النوتش عند التثبيت كـ PWA.
- شريط التثبيت يظهر فقط عند إمكانية التثبيت.

## اختبار سريع
1. ارفع الملفات الثلاثة.
2. افتح `admin.html` من الجوال → يجب أن يظهر خيار التثبيت.
3. سجّل الدخول → أضف مهمة أو ملاحظة → يجب أن تظهر حالة «جاري المزامنة» ثم «مزامن» (بعد تفعيل الـ API).
4. افتح نفس الصفحة من جهاز آخر → يجب أن تظهر نفس المهام بعد المزامنة.
