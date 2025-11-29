# 🔐 Permission System Implementation Guide

## ✅ What's Been Implemented

### 1. **Permission Composable** (`usePermission.js`)
- Loads user permissions from their assigned role
- Checks if user is Super Admin (bypasses all checks)
- Provides `hasPermission(module, action)` function
- Caches permissions for performance

### 2. **Role Form with Detailed Permission Table**
The Role form now has a **professional table interface**:

| Module | View | Add | Edit | Delete |
|--------|------|-----|------|--------|
| 📊 Dashboard | ☑ | ☑ | ☐ | ☐ |
| 👥 Users | ☑ | ☐ | ☑ | ☐ |
| 👨‍🏫 Teachers | ☑ | ☑ | ☑ | ☑ |
| ... and more |

**Quick Actions:**
- ✅ **Select All** - Grant all permissions
- ❌ **Deselect All** - Remove all permissions  
- 👁️ **All View** - Grant only view permissions

### 3. **Grammar Page Example** (✅ Already Applied)
- Create button only shows if user has `grammar_add` permission
- Edit icon only shows if user has `grammar_edit` permission
- Delete icon only shows if user has `grammar_delete` permission
- Shows "No access" if no edit/delete permissions
- **Super Admin sees everything automatically**

---

## 📋 How Permissions Work

### Permission Structure
Permissions are stored as key-value pairs:
```javascript
{
  "grammar_view": true,
  "grammar_add": true,
  "grammar_edit": false,
  "grammar_delete": false,
  "vocabulary_view": true,
  "vocabulary_add": false,
  // ... etc
}
```

### Module Keys
- `dashboard` - Dashboard
- `user` - Users
- `teacher` - Teachers
- `level` - Levels
- `lesson` - Lessons
- `vocabulary` - Vocabulary
- `grammar` - Grammar
- `quiz` - Quizzes
- `report` - Reports
- `role` - Roles

### Action Types
- `view` - Can view the page/data
- `add` - Can create new records
- `edit` - Can modify existing records
- `delete` - Can remove records

---

## 🚀 How to Apply to Other Pages

### Step 1: Import Permission Composable
```javascript
import { usePermission } from '@/composables/usePermission';
const { loadUserPermissions, hasPermission, isSuperAdmin } = usePermission();
```

### Step 2: Load Permissions on Mount
```javascript
onMounted(async () => {
    await loadUserPermissions();
});
```

### Step 3: Protect CREATE Button
```vue
<Button v-if="hasPermission('MODULE_KEY', 'add') || isSuperAdmin" 
    label="Create" 
    @click="handlePopOpenform('add', null)" />
```

### Step 4: Protect EDIT and DELETE Icons
```vue
<i v-if="hasPermission('MODULE_KEY', 'edit') || isSuperAdmin" 
    @click="handlePopOpenform('edit', item)"
    class="fa-solid fa-pen-to-square cursor-pointer"></i>
    
<i v-if="hasPermission('MODULE_KEY', 'delete') || isSuperAdmin" 
    @click="handleConfirmDetele(item)"
    class="fa-solid fa-trash cursor-pointer"></i>
    
<span v-if="!hasPermission('MODULE_KEY', 'edit') && !hasPermission('MODULE_KEY', 'delete') && !isSuperAdmin" 
    class="text-gray-400 text-xs">No access</span>
```

### Module Key Mapping
Replace `MODULE_KEY` with:
- `vocabulary.vue` → `'vocabulary'`
- `lesson.vue` → `'lesson'`
- `quiz.vue` → `'quiz'`
- `teacher.vue` → `'teacher'`
- `user.vue` → `'user'`
- `role.vue` → `'role'`
- `level.vue` → `'level'`
- `report.vue` → `'report'`

---

## 🎯 Testing the System

### As Super Admin:
1. Login as Super Admin
2. ✅ All buttons and actions should be visible
3. ✅ No permission restrictions

### As Regular User:
1. Create a new role with limited permissions
   - Example: Only `grammar_view` and `grammar_edit`
2. Assign this role to a test user
3. Login as the test user
4. Go to Grammar page:
   - ✅ Can see the list (view permission)
   - ✅ Can edit items (edit permission)
   - ❌ Cannot create new items (no add permission)
   - ❌ Cannot delete items (no delete permission)

---

## 📝 Next Steps

**Do you want me to apply this permission system to ALL admin pages?**

I can update:
- ✅ vocabulary.vue
- ✅ lesson.vue
- ✅ quiz.vue
- ✅ teacher.vue
- ✅ user.vue
- ✅ role.vue
- ✅ level.vue
- ✅ report.vue

Just let me know and I'll apply the same pattern to all remaining pages! 🚀

---

## 🔒 Security Notes

### Frontend Enforcement (Current)
- ✅ Hides buttons/actions from unauthorized users
- ⚠️ Users can still see the page if they have the route
- ⚠️ API calls are not blocked (frontend only)

### Backend Enforcement (Recommended)
For full security, you should also add permission checks in your backend API:
```javascript
// Example backend middleware
function checkPermission(module, action) {
    return async (req, res, next) => {
        const user = await User.findById(req.user.userId);
        const role = await Role.findById(user.roleId);
        
        if (user.mainRole === 'Super Admin') {
            return next();
        }
        
        if (!role.permission[`${module}_${action}`]) {
            return res.status(403).json({ error: 'No permission' });
        }
        
        next();
    };
}
```

This ensures security at both frontend AND backend levels! 🛡️

