import { H as Hls } from './hls.js';

export function createPlayer(options) {
  const video = document.querySelector(options.videoSelector);
  const button = document.querySelector(options.buttonSelector);
  const source = options.source;

  if (!video || !button || !source) {
    return;
  }

  let attached = false;
  let hls = null;

  const attachSource = function () {
    if (attached) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    video.controls = true;
    attached = true;
  };

  const start = async function () {
    attachSource();
    button.classList.add('is-hidden');
    video.controls = true;

    try {
      await video.play();
    } catch (error) {
      button.classList.remove('is-hidden');
    }
  };

  button.addEventListener('click', start);

  video.addEventListener('click', function () {
    if (!attached || video.paused) {
      start();
    } else {
      video.pause();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
