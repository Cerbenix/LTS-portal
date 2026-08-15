<template>
  <div style="padding: 2rem; max-width: 1000px; margin: 0 auto; font-family: sans-serif;">
    <h1>Tennis School Bookings</h1>
    
    <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #f0f0f0;">
          <th>Date & Time</th>
          <th>Parent</th>
          <th>Child</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id">
          <td>{{ new Date(booking.start_at).toLocaleString() }}</td>
          <td>{{ booking.parent_name }} ({{ booking.parent_phone }})</td>
          <td>{{ booking.child_name || '-' }}</td>
          <td>{{ booking.status }}</td>
          <td>
            <button 
              :disabled="loadingId === booking.id" 
              @click="sendEmail(booking)"
            >
              {{ loadingId === booking.id ? 'Sending...' : 'Send Invoice' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const { data } = await useFetch('/api/bookings');
const bookings = computed(() => data.value?.bookings || []);
const loadingId = ref(null);

async function sendEmail(booking) {
  try {
    loadingId.value = booking.id;

    await $fetch('/api/invoices/send', {
      method: 'POST',
      body: { bookingId: booking.id }
    });

    alert(`Invoice sent successfully to ${booking.parent_email}`);
  } catch (err) {
    alert(`Failed to send invoice: ${err.statusMessage || err.message}`);
  } finally {
    loadingId.value = null;
  }
}
</script>