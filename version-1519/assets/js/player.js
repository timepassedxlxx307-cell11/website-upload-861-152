(function () {
  function showMessage(shell, text) {
    var message = shell.querySelector('[data-player-message]');

    if (!message) {
      return;
    }

    message.textContent = text;
    message.classList.add('is-visible');

    window.setTimeout(function () {
      message.classList.remove('is-visible');
    }, 2600);
  }

  function loadAndPlay(shell) {
    var video = shell.querySelector('video');

    if (!video) {
      return;
    }

    var stream = video.getAttribute('data-stream');

    if (!stream) {
      showMessage(shell, '播放源暂不可用');
      return;
    }

    shell.classList.add('is-playing');
    showMessage(shell, '正在加载高清播放');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = stream;
      }

      video.play().catch(function () {
        showMessage(shell, '请再次点击播放');
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video.hlsInstance) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(stream);
        hls.attachMedia(video);
        video.hlsInstance = hls;
      }

      video.play().catch(function () {
        showMessage(shell, '请再次点击播放');
      });
      return;
    }

    video.src = stream;
    video.play().catch(function () {
      showMessage(shell, '播放初始化失败');
    });
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-play-trigger]');

    if (!trigger) {
      return;
    }

    var shell = trigger.closest('[data-player]');

    if (shell) {
      loadAndPlay(shell);
    }
  });

  document.querySelectorAll('[data-player]').forEach(function (shell) {
    shell.addEventListener('click', function (event) {
      if (event.target.closest('video') || event.target.closest('[data-play-trigger]')) {
        return;
      }

      if (!shell.classList.contains('is-playing')) {
        loadAndPlay(shell);
      }
    });
  });
})();
