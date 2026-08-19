<script setup>
defineProps({
    to: { type: String, default: null },
    href: { type: String, default: null },
    type: { type: String, default: 'button' },
    variant: {
        type: String,
        default: 'default',
        validator: (val) => ['default', 'primary', 'secondary', 'danger', 'warning'].includes(val)
    }
})
</script>

<template>
    <component 
        :is="to ? 'NuxtLink' : (href ? 'a' : 'button')" 
        :to="to" 
        :href="href" 
        :type="!to && !href ? type : undefined"
        class="btn"
        :class="[`btn--${variant}`]"
    >
        <slot />
    </component>
</template>

<style lang="scss" scoped>
.btn {
    // Define a fallback/default variable
    --btn-bg: #3b82f6; 

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
    border: none;
    font-family: inherit;
    font-size: 1rem;
    
    // Apply the variable to the background
    background-color: var(--btn-bg);
    color: white;

    transition: background-color 0.2s;

    &:hover {
        // Automatically darkens the background color by mixing 85% of it with 15% black
        background-color: color-mix(in srgb, var(--btn-bg) 85%, black);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    // Color Variants just update the variable
    &--default {
        --btn-bg: #3b82f6;
    }

    &--secondary {
        --btn-bg: #64748b;
    }

    &--danger {
        --btn-bg: #ef4444;
    }

    &--warning {
        --btn-bg: #f59e0b;
    }
}
</style>