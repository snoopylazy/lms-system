import { ref, computed } from 'vue';
import { decodeJwt } from '@/composables/decodeJWT';
import axios from 'axios';
import apiURL from '@/services/apiURL';

// Cache for user permissions
const permissionCache = ref(null);
const userMainRole = ref(null);

/**
 * Composable for checking user permissions
 * @returns {Object} Permission checking functions
 */
export function usePermission() {
    /**
     * Fetch and cache user permissions
     */
    const loadUserPermissions = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('🔐 No token found');
                permissionCache.value = null;
                userMainRole.value = null;
                return;
            }

            const decoded = decodeJwt(token);
            if (!decoded) {
                console.log('🔐 Invalid token');
                permissionCache.value = null;
                userMainRole.value = null;
                return;
            }

            // Get userId from token (could be 'id' or 'userId')
            const userId = decoded.userId || decoded.id;
            if (!userId) {
                console.log('🔐 No userId/id found in token');
                permissionCache.value = null;
                userMainRole.value = null;
                return;
            }

            console.log('🔐 Loading permissions for user:', userId);

            // Fetch user data
            const userResponse = await axios.get(`${apiURL}/lms/api/getAllDocs/User`, {
                params: {
                    dynamicConditions: JSON.stringify([
                        {
                            field: '_id',
                            operator: '==',
                            value: userId
                        }
                    ])
                }
            });

            const user = userResponse.data?.data?.[0];
            if (!user) {
                console.log('🔐 User not found');
                permissionCache.value = null;
                userMainRole.value = null;
                return;
            }

            console.log('🔐 User found:', user.username, 'mainRole:', user.mainRole);

            // Store main role
            userMainRole.value = user.mainRole;

            // Super Admin has all permissions (check both variations)
            if (user.mainRole === 'Super Admin' || user.mainRole === 'SuperAdmin' || user.mainRole === 'super admin') {
                console.log('✅ Super Admin detected! Granting all permissions');
                permissionCache.value = 'SUPER_ADMIN';
                return;
            }

            // Fetch role permissions if user has a role
            if (user.roleId) {
                console.log('🔐 Loading role permissions for roleId:', user.roleId);
                const roleResponse = await axios.get(`${apiURL}/lms/api/getAllDocs/Role`, {
                    params: {
                        dynamicConditions: JSON.stringify([
                            {
                                field: '_id',
                                operator: '==',
                                value: user.roleId
                            }
                        ])
                    }
                });

                const role = roleResponse.data?.data?.[0];
                if (role && role.permission) {
                    console.log('✅ Role permissions loaded:', Object.keys(role.permission).length, 'permissions');
                    permissionCache.value = role.permission;
                } else {
                    console.log('⚠️ No permissions found in role');
                    permissionCache.value = {};
                }
            } else {
                console.log('⚠️ No roleId found for user');
                permissionCache.value = {};
            }
        } catch (error) {
            console.error('❌ Error loading permissions:', error);
            permissionCache.value = {};
            userMainRole.value = null;
        }
    };

    /**
     * Check if user has a specific permission
     * @param {String} module - Module name (e.g., 'grammar', 'vocabulary')
     * @param {String} action - Action type ('view', 'add', 'edit', 'delete')
     * @returns {Boolean} Whether user has the permission
     */
    const hasPermission = (module, action) => {
        // If permissions not loaded yet, return false
        if (permissionCache.value === null) {
            console.log(`⏳ Permissions not loaded yet for ${module}_${action}`);
            return false;
        }

        // Super Admin has all permissions
        if (permissionCache.value === 'SUPER_ADMIN') {
            console.log(`✅ Super Admin has ${module}_${action}`);
            return true;
        }

        // Check specific permission
        const permissionKey = `${module.toLowerCase()}_${action}`;
        const hasIt = permissionCache.value[permissionKey] === true;
        console.log(`🔍 Checking ${permissionKey}:`, hasIt);
        return hasIt;
    };

    /**
     * Check if user is Super Admin
     * @returns {Boolean}
     */
    const isSuperAdmin = computed(() => {
        const mainRole = userMainRole.value;
        const isSA = mainRole === 'Super Admin' || 
                     mainRole === 'SuperAdmin' || 
                     mainRole === 'super admin' || 
                     permissionCache.value === 'SUPER_ADMIN';
        console.log(`🔐 isSuperAdmin check: mainRole="${mainRole}", cache="${permissionCache.value}", result:`, isSA);
        return isSA;
    });

    /**
     * Check if user has any permission for a module
     * @param {String} module - Module name
     * @returns {Boolean}
     */
    const hasModuleAccess = (module) => {
        if (permissionCache.value === 'SUPER_ADMIN') {
            return true;
        }

        const actions = ['view', 'add', 'edit', 'delete'];
        return actions.some(action => hasPermission(module, action));
    };

    /**
     * Get all permissions for debugging
     * @returns {Object}
     */
    const getAllPermissions = () => {
        return permissionCache.value;
    };

    return {
        loadUserPermissions,
        hasPermission,
        isSuperAdmin,
        hasModuleAccess,
        getAllPermissions,
        userMainRole: computed(() => userMainRole.value)
    };
}

