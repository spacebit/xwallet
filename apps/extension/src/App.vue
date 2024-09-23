<template>
  <div class="container">
    <h1>Wallet Manager</h1>

    <!-- Form to input Private Key and Wallet Address -->
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="privateKey">Private Key:</label>
        <input
          type="password"
          id="privateKey"
          v-model="privateKey"
          required
          placeholder="Enter your private key"
        />
      </div>

      <div class="form-group">
        <label for="walletAddress">Wallet Address:</label>
        <input
          type="text"
          id="walletAddress"
          v-model="walletAddress"
          required
          placeholder="Enter your wallet address"
        />
      </div>

      <button type="submit">Initialize Wallet</button>
    </form>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading">Loading...</div>

    <!-- Display Currencies -->
    <div v-if="currencies.length > 0" class="currencies">
      <h2>Your Currencies</h2>
      <ul>
        <li v-for="(currency, index) in currencies" :key="index">
          <strong>ID:</strong> {{ currency.id }}<br />
          <strong>Amount:</strong> {{ currency.amount }}
        </li>
      </ul>
    </div>

    <!-- Display Errors -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { XWallet, type Currency } from '@spacebit/simple-nil' // Adjust the import path as needed
import type { Hex } from '@nilfoundation/niljs'

export default defineComponent({
  name: 'App',
  setup() {
    const privateKey = ref<string>('')
    const walletAddress = ref<string>('')
    const currencies = ref<Currency[]>([])
    const error = ref<string | null>(null)
    const isLoading = ref<boolean>(false)

    const handleSubmit = async () => {
      error.value = null
      currencies.value = []
      isLoading.value = true

      try {
        // Initialize XWallet
        const wallet = await XWallet.init({
          address: walletAddress.value as Hex,
          rpc: import.meta.env.VITE_RPC_ENDPOINT,
          signerOrPrivateKey: privateKey.value as Hex
        })

        // Fetch Currencies
        const fetchedCurrencies = await wallet.getCurrencies()

        // Transform Record<string, bigint> to Currency[]
        currencies.value = Object.entries(fetchedCurrencies).map(([id, amount]) => ({
          id: BigInt(id),
          amount
        }))
      } catch (err) {
        console.error(err)
        error.value = 'Failed to initialize wallet or fetch currencies.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      privateKey,
      walletAddress,
      currencies,
      error,
      isLoading,
      handleSubmit
    }
  }
})
</script>

<style scoped>
.container {
  width: 300px;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1,
h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.loading {
  text-align: center;
  margin-top: 20px;
}

.currencies {
  margin-top: 20px;
}

.currencies ul {
  list-style-type: none;
  padding: 0;
}

.currencies li {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
}

.error {
  margin-top: 20px;
  color: red;
  text-align: center;
}
</style>
