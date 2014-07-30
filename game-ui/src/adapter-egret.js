/*
 * File: adapter-egret.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: adapter for egret game engine. 
 * 
 * Copyright (c) 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var Adapter = {};

Adapter.init = function() {
	Adapter.loadAssets = function(srcs, onLoadingProgress) {
		var loaded = 0;
		var n = srcs.length;

		if(!srcs.length || !onLoadingProgress) {
			return srcs;
		}

		function onLoadOne () {
			loaded++;
			onLoadingProgress(loaded, n);

			return;
		}

		for(var i = 0; i < n; i++) {
			var src = srcs[i];
			var image = new Image();
			image.onload = function() {
				onLoadOne();
				
				console.log("Load Success: " + src);
			}

			image.onerror = function(e) {
				onLoadOne();

				console.log("Load Failed: " + src);
			}

			image.src = src;
		}

		return;
	}
	
	Adapter.createTextureFromCanvas = function(canvas) {
		var texture = new egret.Texture();

		texture._setBitmapData(canvas);

		return texture;
	}

	Adapter.createSpriteFromImage = function(src, x, y, w, h) {
		var sprite =  new egret.Bitmap();	
	
		sprite.texture = Adapter.createTextureFromImage(src);

		sprite.x = x;
		sprite.y = y;
		sprite.width = w;
		sprite.height = h;

		return sprite;
	}
	
	Adapter.createTextureFromImage = function (src) {
		var texture = new egret.Texture();

		var image = new Image();
		
		image.onload = function() {
			texture._setBitmapData(image);
		}
		image.src = src;

		return texture;
	}
	
	Adapter.setTexture = function(sprite, texture) {
		sprite.texture = texture;

		return;
	}
	
	Adapter.setBeforePaintCallback= function(sprite, onBeforePaint) {
		sprite.orgTransform = sprite._updateTransform;
		sprite._updateTransform = function() {
			
			onBeforePaint.call(this);
			this.orgTransform();

			return;
		}

		return;
	}

	Adapter.createSprite = function(texture, x, y, w, h) {
		var sprite = new egret.DisplayObject();
	
		sprite.getAbsPosition = function() {
			var point = {};
			var canvas = GameUI.view;
			var pos = GameUI.getHTMLElementPosition(canvas);

			point.x = this.getX() + pos.left;
			point.y = this.getY() + pos.top;

			return point;
		}
		
		sprite.getViewScale = function() {
			return 1;
		}

		sprite.getX = function() {
			return this.x;
		}
		
		sprite.setX = function(x) {
			this.x = x;

			return;
		}
		
		sprite.getY = function() {
			return this.y;
		}
		
		sprite.setY = function(y) {
			this.y = y;

			return;
		}
		
		sprite.getAnchorX = function() {
			return this.anchorX;
		}
		
		sprite.setAnchorX = function(anchorX) {
			this.anchorX = anchorX;

			return;
		}
		
		sprite.getAnchorY = function() {
			return this.anchorY;
		}
		
		sprite.setAnchorY = function(anchorY) {
			this.anchorY = anchorY;

			return;
		}

		sprite.getPivotX = function() {
			return this.pivotX;
		}
		
		sprite.setPivotX = function(pivotX) {
			this.pivotX = pivotX;

			return;
		}
		
		sprite.getPivotY = function() {
			return this.pivotY;
		}
		
		sprite.setPivotY = function(pivotY) {
			this.pivotY = pivotY;

			return;
		}
		
		sprite.getScale = function() {
			return this.scaleX;
		}
		
		sprite.setScale = function(scale) {
			this.scaleX = scale;
			this.scaleY = scale;

			return;
		}
		
		sprite.getAlpha = function() {
			return this.alpha;
		}
		
		sprite.setAlpha = function(alpha) {
			this.alpha = alpha;

			return;
		}

		sprite.rotationFromRadian = function(radian) {
			return 180 * radian/Math.PI;
		}
		
		sprite.getRotation = function() {
			return this.rotation;
		}
		
		sprite.setRotation = function(rotation) {
			this.rotation = rotation;

			return;
		}

		sprite.movePivotToCenter = function() {
			var x = (sprite.getX() + sprite.getWidth()) >> 1;
			var y = (sprite.getY() + sprite.getHeight()) >> 1;

			this.setAnchorX(0.5);
			this.setAnchorY(0.5);

			this.setX(x);
			this.setY(y);

			return;
		}

		sprite.isVisible = function() {
			return this.visible;
		}

		sprite.setVisible = function(visible) {
			this.visible = visible;

			return;
		}

		sprite.onPointerDown = function(event) {
			var point = {};
			point.x = event.localX;
			point.y = event.localY;

			sprite.handlePointerDown(point);

			return true;
		}

		sprite.onPointerMove = function(event) {
			var point = {};
			point.x = event.localX;
			point.y = event.localY;

			sprite.handlePointerMove(point);

			return true;
		}

		sprite.onPointerUp = function(event) {
			var point = {};
			point.x = event.localX;
			point.y = event.localY;

			sprite.handlePointerUp(point);
			
			return true;
		}

		sprite._measureBounds = function () {
			return egret.Rectangle.identity.initialize(this.getX(), this.getY(), this.getWidth(), this.getHeight());
		}

		sprite.enableInput = function() {
			this.touchEnabled = true;
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPointerDown, this);
			this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onPointerMove, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onPointerUp, this);

            return;
		}

		sprite._render = function (renderContext) {
			if(this.isVisible()) {
				this.updateWidgetIfDirty();
			}
			var x = this.getX() - this.getWidth() * this.anchorX;
			var y = this.getY() - this.getHeight() * this.anchorY;

			var ctx = renderContext.canvasContext;
			ctx.drawImage(this.canvas, x, y);

			return;
		}

		sprite.orgTransform = sprite._updateTransform;
		sprite._updateTransform = function() {
			this.updateTransform();
			this.orgTransform();

			return;
		}

		sprite.updateTransform = function() {
		}

		sprite.updateTexture = function() {
		}

		sprite.onRemoved = function() {
			console.log("cleanup:" + this.name);
		}

		sprite.onCreated = function() {
		}

		sprite.setX(x);
		sprite.setY(y);

		return sprite;
	}
};

