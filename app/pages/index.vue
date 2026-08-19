<template>
    <div>
        <div v-if="loggedIn" class="container">
            <div class="header">
                <BaseButton @click="clear" variant="danger">Logout</BaseButton>
            </div>

            <h1>Bookings</h1>

            <div v-for="group in bookingGroups" :key="group.key" class="booking-group">
                <h2 class="group-heading">{{ group.label }}</h2>

                <div class="accordion-list">
                <div 
                    v-for="booking in group.bookings" 
                    :key="booking.id" 
                    class="accordion-item"
                    :class="{ active: expandedId === booking.id }"
                >
                    <!-- Accordion Header (Always Visible) -->
                    <div class="accordion-header" @click="toggleAccordion(booking.id)">
                        <div class="summary-info">
                            <span class="parent-name"><strong>{{ booking.parent_name }}</strong></span>
                        </div>
                        <div class="summary-meta">
                            <span class="chevron">▼</span>
                        </div>
                    </div>

                    <!-- Accordion Content (Expandable) -->
                    <div v-if="expandedId === booking.id" class="accordion-content">
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="label">Parent Phone:</span>
                                <span>{{ booking.parent_phone }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Parent Email:</span>
                                <span>{{ booking.parent_email }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Child Name:</span>
                                <span>{{ booking.child_name || "-" }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Personal Code:</span>
                                <span>{{ booking.personal_code || "-" }}</span>
                            </div>
                        </div>

                        <div class="actions">
                            <BaseButton :disabled="loadingId === booking.id" @click="sendEmail(booking)">
                                {{ loadingId === booking.id ? "Sending..." : "Send Invoice" }}
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>

        <div v-else class="login-container">
            <img src="/images/logo.png" alt="Logo" class="logo" />
            <h1>LTS Portal</h1>
            <p class="subtitle">Please sign in with the authorized account to continue.</p>
            <BaseButton href="/auth/google" class="google-btn">Sign in with Google</BaseButton>
        </div>
    </div>
</template>

<script setup>
const { loggedIn, user, clear } = useUserSession();

const bookings = ref([]);
if (loggedIn.value) {
    const { data } = await useFetch("/api/bookings");
    bookings.value = data.value?.bookings || [];
}

const bookingGroups = computed(() => {
    const groups = new Map();

    for (const booking of bookings.value) {
        const timestamp = booking.start_at ? new Date(booking.start_at).getTime() : null;
        const key = timestamp === null || Number.isNaN(timestamp) ? "unscheduled" : String(timestamp);

        if (!groups.has(key)) {
            groups.set(key, {
                key,
                label: timestamp === null || Number.isNaN(timestamp)
                    ? "Unscheduled"
                    : new Date(timestamp).toLocaleString("lv-LV", {
                        dateStyle: "full",
                        timeStyle: "short",
                    }),
                bookings: [],
            });
        }

        groups.get(key).bookings.push(booking);
    }

    return Array.from(groups.values());
});

const loadingId = ref(null);
const expandedId = ref(null);

function toggleAccordion(id) {
    expandedId.value = expandedId.value === id ? null : id;
}

async function sendEmail(booking) {
    try {
        loadingId.value = booking.id;
        await $fetch("/api/invoices/send", {
            method: "POST",
            body: { bookingId: booking.id },
        });
        alert(`Invoice sent successfully to ${booking.parent_email}`);
    } catch (err) {
        alert(`Failed to send invoice: ${err.statusMessage || err.message}`);
    } finally {
        loadingId.value = null;
    }
}
</script>

<style lang="scss" scoped>
$font-stack: sans-serif;
$border-color: #ddd;

.container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    font-family: $font-stack;

    .header {
        display: flex;
        justify-content: end;
        align-items: center;
        margin-bottom: 1rem;
    }
}

.accordion-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.booking-group {
    margin-bottom: 24px;
}

.group-heading {
    margin: 0 0 10px;
    font-size: 1.1rem;
}

.accordion-item {
    border: 1px solid $border-color;
    border-radius: 6px;
    background: #fff;
    overflow: hidden;
    transition: box-shadow 0.2s ease;

    &.active {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        
        .chevron {
            transform: rotate(180deg);
        }
    }
}

.accordion-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: #fafafa;
    user-select: none;

    &:hover {
        background: #f0f0f0;
    }

    .summary-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .parent-name {
            font-size: 1.05rem;
            color: #333;
        }

        .booking-date {
            font-size: 0.85rem;
            color: #666;
        }
    }

    .summary-meta {
        display: flex;
        align-items: center;
        gap: 12px;

        .status-badge {
            font-size: 0.75rem;
            padding: 4px 8px;
            border-radius: 4px;
            background: #e2e8f0;
            text-transform: uppercase;
            font-weight: bold;
        }

        .chevron {
            font-size: 0.8rem;
            transition: transform 0.2s ease;
            color: #666;
        }
    }
}

.accordion-content {
    padding: 16px;
    border-top: 1px solid $border-color;
    background: #fff;

    .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 16px;

        .detail-item {
            font-size: 0.9rem;
            display: flex;
            flex-direction: column;
            gap: 2px;

            .label {
                font-size: 0.75rem;
                color: #777;
                text-transform: uppercase;
                font-weight: bold;
            }
        }
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid #eee;
        padding-top: 12px;
    }
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: $font-stack;

    .logo {
        width: 150px;
        height: 150px;
        margin-bottom: 1rem;
    }

    .subtitle {
        margin-bottom: 1.5rem;
        color: #666;
    }
}

.google-btn {
    padding: 12px 24px;
    background: #4285f4;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
}
</style>