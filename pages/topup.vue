<template>
  <MobileAppShell>
    <div class="topup-page">
      <header>
        <h1 class="mu-title">เติมเครดิต</h1>
        <p class="mu-subtitle">เลือกแพ็กเครดิตและชำระผ่าน Mock PromptPay สำหรับทดสอบ</p>
      </header>

      <div class="topup-page__packages">
        <TopupPackageCard
          v-for="item in creditPackages"
          :key="item.id"
          :item="item"
          :active="selectedPackageId === item.id"
          @select="selectedPackageId = item.id"
        />
      </div>

      <MuButton :disabled="createPending" @click="createOrder">
        {{ createPending ? 'กำลังสร้างรายการ...' : 'สร้างรายการชำระเงิน' }}
      </MuButton>

      <section v-if="order" class="payment-box mu-panel">
        <span class="mu-small-label">Mock PromptPay</span>
        <img :src="order.qrImageUrl" alt="Mock payment QR">
        <p>{{ order.credits }} เครดิต · {{ order.amount }} THB</p>
        <code>{{ order.qrPayload }}</code>
        <MuButton :disabled="payPending || paid" @click="mockPaid">
          {{ paid ? 'ชำระเงินแล้ว' : 'จำลองว่าชำระเงินแล้ว' }}
        </MuButton>
      </section>

      <section v-if="paymentResult" class="payment-result mu-panel">
        <strong>เครดิตล่าสุด {{ paymentResult.newCreditBalance }}</strong>
        <p>ระบบเพิ่มเครดิตผ่าน API เรียบร้อยแล้ว</p>
      </section>

      <NuxtLink class="topup-page__back" to="/credits">กลับไปเครดิต</NuxtLink>
      <div class="mu-brand">MADAME MU</div>
    </div>
  </MobileAppShell>
</template>

<script setup lang="ts">
import { creditPackages } from '~/data/creditPackages'

useHead({ title: 'เติมเครดิต | Madame Mu' })

interface TopupOrderResponse {
  orderId: string
  amount: number
  credits: number
  status: 'pending'
  qrImageUrl: string
  qrPayload: string
  expiresAt: string
}

interface MockPaidResponse {
  success: boolean
  duplicate: boolean
  newCreditBalance: number
}

const userId = 'local-user'
const selectedPackageId = ref(creditPackages[1]?.id ?? creditPackages[0].id)
const createPending = ref(false)
const payPending = ref(false)
const order = ref<TopupOrderResponse | null>(null)
const paymentResult = ref<MockPaidResponse | null>(null)
const paid = computed(() => Boolean(paymentResult.value?.success))

async function createOrder() {
  createPending.value = true
  paymentResult.value = null

  try {
    order.value = await $fetch<TopupOrderResponse>('/api/topup/create', {
      method: 'POST',
      body: {
        userId,
        packageId: selectedPackageId.value
      }
    })
  } finally {
    createPending.value = false
  }
}

async function mockPaid() {
  if (!order.value) {
    return
  }

  payPending.value = true

  try {
    paymentResult.value = await $fetch<MockPaidResponse>('/api/topup/mock-paid', {
      method: 'POST',
      body: {
        orderId: order.value.orderId
      }
    })
  } finally {
    payPending.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/variables' as *;

.topup-page {
  min-height: 100dvh;
  display: grid;
  align-content: start;
  gap: 16px;
  padding-top: calc(env(safe-area-inset-top) + 34px);
  padding-bottom: calc(env(safe-area-inset-bottom) + 18px);
}

.topup-page__packages {
  display: grid;
  gap: 10px;
}

.payment-box,
.payment-result {
  display: grid;
  gap: 12px;
  padding: 16px;
  text-align: center;
}

.payment-box img {
  width: min(210px, 70vw);
  height: auto;
  margin: 0 auto;
  border-radius: 8px;
}

.payment-box p,
.payment-result p {
  margin: 0;
  color: $mu-muted;
  font-size: 14px;
}

.payment-box code {
  overflow-wrap: anywhere;
  color: $mu-lavender-soft;
  font-size: 11px;
}

.payment-result strong {
  font-size: 19px;
}

.topup-page__back {
  color: $mu-lavender-soft;
  font-size: 14px;
  text-align: center;
}

.mu-brand {
  margin-top: auto;
}
</style>
