document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (!form) {
        console.warn('Contact form not found on this page');
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const statusDiv = document.getElementById('formStatus');
        
        if (!statusDiv) {
            console.error('Form status div not found');
            return;
        }
        
        // Show loading state
        statusDiv.innerHTML = '<div class="loading-message">Sending message...</div>';
        
        // Formspree endpoint. Replace the placeholder with your Formspree form id.
        const formspreeEndpoint = 'https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID';

        // If the endpoint is not configured, show a clear message to the site owner
        if (formspreeEndpoint.includes('REPLACE_WITH')) {
            statusDiv.innerHTML = '<div class="error-message">Contact form is not configured. Edit <code>assets/js/pages/contact.js</code> and set your Formspree form id or remove the contact page.</div>';
            return;
        }

        fetch(formspreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                statusDiv.innerHTML = '<div class="success-message">Thanks for your message! I\'ll get back to you soon.</div>';
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwnProperty.call(data, 'errors')) {
                        statusDiv.innerHTML = '<div class="error-message">Oops! There was a problem: ' + data["errors"].map(error => error["message"]).join(", ") + '</div>';
                    } else {
                        statusDiv.innerHTML = '<div class="error-message">Oops! There was a problem submitting your form</div>';
                    }
                }).catch(() => {
                    statusDiv.innerHTML = '<div class="error-message">Oops! There was a problem submitting your form</div>';
                });
            }
        }).catch(error => {
            console.error('Form submission error:', error);
            statusDiv.innerHTML = '<div class="error-message">Network error. Please try again later.</div>';
        });
    });

    // Auto-update subject line based on name field
    const nameField = document.getElementById('name');
    const hiddenSubject = document.getElementById('hiddenSubject');
    
    if (nameField && hiddenSubject) {
        nameField.addEventListener('input', function() {
            const name = this.value.trim();
            if (name) {
                hiddenSubject.value = `[Portfolio] Message from ${name}`;
            } else {
                hiddenSubject.value = '[Portfolio] New Message';
            }
        });
    }

    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const sendMailBtn = document.getElementById('sendMailBtn');

    function updateSendMailBtn() {
        if (emailField && sendMailBtn) {
            if (emailField.value.trim()) {
                sendMailBtn.style.display = '';
                sendMailBtn.tabIndex = 0;
            } else {
                sendMailBtn.style.display = 'none';
                sendMailBtn.tabIndex = -1;
            }
        }
    }

    if (emailField && sendMailBtn) {
        emailField.addEventListener('input', updateSendMailBtn);
        updateSendMailBtn();
    }

    function isValidEmail(email) {
        // Simple email regex for validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (sendMailBtn && emailField && messageField) {
        sendMailBtn.addEventListener('click', function() {
            const email = emailField.value.trim();
            const name = nameField ? nameField.value.trim() : '';
            const message = messageField.value.trim();
            const statusDiv = document.getElementById('formStatus');
            if (!isValidEmail(email)) {
                if (statusDiv) {
                    statusDiv.innerHTML = '<div class="error-message">Please enter a valid email address to use Send via Mail.</div>';
                }
                emailField.focus();
                return;
            }
            // Use the exposed SITE_EMAIL if available, otherwise the template default
            const defaultEmail = (typeof window !== 'undefined' && window.SITE_EMAIL) ? window.SITE_EMAIL : 'your-email@example.com';
            let mailto = `mailto:${defaultEmail}`;
            let params = [];
            let subject = '[Portfolio Website] Mail from ' + (name ? name : 'Visitor');
            params.push('subject=' + encodeURIComponent(subject));
            if (message) {
                params.push('body=' + encodeURIComponent(message));
            }
            mailto += '?' + params.join('&');
            window.location.href = mailto;
        });
    }

    // Validate email on form submit as well
    if (form && emailField) {
        form.addEventListener('submit', function(e) {
            const email = emailField.value.trim();
            if (email && !isValidEmail(email)) {
                const statusDiv = document.getElementById('formStatus');
                if (statusDiv) {
                    statusDiv.innerHTML = '<div class="error-message">Please enter a valid email address.</div>';
                }
                emailField.focus();
                e.preventDefault();
                return false;
            }
        }, true);
    }

    // Fix scroll issue when textarea is resized
    const textarea = document.getElementById('message');
    if (textarea) {
        // Add mouseup event to handle when user finishes resizing
        textarea.addEventListener('mouseup', function() {
            // Force browser to recalculate scroll behavior
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                document.body.style.overflow = '';
                // Force a reflow to reset scroll state
                document.documentElement.scrollTop = document.documentElement.scrollTop;
            }, 10);
        });

        // Also handle when textarea gains/loses focus during resize
        textarea.addEventListener('blur', function() {
            setTimeout(() => {
                document.body.style.overflow = '';
                document.documentElement.scrollTop = document.documentElement.scrollTop;
            }, 50);
        });
    }
});