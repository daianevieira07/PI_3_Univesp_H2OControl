import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
    state: () => ({
        sessionActive: !!localStorage.getItem('token') // Inicializa com base no token
    }),
    persist: true,
    actions: {
        toggleValue(valor) {
            this.sessionActive = valor;
            // Sincroniza com localStorage
            if (valor) {
                localStorage.setItem('sessionActive', 'true');
            } else {
                localStorage.removeItem('sessionActive');
            }
        }
    }
});