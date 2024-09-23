import CryptoJS from 'crypto-js'

// Define a secret key for encryption. In a real-world scenario, manage this securely.
const SECRET_KEY = 'your-secret-key'

// Encrypt data
function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
}

// Decrypt data
function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// Save private key securely
export async function savePrivateKey(privateKey: string): Promise<void> {
  const encryptedKey = encrypt(privateKey)
  return new Promise((resolve) => {
    chrome.storage.local.set({ encryptedPrivateKey: encryptedKey }, () => {
      resolve()
    })
  })
}

// Get private key
export async function getPrivateKey(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['encryptedPrivateKey'], (result) => {
      if (result.encryptedPrivateKey) {
        const decryptedKey = decrypt(result.encryptedPrivateKey)
        resolve(decryptedKey)
      } else {
        resolve(null)
      }
    })
  })
}

// Remove private key
export async function removePrivateKey(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(['encryptedPrivateKey'], () => {
      resolve()
    })
  })
}

// Save wallet address
export async function saveWalletAddress(address: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ walletAddress: address }, () => {
      resolve()
    })
  })
}

// Get wallet address
export async function getWalletAddress(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['walletAddress'], (result) => {
      if (result.walletAddress) {
        resolve(result.walletAddress)
      } else {
        resolve(null)
      }
    })
  })
}

// Remove all wallet data
export async function removeWalletData(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(['encryptedPrivateKey', 'walletAddress'], () => {
      resolve()
    })
  })
}
