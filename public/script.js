function togglePassword(inputId, icon) {
            const input = document.getElementById(inputId);
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        // Utility functions
        function showMessage(element, text, type) {
            element.textContent = text;
            element.className = `message ${type} show`;
        }

        function hideMessage(element) {
            element.classList.remove('show');
            setTimeout(() => {
                element.textContent = '';
                element.className = 'message';
            }, 300);
        }

        function setLoadingState(button, isLoading) {
            if (isLoading) {
                button.classList.add('loading');
                button.disabled = true;
            } else {
                button.classList.remove('loading');
                button.disabled = false;
            }
        }

        // Main JavaScript
        document.addEventListener('DOMContentLoaded', () => {
            // Get all elements
            const userTab = document.getElementById('user-tab');
            const adminTab = document.getElementById('admin-tab');
            const userForm = document.getElementById('user-form');
            const adminForm = document.getElementById('admin-form');
            const registerForm = document.getElementById('register-form');
            const showRegister = document.getElementById('show-register');
            const backLogin = document.getElementById('back-login');
            const message = document.getElementById('message');
            const regMessage = document.getElementById('reg-message');
            const signupSection = document.getElementById('signup-section');
            const tabsContainer = document.getElementById('tabs-container');

            // Initialize - show user form by default
            userForm.classList.add("active");
            adminForm.classList.remove("active");
            registerForm.classList.remove("active");

            // Tab switching
            userTab.addEventListener('click', () => {
                userTab.classList.add('active');
                adminTab.classList.remove('active');
                userForm.classList.add('active');
                adminForm.classList.remove('active');
                message.textContent = '';
            });

            adminTab.addEventListener('click', () => {
                adminTab.classList.add('active');
                userTab.classList.remove('active');
                adminForm.classList.add('active');
                userForm.classList.remove('active');
                message.textContent = '';
            });

            // SHOW REGISTRATION - HIDE TABS
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                userForm.classList.remove('active');
                adminForm.classList.remove('active');
                registerForm.classList.add('active');
                tabsContainer.classList.add('hidden');
                signupSection.classList.add('hidden');
                message.textContent = '';
            });

            // BACK TO LOGIN - SHOW TABS
            backLogin.addEventListener('click', (e) => {
                e.preventDefault();
                registerForm.classList.remove('active');
                userForm.classList.add('active');
                adminForm.classList.remove('active');
                userTab.classList.add('active');
                adminTab.classList.remove('active');
                tabsContainer.classList.remove('hidden');
                signupSection.classList.remove('hidden');
                regMessage.textContent = '';
            });

            // --- User login (using your backend) ---
            userForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('user-username').value;
                const password = document.getElementById('user-password').value;

                try {
                    const res = await fetch('/login/user', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();
                    if (res.status !== 200) throw new Error(data.message);
                    alert('User logged in!');
                    window.location.href = '/user.html';
                } catch (err) {
                    message.textContent = err.message;
                    message.className = 'message error show';
                }
            });

            // --- Admin login (using your backend) ---
            adminForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('admin-username').value;
                const password = document.getElementById('admin-password').value;

                try {
                    const res = await fetch('/login/admin', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();
                    if (res.status !== 200) throw new Error(data.message);
                    
                    // Store admin data
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminData', JSON.stringify(data.admin));
                    
                    alert('Admin logged in!');
                    window.location.href = '/admin.html';
                } catch (err) {
                    message.textContent = err.message;
                    message.className = 'message error show';
                }
            });

            // --- Registration (using your backend) ---
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('reg-username').value;
                const password = document.getElementById('reg-password').value;

                try {
                    const res = await fetch('/register', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();
                    if (res.status !== 200 && res.status !== 201) throw new Error(data.message);
                    regMessage.style.color = 'green';
                    regMessage.textContent = data.message;
                    regMessage.className = 'message success show';
                    
                    // After successful registration, go back to login
                    setTimeout(() => {
                        registerForm.classList.remove('active');
                        userForm.classList.add('active');
                        userTab.classList.add('active');
                        adminTab.classList.remove('active');
                        tabsContainer.classList.remove('hidden');
                        signupSection.classList.remove('hidden');
                        regMessage.textContent = '';
                    }, 2000);
                } catch (err) {
                    regMessage.style.color = 'red';
                    regMessage.textContent = err.message;
                    regMessage.className = 'message error show';
                }
            });
        });