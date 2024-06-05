const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})
document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.querySelector('.checkbtn');
  const checkbox = document.getElementById('check');
  const navUl = document.querySelector('nav ul');

  checkBtn.addEventListener('click', function() {
    checkbox.checked = !checkbox.checked;
  });

  navUl.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
      checkbox.checked = false;
    }
  });
});
