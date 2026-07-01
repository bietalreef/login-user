# تقرير فحص Target Home Planner

**تاريخ الفحص:** 2 مارس 2026

**تم بواسطة:** Manus AI

## 1. مقدمة

هذا التقرير يقدم تحليلاً مفصلاً لأداة **Target Home Planner**، وهي أداة تخطيط غرف ثلاثية الأبعاد (3D Room Planner) تفاعلية عبر الويب. تم تصميم الأداة لتمكين المستخدمين من تصميم وتأثيث مساحاتهم افتراضياً باستخدام منتجات حقيقية من متجر Target، ومن ثم شرائها مباشرة. يركز الفحص على آلية عمل المخطط، وكيفية عرض المنتجات وربطها بالغرفة، وحساب الأسعار، وإضافتها إلى سلة التسوق.

## 2. واجهة المستخدم الرئيسية

عند فتح الأداة، يتم استقبال المستخدم بواجهة نظيفة مقسمة إلى قسمين رئيسيين: لوحة التنقل الجانبية على اليسار، ومساحة العمل ثلاثية الأبعاد على اليمين.

![Welcome Screen](https://private-us-east-1.manuscdn.com/sessionFile/T5OQbQ4mXX4M6t0hWQqdEJ/sandbox/e1PdRHScn1lQxQ9lpgIF9m-images_1772505851075_na1fn_L2hvbWUvdWJ1bnR1L3NjcmVlbnNob3RzL3RhcmdldC8wMV93ZWxjb21lX3NjcmVlbg.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVDVPUWJRNG1YWDRNNnQwaFdRcWRFSi9zYW5kYm94L2UxUGRSSFNjbjFsUXhROWxwZ0lGOW0taW1hZ2VzXzE3NzI1MDU4NTEwNzVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTmpjbVZsYm5Ob2IzUnpMM1JoY21kbGRDOHdNVjkzWld4amIyMWxYM05qY21WbGJnLndlYnAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=sE~YCSA2zIpQnbgASco-5QKOH2uAp06lG7Mr4z1NTa4k0PvKtRo4j7bIcHdBjfMG-ujbHVgZuaYMb3YB5yA2sIiBqrX-C1ztXiBj30c977YRkwupHWweXWwEIl0awmiEeGM4Z1CYXhRPfRz~T5pxqF4ty3BkIROjHEePV06lzeGgvmYk4z73L7w09V8LWSb0ecu4l6bzazadZP4TJFffaVlUa2VJ7olxOS1vorsROGKw56KbIyBGM4yKXyFUA9Ln3P8SLkhP-wuf0lnCBRpeTR95g99neGQmB7128MHLjzNErXARV5-E-nH0mJhR3srOlop5JkJNA9uaRqiLvbiENg__)

| القسم | الوصف |
| :--- | :--- |
| **لوحة التنقل (يسار)** | تحتوي على التبويبات الرئيسية: **Create space** (لإنشاء مساحة)، **Inspiration** (لأخذ الإلهام)، **Shop space** (لتسوق المنتجات في الغرفة)، و **My spaces** (لحفظ التصاميم). |
| **مساحة العرض (يمين)** | تعرض نموذج الغرفة ثلاثي الأبعاد (3D Canvas) وتسمح بالتفاعل معه. تحتوي أيضاً على أزرار التحكم بالكاميرا وزر سلة التسوق. |

## 3. آلية عمل مخطط الغرف ثلاثي الأبعاد (3D Room Planner)

تبدأ تجربة المستخدم باختيار نقطة بداية، إما غرفة فارغة أو تصميم معد مسبقاً.

### 3.1. إنشاء مساحة (Create Space)

يمكن للمستخدم البدء من الصفر (Start from scratch) أو اختيار أحد القوالب الملهمة (Inspirational spaces) التي صممها خبراء Target، مثل "Modern Bedroom" أو "Classic Home Office".

![Create Space Panel](https://private-us-east-1.manuscdn.com/sessionFile/T5OQbQ4mXX4M6t0hWQqdEJ/sandbox/e1PdRHScn1lQxQ9lpgIF9m-images_1772505851075_na1fn_L2hvbWUvdWJ1bnR1L3NjcmVlbnNob3RzL3RhcmdldC8wMl9jcmVhdGVfc3BhY2VfcGFuZWw.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVDVPUWJRNG1YWDRNNnQwaFdRcWRFSi9zYW5kYm94L2UxUGRSSFNjbjFsUXhROWxwZ0lGOW0taW1hZ2VzXzE3NzI1MDU4NTEwNzVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTmpjbVZsYm5Ob2IzUnpMM1JoY21kbGRDOHdNbDlqY21WaGRHVmZjM0JoWTJWZmNHRnVaV3cud2VicCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Xsg~UnTJcmggpQIL9zQj4NdwCdhrYafDUWJrSrZkWI9fhQn1Sms-tM~r53INgk46ndgoCqufBRL90u1s5k8Xxganil~GpZZhABEWR5JIOqEu-tsjG-WzcURnZfjNW2zrwOHKqeO5SWG8r7uIY5MR4III0Grn2ded~aMR3fTgbhgtyv2RlT5Xo321cijLPifzO20xytIUfmnWF3lSdttqg9TXiyFYRjHXLHdqZ~-6fQ3Y~vZ4qvgH5YvQFJ7kKrLbUAwIw7~HU54XjYNf24PrtABl-wFMUVCUMyjj9mPGEVLIcepC1WFqdlKcY~XKHWmMhc-7CJW-THHNjYQ3lQG~rw__)

### 3.2. التفاعل مع الغرفة ثلاثية الأبعاد

بمجرد اختيار غرفة، يتم عرضها في مساحة العرض ثلاثية الأبعاد. يمكن للمستخدم:

- **استعراض الغرفة:** رؤية الأثاث والديكور من زوايا مختلفة.
- **التفاعل مع المنتجات:** النقر على أي قطعة أثاث داخل الغرفة لتحديدها.
- **تغيير زاوية الرؤية:** استخدام أزرار التحكم لعرض الغرفة من الأعلى (Top camera view) أو تدويرها وتكبيرها.

![Modern Bedroom 3D View](https://private-us-east-1.manuscdn.com/sessionFile/T5OQbQ4mXX4M6t0hWQqdEJ/sandbox/e1PdRHScn1lQxQ9lpgIF9m-images_1772505851075_na1fn_L2hvbWUvdWJ1bnR1L3NjcmVlbnNob3RzL3RhcmdldC8wNF9iZWRyb29tXzNkX3ZpZXc.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVDVPUWJRNG1YWDRNNnQwaFdRcWRFSi9zYW5kYm94L2UxUGRSSFNjbjFsUXhROWxwZ0lGOW0taW1hZ2VzXzE3NzI1MDU4NTEwNzVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTmpjbVZsYm5Ob2IzUnpMM1JoY21kbGRDOHdORjlpWldSeWIyOXRYek5rWDNacFpYYy53ZWJwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Z~njHooK9jACzWgaSZXTX~Kv9AlAv2OelLcFL-gT11IyHzRXQ29GpJF3A~bDBK~R7fWIlvG3kr59VLh~ao7f-LgfLdbd4UZXsQFRUJuaU02ZZMLEsoV1qCvHHi5NPh1FckJUPGjX6E5SfwxEohutJG43gYpEdfwbB2jJxS-H0q39bns5fNawx-OGNbo42RrPwU-BVV0h11kT4q6n8TjIx1vS1ydnRIRfyCsnbKEpG96LljYCJl23zYfsEqDpYsx~qZbPbBS1TmA8rXWuQzT8NVaj3msrMGX3vOveTgkF8SQ2XNqMYaErnQgNQU1UC~MulSubDdxxBJp-TYpw6pVLJA__)

## 4. عرض المنتجات وربطها بالغرفة

تكمن قوة الأداة في ربطها السلس بين التصميم والتجارة الإلكترونية.

### 4.1. لوحة "Shop Space"

عند اختيار غرفة مجهزة، يعرض تبويب **Shop Space** قائمة بجميع المنتجات المستخدمة في تصميمها.

- **عرض المنتجات:** كل منتج يُعرض مع صورته، اسمه، سعره، تقييمه، وزر لإضافته للسلة أو إزالته من الغرفة.
- **الربط بالغرفة:** أي منتج يتم إزالته من هذه القائمة (عبر زر X) يختفي فوراً من النموذج ثلاثي الأبعاد.

![Shop Space with Products](https://private-us-east-1.manuscdn.com/sessionFile/T5OQbQ4mXX4M6t0hWQqdEJ/sandbox/e1PdRHScn1lQxQ9lpgIF9m-images_1772505851075_na1fn_L2hvbWUvdWJ1bnR1L3NjcmVlbnNob3RzL3RhcmdldC8wNV9zaG9wX3NwYWNlX3Byb2R1Y3Rz.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVDVPUWJRNG1YWDRNNnQwaFdRcWRFSi9zYW5kYm94L2UxUGRSSFNjbjFsUXhROWxwZ0lGOW0taW1hZ2VzXzE3NzI1MDU4NTEwNzVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTmpjbVZsYm5Ob2IzUnpMM1JoY21kbGRDOHdOVjl6YUc5d1gzTndZV05sWDNCeWIyUjFZM1J6LndlYnAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=g-qw0iK1RwHrROi~1QT9LJJPZH3veYVHnYS4sl1WiXiSyRhbfNs79xfHsyHF0dKwYSIwIXVc4loxUkt7xppGDQX3A4k07TmenTJ3ujvwuf~v0B7d78EiVa-oipRN6L~3v10Xxt2XoKf8KtvDkfdm5p1F8Yjhw7e4XY-UDjNKtJqQCaW-Eil4DLIcUJODAeDPKfIQpCK5uJbVWgByGd5mQSQXFGUTJJDXo0drFAVQ~wfVDnLD4ux-ealKfRaQHbpYqLEZ0UEQIeNFYBhvQWxNo~Cp288htHEC5qXL8Wkr4s2EEO7UP40QhqPvYSDcloVrimjlF3VaUl28D8aVDvNcfw__)

### 4.2. حساب السعر والإضافة للسلة

تقوم الأداة بحساب التكلفة الإجمالية للمنتجات المعروضة في الغرفة بشكل فوري.

- **حساب السعر:** يتم عرض "Estimated total" (الإجمالي المقدر) و "Estimated savings" (الوفورات المقدرة) أعلى قائمة المنتجات.
- **الإضافة للسلة:** يمكن للمستخدم إضافة جميع منتجات الغرفة دفعة واحدة عبر زر "Add X to cart"، أو إضافة كل منتج على حدة. يتم تحديث أيقونة سلة التسوق في الزاوية العلوية اليمنى بعدد المنتجات.

![Cart and Pricing](https://private-us-east-1.manuscdn.com/sessionFile/T5OQbQ4mXX4M6t0hWQqdEJ/sandbox/e1PdRHScn1lQxQ9lpgIF9m-images_1772505851075_na1fn_L2hvbWUvdWJ1bnR1L3NjcmVlbnNob3RzL3RhcmdldC8wOF9jYXJ0X3ZpZXc.webp?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVDVPUWJRNG1YWDRNNnQwaFdRcWRFSi9zYW5kYm94L2UxUGRSSFNjbjFsUXhROWxwZ0lGOW0taW1hZ2VzXzE3NzI1MDU4NTEwNzVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTmpjbVZsYm5Ob2IzUnpMM1JoY21kbGRDOHdPRjlqWVhKMFgzWnBaWGMud2VicCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=nT84eSIOXEC~x~kfOk~w6cjZJwv8-dwT4m-rh6bsaD-vjBckDoJ7D5b-5YtXbxwZRLC6GHoiy0pb5jGG4d9rtJzN6vlZ~ya3PIDgD5~k7ccwvF3fSWhPN9O-lwpZlybmfGpiAIZOVay9CgqWQ1CTFXlsWSJP4ltZfRO3VZBnQguLd2~-DB9DWLe8lRvdBclpudLBLhaRKW1k97zpNagrpPqL7-lNMj0-06WS9Zz2amovuP4G~3B-xoQb--jnPRoF6BdL1N295ZoWyTh4fbRiAvSmh1PHJOSILssvDRkzV6ElMnfPCOhCRJbAcF6Mt8yJWcZrJZeRtil4FS-I46bvGw__)

## 5. ملخص الميزات والتقنية

| الميزة | الوصف |
| :--- | :--- |
| **العرض ثلاثي الأبعاد** | تستخدم تقنية WebGL لتقديم تجربة 3D سلسة ومباشرة في المتصفح. |
| **التكامل مع المنتجات** | ربط مباشر وفوري بين الكائنات في المشهد ثلاثي الأبعاد وقاعدة بيانات منتجات Target. |
| **التسعير الفوري** | حساب تلقائي لتكلفة جميع المنتجات في الغرفة. |
| **تجربة التسوق** | تبسيط عملية الشراء من خلال السماح بإضافة مجموعة منتجات متناسقة إلى السلة بنقرة واحدة. |
| **الإلهام** | توفير عشرات الغرف المصممة مسبقاً لتكون نقطة انطلاق للمستخدمين. |

## 6. خلاصة

أداة Target Home Planner هي مثال ممتاز على دمج تجربة التصميم التفاعلي مع التجارة الإلكترونية. إنها لا تسمح للمستخدمين بتصور كيف ستبدو المنتجات في منازلهم فحسب، بل تسهل أيضاً عملية الشراء بشكل كبير، مما يحول الإلهام إلى مبيعات فعلية بطريقة مبتكرة وفعالة.
