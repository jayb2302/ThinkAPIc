## 📌 Summary  
<!--    Explain what was added, removed, or modified. Keep it concise.  -->  
-  
-  
-  

## 🔍 Why this change?  
<!--  Explain the reason behind this change. What problem does it solve?  -->  
-  
-  
-  

## 🚀 Changes included  
<!--  List the specific changes made in this PR.  -->  
- [x] Added/Updated `<file or feature>`  
- [x] Modified `<file or logic>`  
- [x] Fixed `<bug or issue>`  

## 🔹 Why is this important?  
<!--  Provide additional context on why these changes matter.  -->  
-  
-  
-  

## 🔍 Benefits  
<!--  Highlight key benefits of this PR. -->  
✔ **Security** – Does this improve authentication or prevent unauthorized actions?  
✔ **Data Integrity** – Does this help maintain correct and accurate data?  
✔ **Performance** – Does this optimize or improve efficiency?  
✔ **Usability** – Does this enhance the user experience?  

## 📝 How to test?  
<!--  Step-by-step guide to test this PR.  -->  
1️⃣ Start the server (`npm run start-dev`).  
2️⃣ Use Postman or another API client to test endpoints:  
   - 🔓 `GET /api/endpoint` → Fetch data (Public).  
   - 🔐 `POST /api/endpoint` → Create data (Restricted).  
   - 🔐 `PUT /api/endpoint/:id` → Update data (Restricted).  
   - 🔐 `DELETE /api/endpoint/:id` → Delete data (Restricted).  
3️⃣ Try accessing restricted routes **without authentication** (should return `401 Unauthorized`).  
4️⃣ Authenticate as an admin and verify restricted actions work correctly.  
5️⃣ Check for correct API responses and logs.  

## ✅ Checklist  
<!--  Mark completed tasks with `[x]` before submitting the PR.  -->  
- [x] Authentication and access control implemented (if applicable).  
- [x] API responses return correct status codes.  
- [x] No breaking changes introduced.  
- [ ] Documentation updated (if necessary).  