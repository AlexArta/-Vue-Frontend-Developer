import { defineStore } from 'pinia';
import { ref, onMounted, reactive } from 'vue';

// --- Типы данных ---
export interface Label {
  text: string;
}
export type AccountType = 'LDAP' | 'Локальная';
export interface Account {
  id: string;
  label: Label[];
  type: AccountType | null;
  login: string;
  password?: string | null;
}

export const useAccountsStore = defineStore('accounts', () => {
  // --- Состояние (State) ---
  const accounts = ref<Account[]>([]);
  const errors = reactive<Record<string, Record<string, boolean>>>({});

  // --- Действия (Actions) ---
  function saveStateToLocalStorage() {
    localStorage.setItem('accounts', JSON.stringify(accounts.value));
  }

  function loadStateFromLocalStorage() {
    const savedAccounts = localStorage.getItem('accounts');
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts);
    }
  }

  function addAccount() {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      label: [],
      type: null,
      login: '',
      password: null,
    };
    accounts.value.push(newAccount);
  }

  function updateAccount(updatedAccount: Account) {
    const index = accounts.value.findIndex(acc => acc.id === updatedAccount.id);
    if (index !== -1) {
      if (updatedAccount.type === 'LDAP') {
        updatedAccount.password = null;
      }
      accounts.value[index] = { ...updatedAccount };
      saveStateToLocalStorage();
    }
  }

  function deleteAccount(accountId: string) {
    accounts.value = accounts.value.filter(acc => acc.id !== accountId);
    delete errors[accountId];
    saveStateToLocalStorage();
  }
  
  function validateAndSave(account: Account) {
  const accountErrors: Record<string, boolean> = {};
  let isValid = true;

  // ... валидация ...

  errors[account.id] = accountErrors;

  console.log(`Validation for account ${account.id}: isValid = ${isValid}`, accountErrors); // ADD THIS LINE

  if (isValid) {
    updateAccount(account);
    console.log(`Account ${account.id} successfully updated.`); // ADD THIS LINE
  } else {
    console.log(`Account ${account.id} not updated due to validation errors.`); // ADD THIS LINE
  }
}
  
  // Загрузка данных при инициализации хранилища
  onMounted(() => {
    loadStateFromLocalStorage();
  });

  return {
    accounts,
    errors,
    addAccount,
    deleteAccount,
    validateAndSave,
  };
});