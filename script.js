// Global Variables
let selectedService = '';
let currentSlideIndex = 0;
const slides = [];
const dots = [];

// Initialize Website
document.addEventListener('DOMContentLoaded', function() {
  initializeWebsite();
});

function initializeWebsite() {
  try {
    setupHeaderScrollEffect();
    setupSmoothScrolling();
    setupIntersectionObserver();
    setupGalleryAutoplay();
    setupHamburgerMenu();
    setupFormValidation();
    setupBackToTop();
    setMinimumDate();
    initializeGallery();
    
    console.log('KoneksiJasa Website Loaded Successfully!');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Header Scroll Effect
function setupHeaderScrollEffect() {
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const currentScrollY = window.scrollY;
    
    if (header) {
      if (currentScrollY > 100) {
        header.style.background = 'rgba(26, 54, 93, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
      } else {
        header.style.background = '#1a365d';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
      }
    }
    
    lastScrollY = currentScrollY;
  });
}

// Mobile Menu Setup
function setupHamburgerMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-menu');
  const mainNav = document.getElementById('main-nav');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMobileMenu() {
    if (mainNav && navOverlay && hamburgerBtn) {
      const isActive = mainNav.classList.contains('active');
      
      mainNav.classList.toggle('active');
      navOverlay.classList.toggle('active');
      
      hamburgerBtn.setAttribute('aria-expanded', !isActive);
      hamburgerBtn.querySelector('i').classList.toggle('fa-bars');
      hamburgerBtn.querySelector('i').classList.toggle('fa-times');
      
      document.body.style.overflow = !isActive ? 'hidden' : '';
    }
  }

  function closeMobileMenu() {
    if (mainNav && navOverlay && hamburgerBtn) {
      mainNav.classList.remove('active');
      navOverlay.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.querySelector('i').classList.add('fa-bars');
      hamburgerBtn.querySelector('i').classList.remove('fa-times');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }
  
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking nav links
  document.querySelectorAll('#main-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav && mainNav.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

// Smooth Scrolling
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active nav link
        updateActiveNavLink(targetId);
      }
    });
  });
}

function updateActiveNavLink(targetId) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === targetId) {
      link.classList.add('active');
    }
  });
}

// Clean Gallery Functions
function initializeGallery() {
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  const navDots = document.querySelectorAll('.nav-dot');
  
  slides.length = 0;
  dots.length = 0;
  
  gallerySlides.forEach(slide => slides.push(slide));
  navDots.forEach(dot => dots.push(dot));
}

function changeSlide(direction) {
  if (slides.length === 0) initializeGallery();
  if (slides.length === 0) return;
  
  // Remove active class
  slides[currentSlideIndex].classList.remove('active');
  dots[currentSlideIndex].classList.remove('active');
  
  // Calculate new slide index
  currentSlideIndex += direction;
  
  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1;
  }
  
  // Add active class to new slide
  slides[currentSlideIndex].classList.add('active');
  dots[currentSlideIndex].classList.add('active');
}

function currentSlide(slideIndex) {
  if (slides.length === 0) initializeGallery();
  if (slides.length === 0) return;
  
  if (slideIndex === currentSlideIndex) return;
  
  // Remove active states
  slides[currentSlideIndex].classList.remove('active');
  dots[currentSlideIndex].classList.remove('active');
  
  // Set new index and add active states
  currentSlideIndex = slideIndex;
  slides[currentSlideIndex].classList.add('active');
  dots[currentSlideIndex].classList.add('active');
}

// Gallery Auto-play
function setupGalleryAutoplay() {
  // Auto-slide every 6 seconds with pause on hover
  let autoSlideTimer = setInterval(autoSlide, 6000);
  
  function autoSlide() {
    if (document.visibilityState === 'visible' && !isPaused) {
      changeSlide(1);
    }
  }
  
  // Pause on hover
  let isPaused = false;
  const gallery = document.querySelector('.image-gallery');
  
  if (gallery) {
    gallery.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    
    gallery.addEventListener('mouseleave', () => {
      isPaused = false;
    });
  }
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger counter animation for stats
        if (entry.target.classList.contains('stat-item')) {
          animateCounter(entry.target);
          entry.target.classList.add('animate');
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// Enhanced Counter Animation
function animateCounter(statItem) {
  const statValue = statItem.querySelector('.stat-value');
  if (!statValue || statValue.dataset.animated) return;
  
  const targetText = statValue.textContent;
  const targetNumber = parseInt(targetText.replace(/\D/g, ''));
  const suffix = targetText.includes('%') ? '%' : '+';
  
  let currentNumber = 0;
  const increment = targetNumber / 60;
  const duration = 2000;
  const stepTime = duration / 60;
  
  const timer = setInterval(() => {
    currentNumber += increment;
    if (currentNumber >= targetNumber) {
      currentNumber = targetNumber;
      clearInterval(timer);
      statValue.dataset.animated = 'true';
    }
    statValue.textContent = Math.floor(currentNumber) + suffix;
  }, stepTime);

  // Animate progress bar
  const progressBar = statItem.querySelector('.progress-bar');
  if (progressBar) {
    setTimeout(() => {
      progressBar.style.width = progressBar.style.width || '100%';
    }, 300);
  }
}

// Modal Functions
function openBookingModal(service) {
  selectedService = service;
  const modal = document.getElementById('bookingModal');
  
  if (modal) {
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    const firstInput = modal.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  
  if (modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    
    const form = document.getElementById('bookingForm');
    if (form) {
      form.reset();
    }
  }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
  const modal = document.getElementById('bookingModal');
  if (e.target === modal) {
    closeBookingModal();
  }
  
  const whatsappModal = document.getElementById('whatsappOptionsModal');
  if (e.target === whatsappModal) {
    closeWhatsAppOptionsModal();
  }
});

// ========================================
// INSTAGRAM API - MOBILE & DESKTOP SMART
// ========================================

function openInstagram() {
  try {
    const device = detectDevice();
    const instagramUsername = 'koneksijasa';
    
    console.log('Opening Instagram for:', instagramUsername);
    console.log('Device type:', device.isMobile ? 'Mobile' : 'Desktop');
    
    if (device.isMobile) {
      // Untuk mobile: coba app native dulu
      const appUrl = `instagram://user?username=${instagramUsername}`;
      const webUrl = `https://www.instagram.com/${instagramUsername}/`;
      
      // Coba buka app native
      const startTime = Date.now();
      window.location.href = appUrl;
      
      // Fallback ke web jika app tidak terinstall
      setTimeout(() => {
        if (Date.now() - startTime < 2000) {
          console.log('Instagram app not installed, opening web version');
          window.open(webUrl, '_blank');
        }
      }, 1500);
      
    } else {
      // Untuk desktop: langsung ke web dengan multiple strategy
      const webUrl = `https://www.instagram.com/${instagramUsername}/`;
      
      // Strategy 1: Buka di tab baru
      const newWindow = window.open(webUrl, '_blank', 'width=1200,height=800');
      
      // Strategy 2: Fallback jika popup diblokir
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.log('Popup blocked, redirecting to Instagram');
        window.location.href = webUrl;
      }
    }
    
    // Show success message
    showInstagramSuccessMessage();
    
  } catch (error) {
    console.error('Instagram opening error:', error);
    // Ultimate fallback
    const fallbackUrl = `https://www.instagram.com/koneksijasa/`;
    window.open(fallbackUrl, '_blank');
    showInstagramSuccessMessage();
  }
}

function showInstagramSuccessMessage() {
  const successMsg = document.getElementById('successMessage');
  if (successMsg) {
    const device = detectDevice();
    
    successMsg.innerHTML = `
      <i class="fab fa-instagram" style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #E4405F;"></i>
      <div><strong>Instagram berhasil dibuka!</strong></div>
      <div style="font-size: 0.85rem; opacity: 0.9; margin-top: 0.5rem;">
        ${device.isMobile ? 
          '📱 Lanjutkan di aplikasi Instagram' : 
          '💻 Follow @koneksijasa untuk update terbaru!'
        }
      </div>
    `;
    
    successMsg.style.background = 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)';
    successMsg.style.display = 'block';
    
    setTimeout(() => {
      successMsg.style.display = 'none';
      // Reset style
      successMsg.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    }, 3000);
  }
}

// ========================================
// ENHANCED SOCIAL MEDIA FUNCTIONS
// ========================================

function openFacebook() {
  // Implement jika ada Facebook page
  showAlert('Halaman Facebook akan segera tersedia!', 'info');
}

function openTwitter() {
  // Implement jika ada Twitter account
  showAlert('Akun Twitter akan segera tersedia!', 'info');
}

function openLinkedIn() {
  // Implement jika ada LinkedIn page
  showAlert('Halaman LinkedIn akan segera tersedia!', 'info');
}

function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Deteksi mobile device
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  
  // Deteksi Windows Phone
  const isWindowsPhone = /windows phone/i.test(userAgent);
  
  // Deteksi tablet
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
  
  return {
    isMobile: isMobile || isWindowsPhone,
    isTablet: isTablet,
    isDesktop: !isMobile && !isWindowsPhone && !isTablet,
    userAgent: userAgent
  };
}

function openWhatsApp(message, phone = '62895383015559') {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const device = detectDevice();
    
    console.log('Device detection:', device);
    console.log('Attempting to open WhatsApp with phone:', cleanPhone);
    
    let whatsappUrl;
    // Universal fallback yang bekerja di semua platform
    let universalFallback = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    
    if (device.isMobile) {
      // Untuk mobile: prioritas app native
      whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
      
      // Coba buka app native
      const startTime = Date.now();
      window.location.href = whatsappUrl;
      
      // Fallback jika app tidak terinstall
      setTimeout(() => {
        if (Date.now() - startTime < 2000) {
          console.log('WhatsApp app not installed, using universal fallback');
          window.open(universalFallback, '_blank');
        }
      }, 1500);
      
    } else if (device.isDesktop) {
      // Untuk desktop: gunakan API universal yang tidak perlu login
      console.log('Desktop detected, using universal WhatsApp link');
      
      // Coba buka dengan multiple strategy
      const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
      
      // Strategy 1: Coba WhatsApp Web dulu (jika sudah login)
      const webWindow = window.open(webUrl, '_blank', 'width=1200,height=800');
      
      // Strategy 2: Setelah delay, buka universal link sebagai backup
      setTimeout(() => {
        // Jika web window tidak berhasil atau user belum login, buka universal link
        const universalWindow = window.open(universalFallback, '_blank');
        
        // Jika popup diblokir, redirect
        if (!universalWindow || universalWindow.closed) {
          console.log('Popup blocked, redirecting to universal link');
          window.location.href = universalFallback;
        }
      }, 2000);
      
    } else {
      // Untuk tablet atau device lain: langsung ke universal
      console.log('Tablet/Other device detected, using universal link');
      window.open(universalFallback, '_blank');
    }
    
    // Tampilkan success message dengan info tambahan untuk desktop
    if (device.isDesktop) {
      showDesktopSuccessMessage();
    } else {
      showSuccessMessage();
    }
    
  } catch (error) {
    console.error('WhatsApp opening error:', error);
    // Ultimate fallback yang pasti bekerja
    const ultimateFallback = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(ultimateFallback, '_blank');
    showSuccessMessage();
  }
}

function chatMitra(namaProvider, phone, message) {
  // Log untuk debugging
  console.log('Chat Mitra:', namaProvider, phone);
  openWhatsAppWithOptions(message, phone);
}

function chatAdmin() {
  const adminMessage = `*🏠 HALO ADMIN KONEKSIJASA!* 👋

Saya butuh bantuan dan informasi layanan.

📋 *KEBUTUHAN SAYA:*
✅ Konsultasi layanan  
✅ Info harga dan paket  
✅ Booking jadwal  
✅ Pertanyaan umum

🙏 *Mohon hubungi saya untuk informasi lebih lanjut.*

Terima kasih! 🚀`;
  
  console.log('Chat Admin triggered');
  openWhatsAppWithOptions(adminMessage, '62895383015559');
}

// Enhanced WhatsApp function dengan opsi untuk desktop
function openWhatsAppWithOptions(message, phone = '62895383015559') {
  const device = detectDevice();
  
  if (device.isDesktop) {
    // Untuk desktop, berikan pilihan
    showWhatsAppOptionsModal(message, phone);
  } else {
    // Untuk mobile, langsung buka
    openWhatsApp(message, phone);
  }
}

// Modal pilihan WhatsApp untuk desktop
function showWhatsAppOptionsModal(message, phone) {
  const modalHtml = `
    <div id="whatsappOptionsModal" class="modal" style="display: block;">
      <div class="modal-content" style="max-width: 480px;">
        <div class="modal-header">
          <h3 class="modal-title">🚀 Pilih Cara Buka WhatsApp</h3>
          <button class="close-btn" onclick="closeWhatsAppOptionsModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div style="padding: 1rem 0;">
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: #25d366; margin-bottom: 0.5rem;">💬 Pesan yang akan dikirim:</h4>
            <div style="background: rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 8px; font-size: 0.9rem; max-height: 120px; overflow-y: auto;">
              ${message.replace(/\*([^*]+)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="display: grid; gap: 1rem;">
            <button onclick="openWhatsAppWeb('${encodeURIComponent(message)}', '${phone}')" 
                    style="background: #25d366; color: white; border: none; padding: 1rem; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;"
                    onmouseover="this.style.background='#128c7e'" 
                    onmouseout="this.style.background='#25d366'">
              <i class="fab fa-whatsapp" style="margin-right: 8px;"></i>
              Buka WhatsApp Web (Perlu Login)
            </button>
            
            <button onclick="openWhatsAppDirect('${encodeURIComponent(message)}', '${phone}')" 
                    style="background: #3182ce; color: white; border: none; padding: 1rem; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;"
                    onmouseover="this.style.background='#2c5282'" 
                    onmouseout="this.style.background='#3182ce'">
              <i class="fas fa-external-link-alt" style="margin-right: 8px;"></i>
              Buka Link Langsung (Tidak Perlu Login)
            </button>
            
            <button onclick="copyWhatsAppLink('${encodeURIComponent(message)}', '${phone}')" 
                    style="background: #38a169; color: white; border: none; padding: 1rem; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;"
                    onmouseover="this.style.background='#2f855a'" 
                    onmouseout="this.style.background='#38a169'">
              <i class="fas fa-copy" style="margin-right: 8px;"></i>
              Salin Link WhatsApp
            </button>
          </div>
          
          <div style="margin-top: 1rem; padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 0.85rem; color: #bee3f8;">
            <strong>💡 Rekomendasi:</strong><br>
            • Gunakan <strong>Link Langsung</strong> jika belum login WhatsApp Web<br>
            • Gunakan <strong>WhatsApp Web</strong> jika sudah login sebelumnya
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow = 'hidden';
}

function closeWhatsAppOptionsModal() {
  const modal = document.getElementById('whatsappOptionsModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = 'auto';
  }
}

function openWhatsAppWeb(message, phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  const decodedMessage = decodeURIComponent(message);
  const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(decodedMessage)}`;
  
  window.open(webUrl, '_blank');
  closeWhatsAppOptionsModal();
  showSuccessMessage();
}

function openWhatsAppDirect(message, phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  const decodedMessage = decodeURIComponent(message);
  const directUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(decodedMessage)}`;
  
  window.open(directUrl, '_blank');
  closeWhatsAppOptionsModal();
  showSuccessMessage();
}

function copyWhatsAppLink(message, phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  const decodedMessage = decodeURIComponent(message);
  const linkUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(decodedMessage)}`;
  
  navigator.clipboard.writeText(linkUrl).then(() => {
    closeWhatsAppOptionsModal();
    showAlert('Link WhatsApp berhasil disalin! Paste di browser untuk membuka.', 'success');
  }).catch(() => {
    // Fallback untuk browser yang tidak support clipboard API
    const textarea = document.createElement('textarea');
    textarea.value = linkUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    closeWhatsAppOptionsModal();
    showAlert('Link WhatsApp berhasil disalin! Paste di browser untuk membuka.', 'success');
  });
}

// Success Message untuk Mobile
function showSuccessMessage() {
  const successMsg = document.getElementById('successMessage');
  if (successMsg) {
    successMsg.innerHTML = `
      <i class="fab fa-whatsapp" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
      <div>WhatsApp berhasil dibuka!</div>
      <div style="font-size: 0.9rem; opacity: 0.9;">Lanjutkan di aplikasi WhatsApp</div>
    `;
    successMsg.style.display = 'block';
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 3000);
  }
}

// Success Message khusus untuk Desktop dengan instruksi
function showDesktopSuccessMessage() {
  const successMsg = document.getElementById('successMessage');
  if (successMsg) {
    successMsg.innerHTML = `
      <i class="fab fa-whatsapp" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
      <div><strong>WhatsApp sedang dibuka!</strong></div>
      <div style="font-size: 0.85rem; opacity: 0.9; margin-top: 0.5rem;">
        💡 <strong>Tips:</strong> Jika belum login WhatsApp Web, akan ada 2 tab:<br>
        • Tab 1: Login WhatsApp Web (QR Code)<br>
        • Tab 2: Link langsung ke chat (gunakan ini)
      </div>
    `;
    successMsg.style.background = 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)';
    successMsg.style.maxWidth = '400px';
    successMsg.style.padding = '1.5rem 2rem';
    successMsg.style.lineHeight = '1.4';
    successMsg.style.display = 'block';
    
    setTimeout(() => {
      successMsg.style.display = 'none';
      // Reset style
      successMsg.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      successMsg.style.maxWidth = '';
      successMsg.style.padding = '1.5rem 2rem';
      successMsg.style.lineHeight = '';
    }, 6000); // Show longer for desktop users
  }
}

// Form Handling
function setupFormValidation() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmission(this);
  });

  // Real-time validation
  const inputs = form.querySelectorAll('input[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
  });
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  clearFieldError(e);
  
  if (!value) {
    showFieldError(field, 'Field ini wajib diisi');
    return false;
  }
  
  if (field.type === 'tel' && !/^[0-9+\-\s()]+$/.test(value)) {
    showFieldError(field, 'Format nomor telepon tidak valid');
    return false;
  }
  
  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    showFieldError(field, 'Format email tidak valid');
    return false;
  }
  
  return true;
}

function showFieldError(field, message) {
  clearFieldError({target: field});
  
  field.style.borderColor = '#e53e3e';
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.style.color = '#e53e3e';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.marginTop = '5px';
  errorDiv.textContent = message;
  
  field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
  const field = e.target;
  field.style.borderColor = 'rgba(49, 130, 206, 0.3)';
  
  const errorDiv = field.parentNode.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

function handleFormSubmission(form) {
  const formData = getFormData();
  
  if (!validateFormData(formData)) {
    return;
  }

  const message = createWhatsAppMessage(formData);
  
  const submitBtn = form.querySelector('button[type="submit"]');
  showLoadingState(submitBtn);
  
  setTimeout(() => {
    try {
      openWhatsAppWithOptions(message, '62895383015559');
      
      setTimeout(() => {
        hideLoadingState(submitBtn);
        closeBookingModal();
      }, 1000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      hideLoadingState(submitBtn);
      showAlert('Gagal membuka WhatsApp. Silakan coba lagi atau hubungi kami secara manual.', 'error');
    }
  }, 500);
}

function getFormData() {
  return {
    name: document.getElementById('customerName')?.value.trim() || '',
    phone: document.getElementById('customerPhone')?.value.trim() || '',
    address: document.getElementById('customerAddress')?.value.trim() || '',
    date: document.getElementById('serviceDate')?.value || '',
    time: document.getElementById('serviceTime')?.value || '',
    notes: document.getElementById('additionalNotes')?.value.trim() || ''
  };
}

function validateFormData(data) {
  const requiredFields = [
    { key: 'name', label: 'Nama' },
    { key: 'phone', label: 'Nomor WhatsApp' },
    { key: 'address', label: 'Alamat' },
    { key: 'date', label: 'Tanggal' },
    { key: 'time', label: 'Waktu' }
  ];
  
  for (const field of requiredFields) {
    if (!data[field.key]) {
      showAlert(`${field.label} harus diisi!`, 'error');
      document.getElementById(`customer${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`)?.focus();
      return false;
    }
  }
  
  if (!/^[0-9+\-\s()]+$/.test(data.phone)) {
    showAlert('Format nomor WhatsApp tidak valid!', 'error');
    document.getElementById('customerPhone')?.focus();
    return false;
  }
  
  // Validate date is not in the past
  const selectedDate = new Date(data.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    showAlert('Tanggal layanan tidak boleh di masa lalu!', 'error');
    document.getElementById('serviceDate')?.focus();
    return false;
  }
  
  return true;
}

function createWhatsAppMessage(data) {
  const dateObj = new Date(data.date);
  const formattedDate = dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeObj = new Date(`2000-01-01T${data.time}`);
  const formattedTime = timeObj.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `*🏠 PESANAN KONEKSIJASA*

📋 *DETAIL PESANAN:*
━━━━━━━━━━━━━━━━━━━━━━━

🎯 *Layanan:* ${selectedService}
👤 *Nama:* ${data.name}
📱 *WhatsApp:* ${data.phone}
📍 *Alamat:* ${data.address}
📅 *Tanggal:* ${formattedDate}
⏰ *Waktu:* ${formattedTime}
${data.notes ? `📝 *Catatan:* ${data.notes}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━
✅ *STATUS:* Menunggu Konfirmasi

🙏 *Mohon konfirmasi ketersediaan jadwal dan detail harga.*

*Terima kasih telah memilih KoneksiJasa! 🚀*`;
}

function showLoadingState(button) {
  if (!button) return;
  
  button.dataset.originalText = button.innerHTML;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
  button.disabled = true;
  button.style.opacity = '0.8';
}

function hideLoadingState(button) {
  if (!button) return;
  
  button.innerHTML = button.dataset.originalText || '<i class="fab fa-whatsapp"></i> Kirim Pesanan via WhatsApp';
  button.disabled = false;
  button.style.opacity = '1';
}

function showAlert(message, type = 'info') {
  // Create custom alert with better styling
  const alertDiv = document.createElement('div');
  
  let backgroundColor;
  switch(type) {
    case 'error':
      backgroundColor = '#e53e3e';
      break;
    case 'success':
      backgroundColor = '#25d366';
      break;
    case 'info':
    default:
      backgroundColor = '#3182ce';
      break;
  }
  
  alertDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${backgroundColor};
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 9999;
    max-width: 90%;
    text-align: center;
    font-weight: 600;
  `;
  alertDiv.textContent = message;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 4000);
}

function setMinimumDate() {
  const dateInput = document.getElementById('serviceDate');
  if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.setAttribute('min', tomorrow.toISOString().split('T')[0]);
  }
}

// Back to top functionality
function setupBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  if (backToTopButton) {
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Enhanced Touch Support for Gallery
let startX = 0;
let endX = 0;
let startY = 0;
let endY = 0;

const gallerySlider = document.querySelector('.gallery-slider');
if (gallerySlider) {
  gallerySlider.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  gallerySlider.addEventListener('touchmove', function(e) {
    // Prevent vertical scroll when swiping horizontally
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);
    
    if (diffX > diffY) {
      e.preventDefault();
    }
  }, { passive: false });

  gallerySlider.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diffX = startX - endX;
    const diffY = startY - endY;
    const threshold = 50;

    // Only trigger if horizontal swipe is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        changeSlide(1); // Swipe left, go to next
      } else {
        changeSlide(-1); // Swipe right, go to previous
      }
    }
  }
}

// Enhanced Keyboard Navigation
document.addEventListener('keydown', function(e) {
  const isBookingModalOpen = document.getElementById('bookingModal').style.display === 'block';
  const isWhatsAppModalOpen = document.getElementById('whatsappOptionsModal') !== null;
  
  if (!isBookingModalOpen && !isWhatsAppModalOpen) {
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        changeSlide(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        changeSlide(1);
        break;
      case ' ': // Spacebar
        e.preventDefault();
        changeSlide(1);
        break;
    }
  }
  
  // Global shortcuts
  if (e.key === 'Escape') {
    if (isBookingModalOpen) {
      closeBookingModal();
    }
    if (isWhatsAppModalOpen) {
      closeWhatsAppOptionsModal();
    }
  }
});

// Performance optimizations
let ticking = false;

function updateOnScroll() {
  // Throttle scroll events
  if (!ticking) {
    requestAnimationFrame(function() {
      // Add any scroll-based updates here
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', updateOnScroll);

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
});

// Debug function untuk test WhatsApp
function testWhatsApp() {
  console.log('🧪 Testing WhatsApp functionality...');
  const device = detectDevice();
  console.log('Device info:', device);
  
  const testMessage = `🧪 *TEST MESSAGE FROM KONEKSIJASA*

Ini adalah pesan test untuk memastikan WhatsApp API bekerja dengan baik di:
📱 Platform: ${device.isMobile ? 'Mobile' : device.isTablet ? 'Tablet' : 'Desktop'}
🌐 Browser: ${navigator.userAgent.split(')')[0]})

✅ Jika Anda menerima pesan ini, berarti WhatsApp API berfungsi sempurna!

Terima kasih! 🚀`;

  openWhatsAppWithOptions(testMessage, '62895383015559');
}

// Debug function untuk test semua social media
function testSocialMedia() {
  console.log('🧪 Testing Social Media APIs...');
  const device = detectDevice();
  console.log('Device info:', device);
  
  console.log('Available tests:');
  console.log('• testWhatsApp() - Test WhatsApp');
  console.log('• testInstagram() - Test Instagram');
  console.log('• openInstagram() - Open Instagram directly');
}

function testInstagram() {
  console.log('🧪 Testing Instagram functionality...');
  openInstagram();
}

// Expose test function to global scope for debugging
window.testWhatsApp = testWhatsApp;
window.testInstagram = testInstagram;
window.testSocialMedia = testSocialMedia;
window.detectDevice = detectDevice;
window.openWhatsAppWithOptions = openWhatsAppWithOptions;
window.openInstagram = openInstagram;

console.log('🚀 Social Media APIs Enhanced & Fixed!');
console.log('📱 Features:');
console.log('  • Smart device detection');
console.log('  • WhatsApp: Multiple opening strategies + options modal');
console.log('  • Instagram: Native app support + web fallback');
console.log('  • Universal fallback links for all platforms');
console.log('');
console.log('🧪 Test commands:');
console.log('  • testSocialMedia() - Show all available tests');
console.log('  • testWhatsApp() - Test WhatsApp functionality');
console.log('  • testInstagram() - Test Instagram functionality');
console.log('  • detectDevice() - Check device detection');
console.log('');
console.log('✅ Ready to use!');