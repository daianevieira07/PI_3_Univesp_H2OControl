// Função de validação para verificar se os campos estão preenchidos corretamente
// e se o e-mail é válido
export const validateEmail = (value) => {
    if (!value) {
        return true;
    }

    if (!/\S+@\S+\.\S+/.test(value)) {
        return false;
    }
    return true;
};

export const validatePassword = (value, signup=false) => {
    if (!value) {
        return true;
    }

    if (value.length < 8) {
        return false;
    }
    if(signup) {
        if (!/[A-Z]/.test(value)) {
            return false;
        }

        if (!/[a-z]/.test(value)) {
            return false;
        }

        if (!/[0-9]/.test(value)) {
            return false;
        }

        if (!/[!@#$%^&*]/.test(value)) {
            return false;
        }
    }

    return true;
}

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return true;
    }

    if (password !== confirmPassword) {
        return false;
    }

    return true;
}
