/**
 * Created by molodyko on 19.08.2016.
 */

/**
 * LazyImages plugin
 */
var LazyImages = (function () {

    /**
     * Init class data
     * @param el string|HTMLElement Id or dom element of block
     * @param o
     */
    var constructor = function (el, o) {
        o = o || {};
        this.el = typeof el === 'string' ? document.getElementById(el) : el;
        this.url = el.getAttribute('data-image') || o.image;

        if (!this.url) {
            throw new Error('Url of image not found');
        }

        this.height = parseInt(el.getAttribute('data-height'), 10) || o.height;
        this.width = parseInt(el.getAttribute('data-width'), 10) || o.width;

        // Get ratio of image
        this.ratio = parseFloat(el.getAttribute('data-ratio')) || o.ratio;
        if (!this.ratio) {
            this.ratio = this.height && this.width ? (this.height / this.width) : 1; // Square by default
        }

        this.color = el.getAttribute('data-color') || o.color || 'transparent';
        this.fadeTime = el.getAttribute('data-fade-time') || o.fadeTime || 250;
    }, self = constructor.prototype;

    /**
     * Init plugin by class
     *
     * @param klass
     * @param o
     * @returns {Array}
     */
    constructor.initByClass = function (klass, o) {
        var items = document.getElementsByClassName(klass),
            list = [];
        // Iterate elements
        Array.prototype.forEach.call(items, function(el) {
            // Init plugin
            list.push((new LazyImages(el, o)).init());
        });
        return list;
    };

    /**
     * Init class
     */
    self.init = function () {
        var image = new Image();
        // Simulate slow internet connection:)
        //setTimeout(function () {
            // Simulate loading
            image.src = this.url;
        //}.bind(this), 2000);
        // Callback on load
        image.onload = this.onLoad.bind(this);

        // Set color of image wrapper
        this.setColor(this.color);
        // Set correct block height
        this.adaptHeight(this.ratio);

        return this;
    };

    /**
     * Adapt height of image wrapper
     *
     * @param ratio
     */
    self.adaptHeight = function (ratio) {
        this.el.style.height = parseInt(this.el.offsetWidth * ratio, 10) + 'px';
    };

    /**
     * Set color of image wrapper
     *
     * @param color
     */
    self.setColor = function (color) {
        this.el.style.backgroundColor = color;
    };

    /**
     * When image was loaded
     */
    self.onLoad = function () {
        var img = document.createElement('img');
        img.src = this.url;
        img.style.display = 'none';

        this.el.appendChild(img);
        this.img = img;

        // Fading image
        this.fade('in', this.fadeTime);
        //img.style.display = 'inline';
        this.afterFade();
    };

    /**
     * Set correct height
     */
    self.afterFade = function () {
        this.el.style.height = 'auto';
        this.el.style.backgroundColor = 'transparent';
    };

    /**
     * Fade element
     *
     * @param type
     * @param ms
     */
    self.fade = function (type, ms) {
        var isIn = type === 'in',
            opacity = isIn ? 0 : 1,
            interval = 50,
            duration = ms,
            gap = interval / duration,
            self = this;

        // Check if image is exist
        if (!this.img) {
            throw new Error('Image not found');
        }

        if(isIn) {
            self.img.style.display = 'inline';
            self.img.style.opacity = opacity;
        }

        var func = function () {
            opacity = isIn ? opacity + gap : opacity - gap;
            self.img.style.opacity = opacity;

            if(opacity <= 0) {
                self.img.style.display = 'none';
            }
            if(opacity <= 0 || opacity >= 1) {
                window.clearInterval(fading);
            }
        }.bind(this);

        var fading = window.setInterval(func, interval);
    };

    return constructor;
}());
