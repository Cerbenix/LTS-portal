<template>
  <div>
      <div v-if="loggedIn" style="padding: 2rem; max-width: 1000px; margin: 0 auto; font-family: sans-serif">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <p>Logged in as: <strong>{{ user?.email }}</strong></p>
              <button @click="clear" style="padding: 5px 10px;">Logout</button>
          </div>

          <h1>Tennis School Bookings</h1>

          <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse">
              <thead>
                  <tr style="background: #f0f0f0">
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
                      <td>{{ booking.child_name || "-" }}</td>
                      <td>{{ booking.status }}</td>
                      <td>
                          <button :disabled="loadingId === booking.id" @click="sendEmail(booking)">
                              {{ loadingId === booking.id ? "Sending..." : "Send Invoice" }}
                          </button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      <div v-else style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
          <h1>Tennis School Portal</h1>
          <p style="margin-bottom: 1.5rem; color: #666;">Please sign in with the authorized account to continue.</p>
          <a href="/auth/google" class="button" style="padding: 12px 24px; background: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;"> 
              Sign in with Google 
          </a>
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

const loadingId = ref(null);

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