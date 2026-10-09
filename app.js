const pages = document.getElementById('pages');
const sections = [...pages.querySelectorAll('.page')];
const dots = [...document.querySelectorAll('[data-page]')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const behavior = reduced ? 'auto' : 'smooth';
let current = 0;

function markPage(i) {
  current = i;
  dots.forEach((dot, n) => {
    if (n === i) dot.setAttribute('aria-current', 'page');
    else dot.removeAttribute('aria-current');
  });
  document.getElementById('prev').disabled = i === 0;
  document.getElementById('next').disabled = i === sections.length - 1;
}

function go(i) {
  i = Math.max(0, Math.min(sections.length - 1, i));
  markPage(i);
  pages.scrollTo({top: sections[i].offsetTop - sections[0].offsetTop, behavior});
}

dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
document.getElementById('prev').onclick = () => go(current - 1);
document.getElementById('next').onclick = () => go(current + 1);
document.querySelector('[data-next]').onclick = () => go(1);
let pageFrame;
pages.addEventListener('scroll', () => {
  cancelAnimationFrame(pageFrame);
  pageFrame = requestAnimationFrame(() => {
    let idx = 0;
    const top = pages.scrollTop + pages.clientHeight * .22;
    sections.forEach((section, i) => {
      if (section.offsetTop - sections[0].offsetTop <= top) idx = i;
    });
    markPage(idx);
  });
}, {passive: true});
markPage(0);

const backgroundGallery = document.getElementById('background-gallery');
const backgroundSlides = [...backgroundGallery.querySelectorAll('.background-slide')];
const backgroundDots = [...document.querySelectorAll('[data-background-page]')];
const backgroundPrev = document.getElementById('background-prev');
const backgroundNext = document.getElementById('background-next');
let backgroundPage = 0;

function markBackground(i) {
  backgroundPage = i;
  document.getElementById('background-count').textContent =
    `${String(i + 1).padStart(2, '0')} / ${String(backgroundSlides.length).padStart(2, '0')}`;
  backgroundPrev.disabled = i === 0;
  backgroundNext.disabled = i === backgroundSlides.length - 1;
  backgroundDots.forEach((dot, n) => {
    if (n === i) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
}

function showBackground(i) {
  i = Math.max(0, Math.min(backgroundSlides.length - 1, i));
  backgroundGallery.scrollTo({left: i * backgroundGallery.clientWidth, behavior});
}

let backgroundFrame;
backgroundGallery.addEventListener('scroll', () => {
  cancelAnimationFrame(backgroundFrame);
  backgroundFrame = requestAnimationFrame(() => {
    if (!backgroundGallery.clientWidth) return;
    const i = Math.round(backgroundGallery.scrollLeft / backgroundGallery.clientWidth);
    markBackground(Math.max(0, Math.min(backgroundSlides.length - 1, i)));
  });
}, {passive: true});
backgroundPrev.onclick = () => showBackground(backgroundPage - 1);
backgroundNext.onclick = () => showBackground(backgroundPage + 1);
backgroundDots.forEach((dot, i) => dot.addEventListener('click', () => showBackground(i)));
// Let each slide scroll vertically while handling horizontal touch gestures once.
let swipeStart;
backgroundGallery.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' || !event.isPrimary) return;
  swipeStart = {id: event.pointerId, x: event.clientX, y: event.clientY};
});
backgroundGallery.addEventListener('pointerup', event => {
  if (!swipeStart || event.pointerId !== swipeStart.id) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  swipeStart = undefined;
  if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
    showBackground(backgroundPage + (dx < 0 ? 1 : -1));
  }
});
backgroundGallery.addEventListener('pointercancel', () => { swipeStart = undefined; });
backgroundGallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    showBackground(backgroundPage + 1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showBackground(backgroundPage - 1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    showBackground(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    showBackground(backgroundSlides.length - 1);
  }
});
new ResizeObserver(() => {
  backgroundGallery.scrollTo({left: backgroundPage * backgroundGallery.clientWidth, behavior: 'instant'});
}).observe(backgroundGallery);
markBackground(0);

let toastTimer;
function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 5000);
}

document.getElementById('share').onclick = async () => {
  const data = {
    title: '上海市滴水湖学校 · AI训练营教师邀请函',
    text: '2026年12月，诚邀您参与青少年人工智能驱动科学训练营。',
    url: location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    if (navigator.clipboard && isSecureContext) {
      await navigator.clipboard.writeText(location.href);
      toast('邀请函链接已复制，可粘贴发送给老师。微信中也可通过右上角菜单转发。');
      return;
    }
    toast('请复制浏览器地址转发；微信中可通过右上角菜单分享。');
  } catch (event) {
    if (event.name !== 'AbortError') toast('请通过浏览器或微信右上角菜单转发邀请函。');
  }
};
