<template>
    <teleport to="body">
        <transition name="toast">
            <div v-if="visible" @mouseenter="stopAutoClose" @mouseleave="resumeAutoClose"
                class="fixed flex items-center top-14 left-1/2 transform -translate-x-1/2 z-[99999] px-6 py-4 rounded-lg shadow-lg text-left cursor-pointer min-w-fit text-white border"
                :class="isFailed
                    ? 'animate-gradient-red border-red-200'
                    : 'animate-gradient-green border-green-200'">
                <font-awesome-icon :icon="isFailed ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check'"
                    class="mr-3 mt-1" />
                <span class="font-medium text-lg">{{ informMessage }}</span>
            </div>
        </transition>
    </teleport>


</template>

<script>
import { onMounted, ref, watch } from 'vue';

export default {
    props: ['informMessage', 'showToast', 'isFailed'],
    setup(props, { emit }) {
        const visible = ref(false);
        let autoCloseTimeout = null;
        const initialDuration = 2000

        const remainingTime = ref(initialDuration);
        let startTimestamp;

        const startAutoClose = () => {
            // Clear any existing timeout before starting a new one
            if (autoCloseTimeout) clearTimeout(autoCloseTimeout);

            startTimestamp = Date.now();
            autoCloseTimeout = setTimeout(() => {
                visible.value = false;
                emit('onClose', 'close');
            }, remainingTime.value);
        };

        const stopAutoClose = () => {
            if (autoCloseTimeout) {
                clearTimeout(autoCloseTimeout);
                remainingTime.value -= Date.now() - startTimestamp;
            }
        };

        const resumeAutoClose = () => {
            startAutoClose();
        };

        watch(() => props.showToast, (newValue) => {
            if (newValue) {
                // Clear any existing timeout and reset remaining time
                if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
                remainingTime.value = initialDuration;
                visible.value = true;
                startAutoClose();
            }
        });

        onMounted(() => {
            if (props.showToast) {
                remainingTime.value = initialDuration;
                visible.value = true;
                startAutoClose();
            }
        });

        return {
            visible,
            stopAutoClose,
            resumeAutoClose,
        };
    },
};
</script>

<style scoped>
@keyframes gradient-x {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

/* Green gradient animation */
.animate-gradient-green {
    background: linear-gradient(270deg,
            #28a745,
            #34d399,
            #16a34a);
    background-size: 600% 600%;
    animation: gradient-x 5s ease infinite;
}

/* Red gradient animation */
.animate-gradient-red {
    background: linear-gradient(270deg,
            #f87171,
            #ef4444,
            #b91c1c);
    background-size: 600% 600%;
    animation: gradient-x 5s ease infinite;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease-out;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
}

.toast-enter-to,
.toast-leave-from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.toast {
    transition: all 0.3s ease-in-out;
}

.toast.error {
    @apply bg-red-500;
}

.toast.infor {
    @apply bg-primary;
}

.fixed.inset-0 {
    background-color: transparent;
    pointer-events: all;
}
</style>