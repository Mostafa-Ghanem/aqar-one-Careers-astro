# بوابة التوظيف — Aqar One Careers (TinaCMS & Clean Architecture)

مشروع Astro حديث ومستقر، يعتمد على **البنية النظيفة (Clean Architecture)** ومُهيأ بالكامل لإدارة المحتوى بواسطة **TinaCMS** والنشر التلقائي على Cloudflare Pages (`jobs.aqar1.com`).

---

## 🏛️ البنية الهندسية للمشروع (Architecture Overview)

تم فصل مكونات النظام بالكامل حسب المبادئ المعمارية الإلزامية:

```text
src/
├── cms/                     # طبقة الـ CMS والبيانات المركزية (Unified Data Access Layer)
│   ├── types.ts             # الأنواع والواجهات البرمجية الشاملة (TypeScript Interfaces)
│   └── repository.ts        # مستودع جلب البيانات (Repository Pattern)
│
├── components/
│   ├── blocks/              # أقسام الصفحات المستقلة (Page Section Blocks)
│   │   ├── HeroBlock.astro
│   │   ├── ValuesBlock.astro
│   │   ├── JobsBlock.astro
│   │   ├── ProcessBlock.astro
│   │   ├── FAQBlock.astro
│   │   └── CTABlock.astro
│   │
│   └── ui/                  # عناصر الواجهة الصغيرة القابلة لإعادة الاستخدام (UI Elements)
│       ├── Button.astro
│       ├── Container.astro
│       ├── Heading.astro
│       └── Chip.astro
│
├── content/                 # المحتوى المُدار عبر CMS / Content Collections
│   ├── jobs/                # ملفات الوظائف المتاحة (.md)
│   ├── pages/               # محتوى أجزاء الصفحات (home.json)
│   └── settings/            # إعدادات الموقع العام والتواصل (site.json)
│
├── pages/                   # صفحات التركيب والتجميع (Composition Pages Only)
│   ├── index.astro
│   └── jobs/
│       └── [slug].astro
│
└── layouts/                 # القوالب الهيكلية الرئيسية (BaseLayout)

tina/
└── config.ts                # إعدادات ونماذج TinaCMS (Tina Schemas)
```

---

## 🚀 التشغيل والإدارة محلياً (Local Development & TinaCMS)

يتطلب **Node.js 20** أو أحدث:

```bash
# تثبيت الحزم البرمجية
npm install

# تشغيل خادم التطوير مع لوحة إدارة TinaCMS
npm run dev

# أو تشغيل خادم Astro فقط بدون TinaCMS
npm run dev:astro
```

عند تشغيل `npm run dev` يمكنك فتح محرر **TinaCMS** محلياً عبر:
👉 `http://localhost:4321/admin/`

---

## 🛠️ كيفية الإدارة وتعديل المحتوى

### 1. إضافة أو تعديل الوظائف (Jobs)
- **عن طريق TinaCMS**: افتح `/admin/` واختر **Job Listings** لإضافة أو تعديل الوظائف بصرياً.
- **عن طريق الملفات**: أضف أو عدّل ملفات `.md` داخل `src/content/jobs/`.

### 2. تعديل محتوى الصفحة الرئيسية (Home Page)
- **عن طريق TinaCMS**: اختر **Pages** ← **home.json** لتعديل نصوص Hero، القيم، الخطوات، والأسئلة الشائعة.
- **عن طريق الملفات**: عدّل مباشرة في `src/content/pages/home.json`.

### 3. تعديل إعدادات الموقع والتواصل (Site Settings)
- عدّل في `src/content/settings/site.json` أو عبر TinaCMS لتحديث أرقام التواصل، الإيميل، والعناوين.

---

## ⚙️ البناء والتحقق قبل النشر (Build & Type Check)

```bash
# فحص الأنواع البرمجية (TypeScript Check)
npm run check

# بناء النسخة الثابتة للإنتاج (TinaCMS + Astro Build)
npm run build
```

تخزين مخرجات البناء النهائية يكون داخل مجلد `dist/`.

---

## ☁️ النشر على Cloudflare Pages

ارفع المشروع إلى GitHub واربطه بـ **Cloudflare Pages** بالإعدادات التالية:

| الإعداد | القيمة |
|---|---|
| **Framework preset** | `Astro` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |
| **Environment Variable** | `NODE_VERSION = 20` |
| **Environment Variable** | `PUBLIC_APPLY_ENDPOINT = [رابط Google Apps Script]` |
