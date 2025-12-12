(() => {
  'use strict'

  const themeSwitch = document.getElementById('theme-switch')

  const getStoredTheme = () => localStorage.getItem('theme')
  const setStoredTheme = theme => localStorage.setItem('theme', theme)

  const applyTheme = theme => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
      themeSwitch.checked = true
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light')
      themeSwitch.checked = false
    }
  }

  // Apply theme on page load based on stored preference or system preference
  const preferredTheme = getStoredTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(preferredTheme);

  if (themeSwitch) {
    themeSwitch.addEventListener('change', () => {
      const newTheme = themeSwitch.checked ? 'dark' : 'light'
      setStoredTheme(newTheme)
      applyTheme(newTheme)
    })
  }
})()