# TA’LIM JARAYONIDA BULUTLI TEXNOLOGIYALARDAN FOYDALANISH VA MA’LUMOTLAR XAVFSIZLIGINI TA’MINLASH

## Loyiha nomi: EduCloud Secure

### 1. Dolzarbligi
Zamonaviy ta'lim tizimida masofaviy o'qitish va raqamli resurslardan foydalanishga bo'lgan ehtiyoj kundan-kunga oshib bormoqda. O'quv materiallarini saqlash, tarqatish va baholash jarayonlarini avtomatlashtirish ta'lim muassasalari uchun dolzarb masalaga aylangan. Shu bilan birga, foydalanuvchilarning shaxsiy ma'lumotlari, o'zlashtirish ko'rsatkichlari va intellektual mulk (dars materiallari) xavfsizligini ta'minlash eng muhim vazifalardan biridir. Bulutli texnologiyalar bu jarayonlarni optimallashtirish imkonini bersa-da, ishonchli xavfsizlik mexanizmlari (autentifikatsiya, shifrlash, RBAC) joriy etilmasa, ma'lumotlar sizib chiqishi xavfi mavjud. Ushbu loyiha aynan shu muammolarni kompleks hal etishga qaratilgan.

### 2. Maqsadi
Loyihaning asosiy maqsadi - ta'lim muassasalari uchun o'quv jarayonini raqamlashtirish, bulutli texnologiyalar yordamida fayllarni tezkor va xavfsiz saqlash/almashish imkonini beruvchi, shuningdek ma'lumotlar xavfsizligi zamonaviy standartlar (JWT, Bcrypt, Role-Based Access) asosida himoyalangan "EduCloud Secure" web-platformasini ishlab chiqishdir.

### 3. Vazifalari
- **Tizim arxitekturasini yaratish:** Frontend (React) va Backend (Node.js/Express) o'rtasida xavfsiz API orqali ma'lumotlar almashinuvini yo'lga qo'yish.
- **Xavfsizlikni ta'minlash:** Foydalanuvchi parollarini Bcrypt yordamida hash qilish, JWT orqali avtorizatsiya va himoyalangan marshrutlarni (Protected Routes) joriy etish.
- **Ma'lumotlar bazasini loyihalash:** O'qituvchilar, talabalar, kurslar va materiallar o'rtasidagi munosabatlarni o'zida aks ettiruvchi relyatsion PostgreSQL bazasini qurish.
- **Bulutli xotira integratsiyasi:** Firebase Storage orqali katta hajmdagi PDF, PPTX, DOCX fayllarni ishonchli saqlash va yuklab olishni ta'minlash.
- **Rollarga asoslangan ruxsat (RBAC):** Admin, O'qituvchi va Talaba rollarini ajratish va ularning vakolatlarini chegaralash.

### 4. Predmet sohasi
Loyihaning predmet sohasi - oliy va o'rta maxsus ta'lim muassasalarida masofaviy ta'lim va axborot texnologiyalarini joriy etish jarayoni, jumladan, elektron ta'lim resurslarini boshqarish va axborot xavfsizligi tizimlari hisoblanadi.

### 5. Texnik topshiriq
- **Frontend:** React.js, Tailwind CSS (Responsive dizayn uchun).
- **Backend:** Node.js, Express.js.
- **Ma'lumotlar bazasi:** PostgreSQL.
- **Bulutli Xotira:** Firebase Storage.
- **Autentifikatsiya:** JWT (JSON Web Tokens).
- **Parol xavfsizligi:** Bcrypt.js (Salt Rounds: 10).
- **Xavfsizlik choralari:** SQL Injection va XSS himoyasi (ORMs/Query Builders va React'ning ichki himoyasi orqali), CORS sozlamalari.
- **Deployment (Joylashtirish):** Vercel (Frontend), Render (Backend).

### 6. Xulosa
"EduCloud Secure" loyihasi ta'lim muassasalariga hujjatlar aylanishini raqamlashtirish, ta'lim sifatini oshirish va resurslarni optimallashtirish imkonini beradi. Platformaga joriy etilgan xavfsizlik choralari va bulutli infratuzilma tizimning barqaror va ishonchli ishlashini kafolatlaydi, bu esa zamonaviy ta'limning ajralmas qismiga aylanadi.
