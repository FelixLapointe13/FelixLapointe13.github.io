export default class YouTube {
  constructor(element) {
    this.element = element;

    this.videoContainer = this.element.querySelector('.js-video');
    this.poster = this.element.querySelector('.js-poster');
    this.videoId = this.element.dataset.videoId;
    this.autoplay = this.poster ? 1 : 0;
    this.playerReady = false;
    this.options = {
      controls: 1,
    };

    YouTube.instances.push(this);
    //console.log(Video.instances);

    if (this.videoId) {
      YouTube.loadScript();
    } else {
      console.error('Vous devez spécifier un id');
    }
  }

  static loadScript() {
    if (!YouTube.scriptIsLoading) {
      YouTube.scriptIsLoading = true;
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
    }
  }

  init() {
    this.initPlayer = this.initPlayer.bind(this);

    if (this.poster) {
      this.element.addEventListener('click', this.initPlayer);
    } else {
      this.initPlayer();
    }
  }

  setOptions() {
    if ('noControls' in this.element.dataset) {
      this.options.controls = 0;
      //console.log('no controls');
    }
  }

  initPlayer(event) {
    if (event) {
      this.element.removeEventListener('click', this.initPlayer);
    }

    this.setOptions();

    //console.log(this.options.controls);

    this.player = new YT.Player(this.videoContainer, {
      height: '100%',
      width: '100%',
      videoId: this.videoId,
      playerVars: {
        rel: 0,
        autoplay: this.autoplay,
        controls: this.options.controls,
      },
      events: {
        onReady: () => {
          this.playerReady = true;
          const observer = new IntersectionObserver(this.watch.bind(this), {
            rootMargin: '0px 0px 0px 0px',
          });
          observer.observe(this.element);
        },
        onStateChange: (event) => {
          if (event.data == YT.PlayerState.PLAYING) {
            //pause tous les videos SAUF celui qui joue
            YouTube.pauseAll(this);
          } else if (event.data == YT.PlayerState.ENDED) {
            //console.log("it's done");
            this.player.seekTo(0);
            this.player.pauseVideo();
          }
        },
      },
    });
  }

  watch(entries) {
    if (this.playerReady && !entries[0].isIntersecting) {
      this.player.pauseVideo();
    }
  }

  static initAll() {
    document.documentElement.classList.add('is-video-ready');
    for (let i = 0; i < YouTube.instances.length; i++) {
      const instance = YouTube.instances[i];
      instance.init();
    }
  }

  static pauseAll(currentInstance) {
    for (let i = 0; i < YouTube.instances.length; i++) {
      const instance = YouTube.instances[i];
      instance.init();
      if (instance.playerReady && instance !== currentInstance) {
        instance.player.pauseVideo();
      }
    }
  }
}

YouTube.instances = [];
window.onYouTubeIframeAPIReady = YouTube.initAll;
