$(document).ready(function(){
    var gia_tg       = $('#price_final').val();

    $("#slpercent > option").each(function() {
        percent_tt = this.value;
        if(percent_tt >= 10){
            amount_tt = gia_tg*(percent_tt/100);
            amount_tt_f = $.number(amount_tt, 0, ',', '.' );
            $(this).attr("data-prepaid", amount_tt);
            $(this).text('Trả trước ' +percent_tt+'% ('+amount_tt_f+'đ)');
        }
    });

});


function CalculateInstallment(){
    var gia_tg       = $('#price_final').val();
    var percent_tt   = $('#slpercent').val();
    var money_tt     = $('#slpercent > option:selected').data('prepaid');
    var khvay        =  $('#slmonth').val();
    var thutuc       =  $('#slprofile').val();
    var mang_lech = new Array();
    var msg_save = '<span class="best_save">Tiết kiệm nhất</span>';
    //Baohiem
    var no_con_lai = gia_tg - money_tt;
    var baohiem    = $.number(no_con_lai*0.05/khvay, 0, ',', '.' );
    //validate
    error = (percent_tt == -1 || khvay == -1 || thutuc == -1) ? 1 : 0
    if(error == 1){
        $('#responsive').html('<p class="error_tragop">Vui lòng chọn các thông tin phù hợp với bạn.</p>');
    }else{
            // $('html, body').animate({scrollTop: $("#responsive").offset().top}, 50);
            //build cac thu tuc can thiet
            if(thutuc == 4){
                 $('#responsive').html('<p><strong>Thủ tục gồm:</strong> CMND, Hộ khẩu, Hóa đơn điện và 1 trong các loại giấy tờ sau ( Sao kê lương 6 tháng gần nhất, Bảng lương có dấu xác nhận của công ty, Giấy phép đăng kí kinh doanh + biên lai thuế 3 tháng gấn nhất).</p>');
            }else if(thutuc == 5){
                $('#responsive').html('<p><strong>Thủ tục gồm:</strong> Thẻ SV, Biên lại học phí học kỳ gần nhất, CMND, Bản sao Hộ khẩu, Bản sao CMND cha mẹ, Hóa đơn điện cùng địa chỉ với hộ khẩu (HDSaison).<br/> Lưu ý: Nếu khoản vay trên 10 triệu thì phải chứng minh thu nhập của cha mẹ (Công ty ACS).</p>');
            }else if(thutuc == 6){
                 $('#responsive').html('<p><strong>Thủ tục gồm:</strong> CMND, Hộ khẩu, Hợp đồng lao động tối thiểu 1 năm và Bảo hiểm y tế còn hiệu lực (bản chính để đối chiếu)</p>');
            }else{
                $('#responsive').hide();
            }
            //hien thi table
            $('.tablefinance').show();
            /**
             Rang buoc dieu kien de chon lai suat
             --> Xem lai su trung lap giua cac khoang ky han, tra truoc
             HD: neu SP 2tr, tt 20, Kh 12 ==> chon muc ls nao
             ACS: sp 5tr, tt 30%, kh 6T ==> chon 2.45 hay 2.2
             **/
            //1.HDSS
            if(gia_tg >= 8500000 && percent_tt == 40 && (khvay >= 6 && khvay <= 12)){
                var lsHD = 1.49;
            }else if(gia_tg >= 2000000 && percent_tt >= 20 && khvay == 12){
                var lsHD = 2.0;
            }else if(gia_tg >= 2000000 && khvay >= 6){
                var lsHD = 3.01;
            }else{
                var lsHD = 'NA'; // khong thoa man dk
            }
            //2.ACS
            if(gia_tg >= 3300000 && (thutuc == 5 || thutuc == 6) && khvay >= 6){
                var lsACS = 1.69;
            }
            else if(gia_tg >= 5000000 && percent_tt >= 30 && khvay >= 6){
                var lsACS = 2.2;
            }else if((gia_tg >= 3300000 && gia_tg < 5000000) && percent_tt < 30 && khvay >= 6){
                var lsACS = 2.45;
            }else{
                var lsACS = 'NA'; // khong thoa man dk
            }
            //3.HC
            if(gia_tg >= 2000000 && thutuc == 3 && percent_tt >= 20 && (khvay >= 6 && khvay <= 12)){
                var lsHC = 2.6;
            }else if(gia_tg >= 2000000 && (thutuc == 1 || thutuc == 2) && khvay >= 6){
                var lsHC = 2.9;
            }else{
                var lsHC = 'NA'; // khong thoa man dk
            }
            //4.FE
            if(gia_tg >= 4000000 && percent_tt >= 20 && (khvay == 9 || khvay == 12)){
                var lsFE = 1.39;
            }else if(gia_tg < 4000000 && percent_tt == 10 && (khvay >= 6 && khvay <= 12)){
                var lsFE = 2.17;
            }else{
                var lsFE = 'NA'; // khong thoa man dk
            }
            /** Xac minh lai suat phu hop voi nhung gi KH chon **/
            if(lsHD == 'NA'){
                $("#zoneHD").hide();
                novalidate('hd');
            }else{
                $("#zoneHD").show();
                 var clHD = xuly(gia_tg,percent_tt,lsHD,khvay,'hd');
                 mang_lech.push(clHD);
            }
            if(lsACS == 'NA'){
                $("#zoneACS").hide();
                novalidate('acs');
            }else{
                $("#zoneACS").show();
                var  clACS = xuly(gia_tg,percent_tt,lsACS,khvay,'acs');
                mang_lech.push(clACS);
            }
            if(lsHC == 'NA'){
                $("#zoneHC").hide();
                novalidate('hc');
            }else{
                $("#zoneHC").show();
                var clHC = xuly(gia_tg,percent_tt,lsHC,khvay,'hc');
                mang_lech.push(clHC);
                $('#inshc').text(baohiem+'₫');
            }
            if(lsFE == 'NA'){
                $("#zoneFE").hide();
                novalidate('fe');
            }else{
               $("#zoneFE").show();
               var clFE = xuly(gia_tg,percent_tt,lsFE,khvay,'fe');
               mang_lech.push(clFE);
               $('#insfe').text(baohiem+'₫');
            }

            // Tim ra goi tiet kiem nhat
            best_save = Math.min.apply(null, mang_lech);

            if(best_save == clHD){
                cLechf = $.number(clHD, 0, ',', '.' );
                $('#difhd').html('<strong>'+cLechf+'₫</strong>'+msg_save);
            }else if(best_save == clACS){
                cLechf = $.number(clACS, 0, ',', '.' );
                $('#difacs').html('<strong>'+cLechf+'₫</strong>'+msg_save);
            }else if(best_save == clHC){
                cLechf = $.number(clHC, 0, ',', '.' );
                $('#difhc').html('<strong>'+cLechf+'₫</strong>'+msg_save);
            }else if(best_save == clFE){
                cLechf = $.number(clFE, 0, ',', '.' );
                $('#diffe').html('<strong>'+cLechf+'₫</strong>'+msg_save);

            }

    }//end validate


 return false;
}

function novalidate(idDIV){
     var msg = 'Không hỗ trợ mức trả góp này.';
     var empty = '...';
      $('#prepaid'+idDIV+'').text(msg);
      $('#ppm'+idDIV+'').text(empty);
      $('#ttp'+idDIV+'').text(empty);
      $('#dif'+idDIV+'').text(empty);
      $('#rate'+idDIV+'').text(empty);
}

function xuly(price, tratruoc, laisuat, kyhantra, idDIV){
    TT    = price*(tratruoc/100);
    NCL   = price-TT; // no con lai
    LCKH  = (NCL*(laisuat/100))*kyhantra; // Lai ca ky han
    baohiem  = NCL*0.05/kyhantra;
    baohiem_homecredit = = NCL*0.035/kyhantra;
    gopMT = (NCL+LCKH)/kyhantra;
    TongGop = TT+NCL+LCKH;

    gocLai = $.number(gopMT, 0, ',', '.' );

    //Cong bao hiem va phi thu ho vao so tien gop hang thang
    if(idDIV == 'fe'){
        gopMT =  gopMT + baohiem + 12000;
        TongGop = TongGop + (baohiem + 12000)*kyhantra;
    }else if(idDIV == 'hc'){
        gopMT =  gopMT + baohiem_homecredit + 130000;
        TongGop = TongGop + (baohiem_homecredit + 13000)*kyhantra;
    }else if(idDIV == 'hd'){
        gopMT =  gopMT + 13000;
        TongGop = TongGop + 13000*kyhantra;
    }

    cLech  = TongGop-price;
    //format number
    Tratruoc = $.number(TT, 0, ',', '.' );
    gopMTf = $.number(gopMT, 0, ',', '.' );
    TongGopf = $.number(TongGop, 0, ',', '.' );
    cLechf = $.number(cLech, 0, ',', '.' );

    //show results
    $("#percenthc, #percentacs, #percenthd, #percentfe").html(' ('+tratruoc+'%)');
    $('#prepaid'+idDIV+'').text(Tratruoc+'₫'); //tra truoc
    $('#detail-ppm-'+idDIV+'').text(gocLai+'₫'); //goc+lai
    $('#ppm'+idDIV+'').html('<strong>'+gopMTf+'₫</strong>'); //gop moi thang
    $('#ttp'+idDIV+'').text(TongGopf+'₫'); // tong gop
    $('#dif'+idDIV+'').html('<b>'+cLechf+'₫</b>'); // chenh lech gia ban
    $('#rate'+idDIV+'').html(laisuat+'%'); // lai suat
    return cLech;
}