var massa = {};
var price = {};

function basket_plus(id)
{
	var count = Basket.plus(id, "basket_");
	basket_reCount(id, count);
}

function basket_minus(id)
{
	var count = Basket.minus(id, "basket_"); 
	basket_reCount(id, count);
}

function basket_reCount(id, count)
{
	Basket.setCount(id);
	//document.getElementById('obj1_' + id).innerHTML = (massa[id] * count) + " г";
	//document.getElementById('obj2_' + id).innerHTML = count > 1 ? "(" + count + " шт. по " + massa[id] + " г.)" : '';
	document.getElementById('price_id_' + id).innerHTML = (price[id] * count) + " руб.";
	//document.getElementById('obj4_' + id).innerHTML = count > 1 ? "(" + count + " шт. по " + price[id] + " Р)" : '';
	countAllSumm();
}

function basket_delete(id)
{
	document.getElementById('basket_count_' + id).value = 0;
	Basket.setCount(id);
	var row = document.getElementById('row_' + id);
	row.parentNode.removeChild(row);
	//delete massa[id];
	delete price[id];
	countAllSumm();
}

function countAllSumm()
{
	var summ = 0;
	for(var tovar_id in price)
	{
		var count = Basket.getCount(tovar_id, "basket_");
		summ += count * price[tovar_id];
	}
	document.getElementById('allsumm').innerHTML = summ + " руб.";
	if(summ == 0)
	{
		$(".block").hide();
		$(".block_no").show();
	}
}

function submitBasketForm()
{
	var f = document.getElementById('basket_form');
	var err = '';
	if(f.name.value == '') err += "Введите имя\n";
	if(f.phone.value == '') err += "Введите телефон\n";
	if(f.mail.value == '') err += "Введите e-mail\n";
		else if(!isValidEmail(f.mail.value)) err += "E-mail введён неверно\n";
	if(err)
	{
		alert(err);
	}
	else
	{
		$.ajax({
			type: 'POST',
			dataType: 'text',
			url: 'catalog/basket_send/',
			data: ({
				name: f.name.value,
				phone: f.phone.value,
				mail: f.mail.value,
				address: f.address.value,
			}),
			complete:function (result, status)
			{
				if ( status === "success" || status === "notmodified" )
				{
          $('body').append('<div style="display:none"><script type="text/javascript">'+result.responseText+'</script></div>');
					$(".block").animate({height:'1px'}, 500, function () {
						$(".block").html("<br><br><i>Ваш заказ отправлен</i>");
						$(".block").animate({height:'100px'}, 300);
					});
          //alert(result.responseText);
          //eval(result.responseText);
                                    
				}
			}
		});
	}
}
function submitBasketForm2()
{
	var f = document.getElementById('basket_form');
	var err = '';
	if(f.name.value == '') err += "Введите имя\n";
	if(f.phone.value == '') err += "Введите телефон\n";
        var summ = parseFloat($('#allsumm').text());
	if(err)
	{
		alert(err);
	}
	else
	{
		$.ajax({
			type: 'POST',
			dataType: 'text',
			url: 'basket/basket_send/',
			data: ({
				family: f.family.value,
				name: f.name.value,
				father_name: f.father_name.value,
				phone: f.phone.value,
				city: f.city.value,
				address: f.address.value,
				comment: f.comment.value
			}),
			/*
			complete:function (result, status)
			{
				if ( status === "success" || status === "notmodified" )
				{
          alert('Спасибо. Ваш заказ отправлен.');
				}
				else
				{
					alert(result);
				}
			} 
			*/
			success: function(msg)
			{
				if(msg == 'error')
				{
					//refreshCaptcha();
					//alert('Слово на картинке введено неверно')
				}
				else
				{
                                    $.ajax({
                                        type: 'POST',
                                        dataType: 'text',
                                        url: '/crm.php',
                                        data: ({
                                                family: f.family.value,
                                                name: f.name.value,
                                                father_name: f.father_name.value,
                                                phone: f.phone.value,
                                                city: f.city.value,
                                                address: f.address.value,
                                                comment: f.comment.value,
                                                summ: summ
                                        })
                                    });
					alert('Спасибо. Ваш заказ оформлен.');
					yaCounter1381277.reachGoal('order');
					//refreshCaptcha();
					document.getElementById('basket_form').reset();
					location.reload();
				}
			}
		});
	}
}
