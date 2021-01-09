function validateForm(event, state) {
  // clear all error messages
  const inputs = document.getElementsByClassName('is-danger');
  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].classList.contains('error')) {
      inputs[i].classList.remove('is-danger');
    }
  }

  if (state.hasOwnProperty('username') && state.username === '') {
    document.getElementById('username').classList.add('is-danger');
    return { blankField: true };
  }
  if (state.hasOwnProperty('firstName') && state.firstName === '') {
    document.getElementById('firstName').classList.add('is-danger');
    return { blankField: true };
  }
  if (state.hasOwnProperty('lastName') && state.lastName === '') {
    document.getElementById('lastName').classList.add('is-danger');
    return { blankField: true };
  }
  if (state.hasOwnProperty('email') && state.email === '') {
    document.getElementById('email').classList.add('is-danger');
    return { blankField: true };
  }
  if (state.hasOwnProperty('verificationCode') && state.verificationCode === '') {
    document.getElementById('verificationCode').classList.add('is-danger');
    return { blankField: true };
  }
  if (state.hasOwnProperty('password') && state.password === '') {
    document.getElementById('password').classList.add('is-danger');
    return { blankField: true };
  }
  if (state.hasOwnProperty('oldPassword') && state.oldPassword === '') {
    document.getElementById('oldPassword').classList.add('is-danger');
    return { blankField: true };
  }
  if (state.hasOwnProperty('newPassword') && state.newPassword === '') {
    document.getElementById('newPassword').classList.add('is-danger');
    return { blankField: true };
  }
  if (state.hasOwnProperty('confirmPassword') && state.confirmPassword === '') {
    document.getElementById('confirmPassword').classList.add('is-danger');
    return { blankField: true };
  }
  if (
    state.hasOwnProperty('password') &&
    state.hasOwnProperty('confirmPassword') &&
    state.password !== state.confirmPassword
  ) {
    document.getElementById('password').classList.add('is-danger');
    document.getElementById('confirmPassword').classList.add('is-danger');
    return { passwordmatch: true };
  }
  if (
    state.hasOwnProperty('newPassword') &&
    state.hasOwnProperty('confirmPassword') &&
    state.newPassword !== state.confirmPassword
  ) {
    document.getElementById('newPassword').classList.add('is-danger');
    document.getElementById('confirmPassword').classList.add('is-danger');
    return { passwordmatch: true };
  }
  return;
}

export default validateForm;
