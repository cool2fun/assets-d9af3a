var bridge = {
    initialize: function() { return Promise.resolve(); },
    EVENT_NAME: {
        INTERSTITIAL_STATE_CHANGED: 'interstitial_state_changed',
        REWARDED_STATE_CHANGED: 'rewarded_state_changed',
        BANNER_STATE_CHANGED: 'banner_state_changed'
    },
    advertisement: {
        _listeners: {},
        showInterstitial: function() {
            var self = this;
            setTimeout(function() {
                self._fire('interstitial_state_changed', 'closed');
            }, 100);
        },
        showRewarded: function() {
            var self = this;
            setTimeout(function() {
                self._fire('rewarded_state_changed', 'rewarded');
                self._fire('rewarded_state_changed', 'closed');
            }, 100);
        },
        showBanner: function() {},
        hideBanner: function() {},
        isBannerSupported: false,
        on: function(event, cb) {
            if (!this._listeners[event]) this._listeners[event] = [];
            this._listeners[event].push(cb);
        },
        off: function(event, cb) {
            if (this._listeners[event]) {
                this._listeners[event] = this._listeners[event].filter(function(f) { return f !== cb; });
            }
        },
        _fire: function(event, data) {
            var cbs = this._listeners[event] || [];
            for (var i = 0; i < cbs.length; i++) cbs[i](data);
        }
    },
    platform: {
        id: 'mock',
        language: 'en',
        payload: '',
        sendMessage: function(msg) { console.log('[bridge] ' + msg); }
    },
    player: {
        isAuthorizationSupported: false,
        isAuthorized: false,
        authorize: function() { return Promise.reject(); },
        id: 'offline-player',
        name: 'Player',
        getData: function() { return Promise.resolve({}); },
        setData: function() { return Promise.resolve(); }
    },
    storage: {
        get: function(key) { try { return Promise.resolve(localStorage.getItem(key)); } catch(e) { return Promise.resolve(null); } },
        set: function(key, val) { try { localStorage.setItem(key, val); } catch(e) {} return Promise.resolve(); },
        delete: function(key) { try { localStorage.removeItem(key); } catch(e) {} return Promise.resolve(); }
    },
    leaderboard: {
        setScore: function() { return Promise.resolve(); },
        getScore: function() { return Promise.resolve(0); },
        getEntries: function() { return Promise.resolve([]); }
    },
    device: { type: 'desktop' },
    game: { on: function() {}, off: function() {} },
    on: function() {},
    off: function() {}
};
