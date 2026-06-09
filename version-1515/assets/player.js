(function() {
  function safePlay(video, overlay) {
    var result = video.play();
    if (result && typeof result.then === 'function') {
      result.then(function() {
        overlay.classList.add('is-hidden');
      }).catch(function() {
        overlay.classList.remove('is-hidden');
      });
    } else {
      overlay.classList.add('is-hidden');
    }
  }

  function attachSource(video, source) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hls = hls;
      return;
    }
    video.src = source;
  }

  window.setupPlayer = function(config) {
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);
    var overlay = document.getElementById(config.overlayId);
    if (!video || !button || !overlay || !config.source) {
      return;
    }

    attachSource(video, config.source);

    function start(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      safePlay(video, overlay);
    }

    button.addEventListener('click', start);
    overlay.addEventListener('click', start);
    video.addEventListener('play', function() {
      overlay.classList.add('is-hidden');
    });
    video.addEventListener('pause', function() {
      if (video.currentTime === 0 || video.ended) {
        overlay.classList.remove('is-hidden');
      }
    });
  };
})();
