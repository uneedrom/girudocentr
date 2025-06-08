// ----------------------------------------------------------------------------
// Stikr, jQuery plugin
// v 1.0
// ----------------------------------------------------------------------------
// Copyright (C) 2010 recens
// http://recens.ru/jquery/plugin_stickr.html
// ----------------------------------------------------------------------------
(function($) {
	$.stickr = function(o) {
		var o = $.extend({   // ��������� �� ���������
			time:5000, // ���������� ��, ������� ������������ ���������
			speed:'slow', // �������� ���������
			note:null, // ����� ���������
			className:null, // �����, ����������� � ���������
			sticked:false, // �� �������� ������ �������� ���������
			position:{top:0,right:0} // ������� �� ��������� - ������ ������
		}, o);
		var stickers = $('#jquery-stickers'); // �������� ������ � ������� ���������
		if (!stickers.length) { // ���� ��� ��� �� ����������
			$('body').prepend('<div id="jquery-stickers"></div>'); // ��������� ���
			var stickers = $('#jquery-stickers');
		}
		stickers.css('position','fixed').css({right:'auto',left:'auto',top:'auto',bottom:'auto'}).css(o.position); // �������������
		var stick = $('<div class="stick"></div>'); // ������ ������
		stickers.append(stick); // ��������� ��� � ������������� ��������
		if (o.className) stick.addClass(o.className); // ���� ����������, ��������� �����
        stick.html(o.note); // ��������� ���������
		if (o.sticked) { // ���� ��������� ����������
			var exit = $('<div class="exit"></div>');  // ������ ������ ������
			stick.prepend(exit); // ��������� � ����� ����������
			exit.click(function(){  // ��� �����
				stick.fadeOut(o.speed,function(){ // �������� ������
					$(this).remove(); // �� ��������� �������� ������� ���
				})
			});
		} else { // ���� �� ���
			setTimeout(function(){ // ������������� ������ �� ����������� �����
				stick.fadeOut(o.speed,function(){ // ����� �������� ������
					$(this).remove(); // �� ��������� �������� ������� ���
				});
			}, o.time);
		}
	};
})(jQuery);
