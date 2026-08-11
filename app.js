// Base API URL pointing to your backend project
const API_BASE_URL = 'https://ver-server-two.vercel.app';

// Equipment database for subpage details
const gearDatabase = {
  'oscilloscope': {
    title: 'Digital Storage Oscilloscope',
    model: 'Model M7300',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80',
    functioning: 'Measures electrical signal voltages over time, displaying waveform patterns to analyze signal frequency, noise, and digital timing protocols.',
    specs: ['2 Channels, 100MHz Bandwidth', '1 GSa/s Real-time Sampling Rate', '7-inch High Resolution Color Display', 'FFT Analysis & Hardware Triggering']
  },
  'multimeter': {
    title: 'True-RMS Digital Multimeter',
    model: 'Model 5-600',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&q=80',
    functioning: 'Accurately measures DC/AC voltage, current, resistance, continuity, and capacitance for circuit debugging.',
    specs: ['Auto-ranging 6000 Counts', 'True-RMS Voltage/Current Detection', 'Continuity Beeper & Diode Tester', 'Safety Overload Protection']
  },
  'powersupply': {
    title: 'Adjustable DC Bench Power Supply',
    model: 'MX-3700',
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&q=80',
    functioning: 'Provides regulated, clean DC power with precise voltage and current limiting controls for testing prototypes safely.',
    specs: ['0-30V Variable DC Output', '0-5A Adjustable Current Limit', 'Digital LED Readout Display', 'Short Circuit & Overcurrent Lockout']
  },
  'logic-analyzer': {
    title: 'USB Logic Analyzer',
    model: 'LCA-S493',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    functioning: 'Captures and decodes digital communications like SPI, I2C, and UART to debug microcontrollers and embedded protocols.',
    specs: ['8 Digital Channels', '24MHz Sampling Frequency', 'Automated Protocol Decoder Support', 'USB Direct Computer Logging']
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Index / Stats Functions
  loadYouTubeStats();
  loadBlogStats();
  loadGitHubStats();
  loadDiscordStats();
  initGearModal();

  // Page Specific Fetchers
  loadBlogsPage();
  loadNewsPage();
  loadConnectPage();
});

// 1. YouTube Stats
function loadYouTubeStats() {
  fetch(`${API_BASE_URL}/api/youtube-stats`)
    .then(res => res.json())
    .then(data => {
      const subsElem = document.getElementById('youtube-subs');
      if (subsElem && data.subscribers) {
        subsElem.innerText = data.subscribers;
      }
      
      if (data.latestVideo && data.latestVideo.id) {
        const titleElem = document.getElementById('latest-video-title');
        const iframeElem = document.getElementById('latest-video-iframe');

        if (titleElem) titleElem.innerText = `Latest Video: ${data.latestVideo.title}`;
        if (iframeElem) iframeElem.src = `https://www.youtube.com/embed/${data.latestVideo.id}`;
      }
    })
    .catch(err => console.error('YouTube API Error:', err));
}

// 2. Total Blogs Count
function loadBlogStats() {
  fetch(`${API_BASE_URL}/api/blogs`)
    .then(res => res.json())
    .then(data => {
      if (data.success || Array.isArray(data.data)) {
        const blogsElem = document.getElementById('total-blogs') || document.getElementById('youtube-views');
        if (blogsElem) {
          blogsElem.innerText = data.totalBlogs !== undefined ? data.totalBlogs : (data.data ? data.data.length : 0);
        }
      }
    })
    .catch(err => console.error('Blogs API Error:', err));
}

// 3. GitHub Stats
function loadGitHubStats() {
  fetch(`${API_BASE_URL}/api/github-stats`)
    .then(res => res.json())
    .then(data => {
      const repoElem = document.getElementById('github-repos');
      if (repoElem && data.success) {
        repoElem.innerText = data.publicRepos;
      }
    })
    .catch(err => console.error('GitHub API Error:', err));
}

// 4. Discord Stats
function loadDiscordStats() {
  fetch(`${API_BASE_URL}/api/discord-stats`)
    .then(res => res.json())
    .then(data => {
      const discordElem = document.getElementById('discord-members');
      if (discordElem && data.success) {
        discordElem.innerText = data.totalMembers;
      }
    })
    .catch(err => console.error('Discord API Error:', err));
}

// 5. Gear Modal Setup
function initGearModal() {
  const modal = document.getElementById('gear-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const gearCards = document.querySelectorAll('.gear-card');

  if (!modal) return;

  gearCards.forEach(card => {
    card.addEventListener('click', () => {
      const gearKey = card.getAttribute('data-gear');
      const data = gearDatabase[gearKey] || {
        title: card.querySelector('.gear-name')?.innerText || 'Lab Gear',
        model: card.querySelector('.gear-model')?.innerText || 'Standard Lab Tool',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
        functioning: 'Essential workstation equipment used for assembling, testing, or building hardware prototypes.',
        specs: ['High reliability engineering grade', 'Integrated into primary electronics lab setup']
      };

      const titleElem = document.getElementById('modal-title');
      const modelElem = document.getElementById('modal-model');
      const imgElem = document.getElementById('modal-img');
      const funcElem = document.getElementById('modal-functioning');
      const specsList = document.getElementById('modal-specs');

      if (titleElem) titleElem.innerText = data.title;
      if (modelElem) modelElem.innerText = data.model;
      if (imgElem) imgElem.src = data.image;
      if (funcElem) funcElem.innerText = data.functioning;
      if (specsList) specsList.innerHTML = data.specs.map(s => `<li>${s}</li>`).join('');

      modal.classList.remove('hidden');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

// 6. Fetch and Render Blogs List Page
function loadBlogsPage() {
  const blogsContainer = document.getElementById('blogs-container');
  if (!blogsContainer) return;

  fetch(`${API_BASE_URL}/api/blogs`)
    .then(res => res.json())
    .then(res => {
      const blogs = res.data || (Array.isArray(res) ? res : []);

      if (blogs.length === 0) {
        blogsContainer.innerHTML = `<div class="glass-card loading-text">No posts available.</div>`;
        return;
      }

      blogsContainer.innerHTML = blogs.map(post => `
        <article class="blog-card">
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" style="width:100%; height:180px; object-fit:cover; border-radius:10px; margin-bottom:1rem; border:1px solid var(--glass-border);">` : ''}
          <span class="post-date">${post.date || ''}</span>
          <h3>${post.title || 'Untitled Post'}</h3>
          <p>${post.content || ''}</p>
        </article>
      `).join('');
    })
    .catch(err => {
      console.error('Blogs Page Fetch Error:', err);
      blogsContainer.innerHTML = `<div class="glass-card loading-text">Failed to load articles.</div>`;
    });
}

// 7. Fetch and Render News Page (news.html)
function loadNewsPage() {
  const newsContainer = document.getElementById('news-container');
  if (!newsContainer) return;

  fetch(`${API_BASE_URL}/api/news`)
    .then(res => res.json())
    .then(res => {
      // Handles res.results (NewsData API format), res.data, or direct arrays
      const newsList = Array.isArray(res) ? res : (res.results || res.data || []);

      if (newsList.length === 0) {
        newsContainer.innerHTML = `<div class="glass-card loading-text">No news updates available right now.</div>`;
        return;
      }

      newsContainer.innerHTML = newsList.map(item => {
        const formattedDate = item.pubDate 
          ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '';
        const category = (item.category && item.category[0]) ? item.category[0].toUpperCase() : 'INDUSTRY';
        const fallbackImg = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80';
        const imageUrl = item.image_url || fallbackImg;

        return `
          <article class="news-card glass-card">
            <div class="news-image-wrapper">
              <img src="${imageUrl}" alt="${item.title || 'News'}" class="news-image" onerror="this.src='${fallbackImg}'">
              <span class="news-category-badge">${category}</span>
            </div>
            <div class="news-content">
              <div class="news-meta">
                <span class="news-source">${item.source_name || 'Industry News'}</span>
                ${formattedDate ? `<span class="news-date">• ${formattedDate}</span>` : ''}
              </div>
              <h3 class="news-title">${item.title || 'Untitled Article'}</h3>
              <p class="news-description">${item.description || ''}</p>
              ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="news-read-more">Read Full Story ↗</a>` : ''}
            </div>
          </article>
        `;
      }).join('');
    })
    .catch(err => {
      console.error('News Page Fetch Error:', err);
      newsContainer.innerHTML = `<div class="glass-card loading-text">Failed to load news updates.</div>`;
    });
}

// 8. Fetch Repos for Connect Page
function loadConnectPage() {
  const githubContainer = document.getElementById('github-commits-container') || document.getElementById('github-repos-container');
  if (!githubContainer) return;

  fetch(`${API_BASE_URL}/api/github-stats`)
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.recentRepos)) {
        githubContainer.innerHTML = `
          <ul class="styled-list">
            ${data.recentRepos.map(repo => `
              <li>
                <span><strong>${repo.name}</strong></span>
                <a href="${repo.url}" target="_blank" class="action-link">View Repo ↗</a>
              </li>
            `).join('')}
          </ul>
        `;
      }
    })
    .catch(err => console.error('Connect GitHub Fetch Error:', err));
}
// Function for Discord stats
function loadDiscordStats() {
  fetch(`${API_BASE_URL}/api/discord-stats`)
    .then(res => res.json())
    .then(data => {
      const onlineElem = document.getElementById('discord-online-badge');
      if (onlineElem) {
        onlineElem.innerText = data.totalMembers || data.presenceCount || '12+';
      }
    })
    .catch(() => {
      const onlineElem = document.getElementById('discord-online-badge');
      if (onlineElem) onlineElem.innerText = 'Active';
    });
}

// Function for GitHub connect page content
function loadConnectPage() {
  const commitsList = document.getElementById('github-commits');
  const reposList = document.getElementById('github-repos-list');
  const repoCount = document.getElementById('github-repos-count');

  if (!commitsList && !reposList) return;

  fetch(`${API_BASE_URL}/api/github-stats`)
    .then(res => res.json())
    .then(data => {
      if (repoCount && data.publicRepos) {
        repoCount.innerText = data.publicRepos;
      }

      // Populate Commits
      if (commitsList) {
        const commits = data.recentCommits || [];
        if (commits.length === 0) {
          commitsList.innerHTML = `<li class="empty-item">No recent commit history available.</li>`;
        } else {
          commitsList.innerHTML = commits.map(c => `
            <li class="list-item">
              <span class="item-title">${c.message || 'Updated project source code'}</span>
              <span class="item-sub">${c.repo || 'Repository'}</span>
            </li>
          `).join('');
        }
      }

      // Populate Repos
      if (reposList) {
        const repos = data.recentRepos || data.repos || [];
        if (repos.length === 0) {
          reposList.innerHTML = `<li class="empty-item">No repositories found.</li>`;
        } else {
          reposList.innerHTML = repos.map(r => `
            <li class="list-item flex-between">
              <div>
                <strong class="item-title">${r.name}</strong>
                <p class="item-sub">${r.description || 'Hardware & software project'}</p>
              </div>
              <a href="${r.url}" target="_blank" class="link-arrow">View ↗</a>
            </li>
          `).join('');
        }
      }
    })
    .catch(err => {
      console.error('GitHub API Error:', err);
      if (commitsList) commitsList.innerHTML = `<li class="empty-item">Failed to fetch commits.</li>`;
      if (reposList) reposList.innerHTML = `<li class="empty-item">Failed to fetch repos.</li>`;
    });
}