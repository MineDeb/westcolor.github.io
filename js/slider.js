$(document).ready(function(){
    $('.catalog__wrapper').slick({
        responsive: [
          {
            breakpoint: 3240, 
            settings: 
              "unslick"
          },
          {
            breakpoint: 769,
            settings: {
              variableWidth: true,
              centerMode: true,
              centerPadding: '38px',
              dots: true,
              prevArrow: '<button type="button" class="slick-prev"><img src="./assets/icons/prev.svg"</button>',
              nextArrow: '<button type="button" class="slick-next"><img src="./assets/icons/next.svg"</button>',
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
});