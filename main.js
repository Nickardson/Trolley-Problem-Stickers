/*globals $:false, prompt:false */
"use strict";

// grid: [20, 20]
var objects = [
	{type: 'image', url: 'img/onlylever.png'},
	{type: 'image', url: 'img/lever.png'},
	{type: 'image', url: 'img/victim.png'},
	{type: 'image', url: 'img/victims.png'},
	{type: 'text', url: 'img/text.png'},
	{type: 'text', url: 'img/textlarge.png', css: {'font-size': '24px', 'font-weight': 'bold'}},
	{type: 'image', url: 'img/fatbridge.png'},
	{type: 'image', url: 'img/trolley.png'},
	{type: 'image', url: 'img/trolley2.png'},
	{type: 'image', url: 'img/tracks.png', opt: {}}, 
	{type: 'image', url: 'img/junction.png', opt: {}},
	{type: 'image', url: 'img/junctionalt.png', opt: {}},
];

/**
 * Creates an object from the given definition.
 * @param  {Object} obj      The object of which an instance should be created
 * @return {HtmlElement}     The created element
 */
function objectCreator(obj) {
	return function () {
		if (obj.type === 'image') {
			return $('<img>').attr('src', obj.url).addClass('sticker sticker-dragging');
		} else if (obj.type == 'text') {
			return $('<div>').addClass('sticker-text').attr('contenteditable', true).text(obj.text || 'Enter your text here.').css(obj.css || {});
		}
	};
}

// when new items are dragged onto the game area, clone the helper.
// non-new items mean an existing object was dragged, so it is ignored.
$('#game').droppable({
	drop: function (event, ui) {
		if (ui.draggable.data('isNew')) {
			var element = ui.helper.clone().removeClass('sticker-dragging').appendTo($(this));

			// position
			var o = $(this).offset();
			element.css({
				'position': 'absolute',
				'left': ui.position.left - o.left,
				'top': ui.position.top - o.top,
				'zIndex': '',
			});

			// set above all existing stickers
			var maxZ = 1;
			$('#game').children().each(function () {
				var z = parseFloat($(this).css('z-index'));
				if (!isNaN(z) && z > maxZ) {
					maxZ = z;
				}
			});
			element.css('z-index', maxZ);

			// make the element draggable
			element.addClass('sticker');
			element.draggable({
				stack: '.sticker',
				start: function () {
					return $(this).addClass('sticker-dragging');
				},
				stop: function () {
					return $(this).removeClass('sticker-dragging');
				}
			});
		}
	}
});

// dropping over the left will delete. While hovering over the background of a sticker turns red.
$('#left').droppable({
	drop: function(event, ui) {
		if (!ui.draggable.data('isNew')) {
			ui.draggable.remove();
		}
	},
	over: function(event, ui) {
		if (!ui.draggable.data('isNew')) {
			ui.draggable.css('background', 'red');
		}
	},
	out: function(event, ui) {
		if (!ui.draggable.data('isNew')) {
			ui.draggable.css('background', '');
		}
	}
});

/**
 * Adds an object which can be dragged to place on the field.
 * @param {Object} def The object definition
 */
function addObject(def) {
	var img = $('<img>').attr('src', def.url).addClass('selectImg').appendTo('#left');
	img.data('isNew', true);

	var opt = def.opt || {};
	opt.helper = objectCreator(def);
	opt.zIndex = 1000;
	opt.scroll = false;

	img.draggable(opt);
}

for (var i = 0; i < objects.length; i++) {
	addObject(objects[i]);
}

var bg = true;
$('#btnBackground').click(function () {
	bg = !bg;
	$(this).text('Background is ' + (bg ? 'on' : 'off'));
	if (bg) {
		$('body').css('background-image', '');
	} else {
		$('body').css('background-image', 'none');
	}
});

$('#btnAddImage').click(function () {
	var url = prompt('Enter the direct url of the image.');
	if (url !== null && url.length > 0) {
		addObject({type: 'image', url: url});
	}
});
