export function validateRequiredFields(obj, requiredFields) {
  const missing = requiredFields.filter(field => !obj[field]);

  if (missing.length > 0) {
    throw new Error(`Campos obrigatórios ausentes: ${missing.join(", ")}`);
  }
}

export function validateReleaseDate(date) {
  if (!date) {
    return;
  }

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    throw new Error("Data de lançamento inválida. Use o formato AAAA-MM-DD.");
  }
}

export function validatePassword(password) {
  if (!password) {
    throw new Error("A senha é obrigatória.");
  }

  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (password.length < minLength) {
    throw new Error(`A senha deve ter no mínimo ${minLength} caracteres.`);
  }

  if (!hasUppercase || !hasNumber || !hasSymbol) {
    throw new Error("A senha deve conter pelo menos uma letra maiúscula, um número e um símbolo.");
  }
}
