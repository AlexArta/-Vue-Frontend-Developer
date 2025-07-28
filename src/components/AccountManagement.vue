<template>
  <div id="app-container" class="pa-4 pa-md-8">
    <header class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h5 text-md-h4 font-weight-bold">Управление учетными записями</h1>
      <button class="add-button" @click="store.addAccount" title="Добавить учетную запись">
        <!-- SVG иконка плюса -->
        <span class="d-none d-sm-inline ml-2">Добавить</span>
      </button>
    </header>

    <div class="info-tooltip-wrapper mb-4">
      <!-- ... HTML код подсказки ... -->
    </div>

    <div class="accounts-list">
      <div class="d-none d-md-grid grid-header font-weight-bold text-uppercase text-grey-darken-1">
        <span>Метка</span>
        <span>Тип записи</span>
        <span>Логин</span>
        <span>Пароль</span>
        <span>Действия</span>
      </div>
      
      <div v-if="accounts.length === 0" class="no-accounts-message text-center pa-8">
        <p>Список учетных записей пуст.</p>
      </div>

      <AccountItem v-for="account in accounts" :key="account.id" :account="account" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts';
import { storeToRefs } from 'pinia';
import AccountItem from './AccountItem.vue';

const store = useAccountsStore();
const { accounts } = storeToRefs(store);
</script>