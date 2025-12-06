document.addEventListener('DOMContentLoaded', function() {
    window.currentLanguage = 'es';
    
    initMobileNav();
    initLanguageSelector();
    initFormValidation();
    initSmoothScroll();
    initParallaxEffect();
    initFadeInSections();
});

function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (Math.abs(currentScroll - lastScroll) > 100) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        lastScroll = currentScroll;
    });
}

function initLanguageSelector() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentLangSpan = document.getElementById('currentLang');

    if (!languageBtn || !languageDropdown) return;

    languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
        languageBtn.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            languageDropdown.classList.remove('show');
            languageBtn.classList.remove('active');
        }
    });

    const languageLinks = languageDropdown.querySelectorAll('a');
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            const langText = this.textContent.trim();
            const flagImg = this.querySelector('.flag img').cloneNode(true);

            currentLangSpan.textContent = langText;
            const btnFlag = languageBtn.querySelector('.flag');
            btnFlag.innerHTML = '';
            btnFlag.appendChild(flagImg);

            if (lang === 'en') {
                changeToEnglish();
            } else {
                changeToSpanish();
            }

            languageDropdown.classList.remove('show');
            languageBtn.classList.remove('active');
        });
    });
}

function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const config = {
        nombre: {
            minLength: 3,
            maxLength: 100,
            pattern: /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/,
            messages: {
                empty: 'El nombre es obligatorio',
                minLength: 'El nombre debe tener al menos 3 caracteres',
                maxLength: 'El nombre no puede exceder 100 caracteres',
                pattern: 'El nombre solo puede contener letras y espacios'
            }
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            messages: {
                empty: 'El correo electrónico es obligatorio',
                pattern: 'Por favor, ingresa un correo electrónico válido'
            }
        },
        telefono: {
            length: 9,
            pattern: /^[0-9]{9}$/,
            messages: {
                empty: 'El teléfono es obligatorio',
                length: 'El teléfono debe tener exactamente 9 dígitos',
                pattern: 'El teléfono solo puede contener números',
                invalid: 'Por favor, ingresa un número de teléfono válido'
            }
        },
        asunto: {
            minLength: 10,
            maxLength: 500,
            messages: {
                empty: 'El asunto es obligatorio',
                minLength: 'El asunto debe tener al menos 10 caracteres',
                maxLength: 'El asunto no puede exceder 500 caracteres'
            }
        }
    };

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        input.classList.add('error');
        errorElement.textContent = message;
        return false;
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        input.classList.remove('error');
        errorElement.textContent = '';
        return true;
    }

    function validateNombre(input) {
        const value = input.value.trim();
        const cfg = config.nombre;
        clearError(input);

        if (value === '') return showError(input, cfg.messages.empty);
        if (value.length < cfg.minLength) return showError(input, cfg.messages.minLength);
        if (value.length > cfg.maxLength) return showError(input, cfg.messages.maxLength);
        if (!cfg.pattern.test(value)) return showError(input, cfg.messages.pattern);

        return true;
    }

    function validateEmail(input) {
        const value = input.value.trim();
        const cfg = config.email;
        clearError(input);

        if (value === '') return showError(input, cfg.messages.empty);
        if (!cfg.pattern.test(value)) return showError(input, cfg.messages.pattern);

        return true;
    }

    function validateTelefono(input) {
        const value = input.value.trim();
        const cfg = config.telefono;
        clearError(input);

        if (value === '') return showError(input, cfg.messages.empty);
        if (!/^[0-9]*$/.test(value)) return showError(input, cfg.messages.pattern);
        if (value.length !== cfg.length) return showError(input, cfg.messages.length);
        if (/^(\d)\1+$/.test(value)) return showError(input, cfg.messages.invalid);
        if (!value.startsWith('9')) return showError(input, 'El teléfono debe comenzar con 9');

        return true;
    }

    function validateAsunto(input) {
        const value = input.value.trim();
        const cfg = config.asunto;
        clearError(input);

        if (value === '') return showError(input, cfg.messages.empty);
        if (value.length < cfg.minLength) return showError(input, cfg.messages.minLength);
        if (value.length > cfg.maxLength) return showError(input, cfg.messages.maxLength);

        return true;
    }

    function validateForm(form) {
        const nombre = form.querySelector('#nombre');
        const email = form.querySelector('#email');
        const telefono = form.querySelector('#telefono');
        const asunto = form.querySelector('#asunto');

        const isNombreValid = validateNombre(nombre);
        const isEmailValid = validateEmail(email);
        const isTelefonoValid = validateTelefono(telefono);
        const isAsuntoValid = validateAsunto(asunto);

        return isNombreValid && isEmailValid && isTelefonoValid && isAsuntoValid;
    }

    const nombreInput = contactForm.querySelector('#nombre');
    const emailInput = contactForm.querySelector('#email');
    const telefonoInput = contactForm.querySelector('#telefono');
    const asuntoInput = contactForm.querySelector('#asunto');

    if (nombreInput) {
        nombreInput.addEventListener('blur', () => validateNombre(nombreInput));
        nombreInput.addEventListener('input', () => {
            if (nombreInput.classList.contains('error')) {
                validateNombre(nombreInput);
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error')) {
                validateEmail(emailInput);
            }
        });
    }

    if (telefonoInput) {
        telefonoInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 9);
            if (this.classList.contains('error')) {
                validateTelefono(this);
            }
        });
        telefonoInput.addEventListener('blur', () => validateTelefono(telefonoInput));
    }

    if (asuntoInput) {
        asuntoInput.addEventListener('blur', () => validateAsunto(asuntoInput));
        asuntoInput.addEventListener('input', () => {
            if (asuntoInput.classList.contains('error')) {
                validateAsunto(asuntoInput);
            }
        });
    }

    let isSubmitting = false;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (isSubmitting) return;

        if (validateForm(this)) {
            const submitButton = this.querySelector('.btn-submit');
            
            const existingDots = submitButton.querySelector('.loading-dots');
            if (existingDots) {
                existingDots.remove();
            }
            
            isSubmitting = true;
            submitButton.disabled = true;
            
            const dots = document.createElement('span');
            dots.className = 'loading-dots';
            dots.innerHTML = '<span></span><span></span><span></span>';
            submitButton.appendChild(dots);

            setTimeout(() => {
                const successMessage = window.currentLanguage === 'en' 
                    ? 'Message sent successfully  ✓'
                    : 'Mensaje enviado correctamente  ✓';
                
                showNotification(successMessage);
                this.reset();

                const inputs = this.querySelectorAll('.form-control');
                inputs.forEach(input => clearError(input));

                submitButton.disabled = false;
                if (dots && dots.parentNode) {
                    dots.remove();
                }
                isSubmitting = false;
            }, 1000);
        } else {
            const firstError = this.querySelector('.form-control.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

function changeToEnglish() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks[0]) navLinks[0].textContent = 'Home';
    if (navLinks[1]) navLinks[1].textContent = 'About Us';
    if (navLinks[2]) navLinks[2].textContent = 'Partners';

    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero p');
    if (heroTitle) heroTitle.textContent = 'WASI SEGURO';
    if (heroSubtitle) heroSubtitle.innerHTML = 'Your safety our priority, your life paramount,<br>travel safe travel with Wasi Seguro';

    const sectionTitles = document.querySelectorAll('.section-title');
    const sectionSubtitles = document.querySelectorAll('.section-subtitle');

    if (sectionTitles[0]) sectionTitles[0].textContent = 'Do you have doubts if your route is safe?';
    if (sectionSubtitles[0]) sectionSubtitles[0].textContent = 'Find the safest and shortest route';

    const featureTitles = document.querySelectorAll('.feature-title');
    if (featureTitles[0]) featureTitles[0].textContent = 'Verified Routes';
    if (featureTitles[1]) featureTitles[1].textContent = 'Real-time alerts';
    if (featureTitles[2]) featureTitles[2].textContent = 'Safe community';

    if (sectionTitles[1]) sectionTitles[1].textContent = 'Do you want to be part of Wasi Seguro?';
    if (sectionSubtitles[1]) sectionSubtitles[1].textContent = 'Find the safest and shortest route';
    if (featureTitles[3]) featureTitles[3].textContent = 'Be a Partner';
    if (featureTitles[4]) featureTitles[4].textContent = 'Join the team';
    if (featureTitles[5]) featureTitles[5].textContent = 'Collaborate';

    const teamTitle = document.querySelector('.team-section h2');
    const teamText = document.querySelectorAll('.team-text p');
    if (teamTitle) teamTitle.textContent = 'Our team';
    if (teamText[0]) teamText[0].innerHTML = '<strong>A team passionate about security and technology.</strong> We develop innovative solutions to help you arrive much faster and safer.';

    const contactTitle = document.querySelector('.contact-section h2');
    const formLabels = document.querySelectorAll('.form-group label');

    if (contactTitle) contactTitle.textContent = 'Contact us';
    if (formLabels[0]) formLabels[0].textContent = 'Full Name';
    if (formLabels[1]) formLabels[1].textContent = 'Email';
    if (formLabels[2]) formLabels[2].textContent = 'Phone';
    if (formLabels[3]) formLabels[3].textContent = 'Subject';

    const footerTitles = document.querySelectorAll('.footer-links h4, .footer-social h4');
    const footerLinks = document.querySelectorAll('.footer-links a');

    if (footerTitles[0]) footerTitles[0].textContent = 'Quick Links';
    if (footerTitles[1]) footerTitles[1].textContent = 'Social Networks';

    if (footerLinks[0]) footerLinks[0].textContent = 'Privacy Policy';
    if (footerLinks[1]) footerLinks[1].textContent = 'Frequent Questions';

    const footerInfo = document.querySelector('.footer-info');
    if (footerInfo) {
        const footerPs = footerInfo.querySelectorAll('p');
        if (footerPs[0]) footerPs[0].innerHTML = '<strong>Email:</strong> wasiseguro@gmail.com';
        if (footerPs[1]) footerPs[1].innerHTML = '<strong>Address:</strong> Av. lascuardas 123';
    }

    window.currentLanguage = 'en';
    console.log('Idioma cambiado a:', window.currentLanguage);
    
    document.querySelectorAll(".testimonial-card").forEach((card, index) => {
        const testimonials = [
            { name: "María García", role: "Lima Resident", text: "Thanks to WasiSeguro I feel safer when moving around the city. Safe routes have helped me a lot" },
            { name: "Carlos López", role: "Frequent User", text: "Excellent app to know the safe areas. It has saved me from several problems on unknown routes" },
            { name: "Juan Martínez", role: "Visitor", text: "As a visitor, WasiSeguro helped me move confidently through Lima. Real-time alerts are very useful" },
            { name: "Pedro Sánchez", role: "Driver", text: "I use WasiSeguro daily to plan my work routes. It saves me time and avoids dangerous areas" },
            { name: "Martín Fernández", role: "Student", text: "I go to university late at night and WasiSeguro shows me the most illuminated and safe routes. I feel protected" },
            { name: "Jorge Ramírez", role: "Businessman", text: "The collaborative reporting feature is great. We all help keep the city safer with WasiSeguro" }
        ];
        if (testimonials[index]) {
            const nameEl = card.querySelector(".testimonial-name");
            const roleEl = card.querySelector(".testimonial-role");
            const textEl = card.querySelector(".testimonial-text");
            if (nameEl) nameEl.textContent = testimonials[index].name;
            if (roleEl) roleEl.textContent = testimonials[index].role;
            if (textEl) textEl.textContent = testimonials[index].text;
        }
    });
}

function changeToSpanish() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks[0]) navLinks[0].textContent = 'Inicio';
    if (navLinks[1]) navLinks[1].textContent = 'Nosotros';
    if (navLinks[2]) navLinks[2].textContent = 'Afiliados';

    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero p');
    if (heroTitle) heroTitle.textContent = 'WASI SEGURO';
    if (heroSubtitle) heroSubtitle.innerHTML = 'Tu seguridad nuestra prioridad, tu vida primordial,<br>viaja seguro viaja con Wasi Seguro';

    const sectionTitles = document.querySelectorAll('.section-title');
    const sectionSubtitles = document.querySelectorAll('.section-subtitle');

    if (sectionTitles[0]) sectionTitles[0].textContent = '¿Tienes duda si tu ruta es segura?';
    if (sectionSubtitles[0]) sectionSubtitles[0].textContent = 'Encuentra la ruta mas segura y mas corta';

    const featureTitles = document.querySelectorAll('.feature-title');
    if (featureTitles[0]) featureTitles[0].textContent = 'Rutas Verificadas';
    if (featureTitles[1]) featureTitles[1].textContent = 'Alertas en tiempo real';
    if (featureTitles[2]) featureTitles[2].textContent = 'Comunidad segura';

    if (sectionTitles[1]) sectionTitles[1].textContent = '¿Quieres formar parte de Wasi Seguro?';
    if (sectionSubtitles[1]) sectionSubtitles[1].textContent = 'Encuentra la ruta mas segura y mas corta';
    if (featureTitles[3]) featureTitles[3].textContent = 'Se Aliado';
    if (featureTitles[4]) featureTitles[4].textContent = 'Unete al equipo';
    if (featureTitles[5]) featureTitles[5].textContent = 'Colabora';

    const teamTitle = document.querySelector('.team-section h2');
    const teamText = document.querySelectorAll('.team-text p');
    if (teamTitle) teamTitle.textContent = 'Nuestro equipo';
    if (teamText[0]) teamText[0].innerHTML = '<strong>Un equipo apasionado por la seguridad y tecnología.</strong> Desarrollamos soluciones innovadoras para ayudarte ha llegar mucho mas rápido y seguro.';

    const contactTitle = document.querySelector('.contact-section h2');
    const formLabels = document.querySelectorAll('.form-group label');

    if (contactTitle) contactTitle.textContent = 'Contactanos';
    if (formLabels[0]) formLabels[0].textContent = 'Nombre Completo';
    if (formLabels[1]) formLabels[1].textContent = 'Correo Electronico';
    if (formLabels[2]) formLabels[2].textContent = 'Telefono';
    if (formLabels[3]) formLabels[3].textContent = 'Asunto';
    
    document.querySelectorAll(".testimonial-card").forEach((card, index) => {
        const testimonios = [
            { name: "María García", role: "Residente de Lima", text: "Gracias a WasiSeguro me siento más tranquila al transitar por la ciudad. Las rutas seguras me han ayudado mucho" },
            { name: "Carlos López", role: "Usuario frecuente", text: "Excelente app para conocer las zonas seguras. Me ha salvado de varios problemas en rutas desconocidas" },
            { name: "Juan Martínez", role: "Visitante", text: "Como trabajador, WasiSeguro me ayudó a moverme con confianza por Lima. Las alertas en tiempo real son muy útiles" },
            { name: "Pedro Sánchez", role: "Conductor", text: "Uso WasiSeguro diariamente para planificar mis rutas de trabajo. Me ahorra tiempo y evita zonas peligrosas" },
            { name: "Martín Fernández", role: "Estudiante", text: "Voy a la universidad tarde en la noche y WasiSeguro me indica las rutas más iluminadas y seguras. Me siento protegido" },
            { name: "Jorge Ramírez", role: "Empresario", text: "La función de reportes colaborativos es genial. Todos ayudamos a mantener la ciudad más segura con WasiSeguro" }
        ];
        if (testimonios[index]) {
            const nameEl = card.querySelector(".testimonial-name");
            const roleEl = card.querySelector(".testimonial-role");
            const textEl = card.querySelector(".testimonial-text");
            if (nameEl) nameEl.textContent = testimonios[index].name;
            if (roleEl) roleEl.textContent = testimonios[index].role;
            if (textEl) textEl.textContent = testimonios[index].text;
        }
    });

    const footerTitles = document.querySelectorAll('.footer-links h4, .footer-social h4');
    const footerLinks = document.querySelectorAll('.footer-links a');

    if (footerTitles[0]) footerTitles[0].textContent = 'Enlaces Rápidos';
    if (footerTitles[1]) footerTitles[1].textContent = 'Redes Sociales';

    if (footerLinks[0]) footerLinks[0].textContent = 'Política de privacidad';
    if (footerLinks[1]) footerLinks[1].textContent = 'Preguntas frecuentes';

    const footerInfo = document.querySelector('.footer-info');
    if (footerInfo) {
        const footerPs = footerInfo.querySelectorAll('p');
        if (footerPs[0]) footerPs[0].innerHTML = '<strong>Email:</strong> wasiseguro@gmail.com';
        if (footerPs[1]) footerPs[1].innerHTML = '<strong>Dirección:</strong> Av. lascuardas 123';
    }

    window.currentLanguage = 'es';
    console.log('Idioma cambiado a:', window.currentLanguage);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroVideo = document.querySelector('.hero-video');
    const heroContent = document.querySelector('.hero-content');

    let ticking = false;

    function updateScroll() {
        const scrolled = window.pageYOffset;
        const heroHeight = hero ? hero.offsetHeight : 0;

        if (scrolled < heroHeight) {
            if (heroVideo) {
                heroVideo.style.transform = `translateY(${scrolled * 0.4}px)`;
            }

            if (heroContent) {
                const opacity = 1 - (scrolled / (heroHeight * 0.7));
                heroContent.style.opacity = Math.max(0, opacity);
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateScroll);
            ticking = true;
        }
    });
}

function initFadeInSections() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.features, .join-section, .team-section, .contact-section');
    sections.forEach(section => {
        section.classList.add('fade-section');
        observer.observe(section);
    });
}

function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    window.currentLanguage = 'es';
    
    initMobileNav();
    initLanguageSelector();
    initFormValidation();
    initSmoothScroll();
    initParallaxEffect();
    initFadeInSections();
    initDarkMode(); 
});

function updateNewSectionsToEnglish() {
    const aboutTitle = document.querySelector('.about-app-section .section-title');
    if (aboutTitle) aboutTitle.textContent = 'About the Application';
    
    const aboutH3 = document.querySelector('.about-app-text h3');
    if (aboutH3) aboutH3.textContent = 'Wasi Seguro';
    
    const aboutP = document.querySelector('.about-app-text p');
    if (aboutP) aboutP.textContent = 'We believe that traveling through your city should not be a stressful task, which is why we have partnered with the best technical centers in your area to offer you a close and trusted service. On our website, you can easily find a quality technical center close to you, and thanks to our real-time tracking, you can be aware of the status of your repair at all times. Trust us to repair your cell phone and get back connected in no time.';
    
    const featureBadges = document.querySelectorAll('.about-feature-item span');
    if (featureBadges[0]) featureBadges[0].textContent = 'Exceptional experience';
    if (featureBadges[1]) featureBadges[1].textContent = 'Reduce impact';
    
    const testimonialsTitle = document.querySelector('.testimonials-section .section-title');
    if (testimonialsTitle) testimonialsTitle.textContent = 'What do customers say?';
    
    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) heroBtn.textContent = 'Start Now';
    
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) submitBtn.textContent = 'Send Message';
    
    const footerAppTitle = document.querySelector('.footer-apps h4');
    if (footerAppTitle) footerAppTitle.textContent = 'Mobile App';
}

function updateNewSectionsToSpanish() {
    const aboutTitle = document.querySelector('.about-app-section .section-title');
    if (aboutTitle) aboutTitle.textContent = 'Acerca de la Aplicación';
    
    const aboutH3 = document.querySelector('.about-app-text h3');
    if (aboutH3) aboutH3.textContent = 'Wasi Seguro';
    
    const aboutP = document.querySelector('.about-app-text p');
    if (aboutP) aboutP.textContent = 'Creemos que transitar por tu ciudad no debería ser una tarea estresante, por lo que nos hemos asociado con los mejores centros técnicos en tu área para ofrecerte un servicio cercano y de confianza. En nuestro sitio web, puedes encontrar fácilmente un centro técnico de calidad cercano a ti, y gracias a nuestro seguimiento en tiempo real, puedes estar al tanto del estado de tu reparación en todo momento. Confía en nosotros para reparar tu celular y vuelve a estar conectado en poco tiempo.';
    
    const featureBadges = document.querySelectorAll('.about-feature-item span');
    if (featureBadges[0]) featureBadges[0].textContent = 'Experiencia excepcional';
    if (featureBadges[1]) featureBadges[1].textContent = 'Reducir impacto';
    
    const testimonialsTitle = document.querySelector('.testimonials-section .section-title');
    if (testimonialsTitle) testimonialsTitle.textContent = '¿Qué dicen los clientes?';
    
    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) heroBtn.textContent = 'Empezar Ahora';
    
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) submitBtn.textContent = 'Enviar Mensaje';
    
    const footerAppTitle = document.querySelector('.footer-apps h4');
    if (footerAppTitle) footerAppTitle.textContent = 'App Móvil';
}

const originalChangeToEnglish = changeToEnglish;
changeToEnglish = function() {
    originalChangeToEnglish();
    updateNewSectionsToEnglish();
};

const originalChangeToSpanish = changeToSpanish;
changeToSpanish = function() {
    originalChangeToSpanish();
    updateNewSectionsToSpanish();
};

(function() {
    function initDropdown() {
        const btn = document.getElementById('languageBtn');
        const dropdown = document.getElementById('languageDropdown');
        
        if (!btn || !dropdown) {
            setTimeout(initDropdown, 100);
            return;
        }
        
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('show');
            btn.classList.toggle('active');
        };
        
        document.onclick = function(e) {
            if (!e.target.closest('.language-selector')) {
                dropdown.classList.remove('show');
                btn.classList.remove('active');
            }
        };
        
        const links = dropdown.querySelectorAll('a');
        links.forEach(function(link) {
            link.onclick = function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                
                if (lang === 'en') {
                    changeToEnglish();
                } else {
                    changeToSpanish();
                }
                
                dropdown.classList.remove('show');
                btn.classList.remove('active');
            };
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDropdown);
    } else {
        initDropdown();
    }
})();

(function() {
    function initHamburger() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) {
            setTimeout(initHamburger, 100);
            return;
        }
        
        hamburger.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        };

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.onclick = function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            };
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHamburger);
    } else {
        initHamburger();
    }
})();
(function() {
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function isElementPartiallyInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

        return (vertInView && horInView);
    }

    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(function(element) {
            if (isElementPartiallyInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
            }
        });
    }

    function setupAnimations() {
        const features = document.querySelectorAll('.feature-card');
        features.forEach(function(card, index) {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = (index * 0.1) + 's';
        });

        const testimonials = document.querySelectorAll('.testimonial-card');
        testimonials.forEach(function(card, index) {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = (index * 0.1) + 's';
        });

        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach(function(member, index) {
            member.classList.add('animate-on-scroll');
            member.style.animationDelay = (index * 0.1) + 's';
        });

        const aboutText = document.querySelector('.about-app-text');
        if (aboutText) aboutText.classList.add('animate-on-scroll');

        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) videoContainer.classList.add('animate-on-scroll');

        // Contacto
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) contactForm.classList.add('animate-on-scroll');

        const contactImage = document.querySelector('.contact-image');
        if (contactImage) contactImage.classList.add('animate-on-scroll');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupAnimations();
            animateOnScroll();
        });
    } else {
        setupAnimations();
        animateOnScroll();
    }

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            animateOnScroll();
        });
    });

    window.addEventListener('load', animateOnScroll);
})();

let isNotificationShowing = false;

function showNotification(message) {
    if (isNotificationShowing) return;
    
    isNotificationShowing = true;
    
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.textContent = message;
    
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            isNotificationShowing = false;
        }, 300);
    }, 3000);
}