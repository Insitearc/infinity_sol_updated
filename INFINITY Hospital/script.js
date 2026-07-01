/**
 * Dr. Mandhane's INFINITY Maternity & IVF Centre - Core JavaScript Functions (Multi-Page Guarded Version)
 * Features: Form Validations, Live Search Engines, Carousel Sliders, 
 *           Intersection Observers, and Accordion Toggle Utilities.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // Helper helper to safely bind events only if elements exist
    const safeInit = (selectors, callback) => {
        const elements = [];
        for (const name in selectors) {
            const el = document.querySelector(selectors[name]);
            if (!el) return; // Exit if any required selector is missing
            elements.push(el);
        }
        callback(...elements);
    };

    // --- 1. HERO SLIDESHOW ROTATION ---
    const heroSlides = document.querySelectorAll(".hero-slide");
    const heroDots = document.querySelectorAll(".slide-dot");
    if (heroSlides.length > 0 && heroDots.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            heroSlides.forEach(slide => slide.classList.remove("active"));
            heroDots.forEach(dot => dot.classList.remove("active"));
            
            currentSlide = (index + heroSlides.length) % heroSlides.length;
            heroSlides[currentSlide].classList.add("active");
            heroDots[currentSlide].classList.add("active");
        };

        const nextSlide = () => {
            showSlide(currentSlide + 1);
        };

        const startSlideshow = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        };

        heroDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
                startSlideshow();
            });
        });

        startSlideshow();
    }
    // --- SERVICES NAV DROPDOWN ---
    const serviceDropdowns = document.querySelectorAll(".nav-dropdown");
    if (serviceDropdowns.length > 0) {
        const closeAllNavDropdowns = () => {
            document.querySelectorAll(".nav-dropdown.show").forEach(openDropdown => {
                openDropdown.classList.remove("show");
                const toggle = openDropdown.querySelector(".nav-link-dropdown");
                if (toggle) toggle.setAttribute("aria-expanded", "false");
            });
        };

        serviceDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector(".nav-link-dropdown");
            const menu = dropdown.querySelector(".dropdown-menu");
            if (!toggle || !menu) return;

            const toggleDropdown = (e) => {
                const isOpen = dropdown.classList.contains("show");
                if (!isOpen) {
                    e.preventDefault();
                    closeAllNavDropdowns();
                    dropdown.classList.add("show");
                    toggle.setAttribute("aria-expanded", "true");
                }
            };

            toggle.addEventListener("click", toggleDropdown);
            toggle.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    toggleDropdown(e);
                }
            });

            menu.querySelectorAll(".dropdown-item").forEach(item => {
                item.addEventListener("click", () => {
                    closeAllNavDropdowns();
                });
            });
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".nav-dropdown")) {
                closeAllNavDropdowns();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeAllNavDropdowns();
            }
        });
    }
    // --- 3. STICKY NAV ACTION & ACTIVE STATE INDICATOR ---
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener("scroll", () => {
            let currentSec = "";
            const scrollY = window.pageYOffset;

            sections.forEach(sec => {
                const sectionHeight = sec.offsetHeight;
                const sectionTop = sec.offsetTop - 120;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentSec = sec.getAttribute("id");
                }
            });

            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSec}` || link.getAttribute("href").includes(currentSec)) {
                    link.classList.add("active");
                }
            });
        });
    }


    // --- 4. SCROLL TO TOP BUTTON ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 400) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }
        });

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // --- 5. ANIMATED STATISTICS COUNTER ---
    const statisticsSection = document.getElementById("statistics");
    const statsNumbers = document.querySelectorAll(".stat-number");
    if (statisticsSection && statsNumbers.length > 0) {
        let countersAnimated = false;
        let statsObserver = null;

        const animateCounters = () => {
            statsNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute("data-target"), 10);
                let count = 0;
                const speed = Math.max(1, target / 80);

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        stat.innerText = Math.ceil(count);
                        setTimeout(updateCount, 15);
                    } else {
                        stat.innerText = target;
                    }
                };
                updateCount();
            });
        };

        const startCounterAnimation = () => {
            if (countersAnimated) return;
            animateCounters();
            countersAnimated = true;
            if (statsObserver) {
                statsObserver.disconnect();
                statsObserver = null;
            }
        };

        const isElementVisible = (element) => {
            const rect = element.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom >= 0;
        };

        if ('IntersectionObserver' in window) {
            statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !countersAnimated) {
                        startCounterAnimation();
                    }
                });
            }, { threshold: 0.3 });
            statsObserver.observe(statisticsSection);
        }

        const checkStatsVisibility = () => {
            if (!countersAnimated && isElementVisible(statisticsSection)) {
                startCounterAnimation();
            }
        };

        checkStatsVisibility();
        window.addEventListener("scroll", checkStatsVisibility, { passive: true });
        window.addEventListener("resize", checkStatsVisibility);
    }


    // --- 6. DEPARTMENTS / SPECIALTIES CARD FILTER ---
    const filterButtons = document.querySelectorAll(".filter-btn");
    const departmentCards = document.querySelectorAll(".department-card, .service-card");
    if (filterButtons.length > 0 && departmentCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.getAttribute("data-filter");
                
                departmentCards.forEach(card => {
                    const category = card.getAttribute("data-category");
                    if (filter === "all" || category === filter) {
                        card.classList.add("show-card");
                    } else {
                        card.classList.remove("show-card");
                    }
                });
            });
        });
    }


    // --- 7. DYNAMIC DOCTORS SELECTION DATABASE ---
    const doctorDatabase = {
        surgery: [
            { name: "Dr. Anirudha Mandhane", degree: "MS (General Surgery), FMAS - Chief Fertility & IVF Specialist", time: "Mon - Sat: 10:00 AM - 4:00 PM" }
        ],
        maternity: [
            { name: "Dr. Priya Mandhane", degree: "MD, DGO - Senior Obstetrician & Maternal Care Expert", time: "Mon - Fri: 11:00 AM - 6:00 PM" }
        ],
        icu: [
            { name: "Dr. Rohit Verma", degree: "MD, IDCCM - Consultant Neonatologist & Pediatric Specialist", time: "Tue - Sat: 2:00 PM - 7:00 PM" }
        ],
        laparoscopy: [
            { name: "Dr. Sneha Patil", degree: "MS, FMAS, FIAGES - Gynecologist & Fertility Endoscopy Specialist", time: "Mon - Thu: 9:00 AM - 1:00 PM" }
        ]
    };

    const serviceToDeptMap = {
        "Obstetrics": "maternity",
        "High Risk Pregnancy": "maternity",
        "Gynecology": "maternity",
        "Laparoscopic Surgery": "laparoscopy",
        "Infertility Treatment": "surgery",
        "IVF": "surgery",
        "Normal Delivery": "maternity",
        "Caesarean Section": "maternity",
        "Hysteroscopy": "laparoscopy",
        "Colposcopy": "laparoscopy",
        "Family Planning": "maternity",
        "Menopause Care": "maternity",
        "PCOS Treatment": "laparoscopy",
        "Endometriosis": "laparoscopy",
        "Fibroid Treatment": "laparoscopy",
        "Ovarian Cyst Treatment": "laparoscopy",
        "Antenatal Care": "maternity",
        "Postnatal Care": "maternity",
        "Neonatal Care": "icu"
    };

    // Map compact hero service labels to internal department keys
    serviceToDeptMap["IVF & Fertility"] = "surgery";
    serviceToDeptMap["Pregnancy Care"] = "maternity";
    serviceToDeptMap["NICU & Neonatal Care"] = "icu";
    serviceToDeptMap["Fertility Endoscopy"] = "laparoscopy";

    safeInit({
        deptSelect: "#bookingDepartment",
        docSelect: "#bookingDoctor"
    }, (deptSelect, docSelect) => {
        deptSelect.addEventListener("change", () => {
            const selectedVal = deptSelect.value;
            const selectedDept = serviceToDeptMap[selectedVal] || selectedVal;
            docSelect.innerHTML = '<option value="" disabled selected>-- Choose Doctor --</option>';
            
            if (selectedDept && doctorDatabase[selectedDept]) {
                doctorDatabase[selectedDept].forEach(doc => {
                    const option = document.createElement("option");
                    option.value = doc.name;
                    option.textContent = `${doc.name} (${doc.degree})`;
                    docSelect.appendChild(option);
                });
            }
        });
    });

    safeInit({
        deptSelect: "#modalBookingDepartment",
        docSelect: "#modalBookingDoctor"
    }, (deptSelect, docSelect) => {
        deptSelect.addEventListener("change", () => {
            const selectedVal = deptSelect.value;
            const selectedDept = serviceToDeptMap[selectedVal] || selectedVal;
            docSelect.innerHTML = '<option value="" disabled selected>-- Choose Doctor --</option>';
            
            if (selectedDept && doctorDatabase[selectedDept]) {
                doctorDatabase[selectedDept].forEach(doc => {
                    const option = document.createElement("option");
                    option.value = doc.name;
                    option.textContent = `${doc.name} (${doc.degree})`;
                    docSelect.appendChild(option);
                });
            }
        });
    });

    // --- CUSTOM VERTICAL SELECTOR IMPLEMENTATION ---
    function initCustomSelect(wrapperSelector, hiddenSelectSelector) {
        const wrapper = document.querySelector(wrapperSelector);
        if (!wrapper) return;
        const trigger = wrapper.querySelector(".custom-select-trigger");
        const optionsContainer = wrapper.querySelector(".custom-options-container");
        const options = wrapper.querySelectorAll(".custom-option");
        // track currently focused option index for keyboard navigation
        let activeIndex = -1;
        const hiddenSelect = document.querySelector(hiddenSelectSelector);

        if (!trigger || !optionsContainer || !hiddenSelect) return;

        // Toggle dropdown open/close
        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll(".custom-select-wrapper").forEach(w => {
                if (w !== wrapper) w.classList.remove("open");
            });
            wrapper.classList.toggle("open");
            const isOpen = wrapper.classList.contains("open");
            trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
            if (isOpen) {
                const selected = wrapper.querySelector('.custom-option.selected');
                activeIndex = selected ? Array.from(options).indexOf(selected) : 0;
                if (options[activeIndex]) {
                    options[activeIndex].focus();
                    options[activeIndex].scrollIntoView({ block: 'nearest' });
                }
            }
        });

        // If the dropdown is inside an overflow-hidden hero, position options fixed to avoid clipping
        const positionOptionsFixed = () => {
            const rect = trigger.getBoundingClientRect();
            const docLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const docTop = window.pageYOffset || document.documentElement.scrollTop;
            optionsContainer.style.position = 'fixed';
            optionsContainer.style.left = rect.left + 'px';
            optionsContainer.style.top = (rect.bottom + 8) + 'px';
            optionsContainer.style.width = rect.width + 'px';
            optionsContainer.style.zIndex = 3000;
        };

        const resetOptionsPosition = () => {
            optionsContainer.style.position = '';
            optionsContainer.style.left = '';
            optionsContainer.style.top = '';
            optionsContainer.style.width = '';
            optionsContainer.style.zIndex = '';
        };

        // When opening, focus the selected option (or first) for keyboard users
        wrapper.addEventListener("transitionend", (ev) => {
            // No-op; keep for future transition hooks
        });

        // Click outside closes the dropdown
        document.addEventListener("click", (e) => {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove("open");
                trigger.setAttribute("aria-expanded", "false");
                // reset any fixed positioning
                resetOptionsPosition();
            }
        });

        // Handle option click
        options.forEach(opt => {
            // Ensure each option has an id for aria referencing
            if (!opt.id) opt.id = `custom-opt-${Math.random().toString(36).substr(2,6)}`;
            opt.addEventListener("click", (e) => {
                e.stopPropagation();
                const val = opt.getAttribute("data-value");
                const text = opt.textContent;

                options.forEach(o => o.classList.remove("selected"));
                opt.classList.add("selected");

                trigger.querySelector("span").textContent = text;
                hiddenSelect.value = val;
                
                hiddenSelect.dispatchEvent(new Event("change"));

                wrapper.classList.remove("open");
                trigger.setAttribute("aria-expanded", "false");
                trigger.focus();
            });
        });

        // Keyboard navigation support
        trigger.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!wrapper.classList.contains("open")) {
                    wrapper.classList.add("open");
                    trigger.setAttribute("aria-expanded", "true");
                    // focus selected or first option when opening via keyboard
                    const selected = wrapper.querySelector('.custom-option.selected');
                    activeIndex = selected ? Array.from(options).indexOf(selected) : 0;
                    if (options[activeIndex]) {
                        options[activeIndex].focus();
                        options[activeIndex].scrollIntoView({ block: 'nearest' });
                    }
                }
                
                if (options.length > 0) {
                    if (e.key === "ArrowDown") {
                        activeIndex = (activeIndex + 1) % options.length;
                        options[activeIndex].focus();
                    } else if (e.key === "ArrowUp") {
                        activeIndex = (activeIndex - 1 + options.length) % options.length;
                        options[activeIndex].focus();
                    }
                }
            } else if (e.key === "Escape" || e.key === "Tab") {
                wrapper.classList.remove("open");
                trigger.setAttribute("aria-expanded", "false");
            }
        });

        options.forEach((opt, idx) => {
            opt.setAttribute("tabindex", "-1");
            opt.addEventListener("keydown", (e) => {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    activeIndex = (idx + 1) % options.length;
                    options[activeIndex].focus();
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    activeIndex = (idx - 1 + options.length) % options.length;
                    options[activeIndex].focus();
                } else if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    opt.click();
                } else if (e.key === "Escape") {
                    wrapper.classList.remove("open");
                    trigger.setAttribute("aria-expanded", "false");
                    trigger.focus();
                }
            });
        });

        // When opening the dropdown, if it's inside the hero area (which hides overflow), position fixed
        const openObserver = new MutationObserver(() => {
            if (wrapper.classList.contains('open')) {
                // detect if ancestor has overflow hidden that would clip
                const heroAncestor = wrapper.closest('.hero-section') || wrapper.classList.contains('hero-service-select-wrapper');
                if (heroAncestor) {
                    positionOptionsFixed();
                }
            } else {
                resetOptionsPosition();
            }
        });
        openObserver.observe(wrapper, { attributes: true, attributeFilter: ['class'] });

        // Close/reset on scroll/resize to avoid misposition
        window.addEventListener('resize', () => { if (!wrapper.classList.contains('open')) resetOptionsPosition(); else positionOptionsFixed(); });
        window.addEventListener('scroll', () => { if (wrapper.classList.contains('open')) positionOptionsFixed(); });
    }

    function selectCustomOptionByValue(wrapperSelector, hiddenSelectSelector, value) {
        const wrapper = document.querySelector(wrapperSelector);
        if (!wrapper) return;
        const trigger = wrapper.querySelector(".custom-select-trigger");
        const options = wrapper.querySelectorAll(".custom-option");
        const hiddenSelect = document.querySelector(hiddenSelectSelector);

        if (!trigger || !hiddenSelect) return;

        const targetOption = Array.from(options).find(opt => opt.getAttribute("data-value") === value);
        if (targetOption) {
            options.forEach(o => o.classList.remove("selected"));
            targetOption.classList.add("selected");
            trigger.querySelector("span").textContent = targetOption.textContent;
            hiddenSelect.value = value;
            hiddenSelect.dispatchEvent(new Event("change"));
        }
    }

    // Initialize Custom Select elements
    initCustomSelect(".booking-form-wrapper .custom-select-wrapper", "#bookingDepartment");
    initCustomSelect(".modal-booking-card .custom-select-wrapper", "#modalBookingDepartment");

    // Enforce 10-digit numeric constraint on all telephone inputs across site
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        // Set HTML attributes without changing styling
        input.setAttribute('maxlength', '10');
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '[0-9]{10}');

        // Prevent non-numeric characters on input
        input.addEventListener('input', (e) => {
            const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
            if (e.target.value !== cleaned) e.target.value = cleaned;
        });

        // Prevent pasting non-numeric values
        input.addEventListener('paste', (e) => {
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^[0-9]+$/.test(paste)) {
                e.preventDefault();
                return;
            }
            // allow paste but trim to 10 digits
            e.preventDefault();
            const current = e.target.value.replace(/\D/g, '');
            const combined = (current + paste).replace(/\D/g, '').slice(0, 10);
            e.target.value = combined;
        });

        // Validate length on blur and on form submit via HTML validation
        input.addEventListener('blur', () => {
            if (input.value.length !== 10) {
                input.setCustomValidity('Please enter a valid 10-digit mobile number');
            } else {
                input.setCustomValidity('');
            }
        });

        input.addEventListener('invalid', () => {
            if (input.value.length !== 10) input.setCustomValidity('Please enter a valid 10-digit mobile number');
        });
    });


    // --- 8. DOCTOR SEARCH & FILTER ENGINE ---
    const doctorSearchInput = document.getElementById("doctorSearchInput");
    const doctorDepartmentFilter = document.getElementById("doctorDepartmentFilter");
    const doctorCards = document.querySelectorAll(".doctor-card");
    const noDoctorsAlert = document.getElementById("noDoctorsAlert");

    if (doctorSearchInput && doctorCards.length > 0) {
        const filterDoctors = () => {
            const query = doctorSearchInput.value.toLowerCase().trim();
            const deptFilter = doctorDepartmentFilter ? doctorDepartmentFilter.value : "all";
            let visibleCount = 0;

            doctorCards.forEach(card => {
                const docName = card.getAttribute("data-name").toLowerCase();
                const docDept = card.getAttribute("data-dept");
                const matchesSearch = docName.includes(query) || docDept.toLowerCase().includes(query);
                const matchesDept = (deptFilter === "all" || docDept.toLowerCase() === deptFilter.toLowerCase());

                if (matchesSearch && matchesDept) {
                    card.style.display = "flex";
                    visibleCount++;
                } else {
                    card.style.display = "none";
                }
            });

            if (noDoctorsAlert) {
                noDoctorsAlert.style.display = (visibleCount === 0) ? "flex" : "none";
            }
        };

        doctorSearchInput.addEventListener("input", filterDoctors);
        if (doctorDepartmentFilter) {
            doctorDepartmentFilter.addEventListener("change", filterDoctors);
        }
    }




    // Check query params if on doctors page
    if (window.location.search.includes("search=")) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get("search");
        if (searchQuery && doctorSearchInput) {
            doctorSearchInput.value = searchQuery;
            // Delay slightly to trigger filter correctly after loads
            setTimeout(() => {
                doctorSearchInput.dispatchEvent(new Event("input"));
            }, 100);
        }
    }


    // --- 10. BOOK CONSULTATION CTA MODAL TRIGGER CONTROLLER ---
    const bookModal = document.getElementById("bookConsultationModal");
    if (bookModal) {
        const ctas = document.querySelectorAll('a[href$="#appointment"], a[href*="#appointment"], .doc-book-btn');
        ctas.forEach(cta => {
            cta.addEventListener("click", (e) => {
                // If the link points to index.html and we are not currently on index.html/root, let it navigate normally
                const href = cta.getAttribute("href");
                const isCurrentIndex = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
                if (href && href.includes("index.html") && !isCurrentIndex) {
                    return; // Let the browser handle standard redirect
                }

                e.preventDefault();

                // Extract parameters if available
                let dept = cta.getAttribute("data-dept");
                let service = cta.getAttribute("data-service");
                let doc = cta.getAttribute("data-doc");
                
                // If it's a link, we can check for href query parameters
                if (cta.getAttribute("href")) {
                    try {
                        const url = new URL(cta.href, window.location.origin);
                        if (!dept) dept = url.searchParams.get("dept");
                        if (!service) service = url.searchParams.get("service");
                        if (!doc) doc = url.searchParams.get("doc");
                    } catch (err) {
                        // ignore parsing error
                    }
                }

                const deptSelect = document.getElementById("modalBookingDepartment");
                const docSelect = document.getElementById("modalBookingDoctor");

                if (deptSelect && docSelect) {
                    if (service) {
                        selectCustomOptionByValue(".modal-booking-card .custom-select-wrapper", "#modalBookingDepartment", service);
                    } else if (dept) {
                        const deptToServiceMap = {
                            "surgery": "IVF",
                            "maternity": "Obstetrics",
                            "icu": "Neonatal Care",
                            "laparoscopy": "Laparoscopic Surgery"
                        };
                        const mappedService = deptToServiceMap[dept];
                        if (mappedService) {
                            selectCustomOptionByValue(".modal-booking-card .custom-select-wrapper", "#modalBookingDepartment", mappedService);
                        } else {
                            deptSelect.value = dept;
                            deptSelect.dispatchEvent(new Event("change"));
                        }
                    }
                    if (doc) {
                        docSelect.value = decodeURIComponent(doc);
                    }
                }
                
                openModal(bookModal);
            });
        });
    }

    // Check query params to open booking modal on page load
    if (window.location.search.includes("book=true")) {
        const urlParams = new URLSearchParams(window.location.search);
        const dept = urlParams.get("dept");
        const service = urlParams.get("service");
        const doc = urlParams.get("doc");
        const bookModal = document.getElementById("bookConsultationModal");
        
        if (bookModal) {
            const deptSelect = document.getElementById("modalBookingDepartment");
            const docSelect = document.getElementById("modalBookingDoctor");
            if (deptSelect && docSelect) {
                if (service) {
                    selectCustomOptionByValue(".modal-booking-card .custom-select-wrapper", "#modalBookingDepartment", service);
                    if (doc) {
                        docSelect.value = decodeURIComponent(doc);
                    }
                } else if (dept) {
                    const deptToServiceMap = {
                        "surgery": "IVF",
                        "maternity": "Obstetrics",
                        "icu": "Neonatal Care",
                        "laparoscopy": "Laparoscopic Surgery"
                    };
                    const mappedService = deptToServiceMap[dept];
                    if (mappedService) {
                        selectCustomOptionByValue(".modal-booking-card .custom-select-wrapper", "#modalBookingDepartment", mappedService);
                    } else {
                        deptSelect.value = dept;
                        deptSelect.dispatchEvent(new Event("change"));
                    }
                    if (doc) {
                        docSelect.value = decodeURIComponent(doc);
                    }
                }
            }
            openModal(bookModal);
        }
    }


    // --- 11. FAQ ACCORDION TRANSITIONS ---
    const faqHeaders = document.querySelectorAll(".faq-header");
    faqHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const faqItem = header.parentElement;
            const faqBody = faqItem.querySelector(".faq-body");
            const isActive = faqItem.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
                item.querySelector(".faq-body").style.display = "none";
            });

            if (!isActive) {
                faqItem.classList.add("active");
                faqBody.style.display = "block";
            }
        });
    });


    // --- 12. TESTIMONIAL CAROUSEL SLIDER ---
    const testimonialSlides = document.querySelectorAll(".testimonial-slide");
    const slidePrev = document.getElementById("slidePrev");
    const slideNext = document.getElementById("slideNext");
    if (testimonialSlides.length > 0 && slidePrev && slideNext) {
        let currentTestimonial = 0;
        let testimonialInterval;

        const showTestimonial = (index) => {
            testimonialSlides.forEach(slide => slide.classList.remove("active"));
            currentTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;
            testimonialSlides[currentTestimonial].classList.add("active");
        };

        const nextTestimonial = () => {
            showTestimonial(currentTestimonial + 1);
        };

        const prevTestimonial = () => {
            showTestimonial(currentTestimonial - 1);
        };

        slideNext.addEventListener("click", () => {
            nextTestimonial();
            startTestimonialAutoRotation();
        });

        slidePrev.addEventListener("click", () => {
            prevTestimonial();
            startTestimonialAutoRotation();
        });

        const startTestimonialAutoRotation = () => {
            clearInterval(testimonialInterval);
            testimonialInterval = setInterval(nextTestimonial, 7000);
        };

        startTestimonialAutoRotation();
    }


    // --- 13. CAREERS ACCORDION & JOB APPLICATION MODAL ---
    const careerHeaders = document.querySelectorAll(".accordion-header");
    const applyJobButtons = document.querySelectorAll(".apply-job-btn");
    
    careerHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const isActive = item.classList.contains("active");

            document.querySelectorAll(".accordion-item").forEach(i => {
                i.classList.remove("active");
            });

            if (!isActive) {
                item.classList.add("active");
            }
        });
    });

    safeInit({
        modal: "#careerApplyModal",
        jobTitleEl: "#applyingJobTitle",
        jobFieldEl: "#applicantJobField"
    }, (modal, jobTitleEl, jobFieldEl) => {
        applyJobButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const jobTitle = btn.getAttribute("data-job");
                jobTitleEl.textContent = jobTitle;
                jobFieldEl.value = jobTitle;
                openModal(modal);
            });
        });
    });


    // --- 14. DYNAMIC MODALS SYSTEM CONTROLLER ---
    const modals = document.querySelectorAll(".modal-system");
    const modalCloseButtons = document.querySelectorAll("[data-modal]");

    function openModal(modalElement) {
        modalElement.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeModal(modalElement) {
        modalElement.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (modalCloseButtons.length > 0) {
        modalCloseButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetModalId = btn.getAttribute("data-modal");
                const modal = document.getElementById(targetModalId);
                if (modal) {
                    closeModal(modal);
                }
            });
        });
    }

    if (modals.length > 0) {
        modals.forEach(modal => {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                const activeModal = document.querySelector(".modal-system.active");
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });
    }


    // --- 15. APPOINTMENT FORM VALIDATIONS & SUCCESS MODAL ---
    safeInit({
        form: "#appointmentForm",
        successModal: "#bookingSuccessModal",
        summaryEl: "#bookingSummaryDetails"
    }, (form, successModal, summaryEl) => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let isValid = true;

            const nameVal = document.getElementById("bookingName");
            const phoneVal = document.getElementById("bookingPhone");
            const emailVal = document.getElementById("bookingEmail");
            const dateVal = document.getElementById("bookingDate");
            const timeVal = document.getElementById("bookingTime");
            const deptSelect = document.getElementById("bookingDepartment");
            const docSelect = document.getElementById("bookingDoctor");

            const validateField = (element, condition) => {
                if (!element) return;
                const group = element.parentElement;
                if (condition) {
                    group.classList.remove("error");
                } else {
                    group.classList.add("error");
                    isValid = false;
                }
            };

            validateField(nameVal, nameVal && nameVal.value.trim().length >= 3);

            const phoneRegex = /^[6-9]\d{9}$/;
            validateField(phoneVal, phoneVal && phoneRegex.test(phoneVal.value.trim()));

            if (emailVal && emailVal.value.trim().length > 0) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                validateField(emailVal, emailRegex.test(emailVal.value.trim()));
            } else if (emailVal) {
                emailVal.parentElement.classList.remove("error");
            }

            if (dateVal && dateVal.value) {
                const selectedDate = new Date(dateVal.value);
                const today = new Date();
                today.setHours(0,0,0,0);
                validateField(dateVal, selectedDate >= today);
            } else {
                validateField(dateVal, false);
            }

            validateField(deptSelect, deptSelect && deptSelect.value !== "");
            validateField(docSelect, docSelect && docSelect.value !== "");
            validateField(timeVal, timeVal && timeVal.value !== "");

            if (isValid) {
                summaryEl.innerHTML = `
                    <div class="summary-row">
                        <span class="summary-lbl">Parent Name:</span>
                        <span class="summary-val">${nameVal.value.trim()}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Contact Phone:</span>
                        <span class="summary-val">${phoneVal.value.trim()}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Specialty Service:</span>
                        <span class="summary-val">${deptSelect.options[deptSelect.selectedIndex].text}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Specialist:</span>
                        <span class="summary-val">${docSelect.value}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Consult Date:</span>
                        <span class="summary-val">${dateVal.value}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Time Slot:</span>
                        <span class="summary-val">${timeVal.options[timeVal.selectedIndex].text}</span>
                    </div>
                `;

                openModal(successModal);
                form.reset();
                if (docSelect) docSelect.innerHTML = '<option value="" disabled selected>-- Choose Specialist --</option>';
            }
        });
    });


    // --- 15b. MODAL APPOINTMENT FORM VALIDATIONS & SUCCESS MODAL ---
    safeInit({
        form: "#modalAppointmentForm",
        successModal: "#bookingSuccessModal",
        summaryEl: "#bookingSummaryDetails",
        bookModal: "#bookConsultationModal"
    }, (form, successModal, summaryEl, bookModal) => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let isValid = true;

            const nameVal = document.getElementById("modalBookingName");
            const phoneVal = document.getElementById("modalBookingPhone");
            const emailVal = document.getElementById("modalBookingEmail");
            const dateVal = document.getElementById("modalBookingDate");
            const timeVal = document.getElementById("modalBookingTime");
            const deptSelect = document.getElementById("modalBookingDepartment");
            const docSelect = document.getElementById("modalBookingDoctor");

            const validateField = (element, condition) => {
                if (!element) return;
                const group = element.parentElement;
                if (condition) {
                    group.classList.remove("error");
                } else {
                    group.classList.add("error");
                    isValid = false;
                }
            };

            validateField(nameVal, nameVal && nameVal.value.trim().length >= 3);

            const phoneRegex = /^[6-9]\d{9}$/;
            validateField(phoneVal, phoneVal && phoneRegex.test(phoneVal.value.trim()));

            if (emailVal && emailVal.value.trim().length > 0) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                validateField(emailVal, emailRegex.test(emailVal.value.trim()));
            } else if (emailVal) {
                emailVal.parentElement.classList.remove("error");
            }

            if (dateVal && dateVal.value) {
                const selectedDate = new Date(dateVal.value);
                const today = new Date();
                today.setHours(0,0,0,0);
                validateField(dateVal, selectedDate >= today);
            } else {
                validateField(dateVal, false);
            }

            validateField(deptSelect, deptSelect && deptSelect.value !== "");
            validateField(docSelect, docSelect && docSelect.value !== "");
            validateField(timeVal, timeVal && timeVal.value !== "");

            if (isValid) {
                summaryEl.innerHTML = `
                    <div class="summary-row">
                        <span class="summary-lbl">Parent Name:</span>
                        <span class="summary-val">${nameVal.value.trim()}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Contact Phone:</span>
                        <span class="summary-val">${phoneVal.value.trim()}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Specialty Service:</span>
                        <span class="summary-val">${deptSelect.options[deptSelect.selectedIndex].text}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Specialist:</span>
                        <span class="summary-val">${docSelect.value}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Consult Date:</span>
                        <span class="summary-val">${dateVal.value}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-lbl">Time Slot:</span>
                        <span class="summary-val">${timeVal.options[timeVal.selectedIndex].text}</span>
                    </div>
                `;

                closeModal(bookModal);
                openModal(successModal);
                form.reset();
                if (docSelect) docSelect.innerHTML = '<option value="" disabled selected>-- Choose Specialist --</option>';
            }
        });
    });


    // --- 16. CONTACT MESSAGE FORM VALIDATIONS ---
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            const cName = document.getElementById("contactName");
            const cEmail = document.getElementById("contactEmail");
            const cPhone = document.getElementById("contactPhone");
            const cMsg = document.getElementById("contactMessage");

            const validateGroup = (element, condition) => {
                if (!element) return;
                const group = element.parentElement;
                if (condition) {
                    group.classList.remove("error");
                } else {
                    group.classList.add("error");
                    isValid = false;
                }
            };

            validateGroup(cName, cName && cName.value.trim().length >= 3);
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateGroup(cEmail, cEmail && emailRegex.test(cEmail.value.trim()));
            
            const phoneRegex = /^[6-9]\d{9}$/;
            validateGroup(cPhone, cPhone && phoneRegex.test(cPhone.value.trim()));
            
            validateGroup(cMsg, cMsg && cMsg.value.trim().length >= 10);

            if (isValid) {
                alert(`Thank you, ${cName.value.trim()}! Your inquiry has been submitted. Our support team will get in touch with you shortly.`);
                contactForm.reset();
            }
        });
    }


    // --- 17. CAREERS APPLICATION FORM SUBMISSION ---
    const careerApplicationForm = document.getElementById("careerApplicationForm");
    if (careerApplicationForm) {
        careerApplicationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            const appName = document.getElementById("applicantName");
            const appEmail = document.getElementById("applicantEmail");
            const appPhone = document.getElementById("applicantPhone");
            const appResume = document.getElementById("applicantResume");
            const jobFieldEl = document.getElementById("applicantJobField");
            const jobField = jobFieldEl ? jobFieldEl.value : "Position";

            const validateAppField = (element, condition) => {
                if (!element) return;
                const group = element.parentElement;
                if (condition) {
                    group.classList.remove("error");
                } else {
                    group.classList.add("error");
                    isValid = false;
                }
            };

            validateAppField(appName, appName && appName.value.trim().length >= 3);
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateAppField(appEmail, appEmail && emailRegex.test(appEmail.value.trim()));
            
            const phoneRegex = /^[6-9]\d{9}$/;
            validateAppField(appPhone, appPhone && phoneRegex.test(appPhone.value.trim()));
            
            const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            validateAppField(appResume, appResume && urlRegex.test(appResume.value.trim()));

            if (isValid) {
                alert(`Application for '${jobField}' successfully submitted! We have received your profile details and will evaluate them shortly.`);
                const modal = document.getElementById("careerApplyModal");
                if (modal) closeModal(modal);
                careerApplicationForm.reset();
            }
        });
    }


    // --- 18. CLINICAL HEALTH BLOG DATABASE & MODAL POPULATOR ---
    const blogsDatabase = {
        "blog-1": {
            category: "Fertility & IVF",
            date: "June 15, 2026",
            title: "Nurturing Hope: Understanding the IVF Journey",
            content: `
                <p>Starting a family is a beautiful milestone, and for many, the path involves advanced fertility support. Modern IVF treatments offer high success rates and new possibilities for aspiring parents.</p>
                <p><strong>1. The IVF Cycle Steps:</strong> The process begins with gentle ovarian stimulation, followed by precise egg retrieval. In our advanced embryology lab, fertilization occurs under controlled conditions to cultivate healthy, strong embryos.</p>
                <p><strong>2. Advanced Embryo Transfer:</strong> Replanting the selected embryo is a painless, simple outpatient procedure. With personalized fertility plans, our embryologists ensure optimal endometrial receptivity for implantation.</p>
                <p><strong>3. Warm Emotional Support:</strong> The fertility journey is as emotional as it is clinical. Compassionate counseling and stress reduction techniques play a vital role in positive pregnancy outcomes.</p>
            `
        },
        "blog-2": {
            category: "Pregnancy Care",
            date: "May 28, 2026",
            title: "The Parenthood Journey: Essential Prenatal Wellness Tips",
            content: `
                <p>Pregnancy is a milestone journey that requires structured clinical support, nutritional balance, and lifestyle adjustments to protect the health of both mother and child.</p>
                <p><strong>1. Structured Prenatal Visits:</strong> Regular consultations are vital to monitor fetal development, measure blood pressure, and conduct routine scans. Expectant mothers should schedule monthly checkups during the first two trimesters, increasing frequency as the delivery date nears.</p>
                <p><strong>2. Targeted Maternity Nutrition:</strong> Emphasize diet plans rich in iron, calcium, folic acid, and lean proteins. Proper hydration is critical for amniotic fluid maintenance, and processed sugars should be minimized to avoid gestational diabetes risks.</p>
                <p><strong>3. Preparing for Delivery:</strong> Attend prenatal breathing classes and coordinate a clear delivery plan with your obstetrician. Setting up support early ensures peace of mind when labor begins.</p>
            `
        },
        "blog-3": {
            category: "Newborn Care",
            date: "May 10, 2026",
            title: "NICU Guidelines: Compassionate Care for Preterm Babies",
            content: `
                <p>Our Neonatal Intensive Care Unit (NICU) is designed to stabilize and nurture premature infants and newborns requiring special care, combining warm human touch with advanced technology.</p>
                <p><strong>1. Continuous Vital Monitoring:</strong> Specialized incubators feature real-time monitoring of oxygen levels, body temperature, and cardiac rhythm to detect subtle changes instantly.</p>
                <p><strong>2. Family-Centered Bonding:</strong> We encourage skin-to-skin contact (Kangaroo Care) and mother-baby bonding. Our pediatric staff guides parents through feeding and holding their tiny miracles safely.</p>
                <p><strong>3. Strict Sanitization:</strong> Protecting premature babies with fragile immune systems requires strict hygiene standards. Relative visits are scheduled with full sanitization protocols to prevent secondary infections.</p>
            `
        },
        "blog-4": {
            category: "Women's Health",
            date: "26 June",
            title: "Laparoscopic Cystectomy Successfully Performed",
            content: `
                <p>A 38-year-old female patient was diagnosed with a <strong>12 &times; 11 cm cystadenoma (benign ovarian tumour)</strong>.</p>
                <p>She successfully underwent <strong>laparoscopic cystectomy</strong>, resulting in safe removal of the benign ovarian cyst using a minimally invasive approach.</p>
            `
        },
        "blog-5": {
            category: "Women's Health",
            date: "29 June",
            title: "Total Laparoscopic Hysterectomy for Multiple Fibroid Uterus",
            content: `
                <p>A 44-year-old female patient with <strong>multiple fibroid uterus</strong> successfully underwent <strong>Total Laparoscopic Hysterectomy (TLH) with Bilateral Salpingectomy</strong>.</p>
                <p>The procedure was completed successfully using minimally invasive laparoscopic techniques.</p>
            `
        },
        "blog-6": {
            category: "Women's Health",
            date: "30 June",
            title: "Diagnostic Hysterolaparoscopy for Asherman Syndrome",
            content: `
                <p>A 24-year-old female patient with a history of <strong>recurrent abortions</strong> and diagnosed with <strong>Asherman syndrome</strong> underwent <strong>Diagnostic Hysterolaparoscopy</strong>.</p>
                <p>During the procedure, <strong>hysteroscopic adhesiolysis</strong> was successfully performed along with <strong>diagnostic laparoscopy</strong>.</p>
            `
        }
    };

    safeInit({
        modal: "#blogReaderModal",
        cat: "#blogModalCategory",
        date: "#blogModalDate",
        title: "#blogModalTitle",
        content: "#blogModalContent"
    }, (modal, cat, date, title, content) => {
        const readMoreButtons = document.querySelectorAll(".btn-read-more");
        readMoreButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const blogId = btn.getAttribute("data-blog");
                const blogData = blogsDatabase[blogId];

                if (blogData) {
                    cat.textContent = blogData.category;
                    date.textContent = blogData.date;
                    title.textContent = blogData.title;
                    content.innerHTML = blogData.content;
                    openModal(modal);
                }
            });
        });
    });


    // --- 19. FOOTER DEPARTMENTS FILTER SYNC ---
    const deptFooterLinks = document.querySelectorAll(".dept-footer-link");
    deptFooterLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const filter = link.getAttribute("data-filter");
            const targetFilterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
            if (targetFilterBtn) {
                targetFilterBtn.click();
            } else {
                // If not on specialties page, redirect to specialties.html?filter=...
                window.location.href = `specialties.html?filter=${filter}`;
            }
        });
    });

    // Check query params if on specialties page
    if (window.location.search.includes("filter=")) {
        const urlParams = new URLSearchParams(window.location.search);
        const filterVal = urlParams.get("filter");
        if (filterVal) {
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterVal}"]`);
            if (targetBtn) {
                setTimeout(() => {
                    targetBtn.click();
                }, 100);
            }
        }
    }


    // --- 20. FLOATING ACTIONS COLLISION AVOIDANCE & OPACITY TRIGGER ---
    const floatingActions = document.getElementById("floatingActions");
    const footer = document.querySelector(".main-footer");
    if (floatingActions && footer) {
        const checkFooterCollision = () => {
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // If the top of the footer is visible or close to the bottom of the viewport
            // We fade the buttons to prevent them from blocking footer contents
            if (footerRect.top < windowHeight - 50) {
                floatingActions.classList.add("near-footer");
            } else {
                floatingActions.classList.remove("near-footer");
            }
        };

        window.addEventListener("scroll", checkFooterCollision);
        window.addEventListener("resize", checkFooterCollision);
        // Initial run
        checkFooterCollision();
    }

    // Reset custom select trigger placeholders when forms are reset
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("reset", () => {
            setTimeout(() => {
                form.querySelectorAll(".custom-select-wrapper").forEach(wrapper => {
                    const trigger = wrapper.querySelector(".custom-select-trigger span");
                    if (trigger) {
                        trigger.textContent = "Select Service";
                    }
                    wrapper.querySelectorAll(".custom-option").forEach(opt => opt.classList.remove("selected"));
                });
            }, 0);
        });
    });

});
