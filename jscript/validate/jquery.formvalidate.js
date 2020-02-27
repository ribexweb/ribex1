function validar(form){
    valid = true;
    $(form+" input ,"+form+" select").each(function(index,element){
        if ($(element).hasClass('required')){
            if ($(element).is("input")){
                if ($(element).val().trim() != '') {
                    $(element).parent().removeClass('has-error');
                    valid &= true;
                }
                else {
                    valid &= false;
                    $(element).parent().addClass('has-error').protipShow({title:'Elemento Requerido',size:'small'});
                }
            }
            else if ($(element).is("select")){
                if ($(element).val() != -1) {
                    $(element).parent().removeClass('has-error');
                    valid &= true;
                }
                else{
                    valid &= false;
                    $(element).parent().addClass('has-error').protipShow({title:'Elemento Requerido',size:'small'});
                }
            }
        }
    });
    return valid;
}