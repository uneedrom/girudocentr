var Basket = {

	prices:{},
	summ:{},
	maxNums:4,
	minPos:0,

	getCount: function (id, prefix)
	{
		prefix = prefix ? prefix : '';
		var obj = document.getElementById(prefix + 'count_' + id);
		return Number(obj.value);
	},

	changeCount: function (id, plus, prefix)
	{
		prefix = prefix ? prefix : '';
		var num = Basket.getCount(id, prefix);
		plus ? num++ : num--;
		if(num < 1)
		{
			num = 1;
		}
		document.getElementById(prefix + 'count_' + id).value = num; 
		return num;
	},

	plus: function(id, prefix)
	{
		return Basket.changeCount(id, true, prefix);
	},

	minus: function(id, prefix)
	{
		return Basket.changeCount(id, false, prefix);
	},
	
	add: function(id)
	{
		//var count = Number(document.getElementById('count_' + id).innerHTML);
		var count = 1;

		$.ajax({
			type: 'GET',
			dataType: 'text',
			url: 'basket/basket_add/' + id + "/" + count + '/',
			data: ({}),
			complete:function (result, status)
			{
				if ( status === "success" || status === "notmodified" )
				{
					$.stickr({note:'Товар добавлен в корзину',className:'stiker',position:{right:0,top:300},time:3000,speed:1000});
					//Basket.get();
				}
			}
		});
	},

	addPop: function(id)
	{
		var count = Number(document.getElementById('count_pop').innerHTML);

		$.ajax({
			type: 'GET',
			dataType: 'text',
			url: 'basket/basket_add/' + id + "/" + count,
			data: ({}),
			complete:function (result, status)
			{
				if ( status === "success" || status === "notmodified" )
				{
					Basket.get();
				}
			}
		});
	},

	get: function()
	{
		$.ajax({
			type: 'GET',
			dataType: 'text',
			url: 'basket/basket_get/',
			data: ({}),
			complete:function (result, status)
			{
				if ( status === "success" || status === "notmodified" )
				{
					Basket.set(result.responseText);
				}
			}
		});
	},
	
	set: function(str)
	{
		if(str.length > 0)
		{
			var table = $(".forma table")[0];
			table.replaceChild(document.createElement('TBODY'), table.tBodies[0]);

			Basket.summ = {};
			Basket.minPos = 0;
			var rows = str.split("\n");
			for(var i = 0; i < rows.length; i++)
			{
				var data = rows[i].split("|");
				Basket.prices[Number(data[0])] = Number(data[2]);
				Basket.summ[Number(data[0])] = Number(data[2]) * Number(data[3]);
				var row = table.insertRow(i);
				row.num = i;
				if(i >= Basket.minPos + Basket.maxNums || i < Basket.minPos)
				{
					row.style.display = "none";
				}
				var cell1 = row.insertCell(0);
				cell1.innerHTML = data[1];
				var cell2 = row.insertCell(1);
				cell2.className = "t3";
				var span1 = document.createElement('span');
				span1.className = "col2";
				span1.tovarid = data[0];
				var span2 = document.createElement('span');
				span2.id = "basket_count_" + data[0];
				span2.innerHTML = data[3];
				span1.appendChild(span2);
				var linkPlus = document.createElement('a');
				linkPlus.innerHTML = "<img src='images/plus.gif' />";
				linkPlus.href = "+";
				linkPlus.onclick = function()
				{
					var tovarId = this.parentNode.tovarid;
					Basket.plus(tovarId, "basket_");
					var count = Basket.setCount(tovarId);
					var summ = Number(count) * Basket.prices[tovarId];
					Basket.summ[Number(tovarId)] = summ;
					this.parentNode.parentNode.parentNode.cells[2].innerHTML = String(summ) + " Р";
					Basket.setItog();
					return false;
				};
				span1.appendChild(linkPlus);
				var linkMinus = document.createElement('a');
				linkMinus.innerHTML = "<img src='images/min.gif' />";
				linkMinus.href = "-";
				linkMinus.onclick = function()
				{
					var tovarId = this.parentNode.tovarid;
					Basket.minus(tovarId, "basket_");
					var count = Basket.setCount(tovarId);
					var summ = Number(count) * Basket.prices[tovarId];
					Basket.summ[Number(tovarId)] = summ;
					this.parentNode.parentNode.parentNode.cells[2].innerHTML = String(summ) + " Р";
					Basket.setItog();
					return false;
				};
				span1.appendChild(linkMinus);
				cell2.appendChild(span1);
				var cell3 = row.insertCell(2);
				cell3.innerHTML = String(Number(data[2]) * Number(data[3])) + " Р";
				var cell4 = row.insertCell(3);
				cell4.tovarid = data[0];
				var linkDelete = document.createElement('a');
				linkDelete.innerHTML = "<img src='images/x.gif' />";
				linkDelete.href = 'x';
				linkDelete.onclick = function()
				{
					var tovarId = this.parentNode.tovarid;
					document.getElementById('basket_count_' + tovarId).innerHTML = 0;
					Basket.setCount(tovarId);
					delete Basket.summ[Number(tovarId)];
					var row = this.parentNode.parentNode;
					row.parentNode.removeChild(row);
					Basket.setItog();
					Basket.setVisibleRows();
					return false;
				};
				cell4.appendChild(linkDelete);
			}
			Basket.setItog();
			$(".forma .no_basket").hide();
			$(".forma .bord").show();
			$(".forma .itog").show();
			$(".forma .knopa").show();
			if(rows.length > Basket.maxNums)
			{
				$(".forma .bord .top").show();
				$(".forma .bord .bottom").show();
			}
			else
			{
				$(".forma .bord .top").hide();
				$(".forma .bord .bottom").hide();
			}
		}
		else
		{
			$(".forma .no_basket").show();
			$(".forma .bord").hide();
			$(".forma .itog").hide();
			$(".forma .knopa").hide();
		}
	},

	setCount:function (id)
	{
		var count = Basket.getCount(id, "basket_");
		$.ajax({
			type: 'GET',
			dataType: 'text',
			url: 'basket/basket_set/' + id + "/" + count,
			data: ({})
		});
		return count;
	},

	setItog: function ()
	{
		var allSumm = 0;
		for(var tovar_id in Basket.summ )
		{
			allSumm += Basket.summ[tovar_id];
		}
		$(".forma .itog span").html(String(allSumm) + " Р");
	},
	
	clean:function()
	{
		$.ajax({
			type: 'GET',
			dataType: 'text',
			url: 'catalog/basket_clean/',
			data: ({}),
			complete:function (result, status)
			{
				var table = $(".forma table")[0];
				table.replaceChild(document.createElement('TBODY'), table.tBodies[0]);
				
				if ( status === "success" || status === "notmodified" )
				{
					Basket.get();
				}
			}
		});
	},
	
	up:function()
	{
		Basket.minPos--;
		if(Basket.minPos < 0)
		{
			Basket.minPos = 0;
		}
		Basket.setVisibleRows();
	},
	
	down:function()
	{
		Basket.minPos++;
		var table = $(".forma table")[0];
		if(Basket.minPos + Basket.maxNums > table.rows.length)
		{
			Basket.minPos = table.rows.length - Basket.maxNums;
		}
		Basket.setVisibleRows();
	},
	
	setVisibleRows:function()
	{
		var table = $(".forma table")[0];
		for(var i = 0; i < table.rows.length; i++)
		{
			table.rows[i].style.display = i < Basket.minPos || i >= Basket.minPos + Basket.maxNums ? "none" : '';
		}
	}

	

};


