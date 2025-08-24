document.addEventListener('DOMContentLoaded', () => {
  // Typing effect
  const roles = ['AI Engineer', 'ML Engineer', 'Data Analyst Enthusiast'];
  let roleIndex = 0;
  let charIndex = 0;
  const roleTextElement = document.getElementById('role-text');

  function type() {
    if (charIndex < roles[roleIndex].length) {
      roleTextElement.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, 100);
    } else {
      setTimeout(erase, 2000);
    }
  }

  function erase() {
    if (charIndex > 0) {
      roleTextElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, 50);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 500);
    }
  }

  type();

  // AOS animations
  AOS.init({
    duration: 1000,
    once: true,
    mirror: false
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Navbar active section highlighting
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a:not(:first-child)');
  const navbar = document.querySelector('nav');
  const lightSections = ['about', 'resume', 'quote'];

  function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  const checkSlide = () => {
    let current = '';
    const navbarHeight = navbar.offsetHeight;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (
        pageYOffset >= sectionTop - navbarHeight - 10 &&
        pageYOffset < sectionTop + sectionHeight - navbarHeight - 10
      ) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });

    if (lightSections.includes(current)) {
      navbar.classList.add('text-dark');
    } else {
      navbar.classList.remove('text-dark');
    }
  }

  window.addEventListener('scroll', debounce(checkSlide));

  // Seamless Skill Scroll - Two Rows
  const skillList = [
    "Python", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow",
    "Data Analysis", "Computer Vision", "NLP", "Scikit-learn", "Pandas",
    "NumPy", "Matplotlib", "Seaborn", "SQL", "Git", "Docker"
  ];

  function generateSkillTrack(wrapperClass, trackClass) {
    const wrapper = document.querySelector(wrapperClass);
    const track = document.createElement('div');
    track.className = trackClass;

    // Duplicate once for seamless scroll
    const duplicated = [...skillList, ...skillList];
    duplicated.forEach(skill => {
      const card = document.createElement('span');
      card.className = 'skill-card';
      card.textContent = skill;
      track.appendChild(card);
    });

    wrapper.appendChild(track);
  }

  generateSkillTrack('.skills-scroll:nth-of-type(1)', 'skills-track');
  generateSkillTrack('.skills-scroll:nth-of-type(2)', 'skills-track-2');

  // GitHub Repo Fetch with Show More
  const projectGrid = document.getElementById('project-grid');
  const showMoreBtn = document.getElementById('show-more');
  let allRepos = [];
  let visibleCount = 6;

  async function fetchGitHubRepos() {
    try {
      const res = await fetch('https://api.github.com/users/RohitXJ/repos?sort=updated');
      const repos = await res.json();
      allRepos = repos.filter(repo => !repo.fork && !repo.archived);
      renderProjects();
    } catch (err) {
      console.error('Failed to load GitHub repos:', err);
    }
  }

  function renderProjects() {
    projectGrid.innerHTML = '';
    const reposToShow = allRepos.slice(0, visibleCount);

    reposToShow.forEach(repo => {
      const projectCard = `
        <div class="bg-secondary rounded-lg overflow-hidden shadow-lg border border-secondary transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-white/10" data-aos="fade-up">
          <div class="p-6">
            <h3 class="text-2xl font-bold mb-2 text-white">${repo.name}</h3>
            <p class="text-gray-300 mb-4">${repo.description || 'No description provided.'}</p>
            <a href="${repo.html_url}" target="_blank" class="text-white font-semibold hover:underline">View Project &rarr;</a>
          </div>
        </div>
      `;
      projectGrid.innerHTML += projectCard;
    });

    if (visibleCount >= allRepos.length) {
      showMoreBtn.style.display = 'none';
    } else {
      showMoreBtn.style.display = 'inline-block';
    }
  }

  showMoreBtn.addEventListener('click', () => {
    visibleCount += 3;
    renderProjects();
  });

  fetchGitHubRepos();

  // Credly Badges
  const badgeGrid = document.getElementById('badge-grid');
  const showMoreBadgesBtn = document.getElementById('show-more-badges');
  let allBadges = [];
  let visibleBadgesCount = 6;

  async function fetchCredlyBadges() {
    try {
      const res = await fetch('https://www.credly.com/users/rohit-gomes.17a606fc/badges.json');
      const { data } = await res.json();
      allBadges = data.map(badge => ({
        name: badge.badge_template.name,
        imageUrl: badge.badge_template.image_url,
        badgeUrl: badge.badge_template.url
      }));
      renderBadges();
    } catch (err) {
      console.error('Failed to load Credly badges:', err);
    }
  }

  function renderBadges() {
    badgeGrid.innerHTML = '';
    const badgesToShow = allBadges.slice(0, visibleBadgesCount);

    badgesToShow.forEach(badge => {
      const badgeCard = `
        <div class="bg-secondary rounded-lg overflow-hidden shadow-lg border border-secondary transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-white/10" data-aos="fade-up">
          <a href="${badge.badgeUrl}" target="_blank">
            <img src="${badge.imageUrl}" alt="${badge.name}" class="w-full h-48 object-contain p-4">
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-white text-center">${badge.name}</h3>
            </div>
          </a>
        </div>
      `;
      badgeGrid.innerHTML += badgeCard;
    });

    if (visibleBadgesCount >= allBadges.length) {
      showMoreBadgesBtn.style.display = 'none';
    } else {
      showMoreBadgesBtn.style.display = 'inline-block';
    }
  }

  showMoreBadgesBtn.addEventListener('click', () => {
    visibleBadgesCount += 3;
    renderBadges();
  });

  fetchCredlyBadges();
});
