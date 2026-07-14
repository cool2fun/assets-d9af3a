
(function() {
  var _events = {};
  function EventEmitter() {
    this.on = function(ev, cb) { (_events[ev] = _events[ev] || []).push(cb); };
    this.off = function(ev, cb) { var arr = _events[ev]; if (arr) { _events[ev] = arr.filter(function(f) { return f !== cb; }); } };
    this._emit = function(ev, data) { var arr = _events[ev]; if (arr) arr.forEach(function(f) { f(data); }); };
  }

  var bridge = new EventEmitter();
  bridge.version = '2.0.0-offline';

  bridge.PLATFORM_ID = {
    PLAYGAMA: 'playgama', YANDEX: 'yandex', VK: 'vk',
    GAME_DISTRIBUTION: 'game_distribution', CRAZY_GAMES: 'crazy_games', POKI: 'poki',
  };

  bridge.EVENT_NAME = {
    INTERSTITIAL_STATE_CHANGED: 'interstitial_state_changed',
    REWARDED_STATE_CHANGED: 'rewarded_state_changed',
    BANNER_STATE_CHANGED: 'banner_state_changed',
    VISIBILITY_STATE_CHANGED: 'visibility_state_changed',
    AUDIO_STATE_CHANGED: 'audio_state_changed',
    PAUSE_STATE_CHANGED: 'pause_state_changed',
  };

  bridge.initialize = function(options) {
    return Promise.resolve();
  };

  // Platform
  bridge.platform = new EventEmitter();
  bridge.platform.id = 'playgama';
  bridge.platform.language = 'en';
  bridge.platform.payload = '';
  bridge.platform.tld = 'com';
  bridge.platform.isAudioEnabled = false;
  bridge.platform.isGetAllGamesSupported = false;
  bridge.platform.isGetGameByIdSupported = false;
  bridge.platform.sendMessage = function(msg) {};
  bridge.platform.getServerTime = function() { return Promise.resolve(Date.now()); };
  bridge.platform.getAllGames = function() { return Promise.resolve([]); };
  bridge.platform.getGameById = function(opts) { return Promise.resolve(null); };

  // Player
  bridge.player = {
    id: null, name: '', photos: [], extra: null,
    isAuthorizationSupported: false, isAuthorized: false,
    authorize: function(opts) { return Promise.resolve(); },
    getData: function(keys) { return Promise.resolve([]); },
    setData: function(data) { return Promise.resolve(); },
  };

  // Advertisement
  bridge.advertisement = new EventEmitter();
  bridge.advertisement.isStickyAvailable = false;
  bridge.advertisement.isFullscreenAvailable = false;
  bridge.advertisement.isRewardedAvailable = false;
  bridge.advertisement.isBannerSupported = false;
  bridge.advertisement.minimumDelayBetweenInterstitial = 0;
  bridge.advertisement.getMinimumDelayBetweenInterstitial = function() { return 0; };
  bridge.advertisement.setMinimumDelayBetweenInterstitial = function(opts) {};
  bridge.advertisement.showBanner = function(opts) { return Promise.resolve(); };
  bridge.advertisement.hideBanner = function() {};
  bridge.advertisement.showSticky = function() { return Promise.resolve(); };
  bridge.advertisement.closeSticky = function() {};
  bridge.advertisement.showInterstitial = function() {
    setTimeout(function() { bridge.advertisement._emit('interstitial_state_changed', 'opened'); }, 100);
    setTimeout(function() { bridge.advertisement._emit('interstitial_state_changed', 'closed'); }, 300);
    return Promise.resolve();
  };
  bridge.advertisement.showRewarded = function() {
    setTimeout(function() { bridge.advertisement._emit('rewarded_state_changed', 'opened'); }, 100);
    setTimeout(function() { bridge.advertisement._emit('rewarded_state_changed', 'closed'); }, 300);
    setTimeout(function() { bridge.advertisement._emit('rewarded_state_changed', 'rewarded'); }, 500);
    return Promise.resolve(true);
  };
  bridge.advertisement.showFullscreen = function() { return Promise.resolve(); };
  bridge.advertisement.closeFullscreen = function() {};
  bridge.advertisement.checkAdBlock = function() { return Promise.resolve(false); };
  bridge.advertisement.interstitialState = 'none';
  bridge.advertisement.rewardedState = 'none';
  bridge.advertisement.bannerState = 'none';
  bridge.advertisement.isInterstitialSupported = false;
  bridge.advertisement.isRewardedSupported = false;
  bridge.advertisement.rewardedPlacement = '';

  // Game
  bridge.game = new EventEmitter();
  bridge.game.isVisible = true;
  bridge.game.visibilityState = 'visible';
  bridge.game.getVisibilityState = function() { return 'visible'; };
  bridge.game.start = function() {};
  bridge.game.pause = function() {};
  bridge.game.resume = function() {};
  bridge.game.getSharedProgress = function() { return Promise.resolve(''); };
  bridge.game.setSharedProgress = function(data) { return Promise.resolve(); };
  bridge.game.canShare = function() { return false; };
  bridge.game.share = function(data) { return Promise.resolve(false); };
  bridge.game.getData = function(key) { return Promise.resolve(null); };
  bridge.game.setData = function(key, value) { return Promise.resolve(); };
  bridge.game.setLoadingProgress = function(progress) {};

  // Storage - supports array keys/values + storageType
  bridge.storage = {
    defaultType: 'local_storage',
    isSupported: function(storageType) { return storageType === 'local_storage'; },
    isAvailable: function(storageType) { return storageType === 'local_storage'; },
    get: function(keys, storageType, noFallback) {
      try {
        var result = [];
        for (var i = 0; i < keys.length; i++) {
          var val = localStorage.getItem(keys[i]);
          result.push(val);
        }
        return Promise.resolve(result);
      } catch(e) { return Promise.reject(e); }
    },
    set: function(keys, values, storageType) {
      try {
        for (var i = 0; i < keys.length; i++) {
          localStorage.setItem(keys[i], values[i] || '');
        }
        return Promise.resolve();
      } catch(e) { return Promise.reject(e); }
    },
    delete: function(keys, storageType) {
      try {
        for (var i = 0; i < keys.length; i++) {
          localStorage.removeItem(keys[i]);
        }
        return Promise.resolve();
      } catch(e) { return Promise.reject(e); }
    },
  };

  // Device
  bridge.device = {
    type: 'desktop',
    isMobile: function() { return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); },
  };

  // Leaderboard (singular)
  bridge.leaderboard = {
    isSupported: function() { return false; },
    isNativePopupSupported: function() { return false; },
    isMultipleBoardsSupported: function() { return false; },
    isSetScoreSupported: function() { return false; },
    isGetScoreSupported: function() { return false; },
    isGetEntriesSupported: function() { return false; },
    open: function() { return Promise.resolve(); },
    setScore: function(data) { return Promise.resolve(); },
    getScore: function(data) { return Promise.resolve({ score: 0 }); },
    getEntries: function(data) { return Promise.resolve({ entries: [] }); },
    showNativePopup: function(data) { return Promise.resolve(); },
  };

  // Leaderboards (plural) - used by newer games
  bridge.leaderboards = {
    type: 'none',
    setScore: function(id, score) { return Promise.resolve(); },
    getEntries: function(id) { return Promise.resolve({ entries: [], userRank: 0 }); },
    showNativePopup: function(id) { return Promise.resolve(); },
  };

  // Payments
  bridge.payments = {
    isSupported: function() { return false; },
    isGetCatalogSupported: function() { return false; },
    isGetPurchasesSupported: function() { return false; },
    isConsumePurchaseSupported: function() { return false; },
    getCatalog: function() { return Promise.resolve({ products: [] }); },
    getPurchases: function() { return Promise.resolve([]); },
    purchase: function(data) { return Promise.resolve({ success: false }); },
    consumePurchase: function(token) { return Promise.resolve(); },
  };

  // Social
  bridge.social = {
    isShareSupported: function() { return false; },
    isInviteFriendsSupported: function() { return false; },
    isJoinCommunitySupported: function() { return false; },
    isCreatePostSupported: function() { return false; },
    isAddToHomeScreenSupported: function() { return false; },
    isAddToFavoritesSupported: function() { return false; },
    isRateSupported: function() { return false; },
    isExternalLinksAllowed: function() { return false; },
    canShare: function() { return false; },
    share: function(data) { return Promise.resolve(false); },
    canInvite: function() { return false; },
    inviteFriends: function(data) { return Promise.resolve(false); },
    canJoinCommunity: function() { return false; },
    joinCommunity: function(data) { return Promise.resolve(false); },
    canCreatePost: function() { return false; },
    createPost: function(data) { return Promise.resolve(false); },
    canAddToHomeScreen: function() { return false; },
    addToHomeScreen: function() { return Promise.resolve(false); },
    canAddToFavorites: function() { return false; },
    addToFavorites: function() { return Promise.resolve(false); },
    canRate: function() { return false; },
    rate: function() { return Promise.resolve(false); },
    getCommunityUser: function() { return Promise.resolve(null); },
  };

  // Remote Config
  bridge.remoteConfig = {
    isSupported: function() { return false; },
    get: function(key) { return Promise.resolve(null); },
    getAll: function() { return Promise.resolve({}); },
  };

  // Clipboard
  bridge.clipboard = {
    isSupported: function() { return false; },
    copy: function(text) { return Promise.resolve(false); },
  };

  // Achievements
  bridge.achievements = {
    isSupported: false,
    isGetListSupported: false,
    isNativePopupSupported: false,
    unlock: function(opts) { return Promise.resolve(); },
    showNativePopup: function(opts) { return Promise.resolve(); },
    getList: function(opts) { return Promise.resolve([]); },
  };

  window.bridge = bridge;
  window.playgamaBridge = bridge;
  window.PlayGamaBridge = bridge;

  // Resume suspended AudioContext on user gesture
  var _ctxs = [];
  var _OrigAC = window.AudioContext || window.webkitAudioContext;
  if (_OrigAC) {
    window.AudioContext = window.webkitAudioContext = function() {
      var c = new _OrigAC();
      _ctxs.push(c);
      return c;
    };
    document.addEventListener('click', function r() {
      document.removeEventListener('click', r);
      _ctxs.forEach(function(c) { if (c.state === 'suspended') c.resume(); });
      _ctxs = [];
    });
  }

  // Emit initial advertisement/visibility states so games don't wait forever
  setTimeout(function() {
    bridge.advertisement._emit('interstitial_state_changed', 'none');
    bridge.advertisement._emit('rewarded_state_changed', 'none');
    bridge.advertisement._emit('banner_state_changed', 'none');
    bridge.game._emit('visibility_state_changed', 'visible');
    bridge.platform._emit('audio_state_changed', false);
    bridge.platform._emit('pause_state_changed', false);
  }, 100);
})();
