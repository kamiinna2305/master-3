/*
  Template © 2025 Inna Web Boutique
  License: for personal use only. Resale prohibited.
*/

document.addEventListener('DOMContentLoaded', () => {
  const cfgPath = 'data/config.json';

  fetch(cfgPath)
    .then(res => {
      if (!res.ok) throw new Error('Fetch error ' + res.status);
      return res.json();
    })
    .then(data => {
      // --- safe default values ---
      const defaults = {
        businessName: 'Your Business',
        tagline: '',
        description: '',
        phone: '',
        email: '',
        location: '',
        instagram: '',
        whatsApp: '',
        descriptionAbout: '',
        themeColor: '#d4a785',
        bodyColor: '',
        hoverColor: '',
        textColor: '',
        services: [],
        gallery: []
      };
      data = Object.assign({}, defaults, data);

      // Title & name
      if (data.businessName) {
        document.title = data.businessName;
        document.querySelectorAll('.business-name')
          .forEach(el => el.textContent = data.businessName);
      }

      // Text blocks
      document.querySelectorAll('.tagline').forEach(el => el.textContent = data.tagline || '');
      document.querySelectorAll('.description').forEach(el => el.textContent = data.description || '');
      document.querySelectorAll('.phone').forEach(el => el.textContent = data.phone || '');
      document.querySelectorAll('.whatsapp').forEach(el => el.textContent = data.whatsApp || '');
      document.querySelectorAll('.email').forEach(el => el.textContent = data.email || '');
      document.querySelectorAll('.location').forEach(el => el.textContent = data.location || '');
      document.querySelectorAll('.instagram').forEach(el => el.textContent = data.instagram || '');
      document.querySelectorAll('.about_description').forEach(el => el.textContent = data.descriptionAbout || '');

      // Links
      const phoneEl = document.querySelector('.phone');
      if (phoneEl) {
        phoneEl.textContent = data.phone;
        phoneEl.setAttribute('href', `tel:${(data.phone || '').replace(/\s/g, '')}`);
      }

      const emailEl = document.querySelector('.email');
      if (emailEl) {
        emailEl.textContent = data.email;
        emailEl.setAttribute('href', `mailto:${data.email || ''}`);
      }

      const whatsappEl = document.querySelector('.whatsapp');
      if (whatsappEl) {
        whatsappEl.textContent = data.whatsApp ? `${data.whatsApp} WhatsApp` : 'WhatsApp';
        whatsappEl.setAttribute('href', `https://wa.me/${(data.phone || '').replace(/\D/g, '')}`);
      }

      const instagramEl = document.querySelector('.instagram');
      if (instagramEl) {
        instagramEl.textContent = data.instagram || '';
        const igUser = (data.instagram || '').replace(/^@/, '');
        instagramEl.setAttribute('href', igUser ? `https://instagram.com/${igUser}` : '#');
      }

      // Colors
      document.documentElement.style.setProperty('--theme-color', data.themeColor);
      if (data.bodyColor)  document.documentElement.style.setProperty('--body-color',  data.bodyColor);
      if (data.hoverColor) document.documentElement.style.setProperty('--hover-color', data.hoverColor);
      if (data.textColor)  document.documentElement.style.setProperty('--text-color',  data.textColor);

      // Services: {name, price}
      const servicesList = document.querySelector('.services');
      if (servicesList && Array.isArray(data.services)) {
        servicesList.innerHTML = '';
        data.services.forEach(service => {
          const li = document.createElement('li');

          if (typeof service === 'string') {
            li.textContent = service;
          } else {
            const name = service.name || '';
            const price = service.price || '';
            li.innerHTML = `
              <span class="service-name">${name}</span>
              <span class="service-price">${price}</span>
            `;
          }

          servicesList.appendChild(li);
        });
      }

      // Slider: config.json
      const track = document.querySelector('.carousel-track');
      const prevBtn = document.querySelector('.prev');
      const nextBtn = document.querySelector('.next');

      if (track && Array.isArray(data.slider)) {
      track.innerHTML = '';
      data.slider.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      slide.appendChild(img);

      if (item.caption) {
      const caption = document.createElement('p');
      caption.className = 'slide-caption';
      caption.textContent = item.caption;
      slide.appendChild(caption);
    }

    track.appendChild(slide);
  });

  const slides = Array.from(track.children);
  let index = 0;

  function moveToSlide(i) {
    if (i < 0) i = slides.length - 1;
    if (i >= slides.length) i = 0;
    index = i;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  prevBtn.addEventListener('click', () => moveToSlide(index - 1));
  nextBtn.addEventListener('click', () => moveToSlide(index + 1));

  // Автопрокрутка
  setInterval(() => moveToSlide(index + 1), 4000);
}

// === CIRCULAR CAROUSEL for product-carousel-2 ===
const pc2Track = document.querySelector('.pc2-track');
const pc2Window = document.querySelector('.pc2-window');
const pc2Prev = document.querySelector('.pc2-prev');
const pc2Next = document.querySelector('.pc2-next');

if (pc2Track && Array.isArray(data.slider2)) {
  pc2Track.innerHTML = '';

  // Create cards with photos
  data.slider2.forEach(item => {
    const slide = document.createElement('div');
    slide.className = 'pc2-slide';

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt || '';

    slide.appendChild(img);
    pc2Track.appendChild(slide);
  });

  const slides = Array.from(pc2Track.children);
  const slideWidth = slides[0].offsetWidth + 20;
  const visibleCount = Math.floor(pc2Window.offsetWidth / slideWidth);

  // Cloning for infinity
  for (let i = 0; i < visibleCount; i++) {
    pc2Track.appendChild(slides[i].cloneNode(true));
    pc2Track.insertBefore(slides[slides.length - 1 - i].cloneNode(true), slides[0]);
  }

  let index = visibleCount;
  pc2Track.style.transform = `translateX(-${slideWidth * index}px)`;

  function go(i) {
    pc2Track.style.transition = 'transform 0.5s ease';
    index = i;
    pc2Track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  pc2Next.addEventListener('click', () => go(index + 1));
  pc2Prev.addEventListener('click', () => go(index - 1));

  pc2Track.addEventListener('transitionend', () => {
    if (index >= slides.length + visibleCount) {
      pc2Track.style.transition = 'none';
      index = visibleCount;
      pc2Track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
    if (index <= 0) {
      pc2Track.style.transition = 'none';
      index = slides.length;
      pc2Track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
  });

}


// Gallery: из config.json
const galleryContainer = document.querySelector('.gallery-grid');
if (galleryContainer) {
  galleryContainer.innerHTML = '';
  if (Array.isArray(data.gallery)) {
    // показываем только первые 5
    data.gallery.slice(0, 4).forEach(item => {
      const src = item?.src || '';
      if (!src) return;

      const link = document.createElement('a');
      link.href = src;
      link.setAttribute('data-fancybox', 'gallery');
      if (item?.caption) link.setAttribute('data-caption', item.caption);

      const img = document.createElement('img');
      img.src = src;
      img.alt = item?.alt || 'gallery image';

      link.appendChild(img);
      galleryContainer.appendChild(link);
    });
  }
}

// Gallery full page
const galleryFull = document.querySelector('#gallery-full .gallery-grid');
if (galleryFull) {
  galleryFull.innerHTML = '';
  if (Array.isArray(data.gallery)) {
    data.gallery.forEach(item => {
      const src = item?.src || '';
      if (!src) return;

      const link = document.createElement('a');
      link.href = src;
      link.setAttribute('data-fancybox', 'gallery');
      if (item?.caption) link.setAttribute('data-caption', item.caption);

      const img = document.createElement('img');
      img.src = src;
      img.alt = item?.alt || 'gallery image';

      link.appendChild(img);
      galleryFull.appendChild(link);
    });
  }
}

      // Initializing Fancybox if it is connected
      if (window.Fancybox && document.querySelector('[data-fancybox="gallery"]')) {
        Fancybox.bind("[data-fancybox='gallery']", {
          animated: true,
          showClass: "f-fadeIn",
          hideClass: "f-fadeOut",
          Thumbs: false,
          Toolbar: {
            display: [
              { id: "counter", position: "center" },
              "zoom",
              "slideshow",
              "fullscreen",
              "close"
            ]
          }
        });
      }
    })
    .catch(err => {
      console.error('Error config.json:', err);
    });


});

/*
  Template © 2025 Inna Web Boutique 
  Author: Inna Hiliarovska
  License: Personal use only. Resale prohibited.
*/
