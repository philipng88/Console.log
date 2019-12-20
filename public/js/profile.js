/* eslint-disable no-undef */
let newPasswordValue;
let confirmationValue;
const newPassword = document.getElementById('new-password');
const confirmation = document.getElementById('password-confirmation');
const validationMessage = document.getElementById('validation-message');
const submitButton = document.getElementById('update-profile-submit-btn');

const validatePasswords = (message, add, remove) => {
  validationMessage.textContent = message;
  validationMessage.classList.add(add);
  validationMessage.classList.remove(remove);
};

const inputFieldBorderColor = (add, remove) => {
  confirmation.classList.add(add);
  confirmation.classList.remove(remove);
};

const buttonChange = (add, remove) => {
  submitButton.classList.add(add);
  submitButton.classList.remove(remove);
};

confirmation.addEventListener('input', e => {
  e.preventDefault();
  newPasswordValue = newPassword.value;
  confirmationValue = confirmation.value;
  if (newPasswordValue !== confirmationValue) {
    validatePasswords('Passwords do not match', 'is-error', 'is-success');
    inputFieldBorderColor('is-error', 'is-success');
    buttonChange('is-disabled', 'is-primary');
    submitButton.setAttribute('disabled', true);
  } else {
    validatePasswords('Passwords match', 'is-success', 'is-error');
    inputFieldBorderColor('is-success', 'is-error');
    buttonChange('is-primary', 'is-disabled');
    submitButton.removeAttribute('disabled');
  }
});
