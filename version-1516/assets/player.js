function initMoviePlayer(streamUrl, videoSelector, layerSelector) {
  var video = document.querySelector(videoSelector);
  var layer = document.querySelector(layerSelector);
  var shell = video ? video.closest(".player-shell") : null;
  var state = shell ? shell.querySelector(".player-state") : null;
  var attached = false;
  var hls = null;

  if (!video || !layer || !streamUrl) {
    return;
  }

  function showState(text) {
    if (state) {
      state.textContent = text;
      state.hidden = false;
    }
  }

  function hideState() {
    if (state) {
      state.hidden = true;
    }
  }

  function attachSource() {
    if (attached) {
      return;
    }

    attached = true;
    hideState();

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR && hls) {
          hls.startLoad();
          return;
        }
        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR && hls) {
          hls.recoverMediaError();
          return;
        }
        showState("播放暂不可用");
      });
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      return;
    }

    showState("播放暂不可用");
  }

  function startPlay() {
    attachSource();
    layer.classList.add("is-hidden");
    video.play().catch(function () {});
  }

  layer.addEventListener("click", startPlay);
  video.addEventListener("click", function () {
    if (video.paused) {
      startPlay();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
