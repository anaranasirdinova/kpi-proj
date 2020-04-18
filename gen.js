// json-server --watch ./db/db.json --port 8000

let list = $(".list");
let btn = $(".btn");
let input = $("input");
let name = $(".kpi_name");
let point1 = $(".point1");
let point2 = $(".point2");
let point3 = $(".point3");
let point4 = $(".point4");
let point5 = $(".point5");
let search_student = $('.search-student');
let table = $('.fields tbody');
let page = 1;
render();

// ВВОДИМ ДАННЫЕ
btn.on("click", function() {
  let contact = {
    name: name.val(),
    point1: point1.val(),
    point2: point2.val(),
    point3: point3.val(),
    point4: point4.val(),
    point5: point5.val()
  };
  if (name.val() === "") {
    alert("Input Name please!");
    return;
  }

  // POST
  $.ajax({
    method: "post",
    url: "http://localhost:8000/students",
    data: contact,
    success: render
  });
  input.val("");
});

//DELETE
$(".list").on("click", ".btn-del", function(e) {
  let id = $(e.target).attr("data-id");
  let confirmation = confirm("Remove student?");
  if (confirmation) {
    $.ajax({
      method: "delete",
      url: `http://localhost:8000/students/${id}`,
      success: render
    });
  }
});

// EDIT
$(".list").on("click", ".item-info", function(e) {
  let text = $(e.target).text();
  $(e.target).html(
    `<input type="text" class="edit-item-ifo" value="${text}"/>`
  );
});
$(".list").change(".edit-item-info", function(e) {
  let target = $(e.target);
  let result = target.val();
  let about = target.parent().attr("data-about");
  let id = target
    .parent()
    .parent()
    .attr("data-id");
  let data = {};
  data[about] = result;
  $.ajax({
    method: "patch",
    url: `http://localhost:8000/students/${id}`,
    data,
    success: render
  });
});


//main render here

function render() {
  $.ajax({
    method: "get",
    url: "http://localhost:8000/students",
    success: function(data) {
      $(".list").html("");
      data.forEach(item => {
        $(".list").append(`
         <tr class="all-items" data-id="${item.id}">
         <td class="itemNumber" data-id="${item.id}">${item.id}</td>
         <td class="item-info1" data-about="kpiname">${item.name}</td>
         <td class="item-info" data-about="point1">${item.point1}</td>
         <td class="item-info" data-about="point2">${item.point2}</td>
         <td class="item-info" data-about="point3">${item.point3}</td>
         <td class="item-info" data-about="point4">${item.point4}</td>
         <td class="item-info" data-about="point5">${item.point5}</td>
         <td class="item-infos" data-about="total">${(Number(item.point1) +
           Number(item.point2) +
           Number(item.point3) +
           Number(item.point4) +
           Number(item.point5)) /
           5}</td>
       <td class="btn-del" data-id="${item.id}"> X</td>
      </tr>`);
      });
    }
  });
}

$(".wassap").on("click", function pagination() {
  $.ajax({
    method: "get",
    url: `http://localhost:8000/students/?_page=${page}&_limit=4`,
    success: function(data) {
      $(".student-list_page").html("");
      data.forEach(item => {
        $(".student-list_page").append(`
                  <li data-id="${item.id}" class="contact-name">
                  ${item.name}  :  ${(Number(item.point1) +
          Number(item.point2) +
          Number(item.point3) +
          Number(item.point4) +
          Number(item.point5)) /
          5} points </li>`);
      });
    }
  });
  $(".student-list").toggleClass("student-list_2");
  $('.students').css('filter', 'blur(5px)');
  $('.groups').css('filter', 'blur(5px)');
  $('.bonus').css('filter', 'blur(5px)');
  $('.header').css('filter', 'blur(5px)');
});

$(".prev-btn").on("click", function() {
  page--;
  $.ajax({
    method: "get",
    url: `http://localhost:8000/students/?_page=${page}&_limit=4`,
    success: function(data) {
      $(".student-list_page").html("");
      data.forEach(item => {
        $(".student-list_page").append(`
                    <li data-id="${item.id}" class="contact-name">
                    ${item.name} ${(Number(item.point1) +
          Number(item.point2) +
          Number(item.point3) +
          Number(item.point4) +
          Number(item.point5)) /
          5}</li>`);
      });
    }
  });
});

$(".next-btn").on("click", function() {
  page++;
  $.ajax({
    method: "get",
    url: `http://localhost:8000/students/?_page=${page}&_limit=4`,
    success: function(data) {
      $(".student-list_page").html("");
      data.forEach(item => {
        $(".student-list_page").append(`
           <li data-id="${item.id}" class="contact-name">
           ${item.name} ${(Number(item.point1) +
          Number(item.point2) +
          Number(item.point3) +
          Number(item.point4) +
          Number(item.point5)) /
          5}</li>`);
      });
      if (data.length === 0) {
        return alert("This is the last page.");
      }
    }
  });
});

$(".close-window").on("click", function() {
  $(".student-list").toggleClass("student-list_2");
  $('.students').css('filter', 'none');
  $('.groups').css('filter', 'none');
  $('.bonus').css('filter', 'none');
  $('.header').css('filter', 'none');
}); 

//search students

$('.search-student').on('keyup', function(){
  let value = $(this).val().toLowerCase(); 
  let tr = $(table).find("tr");

  for (i = 0; i < tr.length; i++){    
    let name = $(tr[i]).find("td")[1]; 

    if (name) { 
      let txtValue = name.innerText; 

    if (txtValue.toLowerCase().indexOf(value) > -1){ 
      $(tr[i]).show()  
    } else {
      $(tr[i]).hide() 
    }
    }
  }
});

// Modal answer 

$(document).on('click', '.wassap2', function(e){
  e.preventDefault();
  let id = $(e.target).attr('data-id');
  $('.answer').fadeIn();
  $('.students').css('filter', 'blur(5px)');
  $('.groups').css('filter', 'blur(5px)');
  $('.bonus').css('filter', 'blur(5px)');
  $('.header').css('filter', 'blur(5px)');
})

// закрытие по крестику
$(document).on('click', '#close', function(e){
  let id = $(e.target).attr('data-id');
  $('.answer').fadeOut();
  $('.students').css('filter', 'none');
  $('.groups').css('filter', 'none');
  $('.bonus').css('filter', 'none');
  $('.header').css('filter', 'none');
})

// modal answer1
$(document).on('click', '.wassap1', function(e){
  e.preventDefault();
  let id = $(e.target).attr('data-id');
  $('.answer1').fadeIn();
  $('.students').css('filter', 'blur(5px)');
  $('.groups').css('filter', 'blur(5px)');
  $('.bonus').css('filter', 'blur(5px)');
  $('.header').css('filter', 'blur(5px)');
})

// закрытие по крестику
$(document).on('click', '#close', function(e){
  let id = $(e.target).attr('data-id');
  $('.answer1').fadeOut();
  $('.students').css('filter', 'none');
  $('.groups').css('filter', 'none');
  $('.bonus').css('filter', 'none');
  $('.header').css('filter', 'none');
})
