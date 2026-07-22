# بوابة التوظيف — Aqar One Careers

مشروع Astro ثابت وجاهز للنشر على `jobs.aqar1.com` من خلال Cloudflare Pages. طلبات التوظيف تُرسل إلى Google Apps Script، ثم تُحفظ في Google Sheets وGoogle Drive مع إشعار بريد إلكتروني إلى الموارد البشرية.

## حالة النسخة

هذه النسخة معالجة ومهيأة للنشر، وتشمل:

- إصلاح ظهور رسالة **Application received** عند فتح الصفحة قبل إرسال النموذج.
- عدم إظهار النجاح إلا بعد استلام رد `{ ok: true }` من Google Apps Script.
- فحص الحقول، البريد، الهاتف، LinkedIn، نوع ملف السيرة الذاتية، والحجم الأقصى 5 MB.
- منع الإرسال المتكرر أثناء معالجة الطلب، مهلة زمنية للطلب، ورسائل خطأ واضحة.
- Honeypot بسيط ضد الروبوتات ومعرّف فريد لكل طلب.
- تحقق خلفي داخل Apps Script وعدم اعتبار أخطاء الخادم نجاحًا.
- حماية خلايا Google Sheets من Formula Injection.
- قفل للكتابة المتزامنة، حفظ منظم للملفات، ومنع التكرار بالمعرّف.
- صفحات وظائف مولّدة تلقائيًا، Sitemap، JobPosting JSON-LD، صفحة 404، ورؤوس أمان أساسية.
- حالات الوظيفة: `open` و`closing-soon` و`closed`.

## التشغيل محليًا

يتطلب Node.js 20 أو أحدث:

```bash
npm install
npm run dev
```

فحص نسخة الإنتاج:

```bash
npm run build
npm run preview
```

مخرجات البناء تكون داخل مجلد `dist/`.

## ربط Google Apps Script

ملف الخادم النهائي موجود هنا:

```text
apps-script/Code.gs
```

الخطوات:

1. افتح Google Sheet المستهدف.
2. اختر **Extensions → Apps Script**.
3. الصق محتوى `apps-script/Code.gs`.
4. راجع فقط القيم أعلى الملف: `SHEET_ID` و`NOTIFY_EMAIL`.
5. شغّل الدالة `setup()` مرة واحدة ووافق على الصلاحيات.
6. اختر **Deploy → New deployment → Web app**.
7. الإعدادات:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. انسخ رابط النشر النهائي الذي ينتهي بـ `/exec`.

لا تضع رابط `/dev`؛ استخدم `/exec` فقط.

## إضافة رابط Apps Script دون تعديل الكود

في Cloudflare Pages:

1. افتح المشروع.
2. **Settings → Environment variables**.
3. أضف متغيرًا باسم:

```text
PUBLIC_APPLY_ENDPOINT
```

والقيمة هي رابط Google Apps Script المنتهي بـ `/exec`.

4. أعد النشر من **Deployments → Retry deployment**.

يمكن أثناء التطوير المحلي نسخ `.env.example` إلى `.env` ووضع الرابط فيه.

عندما لا يكون الرابط مضافًا، لن تظهر رسالة نجاح زائفة؛ سيطلب الموقع من المتقدم إرسال السيرة الذاتية إلى بريد الموارد البشرية.

## النشر على Cloudflare Pages

ارفع هذا المجلد كما هو إلى GitHub، ثم اربطه مع Cloudflare Pages بالقيم التالية:

| الإعداد | القيمة |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node.js | 20 أو أحدث |

بعد نجاح النشر، أضف النطاق:

```text
jobs.aqar1.com
```

## إضافة وظيفة جديدة

انسخ الملف:

```text
src/content/jobs/head-of-sales-business-development.md
```

ثم غيّر اسمه ومحتواه. اسم الملف يصبح رابط الوظيفة تلقائيًا.

صيغة الحالة:

```yaml
status: "open"
```

الخيارات:

- `open`: متاحة.
- `closing-soon`: تُغلق قريبًا.
- `closed`: لا تظهر ولا تُنشأ لها صفحة في البناء التالي.

يمكن إضافة تاريخ انتهاء اختياري لتحسين بيانات Google Jobs:

```yaml
validThrough: "2026-09-30"
```

## الملفات الأساسية

| المطلوب | الملف |
|---|---|
| بيانات الموقع والتواصل | `src/config.ts` |
| إضافة/تعديل الوظائف | `src/content/jobs/` |
| نموذج التقديم | `src/components/ApplyForm.astro` |
| Google Apps Script | `apps-script/Code.gs` |
| الألوان والخطوط | `src/styles/tokens.css` |
| التنسيقات العامة | `src/styles/global.css` |
