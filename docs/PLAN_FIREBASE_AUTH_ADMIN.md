# แผนแก้ไข: ใช้ Firebase Authentication สำหรับ Admin

**สถานะ: ดำเนินการแล้ว (Phase 1 + 2 เสร็จ)**

วัตถุประสงค์: ให้ Admin ล็อกอินด้วย Firebase Auth (อีเมล + รหัสผ่าน) เพื่อให้ Firestore รู้ตัวตน (`request.auth`) และ Rules อนุญาตการอ่าน/เขียนได้ — แก้ปัญหา "Missing or insufficient permissions" และหน้าหมุนไม่หยุด

---

## สรุปภาพรวม (ทำอะไรบ้าง)

| ลำดับ | ขั้นตอน | ทำอะไร |
|------|--------|--------|
| **0** | เตรียม Firebase Console | เปิด Email/Password sign-in, สร้าง Admin คนแรก, สร้าง document ใน `admins` |
| **1** | โค้ดแอป | ใช้ Firebase Auth ใน AuthContext, เปลี่ยนฟอร์มเป็นอีเมล+รหัสผ่าน, เช็คสิทธิ์จาก Firestore |
| **2** | Firestore Rules | เพิ่ม rules สำหรับ collections ที่ยังไม่มี (cases, invoices, subscribers, sent_emails) |
| **3** | ทดสอบ & สรุป | ทดสอบล็อกอินและทุก tab ใน Admin Dashboard |

---

## Phase 0: เตรียมใน Firebase Console (คุณทำเองก่อน — ไม่มีโค้ด)

ทำก่อนหรือทำคู่กับ Phase 1 ก็ได้

1. **เปิด Authentication**
   - ไปที่ [Firebase Console](https://console.firebase.google.com) → โปรเจกต์ thanatheplaw-firm
   - เมนู **Build** → **Authentication** → **Sign-in method**
   - เปิด **Email/Password** (Enable แล้ว Save)

2. **สร้าง Admin user คนแรก**
   - ใน **Authentication** → แท็บ **Users** → **Add user**
   - ใส่ **Email** และ **Password** (เก็บไว้ใช้ล็อกอิน Admin)
   - สร้างเสร็จจะได้ **User UID** (เช่น `abc123xyz`) — copy ไว้

3. **สร้าง document ใน Firestore สำหรับ Admin**
   - **Firestore Database** → **Start collection** (หรือใช้ collection ที่มีอยู่)
   - Collection ID: `admins`
   - Document ID: **ใช้ UID ที่ copy จากขั้นก่อน** (เช่น `abc123xyz`)
   - เพิ่ม field: `role` (string) = `admin`
   - Save

เมื่อทำครบแล้ว: มี user ใน Authentication และมี document `admins/{uid}` ที่ `role == 'admin'` — ถึงตอนนี้ Rules ที่มีอยู่จะรู้ว่า "คนนี้คือ admin"

---

## Phase 1: แก้โค้ดแอป (เราจะเริ่มจากส่วนนี้)

### 1.1 เพิ่ม Firebase Auth ในโปรเจกต์

- ใน `src/services/firebase.ts`: import และ export `getAuth(app)` จาก `firebase/auth`
- ไม่ต้องสร้างไฟล์ใหม่ แค่เพิ่ม auth instance ให้ AuthContext ใช้

### 1.2 แก้ AuthContext ให้ใช้ Firebase Auth

- **สถานะ:** ใช้ `onAuthStateChanged` ฟังว่าใครล็อกอินอยู่
- **login:** รับ `(email: string, password: string)` → เรียก `signInWithEmailAndPassword(auth, email, password)`
- **หลังล็อกอินสำเร็จ:** ต้องเช็คว่า UID นี้เป็น admin จริง โดยอ่าน Firestore `admins/{uid}` — ถ้า `role === 'admin'` ถึงจะถือว่า `isAdmin === true` ถ้าไม่มี document หรือ role ไม่ใช่ admin ให้ถือว่าไม่ใช่ admin (และอาจ signOut ให้)
- **logout:** เรียก `signOut(auth)` และลบ session ใน localStorage (ถ้ามี)
- **Session:** ยังเก็บใน localStorage ได้แต่ให้สอดคล้องกับ Firebase (เช่น เก็บแค่ว่า "เคยล็อกอินแล้ว" ส่วนตัวตนจริงมาจาก onAuthStateChanged)

ผลลัพธ์: เมื่อ Admin ล็อกอินด้วยอีเมล/รหัสผ่าน Firebase → `request.auth` ใน Firestore จะไม่เป็น null → Rules ใช้ `isAdmin()` ได้ → อ่าน/เขียน leads, activity_logs ฯลฯ ได้

### 1.3 แก้ UI หน้า Admin Login (AdminDashboard)

- จาก **ช่องเดียว (รหัสผ่าน)** เป็น **สองช่อง: อีเมล + รหัสผ่าน**
- เรียก `login(email, password)` แทน `login(password)`
- แสดงข้อความ error เมื่อล็อกอินไม่สำเร็จ (รหัสผิด / ไม่มีสิทธิ์ admin)
- จัดการกรณี "ล็อกอิน Firebase ได้แต่ไม่มี document ใน admins" (แสดงข้อความว่าไม่มีสิทธิ์และ signOut)

### 1.4 ประเภทข้อมูล (types)

- แก้ `AuthContextType`: `login: (email: string, password: string) => Promise<boolean>` (หรือ return boolean ตามที่ใช้อยู่)
- `AdminUser` ใช้ `id` = Firebase UID, `email` จาก `user.email` ได้

---

## Phase 2: Firestore Rules

### 2.1 Rules ที่มีอยู่แล้ว

- `leads`, `case_files`, `news`, `case_studies`, `activity_logs`, `admins` ใช้ `isAdmin()` อยู่แล้ว — **ไม่ต้องแก้** (แค่ต้องมี admin ล็อกอินผ่าน Firebase ตาม Phase 0)

### 2.2 Rules ที่ยังไม่มี (ต้องเพิ่ม)

Backend ใช้ collections เหล่านี้แต่ใน `firestore.rules` ยังไม่มีกฎเฉพาะ จึงตกไปที่ "default deny":

- `cases` — อ่าน/เขียน (CMS Cases)
- `invoices` — อ่าน/เขียน (Finance)
- `subscribers` — อ่าน/เขียน (อีเมล newsletter)
- `sent_emails` — เขียน (log อีเมลที่ส่ง)

**การแก้:** เพิ่มบล็อกใน `firestore.rules` สำหรับแต่ละ collection ด้านบน โดยให้ **อ่าน/เขียนได้เฉพาะเมื่อ `isAdmin()`** (รูปแบบเดียวกับ leads/news)

---

## Phase 3: สรุปและทดสอบ

- ลบหรือไม่ใช้ `VITE_ADMIN_PASSWORD` สำหรับการล็อกอิน (เก็บไว้ใน .env ก็ได้ถ้าไม่ใช้แล้ว ไม่กระทบ)
- ทดสอบ: ล็อกอินด้วยอีเมล/รหัสผ่านที่สร้างใน Phase 0 → เปิดแต่ละ tab (Leads, News, Cases, Finance, Logs ฯลฯ) ให้โหลดได้และไม่มี "Missing or insufficient permissions"
- แจ้งทีม: ต้องใช้อีเมล + รหัสผ่านที่ตั้งใน Firebase แทนรหัสเดียวเดิม

---

## ลำดับที่เรา "เริ่มแก้ก่อน" (เมื่อคุณอนุมัติ)

1. **Phase 1 ก่อนทั้งหมด** — เพราะเป็นต้นเหตุว่า Firestore ไม่รู้ตัวตน
   - 1.1 เพิ่ม `getAuth` ใน `firebase.ts`
   - 1.2 แก้ `AuthContext.tsx` (Firebase Auth + เช็ค admins ใน Firestore)
   - 1.3 แก้ฟอร์มล็อกอินใน `AdminDashboard.tsx` (อีเมล + รหัสผ่าน)
   - 1.4 ปรับ types ถ้าจำเป็น

2. **Phase 2 ตามมา** — เพื่อให้ทุก tab ใช้งานได้
   - เพิ่ม rules สำหรับ `cases`, `invoices`, `subscribers`, `sent_emails`

3. **Phase 0** — คุณทำใน Console ขณะที่เราเขียนโค้ด Phase 1 ได้ (หรือทำก่อนก็ได้)

เมื่อคุณพิมพ์ **"อนุมัติ"** เราจะเริ่มลงมือแก้ตามแผนนี้ทีละขั้น ไม่ข้ามไปทำ Phase 2 ก่อน Phase 1
