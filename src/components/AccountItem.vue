<template>
  <div class="account-item-card">
    <div class="account-item-grid">
      <div class="grid-cell">
        <label :for="'label-' + account.id" class="d-md-none cell-label">Метка</label>
        <input :id="'label-' + account.id" type="text" :value="labelString" @blur="handleLabelChange" placeholder="main; backup" maxlength="50" class="form-input" />
      </div>
      <div class="grid-cell">
        <label :for="'type-' + account.id" class="d-md-none cell-label">Тип записи</label>
        <select :id="'type-' + account.id" :value="account.type" @change="handleTypeChange" class="form-select" :class="{ 'invalid-field': errors[account.id]?.type }">
          <option :value="null" disabled>-- Выберите тип --</option>
          <option value="LDAP">LDAP</option>
          <option value="Локальная">Локальная</option>
        </select>
      </div>
      <div class="grid-cell">
        <label :for="'login-' + account.id" class="d-md-none cell-label">Логин</label>
        <input :id="'login-' + account.id" type="text" :value="account.login" @blur="handleFieldChange($event, 'login')" placeholder="user.name" maxlength="100" class="form-input" :class="{ 'invalid-field': errors[account.id]?.login }" />
      </div>
      <div class="grid-cell">
        <label v-if="account.type === 'Локальная'" :for="'password-' + account.id" class="d-md-none cell-label">Пароль</label>
        <input v-if="account.type === 'Локальная'" :id="'password-' + account.id" type="password" :value="account.password || ''" @blur="handleFieldChange($event, 'password')" placeholder="••••••••" maxlength="100" class="form-input" :class="{ 'invalid-field': errors[account.id]?.password }" />
        <div v-else class="password-placeholder text-grey">N/A</div>
      </div>
      <div class="grid-cell action-cell">
        <button @click="store.deleteAccount(account.id)" class="delete-button" title="Удалить запись">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAccountsStore, type Account } from '@/stores/accounts';
import { storeToRefs } from 'pinia';

const props = defineProps<{ account: Account }>();
const store = useAccountsStore();
const { errors } = storeToRefs(store);

const labelString = computed(() => props.account.label.map(l => l.text).join('; '));

function handleLabelChange(event: FocusEvent) {
  const target = event.target as HTMLInputElement;
  const labels = target.value.split(';').map(s => s.trim()).filter(Boolean).map(text => ({ text }));
  store.validateAndSave({ ...props.account, label: labels });
}

function handleTypeChange(event: Event) {
  const newType = (event.target as HTMLSelectElement).value as Account['type'];
  let updatedAccount = { ...props.account, type: newType };

  // If changing to LDAP, explicitly set password to null
  if (newType === 'LDAP') {
    updatedAccount.password = null;
  }
  store.validateAndSave(updatedAccount);
}

function handleFieldChange(event: FocusEvent, field: 'login' | 'password') {
  const value = (event.target as HTMLInputElement).value;
  store.validateAndSave({ ...props.account, [field]: value });
}
</script>